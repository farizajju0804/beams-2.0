'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ScrollPath = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const circle = circleRef.current;

    if (path && circle) {
      gsap.to(circle, {
        motionPath: {
          path: path,
          align: path,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
          start: 0.25,
          end: 0.75
        },
        transformOrigin: "50% 50%",
        scrollTrigger: {
          trigger: path,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          markers: true, // Remove this line if you don't want to see debug markers
        },
      });

      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className="relative h-[1719px]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 793.5 1719"
        className="absolute left-1/2 transform -translate-x-1/2"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          ref={pathRef}
          d="M321.62 106c12.83 51.17 54.11 182.87 145.38 216.5 114 42 270-21 275 147s-392 136-528 275-34 289-34 289 64 110 205 135 270 12 337 165-121 283-121 283-99 58-183 61-312 63-360 281 146 283 146 283 116 30 207 28 284 22 301 144-34 196-94 247-183 101-215 114-205 47-245 224 152 270 190 281c36.35 10.52 183.43 101.57 192.62 204"
          stroke="#a7abb2"
          strokeMiterlimit="10"
          strokeWidth="2"
          fill="none"
          className="path"
        />
      </svg>
      <div ref={circleRef} className="w-8 h-8 bg-black rounded-full"></div>
    </div>
  );
};

export default ScrollPath;
