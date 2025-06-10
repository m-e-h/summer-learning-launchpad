import {
  sanitizeInput,
  isValidEducationalInput,
  isValidApiKey,
  apiRateLimiter
} from '../utils/security'

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
    if (!isValidEducationalInput(sanitizedPrompt)) {
      console.warn('Invalid input provided to API')
      return null
    }

    // 3. Check rate limiting
    if (!apiRateLimiter.canMakeRequest()) {
      const waitTime = Math.ceil(apiRateLimiter.getTimeUntilReset() / 1000)
      console.warn(`Rate limit exceeded. Try again in ${waitTime} seconds.`)
      return null
    }

    // 4. Prepare API request
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const payload = {
      contents: [{
        role: 'user',
        parts: [{ text: sanitizedPrompt }]
      }],
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    if (jsonSchema) {
      payload.generationConfig = {
        responseMimeType: 'application/json',
        responseSchema: jsonSchema
      }
    }

    // 5. Make API request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EducationalApp/1.0'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // 6. Handle response
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('API rate limit exceeded')
      } else if (response.status === 403) {
        console.warn('API access forbidden - check API key')
      } else {
        console.warn(`API request failed with status: ${response.status}`)
      }
      return null
    }

    const result = await response.json()

    // 7. Validate response structure
    if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.warn('Invalid response structure from API')
      return null
    }

    const responseText = result.candidates[0].content.parts[0].text

    // 8. Sanitize response before returning
    const sanitizedResponse = sanitizeInput(responseText)

    if (jsonSchema) {
      try {
        const parsedResponse = JSON.parse(sanitizedResponse)
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
        console.warn('Failed to parse JSON response')
        return null
      }
    }

    return sanitizedResponse

  } catch (error) {
    // 9. Secure error handling - never expose internal details
    if (error.name === 'AbortError') {
      console.warn('API request timed out')
    } else {
      console.warn('API request failed:', error.message)
    }
    return null
  }
}

export { callGemini }