import React, { useState } from 'react'
import { Card, Button } from '../ui'

const FractionsPractice = () => {
  const [questions] = useState([
    {
      id: 1,
      type: 'identify',
      parts: 4,
      shaded: 1,
      options: ['1/2', '1/4', '3/4'],
      answer: '1/4'
    },
    {
      id: 2,
      type: 'identify',
      parts: 2,
      shaded: 1,
      options: ['1/2', '1/3', '2/2'],
      answer: '1/2'
    },
    { id: 3, type: 'compare', options: ['1/2', '1/4'], answer: '1/2' }
  ])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState('')

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = selectedAnswer => {
    if (selectedAnswer === currentQuestion.answer) {
      setFeedback('Correct! 👍')
      setTimeout(() => {
        setCurrentQuestionIndex(current => (current + 1) % questions.length)
        setFeedback('')
      }, 1500)
    } else {
      setFeedback('Try again!')
    }
  }

  const FractionShape = ({ parts, shaded }) => (
    <div className='flex w-32 h-32 border-2 border-gray-400 rounded-md overflow-hidden'>
      {Array.from({ length: parts }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 ${i < shaded ? 'bg-yellow-400' : 'bg-gray-200'}`}
        ></div>
      ))}
    </div>
  )

  return (
    <Card className='mt-8'>
      <h3 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
        Fun with Fractions
      </h3>
      <div className='flex flex-col items-center'>
        {currentQuestion.type === 'identify' && (
          <>
            <p className='text-lg font-semibold mb-4'>
              What fraction of the shape is shaded?
            </p>
            <FractionShape
              parts={currentQuestion.parts}
              shaded={currentQuestion.shaded}
            />
          </>
        )}
        {currentQuestion.type === 'compare' && (
          <p className='text-lg font-semibold mb-4'>
            Which fraction is bigger?
          </p>
        )}
        <div className='flex space-x-4 my-6'>
          {currentQuestion.options.map(opt => (
            <Button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className='bg-yellow-500 hover:bg-yellow-600'
            >
              {opt}
            </Button>
          ))}
        </div>
        {feedback && (
          <p
            className={`text-center font-semibold ${
              feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </Card>
  )
}

export default FractionsPractice