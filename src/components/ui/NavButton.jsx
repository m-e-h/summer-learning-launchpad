import React from 'react'

const NavButton = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-white text-blue-600 shadow-md'
        : 'text-white hover:bg-white/20'
    }`}
  >
    {children}
  </button>
)

export default NavButton