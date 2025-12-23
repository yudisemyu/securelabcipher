import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from './UI';
import { RotateCcw, Save, Zap } from 'lucide-react';
import { AFFINE_MATRIX_K44, AFFINE_MATRIX_AES } from '../utils/crypto';

const ParameterTuner = ({ onUpdateSBox }) => {
  // 8x8 Matrix State (Array of 8 arrays, each 8 bits)
  const [matrix, setMatrix] = useState(AFFINE_MATRIX_K44);
  const [constant, setConstant] = useState(0x63); // Default AES constant
  const [presetName, setPresetName] = useState("Custom Matrix");

  const toggleBit = (row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row] = [...newMatrix[row]];
    newMatrix[row][col] = newMatrix[row][col] ? 0 : 1;
    setMatrix(newMatrix);
  };

  const loadPreset = (type) => {
    if (type === 'K44') {
      setMatrix(AFFINE_MATRIX_K44);
      setConstant(0x63);
      setPresetName("K44 Matrix (Best Performer)");
    } else if (type === 'AES') {
      setMatrix(AFFINE_MATRIX_AES);
      setConstant(0x63);
      setPresetName("Standard AES Matrix");
    } else if (type === 'Identity') {
      setMatrix(Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => i === j ? 1 : 0)));
      setConstant(0);
      setPresetName("Identity Matrix (No Change)");
    }
  };

  // Trigger update when matrix/constant changes
  useEffect(() => {
    onUpdateSBox(matrix, constant);
  }, [matrix, constant]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Research Parameters</h2>
          <p className="text-slate-400">Adjust S-box generation parameters</p>
        </div>
        <Button variant="outline" onClick={() => loadPreset('AES')}>
            <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Presets & Info */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Affine Transformation Matrix</h3>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => loadPreset('K44')} className={`p-3 rounded-lg border text-sm font-bold text-left transition-all ${presetName.includes('K44') ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' : 'bg-[#0a0a1f] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    Paper (K44)
                </button>
                <button onClick={() => loadPreset('AES')} className={`p-3 rounded-lg border text-sm font-bold text-left transition-all ${presetName.includes('AES') ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-[#0a0a1f] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    Standard AES
                </button>
                <button onClick={() => loadPreset('Identity')} className="p-3 rounded-lg border border-slate-700 bg-[#0a0a1f] text-slate-400 text-sm font-bold text-left hover:border-slate-500">
                    Identity
                </button>
                <button className="p-3 rounded-lg border border-dashed border-slate-700 bg-transparent text-slate-500 text-sm font-bold text-left hover:text-slate-300">
                    Custom...
                </button>
            </div>

            <Card className="p-4 bg-[#0a0a1f] border-slate-700 mt-4">
                <div className="text-xs text-slate-500 mb-1">Active Configuration</div>
                <div className="font-bold text-white mb-2">{presetName}</div>
                <div className="text-xs text-slate-400 font-mono">
                    Formula: S(x) = M × x^(-1) ⊕ 0x{constant.toString(16).toUpperCase()}
                </div>
            </Card>
        </div>

        {/* Center: Matrix Editor */}
        <Card className="p-6 bg-[#050510] border-slate-800">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-400">Current Matrix (8x8)</span>
                <span className="text-xs text-cyan-500 font-mono">Click bits to toggle</span>
            </div>
            <div className="grid grid-cols-8 gap-1 mb-4">
                {/* Column Headers */}
                {Array(8).fill(0).map((_, i) => (
                    <div key={`h-${i}`} className="text-center text-[10px] text-slate-600 font-mono">{7-i}</div>
                ))}
                
                {/* Matrix Grid */}
                {matrix.map((row, rIdx) => (
                    row.map((bit, cIdx) => (
                        <div 
                            key={`${rIdx}-${cIdx}`}
                            onClick={() => toggleBit(rIdx, cIdx)}
                            className={`aspect-square rounded-[2px] cursor-pointer transition-all flex items-center justify-center text-[10px] font-mono border border-transparent hover:border-white/20
                                ${bit ? 'bg-cyan-600 text-white shadow-[0_0_5px_rgba(8,145,178,0.5)]' : 'bg-[#0f1020] text-slate-700'}
                            `}
                        >
                            {bit}
                        </div>
                    ))
                ))}
            </div>
            
            {/* Hex Representation of Rows */}
            <div className="space-y-1">
                {matrix.map((row, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>Row {idx}: {row.join('')}</span>
                        <span className="text-slate-300">0x{parseInt(row.join(''), 2).toString(16).toUpperCase().padStart(2, '0')}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* Right: Constant Vector */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Constant Vector (C)</h3>
            <Input 
                value={constant.toString(16).toUpperCase()}
                onChange={(e) => {
                    const val = parseInt(e.target.value, 16);
                    if (!isNaN(val) && val >= 0 && val <= 255) setConstant(val);
                }}
                className="font-mono text-lg tracking-wider"
                prefix="0x"
            />
            <div className="text-xs text-slate-500">Hex/decimal value. Current: {constant}</div>

            <div className="space-y-2 mt-4">
                <div className="text-xs font-bold text-slate-400">Quick Presets:</div>
                <div className="flex gap-2 flex-wrap">
                    {[0x63, 0x00, 0xFF, 0xAA, 0x55].map(val => (
                        <button 
                            key={val}
                            onClick={() => setConstant(val)}
                            className={`px-3 py-1 rounded border text-xs font-mono transition-all
                                ${constant === val ? 'bg-purple-900/30 border-purple-500 text-purple-300' : 'bg-[#0a0a1f] border-slate-700 text-slate-400 hover:border-slate-500'}
                            `}
                        >
                            0x{val.toString(16).toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterTuner;