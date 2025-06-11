import React, { useState, useEffect, useMemo } from 'react'
import { Card, Button, LoadingSpinner, SecureInput } from '../ui'
import { callGemini } from '../../services/geminiApi'

const ScienceExplorer = () => {
  const planets = useMemo(() => [
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune'
  ], [])
  const [shuffledPlanets, setShuffledPlanets] = useState([])
  const [orderedPlanets, setOrderedPlanets] = useState(
    Array(planets.length).fill(null)
  )
  const [feedback, setFeedback] = useState('')

  // Gemini state
  const [showPlanetQA, setShowPlanetQA] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0])
  const [userQuestion, setUserQuestion] = useState('')
  const [planetResponse, setPlanetResponse] = useState('')
  const [isAsking, setIsAsking] = useState(false)

  useEffect(() => {
    setShuffledPlanets([...planets].sort(() => Math.random() - 0.5))
  }, [planets])

  const handleDragStart = (e, planet, source = 'shuffled') => {
    e.dataTransfer.setData('planet', planet)
    e.dataTransfer.setData('source', source)
  }

  const handleDragOver = e => e.preventDefault()

  const handleDrop = (e, index) => {
    e.preventDefault()
    const planet = e.dataTransfer.getData('planet')
    const source = e.dataTransfer.getData('source')

    const newOrderedPlanets = [...orderedPlanets]
    const newShuffledPlanets = [...shuffledPlanets]

    // If there's already a planet in this position, move it back to shuffled
    if (newOrderedPlanets[index]) {
      newShuffledPlanets.push(newOrderedPlanets[index])
    }

    // Place the new planet in the position
    newOrderedPlanets[index] = planet

    // Remove planet from its source
    if (source === 'shuffled') {
      const planetIndex = newShuffledPlanets.indexOf(planet)
      if (planetIndex > -1) {
        newShuffledPlanets.splice(planetIndex, 1)
      }
    } else if (source === 'ordered') {
      // Find and remove from ordered planets
      const planetIndex = newOrderedPlanets.findIndex((p, i) => p === planet && i !== index)
      if (planetIndex > -1) {
        newOrderedPlanets[planetIndex] = null
      }
    }

    setOrderedPlanets(newOrderedPlanets)
    setShuffledPlanets(newShuffledPlanets)
  }

  const handleOrderedPlanetClick = (planet, index) => {
    // Move planet back to shuffled when clicked
    const newOrderedPlanets = [...orderedPlanets]
    const newShuffledPlanets = [...shuffledPlanets]

    newOrderedPlanets[index] = null
    newShuffledPlanets.push(planet)

    setOrderedPlanets(newOrderedPlanets)
    setShuffledPlanets(newShuffledPlanets)
  }

  const checkOrder = () => {
    const isCorrect = orderedPlanets.every((p, i) => p === planets[i])
    if (isCorrect) {
      setFeedback(
        'You did it! You know your planets! 🪐 Now you can ask them a question.'
      )
      setShowPlanetQA(true)
    } else {
      setFeedback('Not quite right. Double check the order!')
      setShowPlanetQA(true)
    }
  }

  const reset = () => {
    setShuffledPlanets([...planets].sort(() => Math.random() - 0.5))
    setOrderedPlanets(Array(planets.length).fill(null))
    setFeedback('')
    setShowPlanetQA(false)
    setPlanetResponse('')
    setUserQuestion('')
  }

  const handleAskPlanet = async () => {
    if (!userQuestion.trim()) return
    setIsAsking(true)
    setPlanetResponse('')
    const prompt = `You are the planet ${selectedPlanet}. In one or two simple, friendly sentences suitable for an 8-year-old, answer this question: "${userQuestion}"`
    const result = await callGemini(prompt)
    if (result) {
      setPlanetResponse(result)
    } else {
      setPlanetResponse("I'm a bit spacey right now. Please ask again.")
    }
    setIsAsking(false)
  }

  return (
    <Card>
      <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        Our Solar System
      </h3>
      <p className='text-center text-gray-600 mb-6'>
        Drag the planets into the correct order from the sun. Click placed planets to move them back.
      </p>

      <div className='flex flex-wrap justify-center items-center gap-4 mb-8'>
        {shuffledPlanets.map(planet => (
          <div
            key={planet}
            draggable
            onDragStart={e => handleDragStart(e, planet, 'shuffled')}
            className='px-4 py-2 bg-gray-200 rounded-lg cursor-grab font-semibold hover:bg-gray-300 transition-colors'
          >
            {planet}
          </div>
        ))}
      </div>

      <div className='flex items-center space-x-2 md:space-x-4'>
        <div className='text-2xl font-bold text-yellow-500'>☀️</div>
        <div className='flex-1 grid grid-cols-4 md:grid-cols-8 gap-2'>
          {orderedPlanets.map((planet, i) => (
            <div
              key={i}
              onDrop={e => handleDrop(e, i)}
              onDragOver={handleDragOver}
              className={`h-20 w-full border-2 border-dashed rounded-lg flex justify-center items-center text-sm font-bold transition-colors ${
                planet
                  ? 'bg-blue-200 border-blue-400 text-blue-900 cursor-pointer hover:bg-blue-300'
                  : 'bg-blue-100/50 border-blue-300 text-blue-800'
              }`}
              onClick={() => planet && handleOrderedPlanetClick(planet, i)}
            >
              {planet && (
                <div
                  draggable
                  onDragStart={e => handleDragStart(e, planet, 'ordered')}
                  className='w-full h-full flex items-center justify-center cursor-grab'
                >
                  {planet}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='text-center mt-8 flex justify-center space-x-4'>
        <Button
          onClick={checkOrder}
          className='bg-green-500 hover:bg-green-600'
        >
          Check Order
        </Button>
        <Button onClick={reset} className='bg-red-500 hover:bg-red-600'>
          Reset
        </Button>
      </div>
      {feedback && (
        <p
          className={`text-center font-semibold mt-4 ${
            feedback.includes('did it') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Gemini Feature Section */}
      {showPlanetQA && (
        <div className='mt-8 pt-6 border-t-2 border-dashed border-green-200 bg-green-50/50 p-4 rounded-lg'>
          <h4 className='text-xl font-bold text-gray-700 text-center mb-4'>
            Ask a Planet a Question!
          </h4>
          <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
            <select
              value={selectedPlanet}
              onChange={e => setSelectedPlanet(e.target.value)}
              className='p-2 border-2 rounded-lg'
            >
              {planets.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <SecureInput
              value={userQuestion}
              onChange={setUserQuestion}
              placeholder='e.g., Why are you red?'
              className='flex-grow p-2 border-2 rounded-lg'
              maxLength={200}
            />
            <Button
              onClick={handleAskPlanet}
              disabled={isAsking}
              className='bg-gradient-to-r from-green-500 to-teal-500'
            >
              ✨ Ask
            </Button>
          </div>
          {isAsking && (
            <div className='mt-4'>
              <LoadingSpinner />
            </div>
          )}
          {planetResponse && (
            <p className='mt-4 text-gray-700 bg-white p-4 rounded-lg leading-relaxed shadow-sm'>
              <strong>{selectedPlanet} says:</strong> {planetResponse}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}

export default ScienceExplorer