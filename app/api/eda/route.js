import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const authClient = isPlaceholderKey
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : supabase

// Helper to get internal user ID
async function getInternalUserId(authUser, dbClient) {
  const { data: internalUser } = await dbClient
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single()
  return internalUser?.id
}

// Get EDA (Exploratory Data Analysis) for a dataset
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser(token)

    if (authError || !authUser) {
      return NextResponse.json({
        error: isPlaceholderKey ? 'Configuration Supabase incomplète' : 'Unauthorized'
      }, { status: 401 })
    }

    const dbClient = isPlaceholderKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      })
      : supabase

    const userId = await getInternalUserId(authUser, dbClient)

    const { searchParams } = new URL(request.url)
    const datasetId = searchParams.get('dataset_id')

    if (!datasetId) {
      return NextResponse.json({ error: 'Dataset ID required' }, { status: 400 })
    }

    // Get dataset from Supabase to verify ownership
    const { data: dataset, error: datasetError } = await dbClient
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .eq('user_id', userId)
      .single()

    if (datasetError || !dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    }

    // Try to download the file and send to FastAPI for EDA
    let edaResult = null

    try {
      // Download file from Supabase Storage
      const { data: fileData, error: downloadError } = await dbClient.storage
        .from('datasets')
        .download(dataset.filename)

      if (!downloadError && fileData) {
        const fileContent = await fileData.text()

        // Upload to FastAPI and get EDA
        const formData = new FormData()
        const blob = new Blob([fileContent], { type: 'text/csv' })
        formData.append('file', blob, dataset.original_filename || 'data.csv')
        formData.append('dataset_name', dataset.original_filename || 'data.csv')

        const uploadResponse = await fetch(`${FASTAPI_URL}/api/datasets/upload`, {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          const fastApiDatasetId = uploadResult.dataset_id

          // Get EDA from FastAPI
          const edaResponse = await fetch(`${FASTAPI_URL}/api/eda/${fastApiDatasetId}`)
          if (edaResponse.ok) {
            edaResult = await edaResponse.json()
          }
        }
      }
    } catch (fastApiError) {
      console.error('FastAPI EDA error:', fastApiError)
    }

    // If FastAPI worked, return the result
    if (edaResult) {
      return NextResponse.json({
        success: true,
        dataset_id: datasetId,
        eda: edaResult,
      })
    }

    // Fallback: Generate basic EDA from columns_info stored in database
    const columnsInfo = dataset.columns_info || {}
    const columns = columnsInfo.columns || []

    const numericColumns = columns.filter(c => c.type?.includes('numeric') || c.type?.includes('int') || c.type?.includes('float')).map(c => c.name)
    const categoricalColumns = columns.filter(c => c.type === 'text' || c.type === 'boolean' || c.type === 'categorical').map(c => c.name)

    // Build numeric stats from columns_info
    const numericStats = {}
    columns.filter(c => numericColumns.includes(c.name)).forEach(col => {
      numericStats[col.name] = {
        count: dataset.row_count - (col.null_count || 0),
        mean: col.mean || 0,
        std: col.std || 0,
        min: col.min || 0,
        '25%': col.q1 || 0,
        '50%': col.median || col.mean || 0,
        '75%': col.q3 || 0,
        max: col.max || 0,
      }
    })

    // Build categorical stats
    const categoricalStats = {}
    columns.filter(c => categoricalColumns.includes(c.name)).forEach(col => {
      categoricalStats[col.name] = {
        unique_values: col.unique_count || 0,
        top_values: col.sample_values ? Object.fromEntries(col.sample_values.map((v, i) => [v, 1])) : {},
        null_count: col.null_count || 0,
      }
    })

    // Build missing values info
    const missingValues = {}
    columns.forEach(col => {
      missingValues[col.name] = col.null_count || 0
    })

    return NextResponse.json({
      success: true,
      dataset_id: datasetId,
      eda: {
        shape: {
          rows: dataset.row_count,
          columns: dataset.column_count,
        },
        column_names: columns.map(c => c.name),
        numeric_columns: numericColumns,
        categorical_columns: categoricalColumns,
        numeric_stats: numericStats,
        categorical_stats: categoricalStats,
        missing_values: missingValues,
        data_types: Object.fromEntries(columns.map(c => [c.name, c.type])),
        correlations: {}, // Would need actual data to compute
        has_predictions: dataset.has_predictions || false,
        model_metrics: dataset.model_metrics || null,
      },
    })
  } catch (error) {
    console.error('EDA error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
