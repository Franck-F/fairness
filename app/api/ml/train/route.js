import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

// ML Training via FastAPI backend
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { dataset_id, algorithm, target_column, feature_columns, test_size } = body

    if (!dataset_id || !target_column) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Call FastAPI ML training endpoint
    const response = await fetch(`${FASTAPI_URL}/api/ml/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataset_id,
        target_column,
        algorithm: algorithm || 'logistic_regression',
        test_size: test_size || 0.2,
        feature_columns: feature_columns || null,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.detail || 'ML training failed' }, { status: response.status })
    }

    const result = await response.json()

    // Update dataset in Supabase with model info
    const { error: updateError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', dataset_id)
      .single()
      .then(async ({ data: dataset }) => {
        if (dataset) {
          return await supabase
            .from('datasets')
            .update({
              has_predictions: true,
              prediction_column: 'ml_prediction',
              model_type: 'classification',
              model_algorithm: result.algorithm,
              model_metrics: result.metrics,
            })
            .eq('id', dataset_id)
        }
        return { error: null }
      })

    return NextResponse.json({
      success: true,
      model_id: result.model_id,
      algorithm: result.algorithm,
      metrics: result.metrics,
      feature_importance: result.feature_importance,
      training_time: result.training_time,
    })
  } catch (error) {
    console.error('ML Training error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET training status
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const datasetId = searchParams.get('dataset_id')

    if (!datasetId) {
      return NextResponse.json({ error: 'Dataset ID required' }, { status: 400 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .eq('user_id', user.id)
      .single()

    if (error || !dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    }

    return NextResponse.json({
      has_predictions: dataset.has_predictions,
      model_algorithm: dataset.model_algorithm,
      model_metrics: dataset.model_metrics,
      status: dataset.has_predictions ? 'completed' : 'pending',
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
