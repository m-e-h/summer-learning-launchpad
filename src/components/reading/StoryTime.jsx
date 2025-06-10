import React, { useState } from 'react'
import { Card, Button, LoadingSpinner, SecureInput } from '../ui'
import { callGemini } from '../../services/geminiApi'

const StoryTime = () => {
  const story = {
    title: "Leo the Lizard's New Friend",
    text: `Leo the lizard loved to bask in the sun. One morning, he was lying on his favorite warm rock when a tiny, lost ladybug landed on his nose. The ladybug, whose name was Lily, was very scared. "I can't find my family," she whispered. Leo felt sorry for her. He gently tilted his head and pointed with his snout. "I saw a whole family of ladybugs on the big red flower this morning," he said. Lily's face lit up. She thanked Leo and flew straight to the flower, where her family was waiting.`,
    questions: [
      { q: 'Who are the main characters?', a: ['leo', 'lily'] },
      { q: 'Where does Leo like to rest?', a: ['rock', 'warm rock'] },
      {
        q: 'How does Leo help Lily?',
        a: ['told her where her family was', 'pointed to the flower']
      }
    ]
  }
  const [answers, setAnswers] = useState(Array(story.questions.length).fill(''))
  const [feedback, setFeedback] = useState(
    Array(story.questions.length).fill(null)
  )

  // State for Gemini feature
  const [continuedStory, setContinuedStory] = useState('')
  const [isContinuing, setIsContinuing] = useState(false)

  const updateAnswer = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const checkAnswers = () => {
    const newFeedback = story.questions.map((item, index) => {
      const userAnswer = answers[index].toLowerCase()
      return item.a.some(possibleAnswer => userAnswer.includes(possibleAnswer))
    })
    setFeedback(newFeedback)
  }

  const handleContinueStory = async () => {
    setIsContinuing(true)
    setContinuedStory('')
    const prompt = `Here is a short story for children: "${story.text}". Please write one creative paragraph that continues this story. Keep it simple and positive.`
    const result = await callGemini(prompt)
    if (result) {
      setContinuedStory(result)
    } else {
      setContinuedStory(
        "I'm a little stuck! Couldn't think of what happens next. Please try again."
      )
    }
    setIsContinuing(false)
  }

  return (
    <Card>
      <h3 className='text-2xl font-bold text-gray-800 mb-4'>{story.title}</h3>
      <p className='text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg'>
        {story.text}
      </p>
      <div className='mt-6 space-y-4'>
        {story.questions.map((q, index) => (
          <div key={index}>
            <label className='font-semibold text-gray-700'>{q.q}</label>
            <div className='flex items-center'>
              <SecureInput
                value={answers[index]}
                onChange={value => updateAnswer(index, value)}
                className='mt-1 block w-full border-2 rounded-lg p-2'
                maxLength={200}
              />
              {feedback[index] !== null && (
                <span className='ml-3 text-2xl'>
                  {feedback[index] ? '✅' : '❌'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='text-center mt-6'>
        <Button
          onClick={checkAnswers}
          className='bg-purple-500 hover:bg-purple-600'
        >
          Check Answers
        </Button>
      </div>

      {/* Gemini Feature Section */}
      <div className='mt-8 pt-6 border-t-2 border-dashed'>
        <div className='text-center'>
          <Button
            onClick={handleContinueStory}
            disabled={isContinuing}
            className='bg-gradient-to-r from-purple-500 to-pink-500'
          >
            ✨ What Happens Next?
          </Button>
        </div>
        {isContinuing && (
          <div className='mt-4'>
            <LoadingSpinner />
          </div>
        )}
        {continuedStory && (
          <p className='mt-4 text-gray-700 bg-purple-50 p-4 rounded-lg leading-relaxed'>
            {continuedStory}
          </p>
        )}
      </div>
    </Card>
  )
}

export default StoryTime