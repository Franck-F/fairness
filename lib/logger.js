/**
 * Structured logger for AuditIQ.
 * In production: only warn/error. In development: all levels.
 */

const isDev = process.env.NODE_ENV === 'development'

function formatMessage(level, context, message, data) {
  const timestamp = new Date().toISOString()
  const prefix = context ? `[${context}]` : ''
  if (data !== undefined) {
    return `${timestamp} [${level}] ${prefix} ${message} ${JSON.stringify(data)}`
  }
  return `${timestamp} [${level}] ${prefix} ${message}`
}

const logger = {
  debug(context, message, data) {
    if (isDev) {
      console.log(formatMessage('DEBUG', context, message, data))
    }
  },

  info(context, message, data) {
    if (isDev) {
      console.log(formatMessage('INFO', context, message, data))
    }
  },

  warn(context, message, data) {
    console.warn(formatMessage('WARN', context, message, data))
  },

  error(context, message, data) {
    console.error(formatMessage('ERROR', context, message, data))
  },
}

export default logger
