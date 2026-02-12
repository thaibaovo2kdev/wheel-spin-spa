'use client';

import { useEffect, useState } from 'react';
import LuckyWheel from '@/components/lucky-wheel';
import WinnerForm from '@/components/winner-form';
import Fireworks from '@/components/fireworks';
import Image from 'next/image'

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

export default function Home() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch prizes from API
    const fetchPrizes = async () => {
      try {
        const response = await fetch('/api/prizes');
        const data = await response.json();
        setPrizes(data.prizes);
      } catch (error) {
        console.error('Failed to fetch prizes:', error);
        // Fallback to default prizes
        setPrizes([
          {
            id: '1',
            discount: '10% OFF',
            percentage: 10,
            color: '#DC2626',
          },
          {
            id: '2',
            discount: '15% OFF',
            percentage: 15,
            color: '#DC2626',
          },
          {
            id: '3',
            discount: '20% OFF',
            percentage: 20,
            color: '#DC2626',
          },
          {
            id: '4',
            discount: 'Free Gift',
            percentage: 0,
            color: '#DC2626',
          },
          {
            id: '5',
            discount: '25% OFF',
            percentage: 25,
            color: '#DC2626',
          },
          {
            id: '6',
            discount: '5% OFF',
            percentage: 5,
            color: '#DC2626',
          },
          {
            id: '7',
            discount: '30% OFF',
            percentage: 30,
            color: '#DC2626',
          },
          {
            id: '8',
            discount: 'Buy 1 Get 1',
            percentage: 50,
            color: '#DC2626',
          },
          {
            id: '9',
            discount: '12% OFF',
            percentage: 12,
            color: '#DC2626',
          },
          {
            id: '10',
            discount: '18% OFF',
            percentage: 18,
            color: '#DC2626',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  const handleSpinComplete = (prize: Prize) => {
    setSelectedPrize(prize);
  };

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    dob: string;
  }) => {
    setSubmitting(true);
    // The actual submission is handled in WinnerForm component
    // Just update the state
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFC]">
        <p className="text-black text-[16px]" style={{ fontFamily: 'var(--font-clash)' }}>
          Loading Lucky Wheel...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFC] relative overflow-hidden">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Image
          src="/figma/bg-pattern.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Header (Figma node 1:12) */}
      <header className="relative h-[270px] bg-black border-b-[6px] border-[#F8DC65] flex items-center justify-center">
        <div className="flex flex-col items-center gap-[16px] text-center">
          <Image
            src="/figma/logo.png"
            alt="Beautique"
            width={120}
            height={58}
            className="h-[58px] w-[120px]"
            priority
          />
          <div className="space-y-0">
            <h1
              className="text-[#F8DC65] text-[60px] leading-[1.5]"
              style={{ fontFamily: 'var(--font-branch)' }}
            >
              LUCKY WHEEL
            </h1>
            <p
              className="text-white text-[20px] leading-[1.5]"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Try your luck and win amazing discounts!
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="relative flex flex-col items-center">
        <div className="mt-[53px] flex flex-col items-center gap-[16px] w-full max-w-[564px] px-6">
          <Image
            src="/figma/snowflake.svg"
            alt=""
            width={48}
            height={48}
            className="h-[48px] w-[48px]"
          />
          <p
            className="text-[#BA1640] text-[20px] leading-[1.5] text-center"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Click the button below to spin the wheel and win your prize
          </p>
        </div>

        <div className="mt-[55px] px-6">
          <LuckyWheel
            prizes={prizes}
            onSpinComplete={handleSpinComplete}
            disabled={!!selectedPrize}
          />
        </div>
      </section>

      {/* Footer (Figma node 1:12) */}
      <footer className="relative mt-[80px] h-[100px] bg-black border-t-[2px] border-[#F8DC65] flex items-center justify-center">
        <p
          className="text-[#F8DC65] text-[16px] leading-[1.5] text-center px-6"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          © 2025 Nail Salon & Spa Lucky Wheel • All rights reserved
        </p>
      </footer>

      {/* Popup overlay */}
      {selectedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 pointer-events-none">
            <Fireworks />
          </div>

          <div className="relative z-10 w-full max-w-[640px]">
            <WinnerForm
              prize={selectedPrize}
              onSubmit={handleFormSubmit}
              onClose={() => {
                setSelectedPrize(null);
              }}
              loading={submitting}
            />
          </div>
        </div>
      )}
    </main>
  );
}
