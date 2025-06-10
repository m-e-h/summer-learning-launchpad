import React, { useState } from 'react'
import { Header, HomePage } from './components/layout'
import { MultiplicationDivision, FractionsPractice, TellingTime } from './components/math'
import { StoryTime, GrammarPower } from './components/reading'
import { ScienceExplorer } from './components/science'
import { SocialStudiesExplorer } from './components/social-studies'
import { ErrorBoundary } from './components/ui'

export default function App() {
  const [page, setPage] = useState('home')

  const renderPage = () => {
    switch (page) {
      case 'math':
        return (
          <>
            <MultiplicationDivision />
            <FractionsPractice />
            <TellingTime />
          </>
        )
      case 'reading':
        return (
          <>
            <StoryTime />
            <GrammarPower />
          </>
        )
      case 'science':
        return <ScienceExplorer />
      case 'social-studies':
        return <SocialStudiesExplorer />
      case 'home':
      default:
        return <HomePage onNavigate={setPage} />
    }
  }

  const pageTitles = {
    home: 'Welcome!',
    math: 'Mastering Math',
    reading: 'Reading & Writing Adventures',
    science: 'Exploring Science',
    'social-studies': 'Discovering Our World'
  }

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8'>
        <div className='max-w-4xl mx-auto'>
          <Header currentPage={page} onNavigate={setPage} />
          <main>
            <h2 className='text-4xl font-bold text-gray-700 mb-6 text-center'>
              {pageTitles[page]}
            </h2>
            {renderPage()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
