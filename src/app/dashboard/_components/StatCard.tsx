import React from 'react';
import Image from 'next/image';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

interface StatCardProps {
  title: string;
  value: string | number;
  imageSrc: string;
  modalContent: React.ReactNode;
  viewLabel: string;
  showViewLabel : boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, imageSrc, modalContent, viewLabel,showViewLabel }) => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <div className="bg-background rounded-2xl shadow-defined p-4 md:p-6 flex items-center justify-between  ">
        <div className="flex flex-col items-start">
          <h4 className="text-sm md:text-lg font-semibold text-text">{title}</h4>
          <p className="text-2xl md:text-4xl font-poppins my-3 font-bold bg-gradient-to-b from-brand to-yellow text-transparent bg-clip-text">{value}</p>
          {showViewLabel && 
          <Button 
            size="sm" 
            className="text-xs text-grey-2 md:text-sm bg-transparent   rounded-full underline transition-all p-0 duration-300"
            onClick={onOpen}
          >
            {viewLabel}
          </Button>
        }
        </div>
        <Image src={imageSrc} alt={title} width={100} height={100} className="w-16 h-16 " />
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        scrollBehavior="inside"
        backdrop="blur"
        size="3xl"
        classNames={{
          wrapper : 'z-[110]'
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-text font-poppins">{title}</h2>
          </ModalHeader>
          <ModalBody className='px-4 py-0'>
            <div className="max-h-[80vh] overflow-y-auto">
              {modalContent}
            </div>
          </ModalBody>
          
        </ModalContent>
      </Modal>
    </>
  );
};

export default StatCard;