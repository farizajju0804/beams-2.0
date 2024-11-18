import React from 'react'
import AdminBeamsToday from './_actions/_components/AdminPage'
import ConnectionGamePage from './_actions/_components/ConnectionGame'

const page = () => {
  return (
    <div>
        <AdminBeamsToday/>
        <ConnectionGamePage/>
    </div>
  )
}

export default page