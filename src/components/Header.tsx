import React from 'react';
import { Sparkles, ShieldCheck, Moon, Globe, Zap } from 'lucide-react';

interface HeaderProps {
  lang: 'am' | 'en' | 'both';
  setLang: (lang: 'am' | 'en' | 'both') => void;
  unpaidCount: number;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, unpaidCount }) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            {/* Ethiopian flag color micro-accent */}
            <div className="absolute -bottom-1 -right-1 flex space-x-0.5 bg-slate-900 px-1 py-0.5 rounded-full border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1">
                CivicPay <span className="text-emerald-400 font-extrabold">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'en'
                ? 'Civic & Utility Bill Manager'
                : lang === 'am'
                ? 'የህዝብ አገልግሎት እና ቢል ማጣሪያ'
                : 'የህዝብ አገልግሎት ማጣሪያ (Utility Manager)'}
            </p>
          </div>
        </div>

        {/* AI Ready Badge & Language Switch */}
        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wide">
              {lang === 'am' ? 'AI ዝግጁ ነው' : lang === 'en' ? 'AI Ready' : 'AI System Ready'}
            </span>
          </div>

          {/* Language selector toggle */}
          <button
            onClick={() => {
              if (lang === 'both') setLang('am');
              else if (lang === 'am') setLang('en');
              else setLang('both');
            }}
            title="ቋንቋ ቀይር / Switch Language"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span className="uppercase text-[11px] font-bold">
              {lang === 'am' ? 'አማ' : lang === 'en' ? 'EN' : 'ሁለቱም'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
