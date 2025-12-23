import React from 'react';
import { Card } from './UI';

const LinearApproximationTable = ({ sboxData }) => {
  const generateLAT = (sbox) => {
    const table = Array(256).fill().map(() => Array(256).fill(0));
    const dot = (a, b) => {
      let result = 0;
      for (let i = 0; i < 8; i++) {
        if (((a >> i) & 1) && ((b >> i) & 1)) result ^= 1;
      }
      return result;
    };
    
    for (let alpha = 0; alpha < 256; alpha++) {
      for (let beta = 0; beta < 256; beta++) {
        let count = 0;
        for (let x = 0; x < 256; x++) {
          const y = sbox[Math.floor(x/16)][x%16];
          if (dot(alpha, x) === dot(beta, y)) count++;
        }
        table[alpha][beta] = count - 128;
      }
    }
    return table;
  };

  const lat = generateLAT(sboxData);
  const maxBias = Math.max(...lat.flat().map(Math.abs));
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        Linear Approximation Table <span className="text-purple-500 text-xs font-mono">(LAT)</span>
      </h3>
      <div className="space-y-4">
        <div className="text-sm text-slate-400">
          Shows correlation between input mask α and output mask β.
          Max bias: <span className="font-bold text-amber-400">±{maxBias}</span> <span className="text-slate-500">({(Math.abs(maxBias)/128*100).toFixed(2)}%)</span>
        </div>
        
        <div className="overflow-auto max-h-96 pr-2 custom-scrollbar">
          <div className="grid grid-cols-[auto_repeat(16,1fr)] gap-[1px] bg-slate-800 border border-slate-700 rounded">
            {/* Header row */}
            <div className="bg-[#0a0a1f] p-2 text-center text-[10px] font-bold text-purple-400 sticky top-0 z-20">α\β</div>
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-[#0a0a1f] p-2 text-center text-[10px] font-bold text-purple-400 sticky top-0 z-20">
                {i.toString(16).toUpperCase()}
              </div>
            ))}
            
            {/* Table rows */}
            {lat.slice(0, 16).map((row, i) => (
              <React.Fragment key={i}>
                <div className="bg-[#0a0a1f] p-2 text-center text-[10px] font-bold text-purple-400 sticky left-0 z-10">
                  {i.toString(16).toUpperCase()}
                </div>
                {row.slice(0, 16).map((bias, j) => (
                  <div
                    key={j}
                    className={`p-1.5 text-center text-[10px] font-mono transition-all hover:scale-125 hover:z-30 cursor-crosshair border border-transparent hover:border-purple-400/50 ${
                      bias === 0 
                        ? 'bg-[#050510] text-slate-700' 
                        : Math.abs(bias) === maxBias
                        ? bias > 0 ? 'bg-amber-600 text-white font-bold shadow-[0_0_10px_orange]' : 'bg-purple-600 text-white font-bold shadow-[0_0_10px_purple]'
                        : bias > 0
                        ? 'bg-amber-900/20 text-amber-500'
                        : 'bg-purple-900/20 text-purple-400'
                    }`}
                    title={`α=0x${i.toString(16).padStart(2,'0')}, β=0x${j.toString(16).padStart(2,'0')}: ${bias > 0 ? '+' : ''}${bias}/256`}
                  >
                    {bias > 0 ? '+' : ''}{bias}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 bg-[#0a0a15] p-2 rounded border border-slate-800">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-600 rounded-sm shadow-[0_0_5px_orange]"></div><span>Pos Max</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-600 rounded-sm shadow-[0_0_5px_purple]"></div><span>Neg Max</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-900/30 border border-amber-600/30 rounded-sm"></div><span>Pos Bias</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-900/30 border border-purple-600/30 rounded-sm"></div><span>Neg Bias</span></div>
        </div>
      </div>
    </Card>
  );
};

export default LinearApproximationTable;