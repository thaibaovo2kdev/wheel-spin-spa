'use client';

interface Prize {
  id: string;
  discount: string;
  percentage: number;
  color: string;
}

interface PrizesListProps {
  prizes: Prize[];
}

export default function PrizesList({ prizes }: PrizesListProps) {
  return (
    <div className="w-full bg-black/5 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-black mb-8 text-center">
          Available Prizes
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-black bg-white hover:shadow-lg transition"
              style={{ backgroundColor: prize.color }}
            >
              <p
                className="text-xl md:text-2xl font-bold text-center"
                style={{
                  color: prize.color === '#FCD34D' ? '#000' : '#FCD34D',
                }}
              >
                {prize.discount}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border-2 border-black rounded-lg p-6 text-center">
          <p className="text-black text-sm">
            ✨ One spin per customer • Prizes vary by luck • Discount codes
            valid for 30 days ✨
          </p>
        </div>
      </div>
    </div>
  );
}
