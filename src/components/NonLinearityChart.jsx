import React from 'react';
import { Card } from './UI';

const NonLinearityChart = ({ sboxData, algorithm }) => {
  const calculateNonLinearity = (sbox) => {
    const results = [];
    for (let i = 0; i < 256; i++) {
      const x = i;
      const y = sbox[Math.floor(i/16)][i%16];
      const hammingWeight = (num) => {
        let weight = 0;
        while (num) { weight += num & 1; num >>= 1; }
        return weight;
      };
      
      const nl = 112 - (hammingWeight(x ^ y) * 2);
      results.push({ input: i, output: y, nl: Math.abs(nl) });
    }
    return results;
  };

  const data = calculateNonLinearity(sboxData);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Non-Linearity Distribution</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
             {algorithm === 'custom' ? 'K-44 S-Box' : 'AES S-Box'}
          </span>
          <span className="text-sm font-bold text-emerald-400 shadow-emerald-500/20 drop-shadow-sm">Max NL: 112</span>
        </div>
        
        <div className="h-64 relative bg-[#050510] rounded-lg border border-slate-800 p-1">
          <div className="absolute inset-1 grid grid-cols-16 gap-[1px]">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="rounded-[1px] transition-all hover:scale-150 hover:z-50 hover:shadow-[0_0_10px_cyan] cursor-pointer"
                style={{
                  // Menggunakan skala warna biru elektrik ke cyan
                  backgroundColor: `rgba(6, 182, 212, ${Math.max(0.1, item.nl / 112)})`,
                  height: '100%',
                  boxShadow: item.nl > 100 ? '0 0 2px rgba(6,182,212,0.5)' : 'none'
                }}
                title={`Input: 0x${item.input.toString(16).padStart(2,'0')} → Output: 0x${item.output.toString(16).padStart(2,'0')}\nNL: ${item.nl}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-slate-400 bg-[#0a0a15] p-2 rounded border border-slate-800">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-cyan-900/20 rounded-full"></div><span>Low</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-cyan-700/50 rounded-full"></div><span>Med</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_5px_cyan]"></div><span>High (Ideal)</span></div>
        </div>
      </div>
    </Card>
  );
};

export default NonLinearityChart;