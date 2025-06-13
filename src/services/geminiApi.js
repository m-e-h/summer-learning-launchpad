import {
  sanitizeInput,
  isValidEducationalInput,
  isValidApiKey,
  apiRateLimiter
} from '../utils/security'
import { GoogleGenAI, Type } from '@google/genai'

/**
 * Secure API call to Gemini with comprehensive validation and error handling
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} jsonSchema - Optional JSON schema for structured responses
 * @returns {Promise<string|Object|null>} - The API response or null on error
 */
const callGemini = async (prompt, jsonSchema = null) => {
  try {
    // 1. Validate API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!isValidApiKey(apiKey)) {
      console.warn('Invalid or missing API key configuration')
      return null
    }

    // 2. Sanitize and validate input
    const sanitizedPrompt = sanitizeInput(prompt)

    // 3. Check rate limiting
    if (!apiRateLimiter.canMakeRequest()) {
      const waitTime = Math.ceil(apiRateLimiter.getTimeUntilReset() / 1000)
      console.warn(`Rate limit exceeded. Try again in ${waitTime} seconds.`)
      return null
    }

    // 4. Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey })

    // 5. Prepare generation config
    const config = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024
    }

    // Add JSON schema if provided
    if (jsonSchema) {
      config.responseMimeType = 'application/json'
      config.responseSchema = jsonSchema
    }

    // 6. Make API request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: sanitizedPrompt,
        config
      })

      clearTimeout(timeoutId)

      // 7. Handle response
      const responseText = response.text

      if (!responseText) {
        console.warn('Empty response from API')
        return null
      }

      // 8. Sanitize response before returning
      const sanitizedResponse = sanitizeInput(responseText)

      if (jsonSchema) {
        try {
          // Strip markdown code blocks if present
          let jsonString = sanitizedResponse
          if (jsonString.includes('```json')) {
            jsonString = jsonString
              .replace(/```json\s*/g, '')
              .replace(/```\s*$/g, '')
              .trim()
          } else if (jsonString.includes('```')) {
            jsonString = jsonString
              .replace(/```\s*/g, '')
              .replace(/```\s*$/g, '')
              .trim()
          }

          const parsedResponse = JSON.parse(jsonString)
          // Validate that parsed response has expected structure
          if (jsonSchema.properties) {
            const requiredFields = jsonSchema.required || []
            const hasAllRequired = requiredFields.every(field =>
              Object.prototype.hasOwnProperty.call(parsedResponse, field)
            )
            if (!hasAllRequired) {
              console.warn('Response missing required fields')
              return null
            }
          }
          return parsedResponse
        } catch (parseError) {
          console.warn('Failed to parse JSON response:', parseError.message)
          console.warn('Raw response:', sanitizedResponse)
          return null
        }
      }

      return sanitizedResponse
    } catch (apiError) {
      clearTimeout(timeoutId)
      throw apiError
    }
  } catch (error) {
    // 9. Secure error handling - never expose internal details
    if (error.name === 'AbortError') {
      console.warn('API request timed out')
    } else if (error.message?.includes('API_KEY')) {
      console.warn('API key issue - check your configuration')
    } else {
      console.warn('API request failed:', error.message)
    }
    return null
  }
}

export { callGemini }
