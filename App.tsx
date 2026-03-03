
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Cpu, ExternalLink, Info, AlertTriangle, ShieldX, BookOpen, Sparkles } from 'lucide-react';
import { calculateStrength } from './utils/passwordLogic';
import { analyzePasswordWithAI } from './services/geminiService';
import { PasswordStrength, SecurityScore, AIAnalysis } from './types';
import StrengthVisualizer from './components/StrengthVisualizer';
import PasswordGenerator from './components/PasswordGenerator';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [score, setScore] = useState<SecurityScore>(calculateStrength(''));
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to resolve "Cannot find namespace 'NodeJS'" error in frontend environments
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update real-time score and auto-trigger AI analysis
  useEffect(() => {
    const currentScore = calculateStrength(password);
    setScore(currentScore);
    
    // Clear AI analysis when password changes
    setAiAnalysis(null);

    // Debounced automatic AI analysis for passwords with some substance
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    
    if (password.length >= 6) {
      analysisTimeoutRef.current = setTimeout(() => {
        handleAIAnalysis();
      }, 1500); // Wait 1.5s after typing stops
    }

    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, [password]);

  const handleAIAnalysis = async () => {
    if (!password || password.length < 6) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePasswordWithAI(password);
      setAiAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyGenerated = (generated: string) => {
    setPassword(generated);
    setShowPassword(true);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
          <Shield className="w-10 h-10 text-cyan-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          SENTRYPASS
        </h1>
        <p className="text-slate-400 font-medium max-w-lg mx-auto">
          Cyber Resilience Analyzer & Security Educator.
          Powered by Cyber Warrior Club & Gemini AI.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Base Stats */}
        <div className="lg:col-span-7 space-y-6">
          <section className="glass p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {score.isCommon ? <ShieldX className="w-24 h-24 text-red-500" /> : <Lock className="w-24 h-24" />}
            </div>

            <div className="relative space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Input Sequence</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type a password to test..."
                    className={`w-full bg-slate-900/50 border-2 rounded-2xl py-4 px-6 text-xl mono focus:outline-none transition-all placeholder:text-slate-700 ${
                      score.isCommon ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-cyan-500/50'
                    }`}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-500 transition-colors p-2"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* PROMINENT WARNING BANNER */}
              {score.isCommon && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="bg-red-500 p-2 rounded-lg animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-red-500 font-black text-sm uppercase tracking-tighter">Compromised Password Detected</h4>
                    <p className="text-red-400/80 text-xs font-medium">This sequence is found in leaked databases and common lists. Using this is equivalent to having no password at all.</p>
                  </div>
                </div>
              )}

              <StrengthVisualizer 
                score={score.score} 
                label={score.label} 
                entropy={score.entropy} 
                crackingTime={score.crackingTime}
                isCommon={score.isCommon}
              />
            </div>
          </section>

          {/* Generator Tool */}
          <PasswordGenerator onApply={handleApplyGenerated} />

          {/* Suggestions List */}
          <section className="glass p-8 rounded-3xl shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-6">
              <Info className={`w-5 h-5 ${score.isCommon ? 'text-red-500' : 'text-amber-500'}`} />
              Security Feedback
            </h3>
            <ul className="space-y-3">
              {score.feedback.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${
                    item.includes("DANGER") ? 'bg-red-500 text-red-500' : 'bg-cyan-500 text-cyan-500'
                  }`} />
                  <span className={`text-sm leading-relaxed ${item.includes("DANGER") ? 'text-red-400 font-bold' : ''}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: AI Analysis & Education */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Status / Report Area */}
          <div className="space-y-6">
            {isAnalyzing && !aiAnalysis && (
              <div className="glass p-8 rounded-3xl animate-pulse flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-cyan-500/10 rounded-full">
                  <Cpu className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase tracking-widest text-xs">AI Deep Scan Active</h3>
                  <p className="text-slate-500 text-[10px] mt-1">Consulting Gemini for structural vulnerabilities...</p>
                </div>
              </div>
            )}

            {aiAnalysis && (
              <section className="glass p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl border-cyan-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-500/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">AI Intelligence Report</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Autonomous pattern detection</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Risk Assessment</h4>
                    <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-cyan-500 pl-4 bg-cyan-500/5 py-2 rounded-r-lg">
                      "{aiAnalysis.riskAssessment}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Technical Context</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {aiAnalysis.bruteForceExplanation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Hardening Strategies</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.customSuggestions.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-[11px] font-medium text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* General Education */}
          <section className="glass p-8 rounded-3xl border-slate-800/50">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Cyber Academy
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 mb-1">What is Brute-Force?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Attackers use software to try millions of character combinations per second until they crack your password. Length is your best defense.
                </p>
              </div>
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 mb-1">The 3-Word Strategy</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instead of one complex word, use three random words joined together (e.g., <code className="text-cyan-400">Correct!Horse?Battery-Staple</code>).
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/50 py-4 px-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${score.isCommon ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-emerald-500 shadow-[0_0_8px_green]'}`} />
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Scanner Active</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-slate-500 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
