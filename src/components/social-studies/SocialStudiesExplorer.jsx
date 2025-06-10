import React, { useState } from 'react'
import { Card, Button } from '../ui'

const SocialStudiesExplorer = () => {
  const symbols = { 'State Bird': 'Cardinal', 'State Flower': 'Dogwood' }
  const options = ['Cardinal', 'Dogwood', 'Blue Jay', 'Rose']
  const [answers, setAnswers] = useState({
    'State Bird': '',
    'State Flower': ''
  })
  const [feedback, setFeedback] = useState('')

  const handleSelect = (symbol, value) => {
    setAnswers(prev => ({ ...prev, [symbol]: value }))
  }

  const checkAnswers = () => {
    if (
      answers['State Bird'] === 'Cardinal' &&
      answers['State Flower'] === 'Dogwood'
    ) {
      setFeedback('You got it! You know your NC symbols! 🌲')
    } else {
      setFeedback(
        'Not quite right. The state bird is the Cardinal and the flower is the Dogwood.'
      )
    }
  }

  return (
    <Card>
      <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        North Carolina Pride
      </h3>
      <p className='text-center text-gray-600 mb-6'>
        Match the symbol to what it represents.
      </p>
      <div className='space-y-4 max-w-md mx-auto'>
        {Object.keys(symbols).map(symbol => (
          <div key={symbol} className='flex items-center justify-between'>
            <span className='font-semibold text-lg'>{symbol}:</span>
            <select
              value={answers[symbol]}
              onChange={e => handleSelect(symbol, e.target.value)}
              className='p-2 border-2 rounded-lg'
            >
              <option value=''>Select...</option>
              {options.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className='text-center mt-8'>
        <Button
          onClick={checkAnswers}
          className='bg-orange-500 hover:bg-orange-600'
        >
          Check Match
        </Button>
      </div>
      {feedback && <p className='mt-4 text-center font-semibold'>{feedback}</p>}
    </Card>
  )
}

export default SocialStudiesExplorer