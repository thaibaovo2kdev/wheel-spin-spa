'use client';

import { useEffect, useState } from 'react';
import LuckyWheel from '@/components/lucky-wheel';
import WinnerForm from '@/components/winner-form';
import Fireworks from '@/components/fireworks';
import PrizesList from '@/components/prizes-list'; // Import PrizesList component

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

export default function Home() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
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

  const handleClaimReward = () => {
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-black font-semibold">Loading Lucky Wheel...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Header */}
      <section className="bg-black text-yellow-400 py-8 border-b-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold mb-2 tracking-wider">
            ✨ NAIL SALON & SPA ✨
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            LUCKY WHEEL
          </h1>
          <p className="text-yellow-300 text-lg">
            Try your luck and win amazing discounts!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col items-center gap-8 relative z-10">
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-2xl">
                <p className="text-center text-black font-semibold mb-6 text-lg">
                  Click the button below to spin the wheel and win your prize!
                </p>
                <LuckyWheel
                  prizes={prizes}
                  onSpinComplete={handleSpinComplete}
                  disabled={showForm || !!selectedPrize}
                />
              </div>

              <div className="text-center text-black/60 text-sm max-w-md">
                <p>
                  Spin once per customer • All winners receive a discount code • Valid for 30 days
                </p>
              </div>

              {/* Win Popup Overlay */}
              {selectedPrize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
                  
                  {/* Fireworks Layer */}
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <Fireworks />
                  </div>

                  {/* Content */}
                  <div className="relative z-20 w-full max-w-2xl bg-gradient-to-b from-yellow-100 to-yellow-50 border-4 border-black rounded-3xl p-8 md:p-12 shadow-2xl text-center animate-in zoom-in-50 duration-500">
                    {showForm ? (
                       <WinnerForm
                          prize={selectedPrize}
                          onSubmit={handleFormSubmit}
                          loading={submitting}
                       />
                    ) : (
                      <>
                        <h2 className="text-5xl font-bold text-black mb-4">🎉</h2>
                        <h2 className="text-4xl font-bold text-black mb-2">
                          Congratulations!
                        </h2>
                        <p className="text-xl text-black mb-8">
                          You won <span className="font-bold text-3xl text-red-600">{selectedPrize.discount}</span>
                        </p>

                        {/* Discount Code Display */}
                        <div className="bg-white border-4 border-black rounded-2xl p-8 mb-8 shadow-lg">
                          <p className="text-sm text-black/60 mb-2 font-semibold">
                            YOUR DISCOUNT CODE
                          </p>
                          <p className="font-mono text-4xl font-bold text-black mb-2 break-all">
                            NAILS{selectedPrize.percentage}OFF
                          </p>
                          <p className="text-xs text-black/50">
                            Valid for 30 days on all services
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                              onClick={handleClaimReward}
                              className="w-full px-8 py-4 bg-gradient-to-b from-black to-black/90 hover:from-black/90 hover:to-black text-yellow-400 font-bold text-lg rounded-xl transition transform hover:scale-105 active:scale-95 shadow-lg"
                            >
                              Claim Reward - Enter Your Details
                            </button>

                            <button
                              onClick={() => {
                                setSelectedPrize(null);
                                setShowForm(false);
                                window.location.reload();
                              }}
                              className="w-full px-8 py-2 bg-white border-2 border-black text-black font-bold rounded-xl hover:bg-yellow-50 transition"
                            >
                              Close & Try Again
                            </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-yellow-400 py-8 border-t-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2025 Nail Salon & Spa Lucky Wheel • All rights reserved
          </p>
        </div>
      </footer>
    </main>
  );
}
