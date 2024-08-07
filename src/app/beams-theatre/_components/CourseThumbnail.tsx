'use client';
import React from 'react';
import { Play } from 'iconsax-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import PreviewPlayer from './PreviewPlayer';

interface ThumbnailProps {
  thumbnailUrl: string;
  videoId: string;
}

const CourseThumbnail: React.FC<ThumbnailProps> = ({ thumbnailUrl, videoId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className='relative w-full h-0 pb-56 overflow-hidden rounded-lg cursor-pointer' style={{ paddingBottom: '56.25%' }} onClick={onOpen}>
        <img
          src={thumbnailUrl}
          alt='Course Thumbnail'
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <div className='bg-background bg-opacity-50 rounded-full p-3 flex items-center justify-center shadow-lg'>
            <Play size={32} className='text-primary' />
          </div>
        </div>
        <div className='absolute bottom-0 left-0 w-full h-full flex items-end'>
          <div className='w-full text-center bg-gradient-to-t from-text to-transparent py-2 font-poppins font-medium text-background text-base'>
            Preview this course
          </div>
        </div>
      </div>

      <Modal 
        backdrop="blur"
        placement='center' 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
        closeButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Preview</ModalHeader>
              <ModalBody>
                <PreviewPlayer videoId={videoId} thumbnailUrl={thumbnailUrl} id='1' />
              </ModalBody>
              <ModalFooter>
                
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CourseThumbnail;
