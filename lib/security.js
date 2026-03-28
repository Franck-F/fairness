// ============================================
// Security utilities for AuditIQ
// ============================================

// --- Prompt Injection Protection ---

// Characters and patterns that could be used for prompt injection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+/i,
  /forget\s+(all\s+)?(previous|your)\s+(instructions|rules)/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\bDAN\b.*\bmode\b/i,
  /jailbreak/i,
  /reveal\s+(your|the)\s+(system|internal|original)\s+(prompt|instructions)/i,
]

/**
 * Sanitize user input before including in LLM prompts.
 * Removes potential injection patterns and escapes dangerous characters.
 */
export function sanitizeForPrompt(input) {
  if (typeof input !== 'string') {
    return String(input || '')
  }

  let sanitized = input

  // Truncate very long inputs (prevent token stuffing)
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000) + '... [tronque]'
  }

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Escape markdown-like formatting that could break prompt structure
  sanitized = sanitized.replace(/```/g, '\'\'\'')

  // Flag potential injection attempts (don't block, but neutralize)
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, '[contenu filtre]')
    }
  }

  return sanitized.trim()
}

/**
 * Sanitize an object's string values for use in prompts
 */
export function sanitizeObjectForPrompt(obj) {
  if (typeof obj === 'string') return sanitizeForPrompt(obj)
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(sanitizeObjectForPrompt)

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[sanitizeForPrompt(key)] = sanitizeObjectForPrompt(value)
  }
  return result
}

// --- Rate Limiting ---

const rateLimitStore = new Map()

/**
 * Simple in-memory rate limiter.
 * Returns { allowed: boolean, remaining: number, resetIn: number }
 */
export function rateLimit(identifier, { maxRequests = 60, windowMs = 60000 } = {}) {
  const now = Date.now()
  const key = identifier

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  const record = rateLimitStore.get(key)

  // Reset window if expired
  if (now - record.windowStart > windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  record.count++

  if (record.count > maxRequests) {
    const resetIn = windowMs - (now - record.windowStart)
    return { allowed: false, remaining: 0, resetIn }
  }

  return { allowed: true, remaining: maxRequests - record.count, resetIn: windowMs - (now - record.windowStart) }
}

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.windowStart > 120000) {
        rateLimitStore.delete(key)
      }
    }
  }, 60000)
}

// --- File Upload Security ---

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * Validate uploaded file
 */
export function validateUploadedFile(file) {
  const errors = []

  if (!file) {
    errors.push('Aucun fichier fourni')
    return { valid: false, errors }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Check extension
  const name = file.name || ''
  const ext = name.substring(name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    errors.push(`Extension non autorisee: ${ext}. Extensions acceptees: ${ALLOWED_EXTENSIONS.join(', ')}`)
  }

  // Sanitize filename (remove path traversal)
  const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '.')

  return {
    valid: errors.length === 0,
    errors,
    sanitizedName,
  }
}

// --- Filename sanitization ---

export function sanitizeFilename(filename) {
  if (!filename) return 'unnamed'
  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Only safe chars
    .replace(/_{2,}/g, '_') // Collapse multiple underscores
    .substring(0, 200) // Limit length
}

// --- SSRF Protection ---

const BLOCKED_IP_PATTERNS = [
  /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
  /^0\./, /^169\.254\./, /^::1$/, /^fc00:/, /^fe80:/,
  /^localhost$/i, /\.internal$/i, /\.local$/i,
]

/**
 * Validate that a backend URL is safe to call (no SSRF to internal networks).
 * Returns the validated URL or throws an error.
 */
export function getValidatedBackendUrl() {
  const url = process.env.FASTAPI_URL
  if (!url) {
    // Default to localhost only in development
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:8000'
    }
    throw new Error('FASTAPI_URL is not configured')
  }

  try {
    const parsed = new URL(url)

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`Unsafe protocol: ${parsed.protocol}`)
    }

    // In production, block internal IPs/hostnames
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname
      for (const pattern of BLOCKED_IP_PATTERNS) {
        if (pattern.test(hostname)) {
          throw new Error(`FASTAPI_URL points to internal address: ${hostname}`)
        }
      }
    }

    return url
  } catch (e) {
    if (e.message.includes('FASTAPI_URL')) throw e
    throw new Error(`Invalid FASTAPI_URL: ${url}`)
  }
}

/**
 * Safe fetch to backend with SSRF protection, auth, and timeout.
 */
export async function safeFetchBackend(path, options = {}) {
  const baseUrl = getValidatedBackendUrl()
  const url = `${baseUrl}${path}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000)

  // Inject internal API key for service-to-service auth
  const headers = new Headers(options.headers || {})
  const internalKey = process.env.BACKEND_API_KEY
  if (internalKey) {
    headers.set('X-Internal-Key', internalKey)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}
