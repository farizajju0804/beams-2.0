import React from 'react'

const RedirectionMessage = () => {
  return (
   
        <div className="fixed min-h-screen inset-0 bg-text bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-poppins text-green-500 font-semibold mb-2">Submission Successful!</p>
            <p className='text-text'>Redirecting ...</p>
          </div>
        </div>
      
  )
}

export default RedirectionMessage