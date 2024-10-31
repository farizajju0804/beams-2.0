'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

// Define the props for the ScratchCard component
interface ScratchCardProps {
  scratchImage: string;  // Image to be scratched off
  finalImage: string;    // Image revealed after scratching
  onReveal: () => void;  // Callback to be called when the card is revealed
}

// Set the threshold for when the card is considered revealed
const SCRATCH_THRESHOLD = 0.4

// Custom hook to manage the scratching behavior and state
const useScratchCard = (scratchImage: string, finalImage: string, threshold: number, onReveal: () => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas element
  const [isRevealed, setIsRevealed] = useState(false); // State to track if the card is revealed
  const [isScratching, setIsScratching] = useState(false); // State to track if the user is currently scratching
  const [scratchPercentage, setScratchPercentage] = useState(0); // Percentage of the card scratched off
  const [isScratchImageLoaded, setIsScratchImageLoaded] = useState(false); // State to check if the scratch image is loaded
  const [isOnline, setIsOnline] = useState(navigator.onLine); 

  useEffect(() => {
    // Handler to update online status
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Initialize the canvas by drawing the scratch image on it
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      const scratchImg = new Image();
      scratchImg.src = scratchImage;
      scratchImg.crossOrigin = "anonymous"; // Allow cross-origin image loading

      // Draw the scratch image on the canvas when it's loaded
      scratchImg.onload = () => {
        ctx.drawImage(scratchImg, 0, 0, canvas.width, canvas.height);
        setIsScratchImageLoaded(true); // Update state to indicate image is loaded
      }
    }
  }, [scratchImage]);

  // Reveal the card by clearing the entire canvas
  const revealAll = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.globalCompositeOperation = 'destination-out'; // Set the composite operation to remove pixels
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    }
    setIsRevealed(true);
    setScratchPercentage(1); // Set scratch percentage to 100%
    onReveal(); // Trigger the reveal callback
    handleClick(); // Trigger confetti effect
  }, [onReveal]);

  // Function to handle the confetti effect when the card is revealed
  const handleClick = () => {
    const scalar = 2; // Scale factor for confetti
    const unicorn = confetti.shapeFromText({ text: "👌", scalar }); // Create a confetti shape

    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.96,
      startVelocity: 10,
      shapes: [unicorn], // Use the unicorn shape for confetti
      scalar,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 10,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"],
      });
    };

    // Trigger confetti shooting
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
  };

  // Handle scratching event to remove pixels from the canvas
  const handleScratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching || !isOnline) return; // Do nothing if not scratching

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // Scale for x coordinate
      const scaleY = canvas.height / rect.height; // Scale for y coordinate

      // Get the mouse or touch position
      const x = (e as React.TouchEvent<HTMLCanvasElement>).touches
        ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX - rect.left
        : (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left;
      const y = (e as React.TouchEvent<HTMLCanvasElement>).touches
        ? (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY - rect.top
        : (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top;

      const adjustedX = x * scaleX; // Adjust x coordinate
      const adjustedY = y * scaleY; // Adjust y coordinate

      ctx.globalCompositeOperation = 'destination-out'; // Set the composite operation to remove pixels
      ctx.beginPath();
      ctx.arc(adjustedX, adjustedY, 20, 0, 2 * Math.PI); // Create a circle for scratching
      ctx.fill();

      // Calculate the percentage of the canvas that has been scratched
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const scratchedPixels = imageData.data.filter((x, i) => i % 4 === 3 && x === 0).length; // Count transparent pixels
      const totalPixels = imageData.data.length / 4; // Total pixels (RGBA)

      const newScratchPercentage = scratchedPixels / totalPixels; // Calculate new scratch percentage

      setScratchPercentage(newScratchPercentage); // Update scratch percentage
      if (newScratchPercentage >= threshold && !isRevealed) {
        revealAll(); // Reveal the card if the scratch percentage exceeds the threshold
      }
    }
  }, [isScratching, isRevealed, revealAll, threshold]);

  // Initialize the canvas on component mount
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Return values and functions for the ScratchCard component
  return { 
    canvasRef, 
    isRevealed, 
    isScratching,
    scratchPercentage, 
    handleScratch,
    setIsScratching,
    revealAll,
    isScratchImageLoaded,
    isOnline 
  }
}

// ScratchCard component definition
const ScratchCard: React.FC<ScratchCardProps> = ({ scratchImage, finalImage, onReveal }) => {
  const { 
    canvasRef, 
    isRevealed, 
    isScratching,
    scratchPercentage, 
    handleScratch, 
    setIsScratching,
    isScratchImageLoaded,
    isOnline
  } = useScratchCard(scratchImage, finalImage, SCRATCH_THRESHOLD, onReveal);

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Show the final image when the card is revealed */}
      {isScratchImageLoaded && (
        <img 
          src={finalImage} 
          alt="Final image" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Canvas element for scratching */}
      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        onMouseDown={() => setIsScratching(true)} // Start scratching
        onMouseUp={() => setIsScratching(false)} // Stop scratching
        onMouseLeave={() => setIsScratching(false)} // Stop scratching on mouse leave
        onTouchStart={() => setIsScratching(true)} // Start scratching on touch
        onTouchEnd={() => setIsScratching(false)} // Stop scratching on touch end
        onMouseMove={handleScratch} // Handle mouse movement for scratching
        onTouchMove={handleScratch} // Handle touch movement for scratching
        className={`absolute inset-0 w-full h-full cursor-pointer ${isRevealed ? 'pointer-events-none' : ''}`} // Disable pointer events if revealed
      />
      {/* Show a message to scratch the card if it is not revealed */}
      {!isRevealed && scratchPercentage === 0 && isScratchImageLoaded && (
        <div className="absolute z-[10] inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-text bg-background p-2 text-lg font-semibold"> {isOnline ? 'Scratch here!' : 'No internet connection'}</p>
        </div>
      )}
      {/* Show the scratch percentage at the bottom of the card */}
      {isScratchImageLoaded && (
        <div className="absolute bottom-2 left-2 text-xs text-background bg-text bg-opacity-50 px-2 py-1 rounded">
          {Math.round(scratchPercentage * 100)}% scratched
        </div>
      )}
    </div>
  );
}

export default ScratchCard;
