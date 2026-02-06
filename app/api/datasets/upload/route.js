import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Papa from 'papaparse'
import crypto from 'crypto'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  try {
    // Get user session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find or create the user in the internal users table
    let { data: internalUser, error: userFetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', authUser.email)
      .single()

    if (!internalUser) {
      // Create user in internal table
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: authUser.email,
          first_name: authUser.user_metadata?.full_name?.split(' ')[0] || 'User',
          last_name: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          hashed_password: 'oauth_user', // Placeholder for OAuth users
          role: 'user',
          plan: 'freemium',
        })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating internal user:', createError)
        return NextResponse.json({ error: 'Erreur lors de la creation utilisateur' }, { status: 500 })
      }
      internalUser = newUser
    }

    const userId = internalUser.id

    // Get the file from form data
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()
    
    // Parse CSV
    const parseResult = Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: 'Erreur lors du parsing CSV', 
        details: parseResult.errors 
      }, { status: 400 })
    }

    const data = parseResult.data
    const columns = parseResult.meta.fields

    // Detect column types
    const detectedColumns = columns.map(colName => {
      const sampleValues = data.slice(0, 100).map(row => row[colName]).filter(v => v !== null && v !== undefined && v !== '')
      
      if (sampleValues.length === 0) {
        return { name: colName, type: 'unknown' }
      }

      // Check if boolean
      const uniqueValues = [...new Set(sampleValues.map(v => String(v).toLowerCase()))]
      if (uniqueValues.length <= 2 && uniqueValues.every(v => ['true', 'false', '0', '1', 'yes', 'no'].includes(v))) {
        return { name: colName, type: 'boolean' }
      }

      // Check if numeric
      const numericCount = sampleValues.filter(v => typeof v === 'number' || !isNaN(Number(v))).length
      if (numericCount / sampleValues.length > 0.8) {
        return { name: colName, type: 'numeric' }
      }

      // Check if datetime
      const dateCount = sampleValues.filter(v => {
        const d = new Date(v)
        return d instanceof Date && !isNaN(d)
      }).length
      if (dateCount / sampleValues.length > 0.8) {
        return { name: colName, type: 'datetime' }
      }

      // Check if categorical (limited unique values)
      if (uniqueValues.length <= 20 && uniqueValues.length / sampleValues.length < 0.5) {
        return { name: colName, type: 'categorical' }
      }

      return { name: colName, type: 'text' }
    })

    // Calculate missing values
    let missingValuesCount = 0
    data.forEach(row => {
      columns.forEach(col => {
        if (row[col] === null || row[col] === undefined || row[col] === '') {
          missingValuesCount++
        }
      })
    })

    // Upload file to Supabase Storage
    const fileName = `${userId}/${Date.now()}_${file.name}`
    
    // Get file as blob for storage upload
    const fileBlob = new Blob([fileContent], { type: file.type || 'text/csv' })
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('datasets')
      .upload(fileName, fileBlob, {
        contentType: file.type || 'text/csv',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Continue anyway - the file might be stored locally
    }

    // Calculate file hash
    const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex')

    // Build columns_info in the format expected by the database
    const columnsInfo = {
      columns: detectedColumns.map(col => {
        const sampleValues = data.slice(0, 5).map(row => row[col.name]).filter(v => v !== null && v !== undefined)
        const allValues = data.map(row => row[col.name]).filter(v => v !== null && v !== undefined && v !== '')
        const nullCount = data.filter(row => row[col.name] === null || row[col.name] === undefined || row[col.name] === '').length
        
        const baseInfo = {
          name: col.name,
          type: col.type === 'numeric' ? 'numeric_integer' : col.type,
          null_count: nullCount,
          null_percentage: (nullCount / data.length) * 100,
          unique_count: [...new Set(allValues)].length,
          sample_values: sampleValues,
        }
        
        // Add numeric stats if applicable
        if (col.type === 'numeric' && allValues.length > 0) {
          const numericValues = allValues.map(v => Number(v)).filter(v => !isNaN(v))
          if (numericValues.length > 0) {
            baseInfo.min = Math.min(...numericValues)
            baseInfo.max = Math.max(...numericValues)
            baseInfo.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
            const sorted = [...numericValues].sort((a, b) => a - b)
            baseInfo.median = sorted[Math.floor(sorted.length / 2)]
          }
        }
        
        return baseInfo
      })
    }

    // Create dataset record in database - matching the actual schema
    const { data: dataset, error: dbError } = await supabase
      .from('datasets')
      .insert({
        user_id: userId,
        filename: fileName,
        original_filename: file.name,
        file_size: file.size,
        file_hash: fileHash,
        mime_type: file.type || 'text/csv',
        encoding: 'utf-8',
        row_count: data.length,
        column_count: columns.length,
        columns_info: columnsInfo,
        status: 'ready',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde en base' }, { status: 500 })
    }

    // Also upload to FastAPI for ML processing
    let fastApiDatasetId = null
    try {
      const fastApiFormData = new FormData()
      const csvBlob = new Blob([fileContent], { type: 'text/csv' })
      fastApiFormData.append('file', csvBlob, file.name)
      fastApiFormData.append('dataset_name', file.name)

      const fastApiResponse = await fetch(`${FASTAPI_URL}/api/datasets/upload`, {
        method: 'POST',
        body: fastApiFormData,
      })

      if (fastApiResponse.ok) {
        const fastApiResult = await fastApiResponse.json()
        fastApiDatasetId = fastApiResult.dataset_id

        // Update Supabase record with FastAPI dataset ID
        await supabase
          .from('datasets')
          .update({ fastapi_dataset_id: fastApiDatasetId })
          .eq('id', dataset.id)
      }
    } catch (fastApiError) {
      console.error('FastAPI upload error (non-blocking):', fastApiError)
    }

    return NextResponse.json({
      id: dataset.id,
      fastapi_dataset_id: fastApiDatasetId,
      filename: file.name,
      data: data.slice(0, 100), // Return first 100 rows for preview
      columns: detectedColumns,
      stats: {
        rows: data.length,
        columns: columns.length,
        missingValues: missingValuesCount,
        fileSize: file.size,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user in the internal users table
    const { data: internalUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', authUser.email)
      .single()

    if (!internalUser) {
      return NextResponse.json({ datasets: [] })
    }

    // Get all datasets for this user
    const { data: datasets, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('user_id', internalUser.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ datasets })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
