import React from 'react'
import { NavButton } from '../ui'

const Header = ({ currentPage, onNavigate }) => {
  return (
    <header className='mb-8 p-4 bg-blue-600 rounded-2xl shadow-xl'>
      <nav className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-white hidden md:block'>
          3rd Grade Prep
        </h1>
        <div className='flex flex-wrap justify-center space-x-2 bg-blue-700/50 p-1.5 rounded-xl'>
          <NavButton
            onClick={() => onNavigate('home')}
            isActive={currentPage === 'home'}
          >
            Home
          </NavButton>
          <NavButton
            onClick={() => onNavigate('math')}
            isActive={currentPage === 'math'}
          >
            Math
          </NavButton>
          <NavButton
            onClick={() => onNavigate('reading')}
            isActive={currentPage === 'reading'}
          >
            Reading
          </NavButton>
          <NavButton
            onClick={() => onNavigate('science')}
            isActive={currentPage === 'science'}
          >
            Science
          </NavButton>
          <NavButton
            onClick={() => onNavigate('social-studies')}
            isActive={currentPage === 'social-studies'}
          >
            Social Studies
          </NavButton>
        </div>
      </nav>
    </header>
  )
}

export default Header