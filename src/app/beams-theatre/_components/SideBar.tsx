'use client'

import { Accordion, AccordionItem } from '@nextui-org/react'
import { AddCircle, TickCircle, MinusCirlce, PlayCircle, Play } from 'iconsax-react'
import React, { useState } from 'react'

interface SubItem {
  title: string;
  duration: string;
  completed: boolean;
}

interface Item {
  title: string;
  duration?: string;
  completed?: boolean;
  progress?: number;
  subitems?: SubItem[];
}

interface Section {
  level: string;
  color: string;
  items: Item[];
}

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const sections: Section[] = [
    {
      level: "Beginner",
      color: "bg-green-500",
      items: [
        {
          title: "Introduction",
          completed: true,
          subitems: [
            { title: "Intro to materials", duration: "04:45", completed: true },
            { title: "Intro to materials", duration: "04:45", completed: true },
            { title: "Intro to materials", duration: "04:45", completed: true }

          ]
        }
      ],
    },
    {
      level: "Intermediate",
      color: "bg-purple-500",
      items: [
        {
          title: "Properties",
          completed: true,
          subitems: [
            { title: "Material properties overview", duration: "04:45", completed: true },
            { title: "Material properties overview", duration: "04:45", completed: true },
            { title: "Material properties overview", duration: "04:45", completed: true }
          ]
        }
      ],
    },
    {
      level: "Advanced",
      color: "bg-blue-500",
      items: [
        {
          title: "Applications Of Magical Materials",
          progress: 20,
          subitems: [
            { title: "Aerogel Applications", duration: "04:45", completed: true },
            { title: "Quantum Dots Applications", duration: "04:45", completed: false },
            { title: "Graphene Applications", duration: "04:45", completed: false },
            { title: "PiezoElectric Applications", duration: "04:45", completed: false },
          ],
        },
      ],
    },
    {
      level: "Proficient",
      color: "bg-yellow-500",
      items: [
        {
          title: "Real Life Techniques",
          completed: false,
          subitems: [
            { title: "Techniques in practice", duration: "04:45", completed: false }
            ,
            { title: "Techniques in practice", duration: "04:45", completed: false }
,
{ title: "Techniques in practice", duration: "04:45", completed: false }

          ]
        }
      ],
    },
    {
      level: "Expert",
      color: "bg-red-500",
      items: [
        {
          title: "Future Research",
          completed: false,
          subitems: [
            { title: "Upcoming research topics", duration: "04:45", completed: false },
            { title: "Upcoming research topics", duration: "04:45", completed: false },
            { title: "Upcoming research topics", duration: "04:45", completed: false }
          ]
        }
      ],
    },
  ];

  const renderIcon = (completed: boolean, progress?: number) => {
    if (completed) {
      return <TickCircle variant="Bold" size={32} className='text-brand' />;
    } else if (progress) {
      return <PlayCircle size={32} className='text-brand' />;
    } else {
      return <PlayCircle size={32} variant='Outline' className='text-text/30' />;
    }
  };
  const renderSubIcon = (completed: boolean, progress?: number) => {
    if (completed) {
      return <TickCircle variant='Bold' size={20} className='text-text' />;
    } else if (progress) {
      return <PlayCircle size={20} className='text-text' />;
    } else {
      return <PlayCircle size={20} variant='Outline' className='text-text/30' />;
    }
  };

  return (
    <div className={`hidden lg:block transition-width duration-300 ${isOpen ? 'w-full lg:w-[30%]' : 'w-fit'}`}>
      <div className={`flex mb-4 justify-between items-center ${isOpen ? 'w-auto' : 'w-fit'} transition-width duration-300 `}>
        {isOpen && <h2 className='text-xl font-semibold'>Progress</h2>}
        <button className='' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MinusCirlce size={24}  /> : <AddCircle size={24} />}
        </button>
      </div>
      <div className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}>
        {sections.map((section, idx) => (
          <div key={idx} className='mb-4'>
            <div className='text-text flex gap-1 justify-center items-center w-fit mb-2'><div className={`w-2 h-2 rounded-full ${section.color}`}></div><div className='text-text text-sm'>{section.level}</div></div>
            <Accordion className='gap-4 px-0' showDivider>
              {section.items.map((item, index) => (
                <AccordionItem
                  disableIndicatorAnimation
                  key={index}
                  aria-label={`Accordion ${index}`}
                  startContent={renderIcon(item.completed || false, item.progress)}
                  indicator={({ isOpen }) =>
                    isOpen ? <MinusCirlce size={24} className='text-text' /> : <AddCircle size={24} className='text-text' />
                  }
                  title={item.title}
                  classNames={{heading: 'p-0',title : "font-poppins text-base font-medium", indicator : "transform-none"}}
                  className='border-b-1 p-0'
                >
                  {item.subitems && item.subitems.map((subitem, subindex) => (
                    <div key={subindex} className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-2'>
                        {renderSubIcon(subitem.completed)}
                        <h1 className='font-normal w-[90%] text-sm'>{subitem.title}</h1>
                      </div>
                      <p className='text-grey-2 font-normal'>{subitem.duration}</p>
                    </div>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar;
