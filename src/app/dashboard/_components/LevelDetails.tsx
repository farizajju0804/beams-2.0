import IconFillingEffect from '@/components/IconFillingEffect';
import Link from 'next/link';

import React from 'react'

interface LevelDetailsProps {
    userLevel: any;
    beams: number;
  
  }

const LevelDetails: React.FC<LevelDetailsProps>= ({ userLevel, beams}) => {
  return (

    <div className='gap-3 mb-2 md:mb-0 flex flex-col items-center justify-center '>
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