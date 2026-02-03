import { NextResponse } from 'next/server';

// Mock prizes data - In production, this would come from a database
const prizes = [
  {
    id: '1',
    discount: '10% OFF',
    percentage: 10,
    color: '#FCD34D', // Yellow
  },
  {
    id: '2',
    discount: '15% OFF',
    percentage: 15,
    color: '#1F2937', // Black
  },
  {
    id: '3',
    discount: '20% OFF',
    percentage: 20,
    color: '#FCD34D', // Yellow
  },
  {
    id: '4',
    discount: 'Free Gift',
    percentage: 0,
    color: '#1F2937', // Black
  },
  {
    id: '5',
    discount: '25% OFF',
    percentage: 25,
    color: '#FCD34D', // Yellow
  },
  {
    id: '6',
    discount: '5% OFF',
    percentage: 5,
    color: '#1F2937', // Black
  },
  {
    id: '7',
    discount: '30% OFF',
    percentage: 30,
    color: '#FCD34D', // Yellow
  },
  {
    id: '8',
    discount: 'Buy 1 Get 1',
    percentage: 50,
    color: '#1F2937', // Black
  },
  {
    id: '9',
    discount: '12% OFF',
    percentage: 12,
    color: '#FCD34D', // Yellow
  },
  {
    id: '10',
    discount: '18% OFF',
    percentage: 18,
    color: '#1F2937', // Black
  },
];

export async function GET() {
  // Mock: Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({ prizes }, { status: 200 });
}
