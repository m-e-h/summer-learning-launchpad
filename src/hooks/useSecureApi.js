import { useState, useCallback } from 'react'
import { callGemini } from '../services/geminiApi'
import { createSafeErrorMessage } from '../utils/security'

/**
 * Custom hook for secure API calls with built-in error handling and loading states
 * @returns {Object} - API call utilities and state
 */
export const useSecureApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastCallTime, setLastCallTime] = useState(0)

  const makeSecureCall = useCallback(async (prompt, jsonSchema = null) => {
    // Prevent rapid successive calls
    const now = Date.now()
    if (now - lastCallTime < 1000) { // 1 second minimum between calls
      setError('Please wait a moment before making another request.')
      return null
    }

    setIsLoading(true)
    setError(null)
    setLastCallTime(now)

    try {
      const result = await callGemini(prompt, jsonSchema)

      if (result === null) {
        setError('Unable to process your request. Please try again.')
        return null
      }

      return result
    } catch (err) {
      const safeError = createSafeErrorMessage(err)
      setError(safeError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [lastCallTime])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    makeSecureCall,
    isLoading,
    error,
    clearError
  }
}