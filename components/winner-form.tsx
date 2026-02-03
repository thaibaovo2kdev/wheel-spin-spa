'use client';

import React from "react"

import { useState } from 'react';
import { AlertCircle, Mail } from 'lucide-react';

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

interface WinnerFormProps {
  prize: Prize;
  onSubmit: (data: { name: string; email: string; dob: string }) => void;
  loading?: boolean;
}

export default function WinnerForm({
  prize,
  onSubmit,
  loading = false,
}: WinnerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.dob) {
      alert('Please fill in all fields');
      return;
    }

    // Submit to API
    try {
      const response = await fetch('/api/send-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          prizeId: prize.id,
          discount: prize.discount,
          percentage: prize.percentage,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to send discount. Please try again.');
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 border-2 border-black rounded-lg p-8 text-center shadow-lg">
          <div className="flex justify-center mb-4">
            <Mail className="w-16 h-16 text-black" />
          </div>

          <h2 className="text-2xl font-bold text-black mb-4">
            Congratulations! 🎉
          </h2>

          <p className="text-black mb-2">
            You won <span className="font-bold text-2xl">{prize.discount}</span>
          </p>

          <p className="text-sm text-black/70 mb-6">
            Your discount code has been sent to{' '}
            <span className="font-semibold">{formData.email}</span>
          </p>

          <div className="bg-white border-2 border-black rounded-lg p-4 mb-6">
            <p className="text-xs text-black/60 mb-2">Discount Code</p>
            <p className="font-mono text-lg font-bold text-black break-all">
              NAILS{prize.percentage}OFF
            </p>
          </div>

          <p className="text-xs text-black/70">
            Check your email for more details and expiration date.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-black text-yellow-400 font-bold rounded-full hover:bg-black/80 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-black mb-2">You Won! 🎊</h2>

        <div className="mb-6 p-4 rounded-lg bg-gradient-to-b from-yellow-100 to-yellow-50 border-2 border-black">
          <p className="text-black text-sm font-semibold mb-1">Your Prize:</p>
          <p className="text-3xl font-bold text-black">{prize.discount}</p>
        </div>

        <p className="text-black/70 text-sm mb-6">
          Enter your details below to receive your discount code via email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black font-semibold text-sm mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder-black/50"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-black font-semibold text-sm mb-2">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black placeholder-black/50"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-black font-semibold text-sm mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              disabled={loading}
            />
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex gap-2">
              <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-black/70">
                Your information is secure and will only be used to send your
                discount code.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-b from-black to-black/90 hover:from-black/90 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed text-yellow-400 font-bold rounded-lg transition transform hover:scale-105 active:scale-95"
          >
            {loading ? 'Sending...' : 'Claim Your Discount Code'}
          </button>
        </form>
      </div>
    </div>
  );
}
