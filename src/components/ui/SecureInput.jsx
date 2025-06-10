import React, { useState, useCallback } from 'react'
import { sanitizeInput, isValidEducationalInput } from '../../utils/security'

const SecureInput = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  maxLength = 500,
  type = 'text',
  ...props
}) => {
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = useCallback((e) => {
    const rawValue = e.target.value
    const sanitizedValue = sanitizeInput(rawValue)

    // Validate the input
    const valid = isValidEducationalInput(sanitizedValue)
    setIsValid(valid)

    if (!valid && sanitizedValue.length > 0) {
      setErrorMessage('Please use only letters, numbers, and basic punctuation.')
    } else {
      setErrorMessage('')
    }

    // Always call onChange with sanitized value
    onChange(sanitizedValue)
  }, [onChange])

  const inputClassName = `
    ${className}
    ${!isValid ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
    transition-colors duration-200
  `.trim()

  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClassName}
        {...props}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

export default SecureInput