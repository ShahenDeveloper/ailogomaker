import React from 'react'

function HeadingDescription({title,description}) {
  return (
    <div>
        <h2 className='font-bold sm:text-3xl text-2xl text-primary'>{title}</h2>
        <p className='sm:text-lg text-base text-gray-500 mt-2'>{description}</p>
    </div>
  )
}

export default HeadingDescription