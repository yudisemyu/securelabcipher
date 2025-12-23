import React from 'react';
import { Card } from './UI';
import { generateCompleteDDT } from '../utils/crypto';

const DistributionHistogram = ({ sboxData }) => {
  const ddt = generateCompleteDDT(sboxData);
  
  // Hitung frekuensi setiap nilai di DDT
  const frequency = {};
  ddt.flat().forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });

  const maxFreq = Math.max(...Object.values(frequency));
  const keys = Object.keys(frequency).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-white mb-4">DDT Value Histogram</h3>
      <p className="text-xs text-slate-400 mb-4">
        Visualisasi sebaran probabilitas diferensial.
      </p>

      <div className="flex items-end gap-2 h-48 mt-4 border-b border-slate-700 pb-2">
        {keys.map((key) => {
            const height = (frequency[key] / maxFreq) * 100;
            return (
                <div key={key} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex justify-center">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-slate-800 text-white text-[10px] p-1 rounded border border-slate-600 whitespace-nowrap">
                            Val: {key}, Count: {frequency[key]}
                        </div>
                        {/* Bar */}
                        <div 
                            className={`w-full max-w-[30px] rounded-t transition-all hover:bg-cyan-400 ${key === '0' ? 'bg-slate-700' : 'bg-cyan-600'}`}
                            style={{ height: `${height}%`, minHeight: '4px' }}
                        ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 font-mono">{key}</span>
                </div>
            );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-slate-500">
        <span>Differential Value</span>
      </div>
    </Card>
  );
};

export default DistributionHistogram;