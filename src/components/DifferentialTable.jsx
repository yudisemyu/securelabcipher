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
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        Differential Distribution Table <span className="text-cyan-500 text-xs font-mono">(DDT)</span>
      </h3>
      <div className="space-y-4">
        <div className="text-sm text-slate-400">
          Shows probability of input difference Δx producing output difference Δy.
          Max value: <span className="font-bold text-red-400">{maxVal}/256</span> <span className="text-slate-500">({(maxVal/256*100).toFixed(2)}%)</span>
        </div>
        
        <div className="overflow-auto max-h-96 pr-2 custom-scrollbar">
          <div className="grid grid-cols-[auto_repeat(16,1fr)] gap-[1px] bg-slate-800 border border-slate-700 rounded">
            {/* Header row */}
            <div className="bg-[#0a0a1f] p-2 text-center text-[10px] font-bold text-cyan-600 sticky top-0 z-20">Δx\Δy</div>
            {[...Array(16)].map((_, i) => (
              <div key={i} className="bg-[#0a0a1f] p-2 text-center text-[10px] font-bold text-cyan-600 sticky top-0 z-20">
                {i.toString(16).toUpperCase()}
              </div>
            ))}
            
            {/* Table rows */}
            {ddt.slice(0, 16).map((row, i) => (
              <React.Fragment key={i}>
                <div className="bg-[#0a0a1f] p-2 text-center text-[10px] font-bold text-cyan-600 sticky left-0 z-10">
                  {i.toString(16).toUpperCase()}
                </div>
                {row.slice(0, 16).map((value, j) => (
                  <div
                    key={j}
                    className={`p-1.5 text-center text-[10px] font-mono transition-all hover:scale-125 hover:z-30 cursor-crosshair border border-transparent hover:border-cyan-400/50 ${
                      value === 0 
                        ? 'bg-[#050510] text-slate-700' 
                        : value === maxVal
                        ? 'bg-red-900/60 text-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                        : value > 0
                        ? 'bg-cyan-900/20 text-cyan-400'
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
        
        <div className="flex items-center gap-4 text-xs text-slate-500 bg-[#0a0a15] p-2 rounded border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-sm shadow-[0_0_5px_red]"></div>
            <span>Maximum ({maxVal})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-900/50 border border-cyan-500/30 rounded-sm"></div>
            <span>Non-zero</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#050510] border border-slate-700 rounded-sm"></div>
            <span>Zero</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DifferentialTable;