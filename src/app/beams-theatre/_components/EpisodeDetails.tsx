'use client'

import React from 'react'
import NoteModal from './NoteModal';
import ShareButton from '@/app/beams-today/_components/ShareButton';
import TabsComponent from './TabsComponent';

const tabs = [
    {
      key: 'transcript',
      title: 'Transcript',
      content: <h1>Transcript</h1>,
    },
    {
      key: 'info',
      title: 'Info',
      content: <h1>Info</h1>,
    },
    {
      key: 'resources',
      title: 'Resources',

      content: <h1>Resources</h1>,
    }
  ];
const EpisodeDetails = () => {
  return (
    <div className='w-full lg:px-0 px-6 flex flex-col'>
        <div className="rounded-3xl">
      <h1 className="text-2xl md:text-3xl font-bold font-poppins my-2">Quantum Dots</h1>
      <div className="flex justify-between gap-4 items-center w-full mt-2">
        <p className="text-grey-2 text-xs lg:text-base">
          Beams
        </p>
        <div className="flex items-center gap-4">
          <NoteModal id={""} title={""} />
          {/* <ShareButton data={} /> */}
        </div>
      </div>
    </div>
       <div className="flex w-full items-start justify-start flex-col mt-4 ">
      <TabsComponent tabs={tabs} onTabChange={()=>{}} />
    </div>
    </div>
  )
}

export default EpisodeDetails



    

