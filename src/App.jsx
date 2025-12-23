import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, UserCircle2, Settings2, Image as ImageIcon, 
  Beaker, FileText, Lock, Unlock, Copy, ArrowRightLeft,
  Key, Eye, EyeOff, Sparkles
} from 'lucide-react';

import { 
  SBOX_44, INV_SBOX_44, 
  encrypt, decrypt, 
  AFFINE_MATRIX_K44, AFFINE_MATRIX_AES,
  generateSBoxFromAffine, createInverseSBox
} from './utils/crypto';

import { Card, Button, Input, TextArea, Badge } from './components/UI';
import AvalancheVisualizer from './components/AvalancheVisualizer';
import { AffineMatrixViewer } from './components/AdvancedStats';
import NonLinearityChart from './components/NonLinearityChart';
import DifferentialTable from './components/DifferentialTable';
import LinearApproximationTable from './components/LinearApproximationTable';
import BitChangeAnalyzer from './components/BitChangeAnalyzer';

// NEW COMPONENTS
import ParameterTuner from './components/ParameterTuner';
import ImageEncryptionPanel from './components/ImageEncryptionPanel';
import ResearchPipeline from './components/ResearchPipeline';

const App = () => {
  // --- KONFIGURASI TIM ---
  const teamMembers = [
    { name: "Rafi Algihari", role: "2304130077" },
    { name: "Wijdan Miftahul Huda", role: "2304130078" },
    { name: "Yefta Yudistira Dio Lewaherilla", role: "2304130068" },
    { name: "Yudistira Imam Putra", role: "2304130049" },
  ];

  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState('text'); 
  
  // S-Box State (Dynamic!)
  const [currentSBox, setCurrentSBox] = useState(SBOX_44);
  const [currentInvSBox, setCurrentInvSBox] = useState(INV_SBOX_44);
  const [currentAffineMatrix, setCurrentAffineMatrix] = useState(AFFINE_MATRIX_K44);
  const [algorithmName, setAlgorithmName] = useState('K44 (Paper)');

  // Encryption State
  const [key, setKey] = useState('MySecretKey12345');
  const [showKey, setShowKey] = useState(false);
  const [plainInput, setPlainInput] = useState('Hello World');
  const [cipherOutput, setCipherOutput] = useState('');
  const [cipherInput, setCipherInput] = useState('');
  const [plainOutput, setPlainOutput] = useState('');

  // Update S-Box when Parameter Tuner changes
  const handleSBoxUpdate = (newMatrix, newConstant) => {
    const generatedSBox = generateSBoxFromAffine(newMatrix, newConstant);
    const generatedInvSBox = createInverseSBox(generatedSBox);
    
    setCurrentSBox(generatedSBox);
    setCurrentInvSBox(generatedInvSBox);
    setCurrentAffineMatrix(newMatrix);
    
    if (JSON.stringify(newMatrix) === JSON.stringify(AFFINE_MATRIX_K44)) setAlgorithmName('K44 (Paper)');
    else if (JSON.stringify(newMatrix) === JSON.stringify(AFFINE_MATRIX_AES)) setAlgorithmName('Standard AES');
    else setAlgorithmName('Custom Experiment');
  };

  // Logic Auto Encrypt
  useEffect(() => {
    if (plainInput && key) {
        const timer = setTimeout(() => {
            try {
                const encrypted = encrypt(plainInput, key, currentSBox);
                setCipherOutput(encrypted);
            } catch(e) { console.error(e); }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [plainInput, key, currentSBox]);

  // Logic Auto Decrypt
  useEffect(() => {
    if (cipherInput && key) {
        const timer = setTimeout(() => {
            try {
                const dec = decrypt(cipherInput, key, currentInvSBox);
                setPlainOutput(dec);
            } catch(e) { setPlainOutput("Error: Invalid ciphertext."); }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [cipherInput, key, currentInvSBox]);

  const menuItems = [
    { id: 'text', label: 'Text Lab', icon: FileText },
    { id: 'image', label: 'Image Lab', icon: ImageIcon },
    { id: 'tuning', label: 'Matrix Tuner', icon: Settings2 },
    { id: 'security', label: 'Analysis', icon: ShieldCheck },
    { id: 'pipeline', label: 'Research', icon: Beaker },
  ];

  return (
    <div className="min-h-screen text-slate-300 font-sans pb-20 bg-[#050510]">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
        
        {/* HEADER */}
        <div className="relative p-6 rounded-2xl bg-[#0a0a1f] border border-cyan-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-black text-white">SECURE CIPHER LAB</h1>
                <p className="text-slate-400 text-sm font-mono">Kriptografi - Kelompok 1</p>
              </div>
            </div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
              <Sparkles className="w-3 h-3 mr-2" /> {algorithmName}
            </Badge>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-wrap gap-2 sticky top-2 z-50 p-2 bg-[#050510]/80 backdrop-blur-md rounded-xl border border-slate-800">
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all
                        ${activeTab === item.id ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:bg-slate-800'}`}
                >
                    <item.icon className="w-4 h-4" /> {item.label}
                </button>
            ))}
        </div>

        {/* CONTENT */}
        <div className="min-h-[500px]">
            {activeTab === 'text' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="p-6 border-t-2 border-t-cyan-500">
                        <h2 className="text-lg font-bold text-white mb-4">Encryption</h2>
                        <Input value={key} onChange={(e) => setKey(e.target.value)} type="password" placeholder="Key" className="mb-4" />
                        <TextArea value={plainInput} onChange={(e) => setPlainInput(e.target.value)} placeholder="Plaintext" className="h-32 mb-4" />
                        <TextArea value={cipherOutput} readOnly className="h-32 bg-black/20 text-emerald-400" />
                    </Card>
                    <Card className="p-6 border-t-2 border-t-emerald-500">
                        <h2 className="text-lg font-bold text-white mb-4">Decryption</h2>
                        <TextArea value={cipherInput} onChange={(e) => setCipherInput(e.target.value)} placeholder="Ciphertext (Hex)" className="h-32 mb-4" />
                        <TextArea value={plainOutput} readOnly className="h-32 bg-black/20" />
                    </Card>
                </div>
            )}
            {activeTab === 'image' && <ImageEncryptionPanel sbox={currentSBox} />}
            {activeTab === 'tuning' && <ParameterTuner onUpdateSBox={handleSBoxUpdate} />}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <NonLinearityChart sboxData={currentSBox} />
                    <AvalancheVisualizer originalHex={null} newHex={null} />
                </div>
            )}
            {activeTab === 'pipeline' && <ResearchPipeline />}
        </div>

        {/* FOOTER TEAM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800 pt-8">
            {teamMembers.map((m, i) => (
                <Card key={i} className="p-4 bg-[#0a0a15]">
                    <div className="text-sm font-bold text-white">{m.name}</div>
                    <div className="text-xs text-cyan-600">{m.role}</div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
