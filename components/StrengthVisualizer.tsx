
import React, { useState } from 'react';
import { PasswordStrength } from '../types';
import { COLORS } from '../constants';
import { Zap, Clock, ChevronDown, ChevronUp, Info, ShieldAlert } from 'lucide-react';

interface Props {
  score: number;
  label: PasswordStrength;
  entropy: number;
  crackingTime: string;
  isCommon: boolean;
}

const StrengthVisualizer: React.FC<Props> = ({ score, label, entropy, crackingTime, isCommon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBarColor = () => {
    if (isCommon) return 'bg-red-600';
    switch (label) {
      case PasswordStrength.VERY_STRONG: return COLORS.BG_VERY_STRONG;
      case PasswordStrength.STRONG: return COLORS.BG_STRONG;
      case PasswordStrength.MEDIUM: return COLORS.BG_MEDIUM;
      default: return COLORS.BG_WEAK;
    }
  };

  const getLabelColor = () => {
    if (isCommon) return 'text-red-500';
    switch (label) {
      case PasswordStrength.VERY_STRONG: return COLORS.VERY_STRONG;
      case PasswordStrength.STRONG: return COLORS.STRONG;
      case PasswordStrength.MEDIUM: return COLORS.MEDIUM;
      default: return COLORS.WEAK;
    }
  };

  const getEntropyQuality = (e: number) => {
    if (e < 28) return { label: 'Very Low', color: 'text-red-400' };
    if (e < 36) return { label: 'Low', color: 'text-orange-400' };
    if (e < 60) return { label: 'Fair', color: 'text-amber-400' };
    if (e < 128) return { label: 'Strong', color: 'text-emerald-400' };
    return { label: 'Military Grade', color: 'text-cyan-400' };
  };

  const entropyQuality = getEntropyQuality(entropy);

  return (
    <div className="space-y-4">
      {/* Primary Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className={`text-2xl font-black tracking-tighter uppercase ${getLabelColor()} neon-glow transition-colors duration-300`}>
            {isCommon ? 'COMPROMISED' : label.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className={`h-1.5 w-1.5 rounded-full ${isCommon ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Security Level {isCommon ? '0' : Math.floor(score / 25) + 1}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-all text-[10px] font-bold text-slate-400 uppercase tracking-wider"
        >
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Metrics
        </button>
      </div>

      {/* Main Progress Bar */}
      <div className="relative">
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)] ${getBarColor()}`}
            style={{ width: `${isCommon ? 5 : score}%` }}
          />
        </div>
        {/* Score marker tooltip-like indicator */}
        {!isCommon && (
           <div 
             className="absolute -top-6 transition-all duration-700" 
             style={{ left: `calc(${score}% - 12px)` }}
           >
             <span className="text-[9px] font-black bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600">
               {score}%
             </span>
           </div>
        )}
      </div>

      {/* Expandable Metrics Panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Entropy Detail Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 group hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-cyan-500">
                <Zap className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Information Entropy</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-slate-800 ${entropyQuality.color}`}>
                {entropyQuality.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black mono text-white">{entropy}</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bits</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 border-t border-slate-800/50 pt-2 mt-2">
              Measures the unpredictability of your character sequence. Higher bits mean exponential difficulty for crackers.
            </p>
          </div>

          {/* Crack Time Detail Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 group hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-500">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Brute Force ETA</span>
              </div>
              {isCommon && (
                <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-3xl font-black mono ${isCommon ? 'text-red-500' : 'text-white'}`}>
                {crackingTime}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 border-t border-slate-800/50 pt-2 mt-2">
              Estimated time to crack using a standard high-performance rig (100 billion guesses/sec).
            </p>
          </div>
        </div>

        {/* Deep Dive Tip */}
        <div className="mt-4 flex items-start gap-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
          <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-cyan-300/70 leading-relaxed italic">
            Tip: Increasing length by just 2 characters can increase your entropy score by over 12 bits, making it 4,000 times harder to crack.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrengthVisualizer;
