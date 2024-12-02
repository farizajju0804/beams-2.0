'use client';

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { FactModal } from "@/app/beams-facts/_components/FactModal";
import { Button } from "@nextui-org/react";
import { Refresh } from "iconsax-react";
import { useRouter } from "next/navigation";

interface Fact {
  id: string;
  title: string;
  thumbnail: string;
  finalImage: string;
  finalImageDark: string;
  hashtags: string[];
  date: Date;
  category: {
    name: string;
    color: string;
  };
  completed: boolean;
}

interface SwipeCardsProps {
  initialFacts: Fact[];
  userId: string;
}

const SwipeCards = ({ initialFacts, userId }: SwipeCardsProps) => {
  const [facts, setFacts] = useState<Fact[]>(initialFacts);
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);

  const handleRefresh = () => {
    setFacts(initialFacts);
  };

  return (
    <div className="w-full mt-6">
      <h1 className="text-2xl px-4 font-poppins mb-4 font-semibold">
        Beams Facts
      </h1>
      
      <div className="grid h-[450px] w-full place-items-center bg-default-100">
        {facts.length > 0 ? (
          facts.map((fact, index) => (
            <FactCard 
              key={fact.id} 
              facts={facts} 
              setFacts={setFacts} 
              index={index}
              onSelect={setSelectedFact}
              {...fact} 
            />
          ))
        ) : (
          <EmptyState onRefresh={handleRefresh} />
        )}
      </div>
      
      {selectedFact && (
        <FactModal
          isOpen={!!selectedFact}
          onClose={() => setSelectedFact(null)}
          fact={selectedFact}
          userId={userId}
        />
      )}
    </div>
  );
};

interface FactCardProps extends Fact {
  setFacts: Dispatch<SetStateAction<Fact[]>>;
  facts: Fact[];
  index: number;
  onSelect: (fact: Fact) => void;
}

const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => {
  const router = useRouter();

  return (
    <motion.div 
      className="flex flex-col items-center justify-center gap-6 text-center p-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">All caught up!</h3>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          variant="bordered"
          onClick={onRefresh}
          className="w-full gap-2"
        >
          <Refresh className="w-4 h-4" />
          Start Over
        </Button>
        
        <Button
          onClick={() => router.push('/beams-facts')}
          className="w-full font-semibold text-white"
          color="primary"
        >
          Explore More Facts
        </Button>
      </div>
    </motion.div>
  );
};

const FactCard = ({
  id,
  thumbnail,
  title,
  category,
  setFacts,
  facts,
  index,
  onSelect,
  ...fact
}: FactCardProps) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-100, 100], [-10, 10]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const isFront = id === facts[facts.length - 1].id;
  const [isDragging, setIsDragging] = useState(false);
  
  const rotate = useTransform(() => {
    const offset = isFront ? 0 : index % 2 ? 4 : -4;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    setIsDragging(false);
    if (Math.abs(x.get()) > 50) {
      setFacts((pv) => pv.filter((v) => v.id !== id));
    }
  };

  const handleClick = () => {
    if (!isDragging && isFront) {
      onSelect({ id, thumbnail, title, category, ...fact });
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <motion.div
      className="relative h-96 w-72 origin-bottom rounded-lg bg-background hover:cursor-grab active:cursor-grabbing overflow-hidden touch-none"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 5px 10px -5px rgb(0 0 0 / 0.3), 0 4px 6px -6px rgb(0 0 0 / 0.3)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      dragElastic={0.7}
      dragMomentum={true}
      dragSnapToOrigin={true}
      dragTransition={{ 
        bounceStiffness: 300,
        bounceDamping: 20 
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileTap={{ cursor: "grabbing", scale: 0.98 }}
    >
      <div className="relative h-full w-full pointer-events-none">
        <div className="relative h-3/4 w-full">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            priority={index === facts.length - 1}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-background p-4">
          <span
            className="inline-block text-white px-2 py-1 text-xs font-semibold rounded-full mb-2"
            style={{ 
              backgroundColor: `${category.color}`,
            }}
          >
            {category.name}
          </span>
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCards;