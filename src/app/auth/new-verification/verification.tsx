import React, { Suspense } from 'react'
import NewVerification from './_components/verification'

const verification = () => {
  return (
    <Suspense>
        <NewVerification/>
    </Suspense>
  )
}

export default verification