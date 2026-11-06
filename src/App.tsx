import React, { useState, useEffect } from "react";
import { Camera, Heart, Activity, ShieldCheck, RefreshCw, Eye } from "lucide-react";

export default function App() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [signals, setSignals] = useState({ pulse: 72, breathing: 14, hrv: 55, mood: "Calm" });

  useEffect(() => {
    if (!hasConsent || isCalibrating) return;

    const interval = setInterval(() => {
      setSignals((prev) => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        const nextPulse = Math.max(60, Math.min(100, prev.pulse + drift));
        const nextHRV = nextPulse > 80 ? Math.max(30, prev.hrv - 2) : Math.min(80, prev.hrv + 2);
        
        return {
          pulse: nextPulse,
          breathing: Math.max(12, Math.min(20, prev.breathing + (Math.random() > 0.7 ? drift : 0))),
          hrv: nextHRV,
          mood: nextPulse > 82 ? "Stressed" : nextPulse < 68 ? "Deeply Relaxed" : "Calm",
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [hasConsent, isCalibrating]);

  const handleConsent = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setHasConsent(true);
    }, 3000);
  };

  const getThemeStyles = () => {
    if (!hasConsent) return "from-slate-900 to-slate-950 text-slate-100";
    if (signals.mood === "Stressed") return "from-rose-950 via-slate-900 to-slate-950 text-rose-100 border-rose-500/20";
    if (signals.mood === "Deeply Relaxed") return "from-emerald-950 via-slate-900 to-slate-950 text-emerald-100 border-emerald-500/20";
    return "from-blue-950 via-slate-900 to-slate-950 text-blue-100 border-blue-500/20";
  };

  return (
    <div className={`min-h-screen bg-gradient-to-tr ${getThemeStyles()} p-6 transition-all duration-1000 font-sans flex flex-col justify-between`}>
      
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
          <span className="text-xl font-bold tracking-wider">HUMAPP</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> On-Device Processing</span>
          <span className="px-2 py-1 bg-white/5 rounded text-xs border border-white/10">v1.0.0 - SmartSpectra Challenge</span>
        </div>
      </header>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 my-auto py-8">
        
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between min-h-[350px]">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" /> Biometric Video Sensor
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Humapp handles your camera stream to isolate raw physiological signals using photoplethysmography (rPPG). No video feeds are recorded or leaves your browser.
            </p>
          </div>

          {!hasConsent ? (
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 text-center my-4 flex-1 flex flex-col justify-center items-center gap-4">
              {isCalibrating ? (
                <>
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-xs text-cyan-400 uppercase tracking-widest animate-pulse">Initializing Presage SDK...</p>
                </>
              ) : (
                <>
                  <Eye className="w-8 h-8 text-slate-500" />
                  <p className="text-xs text-slate-400">Camera inactive. Awaiting authorization.</p>
                </>
              )}
            </div>
          ) : (
            <div className="relative bg-slate-950 rounded-xl my-4 flex-1 overflow-hidden border-2 border-cyan-500/30 flex items-center justify-center min-h-[180px]">
              <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-emerald-400 tracking-wider uppercase font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Analyzing Stream
              </div>
              <p className="text-xs text-slate-500 text-center px-4">[ Simulating isolated client-side camera data matrix ]</p>
            </div>
          )}

          {!hasConsent && !isCalibrating && (
            <button
              onClick={handleConsent}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-600/20 active:scale-[0.98]"
            >
              Grant Camera Permission
            </button>
          )}
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-wider text-slate-400">Heart Rate</span>
              <Heart className={`w-5 h-5 ${hasConsent ? "text-rose-500 animate-bounce" : "text-slate-600"}`} />
            </div>
            <div className="my-4">
              <span className="text-5xl font-extrabold tracking-tight">{hasConsent ? signals.pulse : "--"}</span>
              <span className="text-sm ml-2 text-slate-400 font-medium">BPM</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 transition-all duration-500" 
                style={{ width: hasConsent ? `${(signals.pulse / 120) * 100}%` : "0%" }} 
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-wider text-slate-400">Breathing Rate</span>
              <Activity className={`w-5 h-5 ${hasConsent ? "text-blue-400 animate-pulse" : "text-slate-600"}`} />
            </div>
            <div className="my-4">
              <span className="text-5xl font-extrabold tracking-tight">{hasConsent ? signals.breathing : "--"}</span>
              <span className="text-sm ml-2 text-slate-400 font-medium">/ min</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all duration-500" 
                style={{ width: hasConsent ? `${(signals.breathing / 25) * 100}%` : "0%" }} 
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-wider text-slate-400">Heart Rate Variability (HRV)</span>
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">Vitals</span>
            </div>
            <div className="my-4">
              <span className="text-5xl font-extrabold tracking-tight">{hasConsent ? signals.hrv : "--"}</span>
              <span className="text-sm ml-2 text-slate-400 font-medium">ms</span>
            </div>
            <p className="text-xs text-slate-400">High values reflect balanced nervous system responses.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium uppercase tracking-wider text-slate-400">UI Generative Mood</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow" />
            </div>
            <div className="my-4">
              <span className="text-2xl font-bold tracking-tight text-white block">
                {hasConsent ? signals.mood : "Awaiting Input"}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {hasConsent ? "The interface colors dynamically realign with your profile." : "Activate telemetry metrics to toggle view states."}
              </span>
            </div>
            <div className="text-xs font-mono text-cyan-400/70">
              [Theme_State: {hasConsent ? signals.mood.toUpperCase().replace(/ /g, "_") : "IDLE"}]
            </div>
          </div>

        </div>
      </div>

      <footer className="max-w-6xl w-full mx-auto border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 Copyright Humapp Project - Shahadah Studios Elite | Designed for the Presage SmartSpectra SDK Challenge.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Framework</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Presage SmartSpectra Core</a>
        </div>
      </footer>
    </div>
  );
}
