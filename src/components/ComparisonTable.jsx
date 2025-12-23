import React from 'react';
import { Card, Badge } from './UI';
import { SBOX_AES, calculateSBoxStatistics } from '../utils/crypto';
import { Trophy, XCircle, Minus } from 'lucide-react';

const ComparisonTable = ({ currentSBox, algorithmName }) => {
  // 1. Hitung Statistik untuk S-Box Saat Ini (Custom/K44)
  const statsCurrent = calculateSBoxStatistics(currentSBox);
  
  // 2. Hitung Statistik untuk AES Standar (sebagai pembanding)
  // (Kita hitung sekali saja karena AES statis)
  const statsAES = calculateSBoxStatistics(SBOX_AES);

  // Daftar Metrik yang akan dibandingkan
  const metrics = [
    { key: 'nl', label: 'Non-Linearity (NL)', goal: 'max', ideal: 112 },
    { key: 'sac', label: 'SAC (Avalanche)', goal: 'target', target: 0.5 },
    { key: 'bic_nl', label: 'BIC - NonLinearity', goal: 'max', ideal: 112 },
    { key: 'lap', label: 'Max Linear Prob (LAP)', goal: 'min' },
    { key: 'dap', label: 'Max Diff Prob (DAP)', goal: 'min' },
    { key: 'du', label: 'Diff Uniformity (DU)', goal: 'min', ideal: 4 },
    { key: 'ad', label: 'Algebraic Degree', goal: 'max', ideal: 7 },
  ];

  const determineWinner = (m, val1, val2) => {
    if (m.goal === 'target') {
      const dist1 = Math.abs(val1 - m.target);
      const dist2 = Math.abs(val2 - m.target);
      if (dist1 < dist2) return 'current';
      if (dist2 < dist1) return 'aes';
      return 'draw';
    }
    if (m.goal === 'max') return val1 > val2 ? 'current' : val1 < val2 ? 'aes' : 'draw';
    if (m.goal === 'min') return val1 < val2 ? 'current' : val1 > val2 ? 'aes' : 'draw';
    return 'draw';
  };

  let scoreCurrent = 0;
  let scoreAES = 0;

  return (
    <Card className="p-6 border border-slate-700 bg-[#0a0a1f]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Side-by-Side Comparison</h3>
        <Badge variant="blue">Benchmark</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3 text-cyan-400 font-bold">{algorithmName} (Current)</th>
              <th className="px-4 py-3 text-blue-400 font-bold">Standard AES</th>
              <th className="px-4 py-3 text-center">Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {metrics.map((m, idx) => {
              const val1 = statsCurrent[m.key];
              const val2 = statsAES[m.key];
              const winner = determineWinner(m, val1, val2);
              
              if(winner === 'current') scoreCurrent++;
              if(winner === 'aes') scoreAES++;

              return (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-300">{m.label}</td>
                  <td className={`px-4 py-3 font-mono ${winner === 'current' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {typeof val1 === 'number' ? val1.toFixed(5) : val1}
                  </td>
                  <td className={`px-4 py-3 font-mono ${winner === 'aes' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {typeof val2 === 'number' ? val2.toFixed(5) : val2}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {winner === 'current' && <Badge variant="success">Current</Badge>}
                    {winner === 'aes' && <Badge variant="blue">AES</Badge>}
                    {winner === 'draw' && <span className="text-slate-600">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${scoreCurrent >= scoreAES ? 'bg-cyan-900/20 border-cyan-500' : 'bg-slate-900 border-slate-800'}`}>
            <div className="text-xs text-slate-400 mb-1">Current Score</div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
                {scoreCurrent} {scoreCurrent >= scoreAES && <Trophy className="w-5 h-5 text-yellow-400" />}
            </div>
        </div>
        <div className={`p-4 rounded-xl border ${scoreAES > scoreCurrent ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
            <div className="text-xs text-slate-400 mb-1">AES Score</div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
                {scoreAES} {scoreAES > scoreCurrent && <Trophy className="w-5 h-5 text-yellow-400" />}
            </div>
        </div>
      </div>
    </Card>
  );
};

export default ComparisonTable;