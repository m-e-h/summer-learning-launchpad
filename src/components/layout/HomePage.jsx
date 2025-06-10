import React from 'react'

const HomePage = ({ onNavigate }) => (
  <div className='text-center'>
    <h1 className='text-5xl font-extrabold text-gray-800 mb-2'>
      Get Ready for 3rd Grade!
    </h1>
    <p className='text-xl text-gray-600 mb-12'>
      Let&apos;s practice and have some fun! 🎉
    </p>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div
        onClick={() => onNavigate('math')}
        className='p-8 bg-blue-100 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all'
      >
        <h2 className='text-3xl font-bold text-blue-800'>➕ Math</h2>
      </div>
      <div
        onClick={() => onNavigate('reading')}
        className='p-8 bg-purple-100 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all'
      >
        <h2 className='text-3xl font-bold text-purple-800'>📚 Reading</h2>
      </div>
      <div
        onClick={() => onNavigate('science')}
        className='p-8 bg-green-100 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all'
      >
        <h2 className='text-3xl font-bold text-green-800'>🔬 Science</h2>
      </div>
      <div
        onClick={() => onNavigate('social-studies')}
        className='p-8 bg-orange-100 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all'
      >
        <h2 className='text-3xl font-bold text-orange-800'>
          🗺️ Social Studies
        </h2>
      </div>
    </div>
  </div>
)

export default HomePage