import React from 'react';
import { Card } from './UI';

const LinearApproximationTable = ({ sboxData }) => {
  // Generate Linear Approximation Table
  const generateLAT = (sbox) => {
    const table = Array(256).fill().map(() => Array(256).fill(0));
    
    // Helper: dot product for linear approximation
    const dot = (a, b) => {
      let result = 0;
      for (let i = 0; i < 8; i++) {
        if (((a >> i) & 1) && ((b >> i) & 1)) {
          result ^= 1;
        }
      }
      return result;
    };
    
    for (let alpha = 0; alpha < 256; alpha++) {
      for (let beta = 0; beta < 256; beta++) {
        let count = 0;
        for (let x = 0; x < 256; x++) {
          const y = sbox[Math.floor(x/16)][x%16];
          if (dot(alpha, x) === dot(beta, y)) {
            count++;
          }
        }
        // Store bias: (count - 128)/256
        table[alpha][beta] = count - 128;
      }
    }
    return table;
  };

  const lat = generateLAT(sboxData);
  
  // Find maximum absolute bias
  const maxBias = Math.max(...lat.flat().map(Math.abs));
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-zinc-800 mb-4">Linear Approximation Table (LAT)</h3>
      <div className="space-y-4">
        <div className="text-sm text-zinc-600">
          Shows correlation between input mask α and output mask β.
          Max bias: <span className="font-bold">±{maxBias}</span> ({(Math.abs(maxBias)/128*100).toFixed(2)}%)
        </div>
        
        <div className="overflow-auto max-h-96">
          <div className="grid grid-cols-[auto_repeat(16,1fr)] gap-1">
            {/* Header row */}
            <div className="bg-zinc-100 p-2 text-center text-xs font-bold text-zinc-500">α\β</div>
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-zinc-100 p-2 text-center text-xs font-bold text-zinc-500">
                {i.toString(16).toUpperCase()}
              </div>
            ))}
            
            {/* Table rows */}
            {lat.slice(0, 16).map((row, i) => (
              <React.Fragment key={i}>
                <div className="bg-zinc-100 p-2 text-center text-xs font-bold text-zinc-500">
                  {i.toString(16).toUpperCase()}
                </div>
                {row.slice(0, 16).map((bias, j) => (
                  <div
                    key={j}
                    className={`p-1 text-center text-[10px] font-mono transition-all hover:scale-125 hover:z-10 cursor-pointer ${
                      bias === 0 
                        ? 'bg-zinc-50 text-zinc-300' 
                        : Math.abs(bias) === maxBias
                        ? bias > 0 ? 'bg-amber-500 text-white' : 'bg-purple-500 text-white'
                        : bias > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-purple-100 text-purple-700'
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
        
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span>Positive max bias</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Negative max bias</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-100 rounded"></div>
            <span>Positive bias</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-100 rounded"></div>
            <span>Negative bias</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LinearApproximationTable;