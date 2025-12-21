import React, { useState } from 'react';
import { Card, Button } from './UI';
import { ChevronDown, ChevronUp } from 'lucide-react';

const BitChangeAnalyzer = ({ originalText, keyText, sbox }) => {
  const [flippedBit, setFlippedBit] = useState(0);
  const [results, setResults] = useState(null);
  
  const analyzeBitChange = () => {
    if (!originalText || !keyText) return;
    
    // Simulate encryption with bit flip
    const bytes = new TextEncoder().encode(originalText);
    const modifiedBytes = new Uint8Array(bytes);
    
    // Flip selected bit
    const byteIndex = Math.floor(flippedBit / 8);
    const bitIndex = flippedBit % 8;
    
    if (byteIndex < modifiedBytes.length) {
      modifiedBytes[byteIndex] ^= (1 << bitIndex);
    }
    
    const modifiedText = new TextDecoder().decode(modifiedBytes);
    
    // Simulate encryption results (simplified)
    const simulateEncryption = (text) => {
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0;
      }
      return hash.toString(16).padStart(8, '0');
    };
    
    const originalHash = simulateEncryption(originalText);
    const modifiedHash = simulateEncryption(modifiedText);
    
    // Calculate bit changes
    const originalBits = parseInt(originalHash, 16).toString(2).padStart(32, '0');
    const modifiedBits = parseInt(modifiedHash, 16).toString(2).padStart(32, '0');
    
    let changedBits = 0;
    for (let i = 0; i < 32; i++) {
      if (originalBits[i] !== modifiedBits[i]) changedBits++;
    }
    
    setResults({
      originalHash,
      modifiedHash,
      changedBits,
      percentage: (changedBits / 32 * 100).toFixed(2),
      flippedPosition: `Byte ${byteIndex}, Bit ${bitIndex}`
    });
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-zinc-800 mb-4">Bit Change Analysis</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700 mb-2 block">
              Flip Bit Position (0-{Math.max(0, originalText.length * 8 - 1)})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={Math.max(0, originalText.length * 8 - 1)}
                value={flippedBit}
                onChange={(e) => setFlippedBit(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono bg-zinc-100 px-2 py-1 rounded">
                {flippedBit}
              </span>
            </div>
          </div>
          
          <div className="flex items-end">
            <Button onClick={analyzeBitChange} className="w-full">
              Analyze Bit Change
            </Button>
          </div>
        </div>
        
        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-lg">
                <div className="text-sm text-zinc-500">Original Hash</div>
                <div className="font-mono text-sm break-all">{results.originalHash}</div>
              </div>
              <div className="p-4 bg-zinc-50 rounded-lg">
                <div className="text-sm text-zinc-500">Modified Hash</div>
                <div className="font-mono text-sm break-all">{results.modifiedHash}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">{results.changedBits}/32</div>
                <div className="text-sm text-blue-600">Bits Changed</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-700">{results.percentage}%</div>
                <div className="text-sm text-emerald-600">Change Rate</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-sm font-mono text-purple-700">{results.flippedPosition}</div>
                <div className="text-sm text-purple-600">Flipped Position</div>
              </div>
            </div>
            
            {/* Bit visualization */}
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-zinc-700 mb-2">Bit Changes Visualization</div>
              <div className="grid grid-cols-16 gap-1">
                {Array.from({ length: 32 }).map((_, i) => {
                  const originalBit = results.originalHash ? 
                    (parseInt(results.originalHash, 16) >> (31 - i)) & 1 : 0;
                  const modifiedBit = results.modifiedHash ? 
                    (parseInt(results.modifiedHash, 16) >> (31 - i)) & 1 : 0;
                  const changed = originalBit !== modifiedBit;
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded flex items-center justify-center text-xs ${
                        changed 
                          ? 'bg-red-500 text-white font-bold' 
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                      title={`Bit ${i}: ${originalBit} → ${modifiedBit}`}
                    >
                      {changed ? '1' : '0'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BitChangeAnalyzer;