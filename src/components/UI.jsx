import React from 'react';

// Card dengan efek Glassmorphism + Neon Border
export const Card = ({ children, className = "" }) => (
  <div className={`bg-[#0f1020]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)] transition-all duration-300 hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)] hover:border-cyan-400/50 ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = "primary", className = "", disabled=false }) => {
  const base = "px-4 py-2.5 rounded-lg font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Tombol Utama (Cyan Neon)
    primary: "bg-cyan-600/20 text-cyan-100 border border-cyan-500 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]",
    // Tombol Sekunder (Dark)
    secondary: "bg-[#0a0a1f] border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400",
    // Tombol Ghost
    ghost: "text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/10",
    // Tombol Outline
    outline: "border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-950/30",
    // Tombol Danger (Red Neon)
    danger: "bg-red-900/20 text-red-400 border border-red-900/50 hover:border-red-500 hover:text-red-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ value, onChange, placeholder, type="text", maxLength, className="" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    maxLength={maxLength}
    placeholder={placeholder}
    className={`w-full px-3 py-2.5 bg-[#050510] border border-slate-700 text-cyan-100 rounded-lg text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all duration-200 ${className}`}
  />
);

export const TextArea = ({ value, onChange, placeholder, className="", readOnly=false }) => (
  <textarea
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    placeholder={placeholder}
    className={`w-full p-3 border rounded-lg text-sm focus:outline-none transition-all duration-200 resize-none font-mono
      ${readOnly 
        ? 'bg-[#0a0a15] border-slate-800 text-slate-500 cursor-default' 
        : 'bg-[#050510] border-slate-700 text-cyan-100 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]'} 
      ${className}`}
  />
);

export const Badge = ({ children, variant="default" }) => {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-600",
    success: "bg-emerald-900/30 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    warning: "bg-amber-900/30 text-amber-400 border-amber-500/30",
    purple: "bg-purple-900/30 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    blue:   "bg-blue-900/30 text-blue-400 border-blue-500/30",
    cyan:   "bg-cyan-900/30 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded border text-[10px] md:text-xs font-mono font-semibold tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
};