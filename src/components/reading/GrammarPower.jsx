import React, { useState } from 'react'
import { Card, Button } from '../ui'

const GrammarPower = () => {
  const sentences = [
    {
      text: 'The happy dog chased the red ball.',
      words: {
        happy: 'adjective',
        dog: 'noun',
        chased: 'verb',
        red: 'adjective',
        ball: 'noun'
      }
    },
    {
      text: 'A tall girl reads a funny book.',
      words: {
        tall: 'adjective',
        girl: 'noun',
        reads: 'verb',
        funny: 'adjective',
        book: 'noun'
      }
    }
  ]
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [selectedWord, setSelectedWord] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [correctlyIdentified, setCorrectlyIdentified] = useState({})

  const currentSentence = sentences[sentenceIndex]

  const identifyWord = wordType => {
    if (!selectedWord) return
    const correctType = currentSentence.words[selectedWord]
    if (wordType === correctType) {
      setFeedback(`'${selectedWord}' is indeed a ${wordType}! Correct!`)
      setCorrectlyIdentified(prev => ({ ...prev, [selectedWord]: true }))
    } else {
      setFeedback(`Not quite. '${selectedWord}' is a ${correctType}.`)
    }
    setSelectedWord(null)
    setTimeout(() => setFeedback(''), 2000)
  }

  const nextSentence = () => {
    setSentenceIndex(current => (current + 1) % sentences.length)
    setCorrectlyIdentified({})
    setFeedback('')
  }

  return (
    <Card className='mt-8'>
      <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        Grammar Power
      </h3>
      <p className='text-center text-gray-600 mb-4'>
        Click a word, then identify its type!
      </p>
      <div className='p-4 bg-gray-100 rounded-lg text-2xl text-center'>
        {currentSentence.text.split(' ').map((word, i) => {
          const cleanWord = word.replace('.', '')
                     const isIdentifiable = Object.prototype.hasOwnProperty.call(currentSentence.words, cleanWord)
          return (
            <span key={i} className='mr-2'>
              <span
                onClick={() => isIdentifiable && setSelectedWord(cleanWord)}
                className={`cursor-pointer p-1 rounded ${
                  isIdentifiable ? 'hover:bg-yellow-200' : ''
                } ${selectedWord === cleanWord ? 'bg-yellow-400' : ''} ${
                  correctlyIdentified[cleanWord] ? 'bg-green-300' : ''
                }`}
              >
                {word}
              </span>
            </span>
          )
        })}
      </div>
      <div className='flex justify-center space-x-4 my-6'>
        <Button
          onClick={() => identifyWord('noun')}
          className='bg-pink-500 hover:bg-pink-600'
        >
          Noun
        </Button>
        <Button
          onClick={() => identifyWord('verb')}
          className='bg-indigo-500 hover:bg-indigo-600'
        >
          Verb
        </Button>
        <Button
          onClick={() => identifyWord('adjective')}
          className='bg-teal-500 hover:bg-teal-600'
        >
          Adjective
        </Button>
      </div>
      {feedback && <p className='text-center font-semibold'>{feedback}</p>}
      <div className='text-center mt-6'>
        <Button onClick={nextSentence}>Next Sentence</Button>
      </div>
    </Card>
  )
}

export default GrammarPower