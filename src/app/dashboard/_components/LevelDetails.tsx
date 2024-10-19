import IconFillingEffect from '@/components/IconFillingEffect';
import { Cup } from 'iconsax-react';
import Link from 'next/link';

import React from 'react'

interface LevelDetailsProps {
    userLevel: any;
    beams: number;
  
  }

const LevelDetails: React.FC<LevelDetailsProps>= ({ userLevel, beams}) => {
  return (

    <div className='w-full gap-3 pb-4 max-w-md rounded-3xl shadow-defined bg-background  flex flex-col items-center justify-center '>
    
    <div 
    style={{ backgroundColor: userLevel.bgColor }}
     className="flex items-center text-white w-full justify-center py-2 rounded-t-3xl">
        <Cup variant='Bold' size={20} className="mr-2" />
        <h2 className="text-sm  md:text-lg font-poppins font-semibold">My Level</h2>
      </div>
    <div className="flex items-center md:justify-start justify-center ">
<div className="flex items-center justify-center gap-4">
  <div className="flex items-center gap-2">
    <p className="text-xs mx-auto  md:text-base font-poppins font-medium uppercase ">Level {userLevel.levelNumber}</p>
    <div className="flex items-center gap-2">
      <p className="text-xs md:text-base uppercase font-medium font-poppins text-text relative">
        <span className="inline-block" >
        {userLevel.name}
        </span>
      </p>
    </div>
  </div>
  <p className="text-xs md:text-base mx-auto font-poppins  font-medium">{beams} Beams</p>

</div>
</div>

    
      <IconFillingEffect
                icon={userLevel.icon}
                filledColor={userLevel.bgColor}
                beams={beams}  
                minPoints={userLevel.minPoints}
                maxPoints={userLevel.maxPoints}
              />

      <Link
    href='/achievements'
    style={{ color: userLevel.bgColor }}
    className={` w-full underline font-medium mt-1  text-center mx-auto text-sm`}>
    View Progress
  </Link>
  </div>

  )
}

export default LevelDetails