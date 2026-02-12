'use client';

import React from 'react'
import Image from 'next/image'

import { useState } from 'react'

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
  const [agreePromo, setAgreePromo] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const canSubmit = formData.name && formData.email && agreePromo && agreePrivacy && !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill in Name and Email.');
      return;
    }

    if (!agreePromo || !agreePrivacy) {
      setErrorMessage('Please agree to both checkboxes before submitting.');
      return;
    }

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
      } else if (response.status === 409) {
        const data = await response.json();
        setErrorMessage(data.error || 'This email has already been used to claim a discount.');
      } else {
        setErrorMessage('Failed to send discount. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error submitting form. Please try again.');
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div
        className="relative w-full max-w-[640px] rounded-[24px] overflow-hidden"
        style={{ fontFamily: 'var(--font-clash)' }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/figma/congrats-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-gray-700 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* Content */}
        <div className="relative z-[5] flex flex-col items-center px-[40px] py-[48px]">
          <Image
            src="/figma/Beautique4-01.png"
            alt="Beautique"
            width={180}
            height={87}
            className="h-[87px] w-[180px] object-contain"
            priority
          />
          <div className="mt-[24px] text-center space-y-2">
            <p className="text-[20px] leading-[1.5] text-black">
              Mã giảm giá đã được gửi tới <span className="font-medium">{formData.email}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-[24px] rounded-[16px] bg-[#F5A3B7] px-[48px] py-[16px] text-[16px] leading-[1.5] font-medium text-black"
          >
            QUAY LẠI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-[640px] rounded-[24px] overflow-hidden"
      style={{ fontFamily: 'var(--font-clash)' }}
    >
      {/* Background image — original colors */}
      <div className="absolute inset-0">
        <Image
          src="/figma/congrats-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-gray-700 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>
      )}

      {/* Content */}
      <div className="relative z-[5] flex flex-col items-center px-[40px] py-[40px] md:px-[60px]">
        {/* Logo */}
        <Image
          src="/figma/Beautique4-01.png"
          alt="Beautique"
          width={360}
          height={120}
          className="h-[120px] w-[360px] object-contain"
          priority
        />

        {/* Congrats headline */}
        <div className="mt-[20px] text-center">
          <p
            className="text-[#BA1640] text-[32px] md:text-[40px] leading-[1.2]"
            style={{ fontFamily: 'var(--font-branch)' }}
          >
            Congratulations, you&apos;ve won
          </p>
        </div>

        {/* Prize box */}
        <div className="mt-[16px] w-full max-w-[400px] rounded-[12px] border border-black/20 bg-white/60 px-[24px] py-[14px] flex items-center justify-center">
          <p className="text-[#BA1640] text-[28px] md:text-[36px] leading-[1.3] font-medium text-center">
            {prize.discount}
          </p>
        </div>

        {/* Instruction */}
        <p className="mt-[20px] text-[14px] leading-[1.5] text-black/80 text-center">
          Please enter your information to receive the promo code
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-[16px] w-full space-y-[14px]"
        >
          {/* Name + DOB row */}
          <div className="flex gap-[16px]">
            <div className="flex-1 space-y-[4px]">
              <label className="block text-[13px] leading-[1.4] text-black">
                Name<span className="text-[#BA1640]">*</span>:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-[8px] border border-[#c0c0c0] bg-white px-[12px] py-[10px] text-[14px] leading-[1.4] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-black/10"
                disabled={loading}
                required
              />
            </div>
            <div className="w-[140px] space-y-[4px]">
              <label className="block text-[13px] leading-[1.4] text-black">
                D.O.B
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="mm/dd/yy"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full rounded-[8px] border border-[#c0c0c0] bg-white px-[12px] py-[10px] text-[14px] leading-[1.4] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-black/10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-[4px]">
            <label className="block text-[13px] leading-[1.4] text-black">
              Email<span className="text-[#BA1640]">*</span>:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-[8px] border border-[#c0c0c0] bg-white px-[12px] py-[10px] text-[14px] leading-[1.4] text-black placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-black/10"
              disabled={loading}
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-[8px] pt-[4px]">
            <label className="flex items-start gap-[8px] cursor-pointer text-[12px] leading-[1.5] text-black">
              <input
                type="checkbox"
                checked={agreePromo}
                onChange={(e) => setAgreePromo(e.target.checked)}
                className="mt-[2px] h-[14px] w-[14px] accent-[#BA1640] shrink-0"
                disabled={loading}
              />
              <span>
                By checking this box, I agree to receive general emails and product offers from Beautique nails &amp; spa
              </span>
            </label>

            <label className="flex items-start gap-[8px] cursor-pointer text-[12px] leading-[1.5] text-black">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-[2px] h-[14px] w-[14px] accent-[#BA1640] shrink-0"
                disabled={loading}
              />
              <span>
                I have reviewed and agree to Beautique nails &amp; spa&apos;s{' '}
                <a
                  href="/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#BA1640] underline hover:text-[#8a1030] transition-colors"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {errorMessage && (
            <p className="text-center text-[12px] leading-[1.5] text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-center pt-[8px]">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-[12px] bg-[#F5A3B7] border border-[#c0c0c0] px-[60px] py-[12px] text-[16px] leading-[1.5] font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f291a8] transition-colors"
            >
              {loading ? 'Sending...' : 'Get Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
