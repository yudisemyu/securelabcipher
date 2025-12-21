// src/components/AdvancedStats.jsx
import React from 'react';
import { Card, Badge } from './UI';

export const AffineMatrixViewer = ({ matrix, title }) => (
  <div className="flex flex-col items-center">
    <h4 className="text-xs font-bold uppercase text-zinc-400 mb-3 tracking-wider">{title}</h4>
    <div className="grid grid-cols-8 gap-0.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
      {matrix.map((row, i) => 
        row.map((val, j) => (
          <div 
            key={`${i}-${j}`}
            className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[10px] rounded-[2px] transition-all hover:scale-110
              ${val === 1 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'bg-white text-zinc-300'}`}
            title={`Row ${i}, Col ${j}: ${val}`}
          >
            {val}
          </div>
        ))
      )}
    </div>
    <div className="flex gap-4 mt-2 text-[10px] text-zinc-400">
      <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-600 rounded-sm"></div> 1 (Bit Set)</span>
      <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white border border-zinc-200 rounded-sm"></div> 0 (Unset)</span>
    </div>
  </div>
);

export const MetricCard = ({ label, value, ideal, description, isLoading }) => {
    // Logic warna untuk deviasi dari ideal
    const isGood = Math.abs(value - ideal) < 0.0001; // Toleransi sangat ketat
    
    return (
        <div className="p-4 rounded-xl bg-white border border-zinc-100 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-zinc-700">{label}</span>
                    {isLoading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-indigo-600 animate-spin"></span>
                    ) : (
                        <Badge variant={isGood ? "success" : "warning"}>
                            {typeof value === 'number' ? value.toFixed(6) : value}
                        </Badge>
                    )}
                </div>
                <div className="text-xs text-zinc-500 mb-3">{description}</div>
            </div>
            <div className="text-[10px] font-mono bg-zinc-50 p-2 rounded border border-zinc-200 text-zinc-600">
                Ideal Value: <span className="font-bold">{ideal}</span>
            </div>
        </div>
    );
};
