import React from 'react';
import { Card } from './UI';

const DifferentialTable = ({ sboxData }) => {
  // Generate differential distribution table
  const generateDDT = (sbox) => {
    const table = Array(256).fill().map(() => Array(256).fill(0));
    
    for (let x = 0; x < 256; x++) {
      for (let deltaX = 0; deltaX < 256; deltaX++) {
        const y1 = sbox[Math.floor(x/16)][x%16];
        const y2 = sbox[Math.floor((x ^ deltaX)/16)][(x ^ deltaX)%16];
        const deltaY = y1 ^ y2;
        table[deltaX][deltaY]++;
      }
    }
    return table;
  };

  const ddt = generateDDT(sboxData);
  
  // Find maximum value in DDT (usually 4 for good S-Boxes)
  const maxVal = Math.max(...ddt.flat());
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-zinc-800 mb-4">Differential Distribution Table (DDT)</h3>
      <div className="space-y-4">
        <div className="text-sm text-zinc-600">
          Shows probability of input difference Δx producing output difference Δy.
          Max value: <span className="font-bold">{maxVal}/256</span> ({(maxVal/256*100).toFixed(2)}%)
        </div>
        
        <div className="overflow-auto max-h-96">
          <div className="grid grid-cols-[auto_repeat(16,1fr)] gap-1">
            {/* Header row */}
            <div className="bg-zinc-100 p-2 text-center text-xs font-bold text-zinc-500">Δx\Δy</div>
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-zinc-100 p-2 text-center text-xs font-bold text-zinc-500">
                {i.toString(16).toUpperCase()}
              </div>
            ))}
            
            {/* Table rows */}
            {ddt.slice(0, 16).map((row, i) => (
              <React.Fragment key={i}>
                <div className="bg-zinc-100 p-2 text-center text-xs font-bold text-zinc-500">
                  {i.toString(16).toUpperCase()}
                </div>
                {row.slice(0, 16).map((value, j) => (
                  <div
                    key={j}
                    className={`p-1 text-center text-[10px] font-mono transition-all hover:scale-125 hover:z-10 cursor-pointer ${
                      value === 0 
                        ? 'bg-zinc-50 text-zinc-300' 
                        : value === maxVal
                        ? 'bg-red-500 text-white'
                        : value > 0
                        ? 'bg-blue-100 text-blue-700'
                        : ''
                    }`}
                    title={`Δx=0x${i.toString(16).padStart(2,'0')}, Δy=0x${j.toString(16).padStart(2,'0')}: ${value}/256`}
                  >
                    {value}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Maximum ({maxVal})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Non-zero</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-zinc-50 rounded border"></div>
            <span>Zero</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DifferentialTable;