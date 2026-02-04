'use client';

import React from 'react'

import { useMemo, useState } from 'react'

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

interface WinnerFormProps {
  prize: Prize;
  onSubmit: (data: { name: string; email: string; dob: string }) => void;
  onClose?: () => void;
  loading?: boolean;
}

export default function WinnerForm({
  prize,
  onSubmit,
  onClose,
  loading = false,
}: WinnerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
  });

  const [submitted, setSubmitted] = useState(false)

  const headlineParts = useMemo(() => {
    const wonText = 'You won'
    const prizeText = prize.discount || `${prize.percentage}% OFF`
    return { wonText, prizeText }
  }, [prize.discount, prize.percentage])

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
        setSubmitted(true)
        onSubmit(formData)
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
      <div
        className="relative bg-white rounded-[24px] p-[48px] w-full max-w-[575px]"
        style={{ fontFamily: 'var(--font-clash)' }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>
        )}
        <div className="text-center space-y-4">
          <p className="text-[20px] leading-[1.5] text-black">
            Mã giảm giá đã được gửi tới <span className="font-medium">{formData.email}</span>.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-[16px] bg-[#F5A3B7] px-[48px] py-[16px] text-[16px] leading-[1.5] font-medium text-black"
          >
            QUAY LẠI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-white rounded-[24px] p-[48px] w-full max-w-[575px]"
      style={{ fontFamily: 'var(--font-clash)' }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>
      )}
      <div className="w-full text-center space-y-4">
        <p className="text-[32px] leading-[1.2] text-black">
          {headlineParts.wonText}{' '}
          <span className="text-[#FFA12F]">{headlineParts.prizeText}</span>
        </p>
        <p className="text-[16px] leading-[1.5] text-black">
          Enter your details below to receive your discount code via email.
        </p>
      </div>

      <div className="mt-[48px] flex flex-col items-center gap-[32px]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[479px] space-y-[32px]"
        >
          <div className="space-y-[16px]">
            <label className="block text-[16px] leading-[1.5] text-black">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-[16px] border border-[#A3A3A3] bg-white px-[24px] py-[16px] text-[16px] leading-[1.5] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-black/10"
              disabled={loading}
            />
          </div>

          <div className="space-y-[16px]">
            <label className="block text-[16px] leading-[1.5] text-black">
              Email
            </label>
            <input
              type="email"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-[16px] border border-[#A3A3A3] bg-white px-[24px] py-[16px] text-[16px] leading-[1.5] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-black/10"
              disabled={loading}
            />
          </div>

          <div className="space-y-[16px]">
            <label className="block text-[16px] leading-[1.5] text-black">
              Date of Birth
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="mm/dd/yy"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full rounded-[16px] border border-[#A3A3A3] bg-white px-[24px] py-[16px] text-[16px] leading-[1.5] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-black/10"
              disabled={loading}
            />
          </div>

          <p className="text-center text-[16px] leading-[1.5] text-[#BA1640]">
            Your information is secure and will only
            <br />
            be used to send your discount code.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[16px] bg-[#F5A3B7] px-[48px] py-[16px] text-[16px] leading-[1.5] font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SENDING...' : 'CLAIM YOUR DISCOUNT CODE'}
          </button>
        </form>
      </div>
    </div>
  );
}
