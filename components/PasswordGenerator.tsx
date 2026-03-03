
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Check, Hash, Type, Languages, ShieldCheck, Wand2 } from 'lucide-react';

interface Props {
  onApply: (password: string) => void;
}

const PasswordGenerator: React.FC<Props> = ({ onApply }) => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const charset: Record<string, string> = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (!characters) return;

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += characters[array[i] % characters.length];
    }
    setGeneratedPassword(result);
  }, [length, options]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (option: keyof typeof options) => {
    setOptions(prev => {
      const next = { ...prev, [option]: !prev[option] };
      // Ensure at least one option is selected
      if (!Object.values(next).some(v => v)) return prev;
      return next;
    });
  };

  return (
    <section className="glass p-8 rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <Wand2 className="w-5 h-5 text-purple-400" />
          Quantum Generator
        </h3>
        <button 
          onClick={generate}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
          title="Regenerate"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Output Area */}
        <div className="relative group">
          <div className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-2xl py-4 px-5 pr-24 mono text-lg text-purple-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {generatedPassword}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button 
              onClick={copyToClipboard}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-300 active:scale-90"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => onApply(generatedPassword)}
              className="p-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all text-white active:scale-90"
              title="Test in Scanner"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Entropy Length</span>
              <span className="text-purple-400">{length} Chars</span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => toggleOption('uppercase')}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.uppercase ? 'bg-purple-500/10 border-purple-500/50 text-purple-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}
            >
              <Type className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">ABC</span>
            </button>
            <button 
              onClick={() => toggleOption('lowercase')}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.lowercase ? 'bg-purple-500/10 border-purple-500/50 text-purple-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">abc</span>
            </button>
            <button 
              onClick={() => toggleOption('numbers')}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.numbers ? 'bg-purple-500/10 border-purple-500/50 text-purple-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}
            >
              <Hash className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">123</span>
            </button>
            <button 
              onClick={() => toggleOption('symbols')}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${options.symbols ? 'bg-purple-500/10 border-purple-500/50 text-purple-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}
            >
              <div className="text-sm font-bold">#$&</div>
              <span className="text-xs font-bold uppercase tracking-wider">Sym</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordGenerator;
