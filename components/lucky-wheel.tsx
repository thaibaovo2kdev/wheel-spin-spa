'use client';

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
// No icon in the Figma design for the "SPIN NOW" button.

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

const SEGMENTS = 12

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
}

interface LuckyWheelProps {
  prizes: Prize[];
  onSpinComplete: (prize: Prize) => void;
  disabled?: boolean;
}

export default function LuckyWheel({
  prizes,
  onSpinComplete,
  disabled = false,
}: LuckyWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [coins, setCoins] = useState<Coin[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const wedgePlacementStyle = useMemo(() => {
    // Matches Figma: absolute bottom-1/4 left-1/2 right-0 top-1/2 (i.e., a bottom-right quadrant)
    return {
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      right: 0,
      bottom: '25%',
    }
  }, [])

  const wheelLayers = useMemo(
    () => [
      // Colored wedges (one wedge image rotated every 30deg)
      { src: '/figma/wheel/ellipse13.svg', deg: 0 },
      { src: '/figma/wheel/ellipse14.svg', deg: -30 },
      { src: '/figma/wheel/ellipse15.svg', deg: -60 },
      { src: '/figma/wheel/ellipse16.svg', deg: -90 },
      { src: '/figma/wheel/ellipse17.svg', deg: -120 },
      { src: '/figma/wheel/ellipse18.svg', deg: -150 },
      { src: '/figma/wheel/ellipse19.svg', deg: 180 },
      { src: '/figma/wheel/ellipse20.svg', deg: 150 },
      { src: '/figma/wheel/ellipse21.svg', deg: 120 },
      { src: '/figma/wheel/ellipse22.svg', deg: 90 },
      { src: '/figma/wheel/ellipse23.svg', deg: 60 },
      { src: '/figma/wheel/ellipse24.svg', deg: 30 },
    ],
    [],
  )

  const displayPrizes = useMemo(() => {
    if (!prizes || prizes.length === 0) return []
    const result: Prize[] = []
    for (let i = 0; i < SEGMENTS; i += 1) {
      result.push(prizes[i % prizes.length])
    }
    return result
  }, [prizes])

  // Animate coins on overlay canvas (logic giống phiên bản cũ)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setCoins((prev) => {
        const updated = prev
          .map((coin) => ({
            ...coin,
            x: coin.x + coin.vx,
            y: coin.y + coin.vy,
            vy: coin.vy + 0.3, // gravity
            rotation: coin.rotation + coin.rotationSpeed,
            life: coin.life - 0.02,
          }))
          .filter((coin) => coin.life > 0)

        updated.forEach((coin) => {
          ctx.save()
          ctx.globalAlpha = coin.life
          ctx.translate(coin.x, coin.y)
          ctx.rotate(coin.rotation)

          // coin circle
          ctx.beginPath()
          ctx.arc(0, 0, 8, 0, 2 * Math.PI)
          ctx.fillStyle = '#FCD34D'
          ctx.fill()
          ctx.strokeStyle = '#D97706'
          ctx.lineWidth = 1
          ctx.stroke()

          // symbol
          ctx.font = 'bold 10px Arial'
          ctx.fillStyle = '#D97706'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('$', 0, 0)

          ctx.restore()
        })

        return updated
      })

      frameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [])

  const generateCoins = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const newCoins: Coin[] = []

    for (let i = 0; i < 20; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 6

      newCoins.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: 1,
      })
    }

    setCoins((prev) => [...prev, ...newCoins])
  }

  const spin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);

    // Random spins + target position
    // Select a random segment (0 to SEGMENTS-1)
    const targetIndex = Math.floor(Math.random() * SEGMENTS);

    // Calculate target angle to align segment with top pointer
    // Each segment is 30 degrees (360/12)
    // Segment center from 12 o'clock = targetIndex * 30 + 15 degrees (clockwise)
    // To bring this segment to top, wheel must rotate so that:
    // segmentCenter + wheelRotation ≡ 0 (mod 360)
    // wheelRotation ≡ -segmentCenter ≡ (360 - segmentCenter) (mod 360)
    const segmentAngle = 360 / SEGMENTS; // 30 degrees
    const segmentCenterFromTop = targetIndex * segmentAngle + segmentAngle / 2;
    const targetBase = (360 - segmentCenterFromTop) % 360;
    
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
        // Hiệu ứng coin khi quay xong
        generateCoins();
        setTimeout(() => {
          // Use displayPrizes which maps to the 12 segments
          const winningPrize = displayPrizes[targetIndex];
          if (winningPrize) {
            onSpinComplete(winningPrize);
          }
        }, 500);
      }
    };

    animate();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative" style={{ width: '490px', height: '540px' }}>
        {/* Canvas hiệu ứng coin chồng lên wheel */}
        <canvas
          ref={canvasRef}
          width={490}
          height={490}
          className="pointer-events-none absolute left-0 top-0 h-[490px] w-[490px]"
        />

        {/* Rotating wheel group (match Figma 1:30) */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: '490px',
            height: '490px',
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '245px 245px',
            transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {/* Nền vàng của wheel (vector-center) đặt DƯỚI các ô màu */}
          <Image
            src="/figma/wheel/vector-center.svg"
            alt=""
            width={490}
            height={490}
            className="absolute inset-0 h-[490px] w-[490px]"
          />

          {/* Wedges (background images only) */}
          {wheelLayers.map((layer) => (
            <div
              key={layer.src}
              className="absolute inset-0"
              style={{
                transform: `rotate(${layer.deg}deg)`,
                transformOrigin: '245px 245px',
              }}
            >
              <div style={wedgePlacementStyle}>
                <div className="relative h-full w-full">
                  <Image
                    src={layer.src}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="245px"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Text labels - rendered separately on top of all wedges */}
          {displayPrizes.map((prize, index) => {
            if (!prize) return null;
            // Each segment is 30 degrees (360/12)
            // Segment center angle = index * 30 + 15 degrees
            // Starting from top (270 degrees in standard math) and going clockwise
            const segmentAngle = index * 30 + 15; // degrees from 12 o'clock, clockwise
            const angleInRadians = ((segmentAngle - 90) * Math.PI) / 180; // Convert to math angle (0 = right, counter-clockwise)
            const radius = 175; // pixels from center (closer to edge)
            const centerX = 245;
            const centerY = 245;
            
            // Calculate position
            const x = centerX + radius * Math.cos(angleInRadians);
            const y = centerY + radius * Math.sin(angleInRadians);
            
            // Rotate text to align with spoke (radial)
            const textRotation = segmentAngle;
            
            return (
              <span
                key={`text-${index}`}
                className="absolute z-20 text-[13px] font-semibold text-black"
                style={{
                  fontFamily: 'var(--font-clash)',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                  whiteSpace: 'nowrap',
                }}
              >
                {prize.discount}
              </span>
            );
          })}

          {/* Rings/strokes trên cùng */}
          <Image
            src="/figma/wheel/stroke-red.svg"
            alt=""
            width={490}
            height={490}
            className="absolute inset-0 h-[490px] w-[490px]"
          />

          {/* Center logo (mini) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-[40px] w-[40px] rounded-full bg-black border-2 border-[#F8DC65] flex items-center justify-center overflow-hidden">
              <Image
                src="/figma/wheel/logo-mini.svg"
                alt="B"
                width={28}
                height={28}
                className="h-[28px] w-[28px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Pointer (fixed) */}
        <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 z-20">
          <Image
            src="/figma/wheel/pointer.svg"
            alt=""
            width={58}
            height={58}
            className="h-[58px] w-[58px]"
            priority
          />
        </div>
      </div>

      {/* Spin button - stays stationary */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className="rounded-[32px] bg-[#F5A3B7] px-[32px] py-[16px] text-[20px] leading-[1.5] text-black disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-[0.98]"
        style={{ fontFamily: 'var(--font-clash)' }}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
      </button>
    </div>
  );
}
