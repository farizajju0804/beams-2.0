import React from 'react'
interface HeadingProps{
    heading : string
}
const Heading: React.FC<HeadingProps> = ({heading}) => {
  return (
    <div className="pl-6 lg:pl-0 flex flex-col items-start">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">{heading}</h1>
        <div className="border-b-2 border-brand mb-6 w-[60px]" ></div>
    </div>
  )
}

export default Heading