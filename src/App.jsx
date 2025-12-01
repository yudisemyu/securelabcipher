import React, { useState } from 'react';
import { 
  Lock, Unlock, Zap, Activity, Shield, 
  BarChart3, CheckCircle2, AlertCircle,
  Binary, Terminal, FileKey, ArrowRightLeft,
  Copy, RefreshCcw, Loader2 
} from 'lucide-react';

import { 
  SBOX_44, SBOX_AES, INV_SBOX_44, INV_SBOX_AES,
  encrypt, decrypt, stringToBytes, bytesToString,
  calculateSAC 
} from './utils/crypto';

import { Card, Button, Input, TextArea, Badge } from './components/UI';
import AvalancheVisualizer from './components/AvalancheVisualizer';

const App = () => {
  const [activeTab, setActiveTab] = useState('playground'); 
  const [operationMode, setOperationMode] = useState('encrypt'); 

  // State Data
  const [key, setKey] = useState('MySecretKey12345');
  const [algorithm, setAlgorithm] = useState('custom');
  
  const [plainInput, setPlainInput] = useState('Hello World');
  const [cipherOutput, setCipherOutput] = useState('');
  
  const [cipherInput, setCipherInput] = useState('');
  const [plainOutput, setPlainOutput] = useState('');

  const [metrics, setMetrics] = useState({ encTime: 0, decTime: 0 });
  const [avalancheData, setAvalancheData] = useState(null);
  
  // State baru untuk loading verification
  const [verificationStats, setVerificationStats] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const currentSBox = algorithm === 'custom' ? SBOX_44 : SBOX_AES;


  const handleEncrypt = () => {
    // Validasi Key dilonggarkan: hanya cek jika kosong
    if (!plainInput || !key) {
      alert("Please enter plaintext and a key.");
      return;
    }
    
    try {
      const start = performance.now();
      const encrypted = encrypt(plainInput, key, currentSBox);
      const end = performance.now();
      
      setCipherOutput(encrypted);
      setMetrics(prev => ({ ...prev, encTime: end - start }));
      setAvalancheData(null); 
    } catch (e) {
      alert("Encryption error: " + e.message);
    }
  };

  const handleDecrypt = () => {
    if (!cipherInput || !key) {
      alert("Please enter ciphertext and key.");
      return;
    }
    try {
      const start = performance.now();
      const dec = decrypt(cipherInput, key, algorithm === 'custom' ? INV_SBOX_44 : INV_SBOX_AES);
      const end = performance.now();
      setPlainOutput(dec);
      setMetrics(prev => ({ ...prev, decTime: end - start }));
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setPlainOutput("Error: Invalid ciphertext or key mismatch.");
    }
  };

  const copyToClipboard = (text) => {
    if(text) navigator.clipboard.writeText(text);
  };

  const transferToDecrypt = () => {
    setCipherInput(cipherOutput);
    setOperationMode('decrypt');
  };

  const runAnalysis = () => {
    if (!plainInput || !key) {
        alert("Please provide input in Encryption tab first.");
        return;
    }
    
    const cipher1 = encrypt(plainInput, key, currentSBox);
    const inputBytes = stringToBytes(plainInput);
    
    // Pastikan input cukup panjang untuk dimodifikasi
    if(inputBytes.length > 0) {
        inputBytes[inputBytes.length - 1] ^= 1; 
    } else {
        alert("Input is empty");
        return;
    }
    
    const modifiedInput = bytesToString(inputBytes);
    const cipher2 = encrypt(modifiedInput, key, currentSBox);

    setAvalancheData({
      original: cipher1,
      modified: cipher2,
      inputDiff: `Changed last bit of input`
    });
  };

  const verifySBoxStrength = async () => {
    setIsVerifying(true);
    setVerificationStats(null); 

    await new Promise(resolve => setTimeout(resolve, 600));

    const sacValue = calculateSAC(currentSBox);
    const idealSAC = 0.5;
    const deviation = Math.abs(idealSAC - sacValue);
    
    setVerificationStats({
      sac: sacValue,
      deviation: deviation,
      isBetterThanAES: algorithm === 'custom' ? deviation < Math.abs(0.5 - 0.50488) : false
    });
    
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 md:p-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-zinc-900">
              <Shield className="w-8 h-8 text-indigo-600" />
              Crypto S-Box Analyzer
            </h1>
            <p className="text-zinc-500 mt-2 text-sm md:text-base">
              Scientific comparison & implementation of Custom S-Box (Paper) vs AES Standard
            </p>
          </div>
          
          <div className="bg-white p-1.5 rounded-xl border border-zinc-200 shadow-sm flex gap-1">
            {['playground', 'analysis'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-zinc-900 text-white shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'playground' && (
          <div className="grid md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Configuration */}
            <div className="md:col-span-4 space-y-6 sticky top-6">
              <Card className="p-5 space-y-5 border-indigo-100 ring-4 ring-indigo-50/50">
                <div className="flex items-center gap-2 text-zinc-800 font-bold border-b border-zinc-100 pb-3">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Global Configuration
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Algorithm</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'custom', label: 'Custom S-Box 44', sub: 'High Nonlinearity (NL=112)' },
                      { id: 'aes', label: 'Standard AES', sub: 'NIST FIPS 197 Standard' }
                    ].map((opt) => (
                      <div 
                        key={opt.id}
                        onClick={() => {
                            setAlgorithm(opt.id);
                            setVerificationStats(null); // Reset stats jika ganti algo
                        }}
                        className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center justify-between group
                          ${algorithm === opt.id 
                            ? 'border-indigo-600 bg-indigo-50/30' 
                            : 'border-zinc-100 hover:border-indigo-200 hover:bg-white'
                          }`}
                      >
                        <div>
                          <div className={`font-bold text-sm ${algorithm === opt.id ? 'text-indigo-700' : 'text-zinc-700'}`}>{opt.label}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{opt.sub}</div>
                        </div>
                        {algorithm === opt.id && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Secret Key (Auto-padded)
                  </label>
                  <div className="relative group">
                    <FileKey className="absolute left-3 top-3 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                      value={key} 
                      onChange={(e) => setKey(e.target.value)}
                      maxLength={32} 
                      className="pl-10 font-mono tracking-wide"
                      placeholder="Enter any key..."
                    />
                  </div>
                  
                  <div className="flex justify-between px-1 items-center">
                    <span className="text-[10px] text-zinc-400">ECB Mode</span>
                    {key.length === 16 ? (
                         <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3"/> Perfect (16 bytes)
                         </span>
                    ) : key.length < 16 ? (
                        <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3"/> Padded with 0s (+{16 - key.length})
                        </span>
                    ) : (
                        <span className="text-[10px] font-medium text-blue-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3"/> Sliced to 16 bytes
                        </span>
                    )}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 flex flex-col justify-center items-center text-center bg-zinc-900 text-white border-zinc-800">
                  <Zap className="w-5 h-5 text-amber-400 mb-1" />
                  <div className="text-xl font-bold font-mono">{metrics.encTime.toFixed(2)}<span className="text-sm font-normal text-zinc-400">ms</span></div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Enc Speed</div>
                </Card>
                <Card className="p-4 flex flex-col justify-center items-center text-center">
                  <Unlock className="w-5 h-5 text-emerald-500 mb-1" />
                  <div className="text-xl font-bold font-mono text-zinc-900">{metrics.decTime.toFixed(2)}<span className="text-sm font-normal text-zinc-400">ms</span></div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Dec Speed</div>
                </Card>
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              
              <div className="flex bg-zinc-200/50 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => setOperationMode('encrypt')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    operationMode === 'encrypt' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <Lock className="w-4 h-4" /> Encryption Mode
                </button>
                <button
                  onClick={() => setOperationMode('decrypt')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    operationMode === 'decrypt' 
                      ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' 
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <Unlock className="w-4 h-4" /> Decryption Mode
                </button>
              </div>

              {operationMode === 'encrypt' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Card className="p-6 md:p-8 space-y-6 border-t-4 border-t-indigo-500">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          Plaintext Input
                        </label>
                        <Badge variant="blue">UTF-8 Text</Badge>
                      </div>
                      <TextArea
                        value={plainInput}
                        onChange={(e) => setPlainInput(e.target.value)}
                        placeholder="Type your secret message here to encrypt..."
                        className="h-32 font-mono text-sm"
                      />
                    </div>

                    <Button onClick={handleEncrypt} className="w-full py-4 text-base shadow-indigo-200" disabled={!key || !plainInput}>
                      <Lock className="w-5 h-5" /> Encrypt Message
                    </Button>

                    <div className="relative">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          Ciphertext Result
                        </label>
                        <div className="flex gap-2">
                          {cipherOutput && (
                            <button onClick={transferToDecrypt} className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                              <ArrowRightLeft className="w-3 h-3" /> Test Decrypt
                            </button>
                          )}
                          <Badge variant="purple">HEX</Badge>
                        </div>
                      </div>
                      <div className="relative group">
                        <TextArea
                          value={cipherOutput}
                          readOnly
                          placeholder="Encrypted result will appear here..."
                          className="h-32 font-mono text-sm bg-zinc-50/50 border-zinc-200/80 text-zinc-600"
                        />
                         {cipherOutput && (
                            <button 
                              onClick={() => copyToClipboard(cipherOutput)}
                              className="absolute top-2 right-2 p-1.5 bg-white border border-zinc-200 rounded-md text-zinc-400 hover:text-indigo-600 hover:border-indigo-200 transition-all opacity-0 group-hover:opacity-100"
                              title="Copy"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {operationMode === 'decrypt' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Card className="p-6 md:p-8 space-y-6 border-t-4 border-t-emerald-500">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Ciphertext Input
                        </label>
                        <Badge variant="purple">HEX String</Badge>
                      </div>
                      <TextArea
                        value={cipherInput}
                        onChange={(e) => setCipherInput(e.target.value)}
                        placeholder="Paste hexadecimal ciphertext here..."
                        className="h-32 font-mono text-sm"
                      />
                    </div>

                    {/* FIX: Disabled condition dilonggarkan */}
                    <Button onClick={handleDecrypt} variant="secondary" className="w-full py-4 text-base border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300" disabled={!key || !cipherInput}>
                      <Unlock className="w-5 h-5" /> Decrypt Message
                    </Button>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Decrypted Plaintext
                        </label>
                        <Badge variant="blue">UTF-8 Result</Badge>
                      </div>
                      <TextArea
                        value={plainOutput}
                        readOnly
                        placeholder="Decrypted message will appear here..."
                        className={`h-32 font-mono text-sm ${plainOutput.startsWith('Error') ? 'text-red-600 bg-red-50 border-red-200' : 'text-zinc-800'}`}
                      />
                    </div>
                  </Card>
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
             <div className="grid md:grid-cols-2 gap-6">
              
              {/* S-Box Properties Card */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Real-time Strength Verification
                    </h3>
                    
                    <Button 
                        onClick={verifySBoxStrength} 
                        variant="outline" 
                        className="text-xs h-8 min-w-[100px]"
                        disabled={isVerifying}
                    >
                       {isVerifying ? (
                           <>
                            <Loader2 className="w-3 h-3 animate-spin" /> Calculating...
                           </>
                       ) : (
                           <>
                            <RefreshCcw className="w-3 h-3" /> Verify Math
                           </>
                       )}
                    </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-zinc-600">Non-Linearity (NL)</span>
                      <Badge variant="success">112</Badge>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Theoretical value from paper. Matches AES standard.
                    </p>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-zinc-600">Strict Avalanche (SAC)</span>
                      
                      {isVerifying ? (
                          <span className="text-xs text-indigo-500 animate-pulse font-medium">Computing...</span>
                      ) : verificationStats ? (
                        <div className="text-right animate-in fade-in slide-in-from-right-4 duration-500">
                            <span className={`font-mono font-bold text-lg ${verificationStats.isBetterThanAES && algorithm === 'custom' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                                {verificationStats.sac.toFixed(5)}
                            </span>
                            <span className="text-[10px] text-zinc-400 block">
                                (Paper Claim: {algorithm === 'custom' ? '0.50073' : '0.50488'})
                            </span>
                        </div>
                      ) : (
                        <Badge variant="default">Click Verify</Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">
                      Calculated real-time. Ideal value is 0.5.
                    </p>
                    
                    {verificationStats && !isVerifying && (
                        <div className="text-[10px] bg-white p-2 rounded-lg border border-zinc-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex justify-between">
                                <span>Deviation form Ideal:</span>
                                <span className="font-mono">{verificationStats.deviation.toFixed(5)}</span>
                            </div>
                            {algorithm === 'custom' && verificationStats.isBetterThanAES && (
                                <div className="mt-1 text-emerald-600 font-bold flex items-center gap-1">
                                     <CheckCircle2 className="w-3 h-3" /> 
                                     Closer to 0.5 than Standard AES!
                                </div>
                            )}
                        </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-indigo-100 ring-4 ring-indigo-50/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                      <Binary className="w-5 h-5 text-indigo-600" />
                      Avalanche Visualizer
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Uses input from Encryption tab</p>
                  </div>
                  <Button onClick={runAnalysis} variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
                    Run Analysis
                  </Button>
                </div>

                {!avalancheData ? (
                  <div className="h-48 flex flex-col gap-2 items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-sm bg-zinc-50">
                    <Activity className="w-8 h-8 opacity-20" />
                    <span>Run encryption first, then click Analyze</span>
                  </div>
                ) : (
                  <AvalancheVisualizer originalHex={avalancheData.original} newHex={avalancheData.modified} />
                )}
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-zinc-800 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-zinc-500" />
                Internal State Matrix: {algorithm === 'custom' ? 'S-Box 44' : 'AES S-Box'}
              </h3>
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-[auto_repeat(16,1fr)] gap-px bg-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
                        <div className="bg-zinc-100 p-2 text-center text-[10px] font-bold text-zinc-500">/</div>
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className="bg-zinc-50 p-2 text-center text-[10px] font-bold text-zinc-500">{i.toString(16).toUpperCase()}</div>
                        ))}

                        {currentSBox.map((row, i) => (
                            <React.Fragment key={i}>
                                <div className="bg-zinc-50 p-2 text-center text-[10px] font-bold text-zinc-700">{i.toString(16).toUpperCase()}</div>
                                {row.map((val, j) => (
                                    <div key={j} className="bg-white p-1.5 text-center text-[10px] font-mono text-zinc-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-crosshair">
                                        {val.toString(16).padStart(2, '0').toUpperCase()}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;