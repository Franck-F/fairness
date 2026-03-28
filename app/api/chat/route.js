import { NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'
import { chatSchema, validate } from '@/lib/validations'
import { sanitizeForPrompt, rateLimit } from '@/lib/security'
import logger from '@/lib/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting: 20 requests per minute per user
    const rl = rateLimit(`chat:${user.id}`, { maxRequests: 20, windowMs: 60000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Trop de requetes. Reessayez dans quelques secondes.' }, { status: 429 })
    }

    const body = await request.json()
    const { success, errors, data: validated } = validate(chatSchema, body)
    if (!success) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    const { messages, context } = validated

    // Get Gemini model
    const model = getGeminiModel()

    // Format messages for Gemini API - filter history (exclude current message)
    const historyMessages = messages.slice(0, -1)

    // Ensure history starts with user message (Gemini requirement)
    let formattedHistory = historyMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: sanitizeForPrompt(msg.content) }]
    }))

    // Remove leading model messages to ensure history starts with 'user'
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift()
    }

    // Ensure alternating pattern (user, model, user, model...)
    const cleanHistory = []
    let lastRole = null
    for (const msg of formattedHistory) {
      if (msg.role !== lastRole) {
        cleanHistory.push(msg)
        lastRole = msg.role
      }
    }

    // Add context if provided (e.g., audit results) - sanitize user message
    let userMessage = sanitizeForPrompt(messages[messages.length - 1].content)
    if (context) {
      userMessage = `Contexte de l'audit:\n${JSON.stringify(context, null, 2)}\n\nQuestion de l'utilisateur: ${userMessage}`
    }

    // Create a chat session
    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    })

    // Generate response (non-streaming for simplicity)
    const result = await chat.sendMessage(userMessage)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: text,
      },
    })
  } catch (error) {
    logger.error("CHAT", 'Chat API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}

// Streaming version endpoint
export async function PUT(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await request.json()
    const { success, errors, data: validated } = validate(chatSchema, body)
    if (!success) {
      return new Response(JSON.stringify({ error: errors.join(', ') }), { status: 400 })
    }
    const { messages, context } = validated

    // Get Gemini model
    const model = getGeminiModel()

    // Format messages for Gemini API - filter history (exclude current message)
    const historyMessages = messages.slice(0, -1)

    // Ensure history starts with user message (Gemini requirement)
    let formattedHistory = historyMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Remove leading model messages to ensure history starts with 'user'
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift()
    }

    // Ensure alternating pattern (user, model, user, model...)
    const cleanHistory = []
    let lastRole = null
    for (const msg of formattedHistory) {
      if (msg.role !== lastRole) {
        cleanHistory.push(msg)
        lastRole = msg.role
      }
    }

    // Add context if provided
    let userMessage = messages[messages.length - 1].content
    if (context) {
      userMessage = `Contexte de l'audit:\n${JSON.stringify(context, null, 2)}\n\nQuestion de l'utilisateur: ${userMessage}`
    }

    // Create a chat session
    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    })

    // Generate streaming response
    const result = await chat.sendMessageStream(userMessage)

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          logger.error("CHAT", 'Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    logger.error("CHAT", 'Chat streaming error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
