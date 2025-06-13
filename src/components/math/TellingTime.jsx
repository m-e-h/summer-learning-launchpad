import React, { useState, useEffect } from 'react'
import { Card, Button } from '../ui'

const TellingTime = () => {
  const [time, setTime] = useState({ hour: 0, minute: 0 })
  const [answer, setAnswer] = useState({ hour: '', minute: '' })
  const [feedback, setFeedback] = useState('')

  const generateTime = () => {
    setTime({
      hour: Math.floor(Math.random() * 12) + 1,
      minute: Math.floor(Math.random() * 12) * 5
    })
    setAnswer({ hour: '', minute: '' })
    setFeedback('')
  }

  useEffect(generateTime, [])

  const checkTime = () => {
    const minuteStr = time.minute < 10 ? `0${time.minute}` : `${time.minute}`
    if (
      parseInt(answer.hour) === time.hour &&
      parseInt(answer.minute) === time.minute
    ) {
      setFeedback('Correct! You are a time wizard! 🧙')
      setTimeout(generateTime, 2000)
    } else {
      setFeedback(
        `Not quite. The time is ${time.hour}:${minuteStr}. Let&apos;s try another!`
      )
      setTimeout(generateTime, 3000)
    }
  }

  const hourAngle = ((time.hour % 12) + time.minute / 60) * 30
  const minuteAngle = time.minute * 6

  return (
    <Card className='mt-8'>
      <h3 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
        What&apos;s the Time?
      </h3>
      <div className='flex justify-center items-center'>
        <div className='w-64 h-64 bg-gray-100 rounded-full border-8 border-gray-700 relative'>
          {/* Hour Hand: Corrected positioning */}
          <div
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
            className='h-16 w-1.5 bg-gray-800 absolute bottom-1/2 left-1/2 origin-bottom'
          ></div>
          {/* Minute Hand: Corrected positioning */}
          <div
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
            className='h-24 w-1 bg-gray-800 absolute bottom-1/2 left-1/2 origin-bottom'
          ></div>
          {/* Center Dot */}
          <div className='w-4 h-4 bg-gray-900 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'></div>
        </div>
      </div>
      <div className='flex items-center justify-center my-6 space-x-2'>
        <input
          type='number'
          min='1'
          max='12'
          placeholder='H'
          value={answer.hour}
          onChange={e => setAnswer({ ...answer, hour: e.target.value })}
          className='w-20 p-2 text-xl text-center border-2 rounded-lg'
        />
        <span className='text-2xl font-bold'>:</span>
        <input
          type='number'
          min='00'
          max='59'
          placeholder='MM'
          value={answer.minute}
          onChange={e => setAnswer({ ...answer, minute: e.target.value })}
          className='w-20 p-2 text-xl text-center border-2 rounded-lg'
        />
        <Button onClick={checkTime} className='bg-green-500 hover:bg-green-600'>
          Set
        </Button>
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
    </Card>
  )
}

export default TellingTime
