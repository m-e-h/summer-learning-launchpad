import React, { useState } from 'react'
import { Card, Button, LoadingSpinner, SecureInput } from '../ui'
import { callGemini } from '../../services/geminiApi'

const StoryTime = () => {
  const defaultStory = {
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

  const [story, setStory] = useState(defaultStory)
  const [answers, setAnswers] = useState(
    Array(defaultStory.questions.length).fill('')
  )
  const [feedback, setFeedback] = useState(
    Array(defaultStory.questions.length).fill(null)
  )

  // State for Gemini features
  const [continuedStory, setContinuedStory] = useState('')
  const [isContinuing, setIsContinuing] = useState(false)
  const [isGeneratingStory, setIsGeneratingStory] = useState(false)

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

  const resetAnswers = questionCount => {
    setAnswers(Array(questionCount).fill(''))
    setFeedback(Array(questionCount).fill(null))
    setContinuedStory('')
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

  const handleGenerateNewStory = async () => {
    setIsGeneratingStory(true)

    const storyPrompt = `Write a short, engaging story for 3rd grade students (about 100-150 words). The story should:
    - Have 2-3 main characters with simple names
    - Include a clear problem and solution
    - Be positive and age-appropriate
    - Have a clear beginning, middle, and end
    - Use vocabulary suitable for 8-9 year olds
    - Do not use Lily and Tom at the beach`

    const storySchema = {
      type: 'OBJECT',
      properties: {
        storyTitle: { type: 'STRING' },
        storyText: { type: 'STRING' }
      },
      required: ['storyTitle', 'storyText']
    }

    try {
      const storyResult = await callGemini(storyPrompt, storySchema)

      if (storyResult) {
        // storyResult is already parsed JSON from the API
        const parsedStory = storyResult

        // Generate questions for the new story
        const questionsPrompt = `Based on this story: "${parsedStory.storyText}"

        Create exactly 3 simple comprehension questions suitable for 3rd graders. For each question, provide possible correct answers (keywords that would be acceptable in a student's response).`

        const questionsSchema = {
          type: 'OBJECT',
          properties: {
            questions: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  q: { type: 'STRING' },
                  a: {
                    type: 'ARRAY',
                    items: { type: 'STRING' }
                  }
                },
                required: ['q', 'a']
              }
            }
          },
          required: ['questions']
        }

        const questionsResult = await callGemini(
          questionsPrompt,
          questionsSchema
        )

        if (questionsResult) {
          // questionsResult is already parsed JSON from the API
          const newStory = {
            title: parsedStory.storyTitle,
            text: parsedStory.storyText,
            questions: questionsResult.questions || []
          }

          setStory(newStory)
          resetAnswers(newStory.questions.length)
        } else {
          // Fallback if questions generation fails
          const newStory = {
            title: parsedStory.storyTitle,
            text: parsedStory.storyText,
            questions: [
              {
                q: 'Who are the main characters in this story?',
                a: ['character', 'main']
              },
              {
                q: 'What problem did the characters face?',
                a: ['problem', 'trouble']
              },
              {
                q: 'How was the problem solved?',
                a: ['solved', 'fixed', 'helped']
              }
            ]
          }
          setStory(newStory)
          resetAnswers(3)
        }
      }
    } catch (error) {
      console.error('Error generating story:', error)
      // Keep the current story if generation fails
    }

    setIsGeneratingStory(false)
  }

  const handleResetToDefault = () => {
    setStory(defaultStory)
    resetAnswers(defaultStory.questions.length)
  }

  return (
    <Card>
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-2xl font-bold text-gray-800'>{story.title}</h3>
        <div className='flex gap-2'>
          <Button
            onClick={handleGenerateNewStory}
            disabled={isGeneratingStory}
            className='bg-gradient-to-r from-blue-500 to-purple-500 text-sm px-3 py-1'
          >
            {isGeneratingStory ? '✨ Creating...' : '✨ New Story'}
          </Button>
          {story !== defaultStory && (
            <Button
              onClick={handleResetToDefault}
              className='bg-gray-500 hover:bg-gray-600 text-sm px-3 py-1'
            >
              📖 Original
            </Button>
          )}
        </div>
      </div>

      {isGeneratingStory && (
        <div className='mb-4'>
          <LoadingSpinner />
          <p className='text-center text-gray-600 mt-2'>
            Creating a new story for you...
          </p>
        </div>
      )}

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
