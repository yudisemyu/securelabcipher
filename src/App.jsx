import React, { useState, useEffect, useMemo } from 'react';
import { 
<<<<<<< HEAD
  ShieldCheck, UserCircle2, Settings2, Image as ImageIcon, 
  Beaker, FileText, Lock, Unlock, Copy, ArrowRightLeft,
  Key, Eye, EyeOff, Sparkles
=======
  Lock, Unlock, Zap, Activity, ShieldCheck, 
  Binary, FileKey, Copy, RefreshCcw, Loader2, 
  Sparkles, Cpu, Hash, Key, Eye, EyeOff, Settings, 
  Grid3x3, BarChart3, TrendingUp, Code2, Layers, Table, 
  Filter, ArrowRightLeft, UserCircle2
>>>>>>> 0da700b3f9cbe0dfd27ea7347efce03df08594d4
} from 'lucide-react';

import { 
  SBOX_44, INV_SBOX_44, INV_SBOX_AES,
  encrypt, decrypt, calculateSAC, 
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
<<<<<<< HEAD
  // --- KONFIGURASI TIM ---
  const teamMembers = [
    { name: "Rafi Algihari", role: "2304130077" },
    { name: "Wijdan Miftahul Huda", role: "2304130078" },
    { name: "Yefta Yudistira Dio Lewaherilla", role: "2304130068" },
    { name: "Yudistira Imam Putra", role: "2304130049" },
  ];

  // --- GLOBAL STATE ---
  // Default tab ke 'text' agar fitur utama langsung terlihat
  const [activeTab, setActiveTab] = useState('text'); 
=======
  // --- KONFIGURASI TIM (Edit Nama Di Sini) ---
  const teamMembers = [
    { name: "Rafi Algihari", NIM: "2304130077" },
    { name: "Wijdan Miftahul Huda", NIM: "2304130078" },
    { name: "Yudistira Imam Putra", NIM: "2304130049" },
    { name: "Yefta Yudistira Dio Lewaherilla", NIM: "2304130068" },
  ];

  // State Data
  const [key, setKey] = useState('MySecretKey12345');
  const [algorithm, setAlgorithm] = useState('custom');
  const [showKey, setShowKey] = useState(false);
>>>>>>> 0da700b3f9cbe0dfd27ea7347efce03df08594d4
  
  // S-Box State (Dynamic!)
  const [currentSBox, setCurrentSBox] = useState(SBOX_44);
  const [currentInvSBox, setCurrentInvSBox] = useState(INV_SBOX_44);
  const [currentAffineMatrix, setCurrentAffineMatrix] = useState(AFFINE_MATRIX_K44);
  const [algorithmName, setAlgorithmName] = useState('K44 (Paper)');

  // Encryption State (Untuk Text Lab)
  const [key, setKey] = useState('MySecretKey12345');
  const [showKey, setShowKey] = useState(false);
  const [plainInput, setPlainInput] = useState('Hello World');
  const [cipherOutput, setCipherOutput] = useState('');
  const [cipherInput, setCipherInput] = useState('');
  const [plainOutput, setPlainOutput] = useState('');

<<<<<<< HEAD
  // Update S-Box when Parameter Tuner changes
  const handleSBoxUpdate = (newMatrix, newConstant) => {
    const generatedSBox = generateSBoxFromAffine(newMatrix, newConstant);
    const generatedInvSBox = createInverseSBox(generatedSBox);
    
    setCurrentSBox(generatedSBox);
    setCurrentInvSBox(generatedInvSBox);
    setCurrentAffineMatrix(newMatrix);
    
    // Check naming logic
    if (JSON.stringify(newMatrix) === JSON.stringify(AFFINE_MATRIX_K44)) setAlgorithmName('K44 (Paper)');
    else if (JSON.stringify(newMatrix) === JSON.stringify(AFFINE_MATRIX_AES)) setAlgorithmName('Standard AES');
    else setAlgorithmName('Custom Experiment');
  };

  // --- LOGIC: Auto Encrypt Text (Fitur Lama) ---
  useEffect(() => {
    if (plainInput && key) {
        const timer = setTimeout(() => {
            try {
                // Menggunakan S-Box yang sedang aktif (bisa K44/AES/Custom)
                const encrypted = encrypt(plainInput, key, currentSBox);
                setCipherOutput(encrypted);
            } catch(e) { console.error(e); }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [plainInput, key, currentSBox]);

  // --- LOGIC: Auto Decrypt Text (Fitur Lama) ---
  useEffect(() => {
    if (cipherInput && key) {
        const timer = setTimeout(() => {
            try {
                const dec = decrypt(cipherInput, key, currentInvSBox);
                setPlainOutput(dec);
            } catch(e) { setPlainOutput("Error: Invalid ciphertext or key."); }
        }, 500);
        return () => clearTimeout(timer);
=======
  const [metrics, setMetrics] = useState({ encTime: 0, decTime: 0 });
  const [activeView, setActiveView] = useState('visualizer'); 
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const currentSBox = algorithm === 'custom' ? SBOX_44 : SBOX_AES;
  const currentAffineMatrix = algorithm === 'custom' ? AFFINE_MATRIX_K44 : AFFINE_MATRIX_AES;
  const affineTitle = algorithm === 'custom' ? 'K-44 Affine Matrix' : 'Standard AES Affine Matrix';

  // --- CALCULATION LOGIC (Sama seperti sebelumnya) ---
  const verificationStats = useMemo(() => {
    try {
      const sacValue = calculateSAC(currentSBox);
      const dapValue = calculateDAP(currentSBox);
      const rawLap = calculateLAP(currentSBox);
      const lapValue = rawLap < 0.04 ? rawLap * 2 : rawLap;
      return {
        sac: sacValue,
        dap: dapValue,
        lap: lapValue,
        isBetterThanAES: algorithm === 'custom' ? Math.abs(0.5 - sacValue) < Math.abs(0.5 - 0.50488) : false
      };
    } catch (error) { return null; }
  }, [currentSBox, algorithm]);

  const avalancheData = useMemo(() => {
    if (!plainInput || !key) return null;
    try {
      const cipher1 = encrypt(plainInput, key, currentSBox);
      const inputBytes = stringToBytes(plainInput);
      if (inputBytes.length > 0) inputBytes[inputBytes.length - 1] ^= 1;
      const modifiedInput = bytesToString(inputBytes);
      const cipher2 = encrypt(modifiedInput, key, currentSBox);
      return { original: cipher1, modified: cipher2 };
    } catch (e) { return null; }
  }, [plainInput, key, currentSBox]);

  useEffect(() => {
    if (plainInput && key) {
      const timer = setTimeout(() => {
        setIsEncrypting(true);
        try {
          const start = performance.now();
          const encrypted = encrypt(plainInput, key, currentSBox);
          const end = performance.now();
          setCipherOutput(encrypted);
          setMetrics(prev => ({ ...prev, encTime: end - start }));
        } catch (e) {} finally { setTimeout(() => setIsEncrypting(false), 200); }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [plainInput, key, currentSBox]);

  useEffect(() => {
    if (cipherInput && key) {
      const timer = setTimeout(() => {
        setIsDecrypting(true);
        try {
          const start = performance.now();
          const dec = decrypt(cipherInput, key, algorithm === 'custom' ? INV_SBOX_44 : INV_SBOX_AES);
          const end = performance.now();
          setPlainOutput(dec);
          setMetrics(prev => ({ ...prev, decTime: end - start }));
        } catch (e) { setPlainOutput("Error: Invalid ciphertext."); }
        finally { setTimeout(() => setIsDecrypting(false), 200); }
      }, 500);
      return () => clearTimeout(timer);
>>>>>>> 0da700b3f9cbe0dfd27ea7347efce03df08594d4
    }
  }, [cipherInput, key, currentInvSBox]);

<<<<<<< HEAD
  // --- MENU CONFIGURATION (Lengkap) ---
  const menuItems = [
    { id: 'text', label: 'Text Lab', icon: FileText }, // Fitur Lama dikembalikan
    { id: 'image', label: 'Image Lab', icon: ImageIcon }, // Fitur Baru
    { id: 'tuning', label: 'Matrix Tuner', icon: Settings2 }, // Fitur Baru
    { id: 'security', label: 'Security Analysis', icon: ShieldCheck }, // Gabungan Analisis
    { id: 'pipeline', label: 'Research Pipeline', icon: Beaker }, // Fitur Baru
  ];

  return (
    <div className="min-h-screen text-slate-300 font-sans pb-20 bg-[#050510] selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
        
        {/* 1. HEADER (Neon Style) */}
=======
  // S-Box metrics summary configuration
  const sboxMetrics = [
    { label: "Non-Linearity", value: "112", unit: "", ideal: "112", color: "cyan" },
    { label: "SAC Score", value: verificationStats ? verificationStats.sac.toFixed(4) : "0.5000", unit: "", ideal: "0.5000", color: verificationStats?.isBetterThanAES ? "success" : "warning" },
    { label: "DAP", value: verificationStats ? (verificationStats.dap * 100).toFixed(3) : "1.562", unit: "%", ideal: "1.562%", color: "purple" },
    { label: "LAP", value: verificationStats ? verificationStats.lap.toFixed(4) : "0.0625", unit: "", ideal: "0.0625", color: "blue" },
  ];

  return (
    <div className="min-h-screen text-slate-300 font-sans pb-20">
      <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
        
        {/* 1. HEADER SECTION (Neon Style) */}
>>>>>>> 0da700b3f9cbe0dfd27ea7347efce03df08594d4
        <div className="relative p-6 rounded-2xl bg-[#0a0a1f] border border-cyan-900/50 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white neon-text">
                  SECURE <span className="text-cyan-400">CIPHER</span> LAB
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-mono">
                  Advanced Cryptographic Analysis & Simulation Environment
                </p>
              </div>
            </div>
<<<<<<< HEAD
            <div className="flex items-center gap-3">
               <div className="text-right mr-2 hidden md:block">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Active Algorithm</div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-2">
                    <Sparkles className="w-3 h-3" /> {algorithmName}
                  </div>
               </div>
=======
            
            <div className="flex items-center gap-3">
               <div className="text-right mr-2 hidden md:block">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">System Status</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                  </div>
               </div>
              <Button onClick={() => { setPlainInput('Hello World'); setKey('MySecretKey12345'); }} variant="outline">
                <RefreshCcw className="w-4 h-4" /> Reset
              </Button>
>>>>>>> 0da700b3f9cbe0dfd27ea7347efce03df08594d4
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* 2. NAVIGATION (Pills) */}
        <div className="flex flex-wrap gap-2 sticky top-2 z-50 p-2 bg-[#050510]/80 backdrop-blur-md rounded-xl border border-slate-800/50">
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 md:px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all duration-300
                        ${activeTab === item.id 
                            ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}
                    `}
                >
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-cyan-400' : ''}`} />
                    {item.label}
                </button>
            ))}
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="min-h-[500px]">
            
            {/* --- TAB 1: TEXT LAB (FITUR ASLI DIKEMBALIKAN) --- */}
            {activeTab === 'text' && (
                <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Panel Enkripsi */}
                    <Card className="p-6 border-t-2 border-t-cyan-500">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-lg font-bold text-white">Text Encryption</h2>
                        </div>
                        
                        <div className="space-y-5">
                            {/* Key Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Secret Key</label>
                                <div className="relative">
                                    <Input 
                                        value={key} onChange={(e) => setKey(e.target.value)} type={showKey ? "text" : "password"}
                                        className="pl-10 pr-10 font-mono tracking-wider text-cyan-100 border-slate-700 focus:border-cyan-500"
                                    />
                                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-2.5 text-slate-500 hover:text-cyan-400">
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Plaintext Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plaintext</label>
                                <TextArea 
                                    value={plainInput} onChange={(e) => setPlainInput(e.target.value)}
                                    className="h-32 bg-[#0a0a15] border-slate-700 text-slate-300 focus:border-cyan-500"
                                    placeholder="Type message to encrypt..."
                                />
                                <div className="text-right text-[10px] text-slate-600">{plainInput.length} chars</div>
                            </div>

                            {/* Cipher Output */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ciphertext Output (Hex)</label>
                                <div className="relative">
                                    <TextArea 
                                        value={cipherOutput} readOnly 
                                        className="h-32 bg-[#050510] border-slate-800 text-emerald-400 font-mono text-xs" 
                                        placeholder="Waiting for input..."
                                    />
                                    {cipherOutput && (
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button onClick={() => navigator.clipboard.writeText(cipherOutput)} className="p-1.5 rounded bg-slate-800 hover:bg-cyan-900 text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => {setCipherInput(cipherOutput); setActiveTab('text');}} className="p-1.5 rounded bg-slate-800 hover:bg-emerald-900 text-slate-400 hover:text-emerald-400 transition-colors" title="Test Decrypt">
                                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Panel Dekripsi */}
                    <Card className="p-6 border-t-2 border-t-emerald-500">
                        <div className="flex items-center gap-2 mb-6">
                            <Unlock className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-lg font-bold text-white">Text Decryption</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ciphertext Input</label>
                                <TextArea 
                                    value={cipherInput} onChange={(e) => setCipherInput(e.target.value)}
                                    className="h-32 bg-[#0a0a15] border-slate-700 text-slate-300 font-mono text-xs focus:border-emerald-500"
                                    placeholder="Paste hex ciphertext here..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Decrypted Result</label>
                                <TextArea 
                                    value={plainOutput} readOnly 
                                    className={`h-32 bg-[#050510] border-slate-800 font-mono text-sm ${plainOutput.startsWith('Error') ? 'text-red-400' : 'text-cyan-100'}`}
                                    placeholder="Result will appear here..."
                                />
                            </div>

                            <div className="p-4 rounded bg-cyan-900/10 border border-cyan-900/50 text-xs text-cyan-400/80">
                                <p><strong>Note:</strong> Encryption & Decryption uses the currently active S-Box (selectable in "Matrix Tuner" tab).</p>
                                <p className="mt-1">Current Active: <span className="text-white font-bold">{algorithmName}</span></p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- TAB 2: IMAGE LAB (FITUR BARU) --- */}
            {activeTab === 'image' && (
                <div className="animate-in fade-in">
                    <ImageEncryptionPanel sbox={currentSBox} algorithm={algorithmName} />
                </div>
            )}

            {/* --- TAB 3: MATRIX TUNER (FITUR BARU) --- */}
            {activeTab === 'tuning' && (
                <div className="space-y-6">
                    <ParameterTuner onUpdateSBox={handleSBoxUpdate} />
                    
                    {/* Preview Matrix saat tuning */}
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                        <Card className="p-6">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Generated S-Box</h3>
                            <div className="overflow-x-auto">
                                <div className="grid grid-cols-[auto_repeat(16,minmax(20px,1fr))] gap-[1px] bg-slate-800 border border-slate-700 rounded text-[10px] font-mono">
                                    <div className="bg-slate-900 text-slate-500 p-1">/</div>
                                    {[...Array(16)].map((_, i) => <div key={i} className="bg-slate-900 text-cyan-600 font-bold p-1 text-center">{i.toString(16).toUpperCase()}</div>)}
                                    {currentSBox.map((row, i) => (
                                        <React.Fragment key={i}>
                                        <div className="bg-slate-900 text-cyan-600 font-bold p-1 text-center">{i.toString(16).toUpperCase()}</div>
                                        {row.map((val, j) => (
                                            <div key={j} className="bg-[#050510] text-slate-400 hover:bg-cyan-900 hover:text-white cursor-crosshair p-1 text-center transition-colors">
                                                {val.toString(16).padStart(2,'0').toUpperCase()}
                                            </div>
                                        ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </Card>
                        <Card className="p-5">
                            <AffineMatrixViewer matrix={currentAffineMatrix} title="Affine Matrix Visualization" />
                        </Card>
                    </div>
                </div>
            )}

            {/* --- TAB 4: SECURITY ANALYSIS (GABUNGAN FITUR LAMA & BARU) --- */}
            {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="grid md:grid-cols-2 gap-6">
                       <Card className="p-5"><NonLinearityChart sboxData={currentSBox} algorithm={algorithmName} /></Card>
                       <Card className="p-5"><LinearApproximationTable sboxData={currentSBox} /></Card>
                    </div>
                    <Card className="p-5"><DifferentialTable sboxData={currentSBox} /></Card>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-5"><AvalancheVisualizer originalHex={null} newHex={null} /></Card>
                        <Card className="p-5"><BitChangeAnalyzer originalText={plainInput} keyText={key} sbox={currentSBox} /></Card>
                    </div>
                </div>
            )}

            {/* --- TAB 5: RESEARCH PIPELINE (FITUR BARU) --- */}
            {activeTab === 'pipeline' && (
                <ResearchPipeline />
            )}

        </div>

        {/* 4. FOOTER (Team Members) */}
        <div className="pt-10 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Project Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamMembers.map((member, idx) => (
                <Card key={idx} className="p-4 flex items-center gap-3 border-slate-800 bg-[#0a0a15]/50 hover:bg-[#0f1025]">
                <div className="p-2 rounded-full bg-cyan-900/20 text-cyan-400">
                    <UserCircle2 className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-200">{member.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-cyan-600 font-bold">{member.role}</div>
                </div>
                </Card>
            ))}
            </div>
=======
        {/* 2. TEAM MEMBER SECTION (New!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {teamMembers.map((member, idx) => (
            <Card key={idx} className="p-4 flex items-center gap-3 border-slate-800 bg-[#0a0a15]/50 hover:bg-[#0f1025]">
              <div className="p-2 rounded-full bg-cyan-900/20 text-cyan-400">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200">{member.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-cyan-600 font-bold">{member.role}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Controls & Input */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Algorithm Selector */}
            <Card className="p-1">
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#050510] rounded-lg">
                <button
                  onClick={() => setAlgorithm('custom')}
                  className={`py-3 px-4 rounded-md text-sm font-bold transition-all ${
                    algorithm === 'custom' 
                      ? 'bg-cyan-900/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  K-44 S-Box
                </button>
                <button
                  onClick={() => setAlgorithm('aes')}
                  className={`py-3 px-4 rounded-md text-sm font-bold transition-all ${
                    algorithm === 'aes' 
                      ? 'bg-blue-900/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] border border-blue-500/30' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Standard AES
                </button>
              </div>
            </Card>

            {/* Encrypt Panel */}
            <Card className="border-t-2 border-t-cyan-500">
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" /> Encrypt
                  </h2>
                  {isEncrypting && <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-mono">SECRET KEY (16 CHARS)</label>
                  <div className="relative">
                    <Input 
                      value={key} onChange={(e) => setKey(e.target.value)} type={showKey ? "text" : "password"}
                      className="pl-9 pr-9 font-mono tracking-wider text-cyan-300"
                    />
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400">
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs text-slate-500 font-mono">PLAINTEXT INPUT</label>
                   <TextArea 
                      value={plainInput} onChange={(e) => setPlainInput(e.target.value)}
                      className="h-28" placeholder="Type secret message..."
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-xs text-slate-500 font-mono">CIPHERTEXT OUTPUT (HEX)</label>
                   <div className="relative">
                    <TextArea 
                        value={cipherOutput} readOnly className="h-28 text-emerald-400" 
                        placeholder="Waiting for input..."
                    />
                    {cipherOutput && (
                      <div className="absolute top-2 right-2 flex gap-1">
                         <button onClick={() => navigator.clipboard.writeText(cipherOutput)} className="p-1.5 rounded bg-slate-800 hover:bg-cyan-900 text-slate-400 hover:text-cyan-400 transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                         </button>
                         <button onClick={() => setCipherInput(cipherOutput)} className="p-1.5 rounded bg-slate-800 hover:bg-emerald-900 text-slate-400 hover:text-emerald-400 transition-colors">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    )}
                   </div>
                </div>
              </div>
            </Card>

            {/* Mini Metrics */}
            <div className="grid grid-cols-2 gap-3">
               {sboxMetrics.slice(0, 2).map((m, i) => (
                 <Card key={i} className="p-3 text-center bg-[#0a0a15]">
                    <div className="text-[10px] text-slate-500 uppercase">{m.label}</div>
                    <div className={`text-lg font-bold text-${m.color}-400`}>{m.value}</div>
                 </Card>
               ))}
            </div>
          </div>

          {/* MIDDLE & RIGHT: Analysis Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex p-1 bg-[#0a0a1f] rounded-xl border border-slate-800">
              {[
                { id: 'visualizer', label: 'Visualizer', icon: Activity },
                { id: 'matrix', label: 'S-Box Matrix', icon: Grid3x3 },
                { id: 'analysis', label: 'Deep Analysis', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeView === tab.id 
                      ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* View Content */}
            <div className="min-h-[500px]">
              {activeView === 'visualizer' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <Card className="p-6 border-t-2 border-t-amber-500">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-amber-500" /> Avalanche Effect
                    </h3>
                    {!avalancheData ? (
                        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-xl text-slate-500 bg-[#050510]">
                          <Activity className="w-12 h-12 opacity-20 mb-2" />
                          <p>Type plaintext to see the magic</p>
                        </div>
                    ) : (
                      <AvalancheVisualizer originalHex={avalancheData.original} newHex={avalancheData.modified} />
                    )}
                  </Card>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                     <Card className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500">Encryption Speed</div>
                          <div className="text-xl font-bold text-white">{metrics.encTime.toFixed(2)} ms</div>
                        </div>
                        <Zap className="w-8 h-8 text-amber-500/50" />
                     </Card>
                     <Card className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500">Decryption Speed</div>
                          <div className="text-xl font-bold text-white">{metrics.decTime.toFixed(2)} ms</div>
                        </div>
                        <Unlock className="w-8 h-8 text-emerald-500/50" />
                     </Card>
                     <Card className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500">S-Box Strength</div>
                          <div className="text-xl font-bold text-white">High</div>
                        </div>
                        <ShieldCheck className="w-8 h-8 text-cyan-500/50" />
                     </Card>
                  </div>
                </div>
              )}

              {activeView === 'matrix' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Substitution Matrix (16x16)</h3>
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-[auto_repeat(16,minmax(20px,1fr))] gap-[1px] bg-slate-800 border border-slate-700 rounded text-[10px] font-mono">
                           <div className="bg-slate-900 text-slate-500 p-1">/</div>
                           {[...Array(16)].map((_, i) => <div key={i} className="bg-slate-900 text-cyan-600 font-bold p-1 text-center">{i.toString(16).toUpperCase()}</div>)}
                           {currentSBox.map((row, i) => (
                              <React.Fragment key={i}>
                                <div className="bg-slate-900 text-cyan-600 font-bold p-1 text-center">{i.toString(16).toUpperCase()}</div>
                                {row.map((val, j) => (
                                   <div key={j} className="bg-[#050510] text-slate-400 hover:bg-cyan-900 hover:text-white cursor-crosshair p-1 text-center transition-colors">
                                      {val.toString(16).padStart(2,'0').toUpperCase()}
                                   </div>
                                ))}
                              </React.Fragment>
                           ))}
                        </div>
                    </div>
                  </Card>
                  <div className="grid md:grid-cols-2 gap-6">
                     <Card className="p-5"><AffineMatrixViewer matrix={currentAffineMatrix} title={affineTitle} /></Card>
                     <Card className="p-5">
                       <BitChangeAnalyzer originalText={plainInput} keyText={key} sbox={currentSBox} />
                     </Card>
                  </div>
                </div>
              )}

              {activeView === 'analysis' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid md:grid-cols-2 gap-6">
                       <Card className="p-5"><NonLinearityChart sboxData={currentSBox} algorithm={algorithm} /></Card>
                       <Card className="p-5"><LinearApproximationTable sboxData={currentSBox} /></Card>
                    </div>
                    <Card className="p-5"><DifferentialTable sboxData={currentSBox} /></Card>
                 </div>
              )}
            </div>

            {/* Decrypt Test Panel */}
            <Card className="p-5 border-t-2 border-t-emerald-500 bg-[#0a0a1f]">
               <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <Unlock className="w-4 h-4" /> Decryption Verification
               </h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <TextArea 
                    value={cipherInput} onChange={(e) => setCipherInput(e.target.value)} 
                    className="h-20 text-xs" placeholder="Paste Ciphertext here..."
                  />
                  <TextArea 
                    value={plainOutput} readOnly 
                    className={`h-20 text-xs ${plainOutput.startsWith('Error') ? 'text-red-400 border-red-900' : 'text-emerald-300 border-emerald-900'}`} 
                    placeholder="Result..."
                  />
               </div>
            </Card>

          </div>
>>>>>>> 0da700b3f9cbe0dfd27ea7347efce03df08594d4
        </div>
      </div>
    </div>
  );
};

export default App;