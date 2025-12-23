import React from 'react';
import { Card, Badge } from './UI';
import { ChevronDown, Database, FunctionSquare, Zap, Filter, Award, SearchCheck } from 'lucide-react';

const Step = ({ number, title, subtitle, desc, tags, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(6,182,212,0.3)]">
        {number}
      </div>
      {!isLast && <div className="w-0.5 flex-1 bg-slate-800 my-2"></div>}
    </div>
    <div className="pb-8 flex-1">
      <div className="flex items-center gap-3 mb-1">
        <h4 className="text-white font-bold text-lg">{title}</h4>
        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{subtitle}</span>
      </div>
      <p className="text-slate-400 text-sm mb-3 leading-relaxed">{desc}</p>
      <div className="flex gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-mono text-cyan-600 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ResearchPipeline = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Research Pipeline Overview</h2>
        <p className="text-slate-400 max-w-2xl">
            Visual workflow of the "AES S-box modification using affine matrices exploration" paper implementation.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Timeline */}
        <div className="lg:col-span-2 space-y-2">
            <Step 
                number="1"
                title="Define Affine Matrix 8x8"
                subtitle="Space: 2^64"
                desc="The Parameter Panel allows full control over 8 rows × 8 columns of bits (0/1). These bit combinations form a search space of 2^64."
                tags={['ParameterTuner.jsx', 'generateSBoxFromAffine()']}
            />
            <Step 
                number="2"
                title="Inverse GF(2⁸) Transformation"
                subtitle="Polynomial: 0x11B"
                desc="Each candidate byte is inverted in GF(2⁸) using the AES irreducible polynomial (x⁸ + x⁴ + x³ + x + 1). The selected affine matrix is then applied as a linear transform."
                tags={['crypto.js', 'gfInverse()']}
            />
            <Step 
                number="3"
                title="S-Box Candidate Generation"
                subtitle="Output: 256 Bytes"
                desc="Every Matrix + Constant combination produces a 256-value table (0-255). The UI generates this in real-time."
                tags={['S-Box Matrix View']}
            />
            <Step 
                number="4"
                title="Cryptographic Metrics Testing"
                subtitle="NL, SAC, BIC, LAP, DAP"
                desc="Each generated S-Box is automatically tested against 5+ cryptographic metrics. The goal is High Nonlinearity (112) and Low LAP/DAP."
                tags={['AdvancedStats.jsx', 'NonLinearityChart.jsx']}
                isLast={true}
            />
        </div>

        {/* Right: Summary Cards */}
        <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-[#0a0a1f] to-[#050510] border-slate-800">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Search Space</div>
                <div className="text-3xl font-black text-white mb-2">2<sup className="text-cyan-500">64</sup></div>
                <p className="text-xs text-slate-400">Total possible affine matrices combinations to be explored.</p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-[#0a0a1f] to-[#050510] border-slate-800">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Valid Candidates</div>
                <div className="text-3xl font-black text-white mb-2">128</div>
                <p className="text-xs text-slate-400">Only 128 candidates met the "Balance & Bijective" criteria reported in the paper.</p>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-900/20 to-[#050510] border-cyan-900/50">
                <div className="text-xs text-cyan-500 mb-1 uppercase tracking-widest">Paper Winner</div>
                <div className="text-3xl font-black text-white mb-2">K-44</div>
                <p className="text-xs text-slate-400">Outperforms AES in Strict Avalanche Criterion (SAC) while maintaining NL=112.</p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchPipeline;