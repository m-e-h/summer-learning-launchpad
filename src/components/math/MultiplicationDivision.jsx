import React, { useState, useEffect } from 'react'
import { Card, Button, LoadingSpinner } from '../ui'
import { callGemini } from '../../services/geminiApi'

const MultiplicationDivision = () => {
  const [problem, setProblem] = useState({ a: 0, b: 0, type: 'x' })
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)

  // State for Gemini feature
  const [wordProblem, setWordProblem] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userWordProblemAnswer, setUserWordProblemAnswer] = useState('')
  const [wordProblemFeedback, setWordProblemFeedback] = useState('')

  const generateProblem = () => {
    const type = Math.random() > 0.5 ? 'x' : '÷'
    let a, b
    if (type === 'x') {
      a = Math.floor(Math.random() * 9) + 2
      b = Math.floor(Math.random() * 9) + 2
    } else {
      b = Math.floor(Math.random() * 9) + 2
      const result = Math.floor(Math.random() * 9) + 2
      a = b * result
    }
    setProblem({ a, b, type })
    setAnswer('')
    setFeedback('')
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const checkAnswer = () => {
    const correctAnswer =
      problem.type === 'x' ? problem.a * problem.b : problem.a / problem.b
    if (parseInt(answer) === correctAnswer) {
      setFeedback('Correct! Great job! 🎉')
      setScore(s => s + 1)
      setTimeout(generateProblem, 1500)
    } else {
      setFeedback(
        `Not quite! The correct answer is ${correctAnswer}. Keep trying!`
      )
    }
  }

  const generateWordProblem = async () => {
    setIsGenerating(true)
    setWordProblem(null)
    setWordProblemFeedback('')
    setUserWordProblemAnswer('')
    const prompt =
      'Generate a simple one-step multiplication or division word problem for an 8-year-old. The answer must be a whole number. Provide the problem and the numeric answer.'
    const schema = {
      type: 'OBJECT',
      properties: {
        problem: { type: 'STRING' },
        answer: { type: 'NUMBER' }
      },
      required: ['problem', 'answer']
    }
    const result = await callGemini(prompt, schema)
    if (result) {
      setWordProblem(result)
    } else {
      setWordProblemFeedback(
        "Oops! Couldn't create a problem. Please try again."
      )
    }
    setIsGenerating(false)
  }

  const checkWordProblemAnswer = () => {
    if (parseInt(userWordProblemAnswer) === wordProblem.answer) {
      setWordProblemFeedback('Correct! You solved it! 🌟')
      setScore(s => s + 5) // Extra points!
    } else {
      setWordProblemFeedback(
        `Good try! The correct answer was ${wordProblem.answer}.`
      )
    }
  }

  return (
    <>
      <Card>
        <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
          Multiplication & Division
        </h3>
        <div className='text-center p-4 bg-blue-50 rounded-lg'>
          <p className='text-5xl font-mono font-bold text-gray-700'>
            {problem.a} {problem.type === 'x' ? '×' : '÷'} {problem.b} = ?
          </p>
        </div>
        <div className='flex items-center justify-center my-6 space-x-4'>
          <input
            type='number'
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && checkAnswer()}
            className='text-2xl w-32 p-3 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500'
          />
          <Button onClick={checkAnswer}>Check</Button>
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
        <p className='text-center mt-4 text-lg font-semibold text-gray-600'>
          Score: {score}
        </p>
      </Card>

      {/* Gemini Feature Section */}
      <Card className='mt-8 bg-blue-50'>
        <div className='text-center'>
          <Button
            onClick={generateWordProblem}
            disabled={isGenerating}
            className='bg-gradient-to-r from-blue-500 to-indigo-500'
          >
            ✨ Generate a Word Problem
          </Button>
        </div>
        {isGenerating && <LoadingSpinner />}
        {wordProblem && (
          <div className='mt-4 text-center'>
            <p className='text-lg text-gray-700 p-4 bg-white rounded-lg'>
              {wordProblem.problem}
            </p>
            <div className='flex items-center justify-center my-4 space-x-4'>
              <input
                type='number'
                value={userWordProblemAnswer}
                onChange={e => setUserWordProblemAnswer(e.target.value)}
                className='text-xl w-32 p-2 text-center border-2 border-gray-300 rounded-lg'
              />
              <Button onClick={checkWordProblemAnswer}>Solve</Button>
            </div>
          </div>
        )}
        {wordProblemFeedback && (
          <p
            className={`text-center font-semibold ${
              wordProblemFeedback.includes('Correct')
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {wordProblemFeedback}
          </p>
        )}
      </Card>
    </>
  )
}

export default MultiplicationDivision