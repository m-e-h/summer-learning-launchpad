// Security utilities for input validation and sanitization

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = input => {
  if (typeof input !== 'string') return ''

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Validates that input contains only safe characters for educational content
 * @param {string} input - The input to validate
 * @returns {boolean} - Whether the input is safe
 */
export const isValidEducationalInput = input => {
  if (!input || typeof input !== 'string') return false

  // Allow letters, numbers, spaces, basic punctuation, and common educational symbols
  const safePattern = /^[a-zA-Z0-9\s.,!?'"()\-+÷×=:/]+$/
  return safePattern.test(input) && input.length <= 620
}

/**
 * Validates API key format (basic check)
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} - Whether the API key format is valid
 */
export const isValidApiKey = apiKey => {
  if (!apiKey || typeof apiKey !== 'string') return false

  // Basic validation - should be a reasonable length and contain alphanumeric characters
  return (
    apiKey.length >= 20 &&
    apiKey.length <= 100 &&
    /^[a-zA-Z0-9_-]+$/.test(apiKey)
  )
}

/**
 * Creates a safe error message for users (no sensitive information)
 * @returns {string} - Safe error message
 */
export const createSafeErrorMessage = () => {
  // Never expose internal error details to users
  const safeMessages = {
    'API call failed':
      'Unable to connect to our learning service. Please try again.',
    'Invalid response': 'Received an unexpected response. Please try again.',
    'Network error':
      'Network connection issue. Please check your internet connection.',
    'Rate limit': 'Too many requests. Please wait a moment before trying again.'
  }

  // Return a generic safe message
  return safeMessages['API call failed']
}

/**
 * Rate limiter for API calls
 */
class RateLimiter {
  constructor (maxRequests = 10, windowMs = 60000) {
    // 10 requests per minute
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }

  canMakeRequest () {
    const now = Date.now()

    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs)

    // Check if we're under the limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true
    }

    return false
  }

  getTimeUntilReset () {
    if (this.requests.length === 0) return 0

    const oldestRequest = Math.min(...this.requests)
    const timeUntilReset = this.windowMs - (Date.now() - oldestRequest)
    return Math.max(0, timeUntilReset)
  }
}

// Create a global rate limiter instance
export const apiRateLimiter = new RateLimiter()
