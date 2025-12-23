import React, { useState, useRef } from 'react';
import { Card, Button, Badge } from './UI';
import { Upload, Lock, Unlock, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { encryptData, decryptData, createInverseSBox } from '../utils/crypto';

const ImageEncryptionPanel = ({ sbox, algorithm }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [encryptedBlob, setEncryptedBlob] = useState(null);
  const [decryptedBlob, setDecryptedBlob] = useState(null);
  const [key, setKey] = useState('MySecretKey12345');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 8 * 1024 * 1024) {
        setError("File size exceeds 8MB limit");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setEncryptedBlob(null);
      setDecryptedBlob(null);
      setError('');
    }
  };

  const handleEncrypt = async () => {
    if (!file || !key) return;
    setIsProcessing(true);
    
    try {
      // 1. Read file as ArrayBuffer
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      // 2. Encrypt
      const encryptedBytes = encryptData(bytes, key, sbox);
      
      // 3. Create Blob for "Cipher Image" (It will look like noise)
      // Note: Browsers might not render random bytes as valid image, 
      // but we display it to show "corruption" or noise.
      // Often better to wrap in BMP header to force render, but for raw visualization:
      const blob = new Blob([encryptedBytes], { type: file.type });
      setEncryptedBlob(URL.createObjectURL(blob));
    } catch (err) {
      setError("Encryption failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedBlob) return;
    setIsProcessing(true);
    
    try {
      // 1. Fetch the blob data back
      const response = await fetch(encryptedBlob);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      // 2. Decrypt
      const invSbox = createInverseSBox(sbox);
      const decryptedBytes = decryptData(bytes, key, invSbox);
      
      // 3. Show Result
      const blob = new Blob([decryptedBytes], { type: file.type });
      setDecryptedBlob(URL.createObjectURL(blob));
    } catch (err) {
      setError("Decryption failed. Key might be wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <ImageIcon className="w-6 h-6 text-purple-500" /> Image Encryption & Decryption
           </h2>
           <p className="text-sm text-slate-400">Encrypt binary image data using current S-Box ({algorithm})</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div 
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-950/10 transition-all group"
        >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div className="flex flex-col items-center gap-2">
                <div className="p-4 rounded-full bg-slate-800 group-hover:bg-cyan-900/50 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
                </div>
                <div className="text-slate-300 font-medium">Click to upload image</div>
                <div className="text-xs text-slate-500">Max 8MB. JPG, PNG, WebP supported.</div>
            </div>
        </div>

        {/* Key Input */}
        <div className="bg-[#0a0a1f] p-4 rounded-lg border border-slate-700">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Encryption Key</label>
            <input 
                type="text" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-[#050510] border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none"
                placeholder="Enter secret key..."
            />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
            <Button 
                onClick={handleEncrypt} 
                disabled={!file || isProcessing}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-none text-white"
            >
                {isProcessing ? 'Processing...' : <><Lock className="w-4 h-4" /> Encrypt Image</>}
            </Button>
            <Button 
                onClick={handleDecrypt} 
                disabled={!encryptedBlob || isProcessing}
                variant="secondary"
                className="flex-1"
            >
                {isProcessing ? 'Processing...' : <><Unlock className="w-4 h-4" /> Decrypt Image</>}
            </Button>
        </div>

        {error && (
            <div className="p-3 rounded bg-red-900/20 border border-red-500/50 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        )}

        {/* Results Grid */}
        {(preview || encryptedBlob || decryptedBlob) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {preview && (
                    <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase">Original</div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-700 relative group">
                            <img src={preview} alt="Original" className="w-full h-full object-contain" />
                        </div>
                    </div>
                )}
                {encryptedBlob && (
                     <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase flex justify-between">
                            <span>Encrypted (Cipher)</span>
                            <Badge variant="warning">No Header</Badge>
                        </div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-red-500/30 relative">
                             {/* Note: Encrypted raw bytes usually won't display as valid image, showing a placeholder icon instead */}
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                <div className="text-center p-4">
                                    <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <div className="text-xs text-slate-500">Raw Encrypted Bytes</div>
                                    <div className="text-[10px] text-slate-600 mt-1">(Unviewable)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {decryptedBlob && (
                     <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase flex justify-between">
                            <span>Decrypted Result</span>
                            <Badge variant="success">Success</Badge>
                        </div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-emerald-500/30 relative">
                            <img src={decryptedBlob} alt="Decrypted" className="w-full h-full object-contain" />
                            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-emerald-400 backdrop-blur">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className="text-[10px] text-slate-500 bg-[#0a0a1f] p-3 rounded border border-slate-800">
            <strong>Program Limitations:</strong> Max 8MB file size. Encrypted result is processed in-memory. Large files might cause browser lag.
        </div>
      </div>
    </Card>
  );
};

export default ImageEncryptionPanel;