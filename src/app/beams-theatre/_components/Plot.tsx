'use client'
import { Accordion, AccordionItem, Card, CardBody } from '@nextui-org/react';
import { ArrowDown2, ArrowUp2 } from 'iconsax-react';
import React from 'react';

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

const sections: Section[] = [
  {
    level: 'Beginner',
    color: 'bg-green-500',
    items: [
      {
        title: 'Introduction',
        completed: true,
        subitems: [{ title: 'Intro to materials', duration: '04:45', completed: true }],
      },
    ],
  },
  {
    level: 'Intermediate',
    color: 'bg-purple-500',
    items: [
      {
        title: 'Properties',
        completed: true,
        subitems: [{ title: 'Material properties overview', duration: '04:45', completed: true }],
      },
    ],
  },
  {
    level: 'Advanced',
    color: 'bg-blue-500',
    items: [
      {
        title: 'Applications Of Magical Materials',
        progress: 20,
        subitems: [
          { title: 'Aerogel Applications', duration: '04:45', completed: true },
          { title: 'Quantum Dots Applications', duration: '04:45', completed: false },
          { title: 'Graphene Applications', duration: '04:45', completed: false },
          { title: 'PiezoElectric Applications', duration: '04:45', completed: false },
        ],
      },
    ],
  },
  {
    level: 'Proficient',
    color: 'bg-yellow-500',
    items: [
      {
        title: 'Real Life Techniques',
        completed: false,
        subitems: [{ title: 'Techniques in practice', duration: '04:45', completed: false }],
      },
    ],
  },
  {
    level: 'Expert',
    color: 'bg-red-500',
    items: [
      {
        title: 'Future Research',
        completed: false,
        subitems: [{ title: 'Upcoming research topics', duration: '04:45', completed: false }],
      },
    ],
  },
];

const Plot = () => {
  return (
    <Card className="bg-grey-3 shadow-none border-none">
      <CardBody className="p-4">
        <h1 className="font-display text-lg lg:text-2xl font-bold text-text mb-4">The Plot</h1>
        {sections.map((section, idx) => (
          <div key={idx} className="mb-4">
            <div className="text-text flex lg:pl-4 gap-1 justify-start items-center w-fit mb-2">
              <div className={`w-2 h-2 rounded-full ${section.color}`}></div>
              <div className="text-text text-sm">{section.level}</div>
            </div>
            <Accordion variant='shadow' className="gap-6 shadow-none border-none outline-none rounded-3xl px-0">
              {section.items.map((item, index) => (
                <AccordionItem
                  disableIndicatorAnimation
                  key={index}
                  aria-label={`Accordion ${index}`}
                  indicator={({ isOpen }) =>
                    isOpen ? <ArrowUp2 size={24} className="text-text" /> : <ArrowDown2 size={24} className="text-text" />
                  }
                  title={item.title}
                  classNames={{
                    content: 'py-0 ',
                    heading : "px-4 py-0 shadow-none border-none outline-none",
                    title: 'font-poppins text-base lg:text-xl font-medium',
                    indicator: 'transform-none',
                  }}
                  className="outline-none shadow-none"
                >
                  {item.subitems &&
                    item.subitems.map((subitem, subindex) => (
                      <div key={subindex} className="text-grey-2 flex items-center px-4 justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h1 className="font-normal text-sm lg:text-base">{subitem.title}</h1>
                        </div>
                        <p className=" text-sm lg:text-base font-normal">{subitem.duration}</p>
                      </div>
                    ))}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default Plot;
