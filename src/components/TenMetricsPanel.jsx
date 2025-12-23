import React from 'react';
import { Card, Badge } from './UI';
import { calculateSBoxStatistics } from '../utils/crypto';
import { ShieldCheck, Activity, Zap, Scale, Grid, Binary, Eye, BarChart3, Lock, Network } from 'lucide-react';

const MetricItem = ({ label, value, ideal, desc, icon: Icon, color }) => (
  <div className={`p-4 rounded-xl border bg-[#0a0a1f] ${color} transition-all hover:scale-[1.02] hover:shadow-lg`}>
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-slate-200">{label}</span>
      </div>
      <Badge className="bg-slate-900 border-slate-700 text-cyan-400 font-mono text-xs">
        {typeof value === 'number' ? value.toString().substring(0, 6) : value}
      </Badge>
    </div>
    <div className="text-[10px] text-slate-400 mb-1 h-8 line-clamp-2">{desc}</div>
    <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
      <span className="text-slate-500">Target</span>
      <span className="font-mono text-emerald-400">{ideal}</span>
    </div>
  </div>
);

const TenMetricsPanel = ({ sboxData }) => {
  const stats = calculateSBoxStatistics(sboxData);

  const metricsList = [
    { 
      label: "Non-Linearity (NL)", 
      value: stats.nl, 
      ideal: "Max (112)", 
      desc: "Ketahanan terhadap serangan linier. Semakin tinggi semakin baik.",
      icon: ShieldCheck,
      color: "border-cyan-500/30 hover:border-cyan-400"
    },
    { 
      label: "SAC", 
      value: stats.sac, 
      ideal: "0.5", 
      desc: "Strict Avalanche Criterion. 1 bit input berubah, output berubah 50%.",
      icon: Activity,
      color: "border-emerald-500/30 hover:border-emerald-400"
    },
    { 
      label: "BIC - NL", 
      value: stats.bic_nl, 
      ideal: "Max (112)", 
      desc: "Independensi non-linearitas antar bit output.",
      icon: Network,
      color: "border-purple-500/30 hover:border-purple-400"
    },
    { 
      label: "BIC - SAC", 
      value: stats.bic_sac, 
      ideal: "~0.5", 
      desc: "Independensi kriteria avalanche antar bit output.",
      icon: Zap,
      color: "border-indigo-500/30 hover:border-indigo-400"
    },
    { 
      label: "LAP", 
      value: stats.lap, 
      ideal: "Min (<0.06)", 
      desc: "Probabilitas Aproksimasi Linier. Harus serendah mungkin.",
      icon: Scale,
      color: "border-amber-500/30 hover:border-amber-400"
    },
    { 
      label: "DAP", 
      value: stats.dap, 
      ideal: "Min (1.56%)", 
      desc: "Probabilitas Aproksimasi Diferensial.",
      icon: Grid,
      color: "border-rose-500/30 hover:border-rose-400"
    },
    { 
      label: "Diff. Uniformity (DU)", 
      value: stats.du, 
      ideal: "4", 
      desc: "Nilai maksimum dalam tabel DDT. 4 adalah standar AES.",
      icon: BarChart3,
      color: "border-orange-500/30 hover:border-orange-400"
    },
    { 
      label: "Algebraic Degree (AD)", 
      value: stats.ad, 
      ideal: "7", 
      desc: "Derajat polinomial fungsi Boolean S-Box.",
      icon: Binary,
      color: "border-teal-500/30 hover:border-teal-400"
    },
    { 
      label: "Transparency Order (TO)", 
      value: stats.to, 
      ideal: "Min", 
      desc: "Ketahanan terhadap serangan DPA (Side Channel).",
      icon: Eye,
      color: "border-blue-500/30 hover:border-blue-400"
    },
    { 
      label: "Correlation Immunity (CI)", 
      value: stats.ci, 
      ideal: "0", 
      desc: "Korelasi antara input dan output. Untuk S-Box 8x8 bijective harus 0.",
      icon: Lock,
      color: "border-pink-500/30 hover:border-pink-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">10 Pengujian Kriptografi</h2>
        <Badge variant="purple">Full Suite Analysis</Badge>
      </div>
      
      <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded border border-slate-800">
        Mayoritas metrik menggunakan prinsip "semakin kecil semakin baik". 
        Pengecualian: <span className="text-cyan-400 font-bold">Nonlinearity & BIC</span> membutuhkan nilai maksimum, 
        sedangkan <span className="text-emerald-400 font-bold">SAC</span> terbaik bila mendekati 0.5.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricsList.map((metric, idx) => (
          <MetricItem key={idx} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default TenMetricsPanel;