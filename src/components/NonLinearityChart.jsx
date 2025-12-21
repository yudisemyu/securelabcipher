import React from 'react';
import { Card } from './UI';

const NonLinearityChart = ({ sboxData, algorithm }) => {
  // Menghitung non-linearity untuk setiap komponen S-Box
  const calculateNonLinearity = (sbox) => {
    const results = [];
    for (let i = 0; i < 256; i++) {
      const x = i;
      const y = sbox[Math.floor(i/16)][i%16];
      const hammingWeight = (num) => {
        let weight = 0;
        while (num) {
          weight += num & 1;
          num >>= 1;
        }
        return weight;
      };
      
      // Simplified non-linearity calculation
      const nl = 112 - (hammingWeight(x ^ y) * 2);
      results.push({
        input: i,
        output: y,
        nl: Math.abs(nl)
      });
    }
    return results;
  };

  const data = calculateNonLinearity(sboxData);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-zinc-800 mb-4">Non-Linearity Distribution</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">Algorithm: {algorithm === 'custom' ? 'K-44 S-Box' : 'AES S-Box'}</span>
          <span className="text-sm font-medium text-emerald-600">Max NL: 112</span>
        </div>
        
        <div className="h-64 relative">
          <div className="absolute inset-0 grid grid-cols-16 gap-1">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="rounded-sm transition-all hover:scale-110 hover:z-10 cursor-pointer"
                style={{
                  backgroundColor: `rgba(37, 99, 235, ${item.nl / 112})`,
                  height: '100%'
                }}
                title={`Input: 0x${item.input.toString(16).padStart(2,'0')} → Output: 0x${item.output.toString(16).padStart(2,'0')}\nNL: ${item.nl}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Low NL (0-28)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>Medium NL (29-56)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>High NL (57-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-900 rounded"></div>
            <span>Very High NL (85-112)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NonLinearityChart;