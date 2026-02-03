'use client';

import { useEffect, useRef, useState } from 'react';
import { Pin as Spin } from 'lucide-react';

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

interface LuckyWheelProps {
  prizes: Prize[];
  onSpinComplete: (prize: Prize) => void;
  disabled?: boolean;
}

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
}

export default function LuckyWheel({
  prizes,
  onSpinComplete,
  disabled = false,
}: LuckyWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [coins, setCoins] = useState<Coin[]>([]);

  // Draw the main wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel segments (red and cream)
    const segmentAngle = (2 * Math.PI) / prizes.length;

    prizes.forEach((prize, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Alternate between red and cream
      const isRed = index % 2 === 0;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      // Glossy Effect with Gradient
      const gradient = ctx.createLinearGradient(
        centerX + Math.cos(startAngle) * (radius * 0.5),
        centerY + Math.sin(startAngle) * (radius * 0.5),
        centerX + Math.cos(endAngle) * radius,
        centerY + Math.sin(endAngle) * radius
      );

      if (isRed) {
        gradient.addColorStop(0, '#EF4444'); // Lighter Red
        gradient.addColorStop(0.5, '#DC2626'); // Standard Red
        gradient.addColorStop(1, '#991B1B'); // Darker Red
      } else {
        gradient.addColorStop(0, '#FFFFFF'); // White
        gradient.addColorStop(0.5, '#FFF5E6'); // Cream
        gradient.addColorStop(1, '#FDE68A'); // Gold/Yellowish tint
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw border (golden)
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      const textAngle = startAngle + segmentAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.65);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.65);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = isRed ? '#FFF5E6' : '#DC2626';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(prize.discount, 0, 0);
      ctx.restore();
    });

    // Draw outer golden ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Draw inner golden ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw center golden circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
    ctx.fillStyle = '#FCD34D';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw inner center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
  }, [prizes]);

  // Animate coins particles
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setCoins((prevCoins) => {
        const newCoins = prevCoins
          .map((coin) => ({
            ...coin,
            x: coin.x + coin.vx,
            y: coin.y + coin.vy,
            vy: coin.vy + 0.3, // gravity
            rotation: coin.rotation + coin.rotationSpeed,
            life: coin.life - 0.02,
          }))
          .filter((coin) => coin.life > 0);

        // Draw coins
        newCoins.forEach((coin) => {
          ctx.save();
          ctx.globalAlpha = coin.life;
          ctx.translate(coin.x, coin.y);
          ctx.rotate(coin.rotation);

          // Draw coin circle
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#FCD34D';
          ctx.fill();
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw coin symbol
          ctx.font = 'bold 10px Arial';
          ctx.fillStyle = '#D97706';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 0);

          ctx.restore();
        });

        return newCoins;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const generateCoins = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const newCoins: Coin[] = [];

    for (let i = 0; i < 20; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 3 + Math.random() * 6;

      newCoins.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }

    setCoins((prev) => [...prev, ...newCoins]);
  };

  const spin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);

    // Random spins + target position
    // Define targetIndex (Randomly select a prize)
    const targetIndex = Math.floor(Math.random() * prizes.length);

    // Calculate target angle to align with Top Arrow (270 degrees or -90 degrees)
    // Segment Center = index * segmentAngle + segmentAngle / 2
    // Goal: (Rotation + SegmentCenter) % 360 = 270
    // So: Rotation = 270 - SegmentCenter
    const anglePerPrize = 360 / prizes.length;
    const prizeCenterAngle = targetIndex * anglePerPrize + anglePerPrize / 2;
    // Calculate the target rotation (mod 360)
    // We arrive at 270. 
    // Example: If Center is 90. Need 180 rotation. 180 + 90 = 270.
    const targetBase = 270 - prizeCenterAngle;
    
    // Add multiple spins to current rotation
    // Ensure we move forward
    const currentRot = rotation;
    const minSpins = 360 * 5; // 5 full spins
    
    // Calculate final target ensuring it's > current + minSpins and lands on targetBase
    // current + min + delta
    const nextRotationMin = currentRot + minSpins;
    const remainder = nextRotationMin % 360;
    
    // We want (nextRotationMin + adjust) % 360 === targetBase (normalized)
    let adjust = ((targetBase - remainder) % 360);
    if (adjust < 0) adjust += 360;
    
    const finalRotation = nextRotationMin + adjust;

    // Animate rotation
    const startTime = Date.now();
    const duration = 4500;
    
    // Starting value for this specific spin animation
    const startRotation = rotation;
    const changeInRotation = finalRotation - startRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const newRotation = startRotation + changeInRotation * easeProgress;
      setRotation(newRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setRotation(finalRotation); // Keep the accumulated value!
        // Generate coins when spin completes
        generateCoins();
        setTimeout(() => {
          onSpinComplete(prizes[targetIndex]);
        }, 500);
      }
    };

    animate();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative" style={{ width: '400px', height: '450px' }}>
        {/* Wheel canvas with rotation */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="absolute top-0 left-0 drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
          }}
        />
        {/* Particle effects for coins */}
        <canvas
          ref={particleCanvasRef}
          width={400}
          height={400}
          className="absolute top-0 left-0"
        />
        {/* Static pointer at top pointing at wheel */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20"
          style={{
            width: '0',
            height: '0',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '25px solid #000',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            transform: 'rotate(180deg)',
          }}
        />
      </div>

      {/* Spin button - stays stationary */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className="px-8 py-4 bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Spin className={isSpinning ? 'animate-spin' : ''} size={20} />
        {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
      </button>
    </div>
  );
}
