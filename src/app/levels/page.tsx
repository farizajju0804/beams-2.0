import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import React from 'react'
import Heading from '../dashboard/_components/Heading'
import UserLevelIndicator from './_components/UserLevelIndicator'
import {  currentUser } from '@/libs/auth'
import { getAllLevels, getUserBeams } from '@/actions/points/getAllLevels'
import LevelsModal from './_components/LevelsModal'

const page = async() => {
  const user:any = await currentUser();
  const levels = await getAllLevels();

  const beams = await getUserBeams(user?.id);

  return (
    <div className='flex flex-col w-full'>
        <LevelsModal/>
        <UserLevelIndicator levels={levels} beams={beams.beams}/>

    </div>
  )
}

export default page