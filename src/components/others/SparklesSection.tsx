'use client'
import React, { useEffect, useRef } from "react";
import { SparklesCore } from "@/ui/Sparkles";
import { Spotlight } from "@/ui/Spotlight";
import Matter from 'matter-js';

export function SparklesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    // create an engine
    const engine = Engine.create();
    const world = engine.world;
    const runner = Runner.create();

    // create a renderer
    const render = Render.create({
      element: container,
      canvas: canvas,
      engine: engine,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: 'transparent',
      }
    });

    // create ground
    const ground = Bodies.rectangle(container.clientWidth / 2, container.clientHeight, container.clientWidth, 20, { isStatic: true });

    // create the word Beams
    const beamsText = document.getElementById('beams-text') as HTMLDivElement;
    const beamsBounds = beamsText.getBoundingClientRect();
    const beams = Bodies.rectangle(beamsBounds.left + beamsBounds.width / 2, beamsBounds.top + beamsBounds.height / 2, beamsBounds.width, beamsBounds.height, { isStatic: true, render: { visible: false } });

    // create medium-sized colorful balls at random positions around the middle
    const colors = ['#FF6347', '#FFA500', '#FFFF00', '#ADFF2F', '#00FF00', '#00CED1', '#1E90FF', '#FF69B4', '#EE82EE', '#8A2BE2', 'blue','red','yellow','orange','purple'];
    const balls: Matter.Body[] = [];
    const middleX = container.clientWidth / 2;

    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 20 + 10; // size between 10 and 30
      const color = colors[Math.floor(Math.random() * colors.length)];
      const ball = Bodies.circle(middleX, -size, size, { restitution: 0.9, render: { fillStyle: color } });
      balls.push(ball);
      // Stagger the start time for each ball
      setTimeout(() => {
        World.add(world, ball);
      }, i * 500); // 500ms interval
    }

    // create mouse control
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(world, [ground, beams, mouseConstraint]);

    Engine.run(engine);
    Render.run(render);
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div ref={containerRef} className="h-[70vh] lg:h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden relative">
      <Spotlight
        className="-top-10 left-5 md:left-60 md:-top-20 z-20"
        fill="white"
      />
      <h1 id="beams-text" className="text-7xl lg:text-9xl font-display font-bold text-center text-black lg:mt-10 relative">
        Beams
      </h1>
      <div className="w-[40rem] h-40 relative z-20">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#000000"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-75"></canvas>
    </div>
  );
}
