"use client";

import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial window size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Mobile beam configuration
  const mobileBeams = [
    {
      initialX: 60,
      translateX: 60,
      duration: 10,
      repeatDelay: 6,
      delay: 1,
    },
    {
      initialX: 120,
      translateX: 120,
      duration: 12,
      repeatDelay: 8,
      delay: 3,
    },
    {
      initialX: 220,
      translateX: 220,
      duration: 11,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 260,
      translateX: 260,
      duration: 13,
      repeatDelay: 5,
      delay: 4,
    }
  ];

  // Desktop beam configuration
  const desktopBeams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 12,
      repeatDelay: 8,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 15,
      repeatDelay: 10,
      delay: 6,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 13,
      repeatDelay: 12,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 14,
      repeatDelay: 14,
      delay: 8,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 16,
      repeatDelay: 9,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 18,
      repeatDelay: 11,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 20,
      repeatDelay: 13,
      delay: 10,
      className: "h-6",
    },
  ];
  
  const beams = isMobile ? mobileBeams : desktopBeams;

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-fit b-gradient-to-b from-background to-background/10 relative flex items-center w-full justify-center overflow-hidden",
        className
      )}
    >
      {beams.map((beam, index) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
          beamIndex={index}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-default-100 w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamIndex: number;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {}, beamIndex }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);
  const collisionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add cooldown control
  const [isInCooldown, setIsInCooldown] = useState(false);
  const cooldownDuration = 5000 + (beamIndex * 1000); // Stagger cooldowns based on beam index

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected &&
        !isInCooldown
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
          setIsInCooldown(true);
          
          // Reset cooldown after duration
          setTimeout(() => {
            setIsInCooldown(false);
          }, cooldownDuration);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 100); // Reduced check frequency

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, isInCooldown, cooldownDuration]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      if (collisionTimeoutRef.current) {
        clearTimeout(collisionTimeoutRef.current);
      }

      collisionTimeoutRef.current = setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }

    return () => {
      if (collisionTimeoutRef.current) {
        clearTimeout(collisionTimeoutRef.current);
      }
    };
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "1800px",
            translateX: beamOptions.translateX || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-brand via-yellow to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-brand to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-brand to-yellow"
        />
      ))}
    </div>
  );
};

export default BackgroundBeamsWithCollision;