import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Zap,
  Droplets,
  ShieldAlert,
  Building2,
  Radio,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BookmarkPlus,
  CreditCard,
  Volume2,
  VolumeX,
  RefreshCw,
  Info,
} from 'lucide-react';
import { BillItem, ParsedBillResult, ServiceType } from '../types';
import { parseQueryWithAI, SAMPLE_PROMPTS } from '../utils/aiParser';
import { SERVICE_METADATA } from '../data/mockBills';

interface LookupTabProps {
  bills: BillItem[];
  onSaveToMyBills: (bill: BillItem) => void;
  onPayBill: (bill: BillItem, method: 'Telebirr' | 'CBE Birr') => void;
  onViewReceipt: (bill: BillItem) => void;
  lang: 'am' | 'en' | 'both';
}

export const LookupTab: React.FC<LookupTabProps> = ({
  bills,
  onSaveToMyBills,
  onPayBill,
  onViewReceipt,
  lang,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedBillResult | null>(null);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Voice simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const timerRef = useRef<any>(null);

  // Available simulated voice phrases
  const simulatedVoicePhrases = [
    'የመብራት ቁጥሬ 10293845 ነው፤ ስንት ደረሰ?',
    'የውሃ ቢል 4455823 ቁጥር ስንት ደረሰ?',
    'የትራፊክ ቅጣት AA-2-B49102 ሰሌዳ አለብኝ?',
    'የቦሌ ክፍለ ከተማ የቤት ታክስ BL-TAX-2024 ማጣራት',
  ];

  // Voice recording simulation timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 3) {
            // After 3 seconds of "listening", auto-transcribe a voice prompt
            handleVoiceComplete();
            return 3;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  const handleVoiceComplete = (chosenText?: string) => {
    setIsRecording(false);
    const spokenText =
      chosenText ||
      simulatedVoicePhrases[Math.floor(Math.random() * simulatedVoicePhrases.length)];
    setQuery(spokenText);
    executeLookup(spokenText);
  };

  const executeLookup = async (textToSearch?: string) => {
    const text = (textToSearch !== undefined ? textToSearch : query).trim();
    if (!text) return;

    setIsSearching(true);
    setSavedSuccess(false);

    try {
      const result = await parseQueryWithAI(text, bills);
      setParsedResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChipClick = (chipQuery: string) => {
    setQuery(chipQuery);
    executeLookup(chipQuery);
  };

  const handleCopy = (acc: string) => {
    navigator.clipboard?.writeText(acc);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  // Check if result is already in user's saved bills
  const isAlreadySaved =
    parsedResult &&
    bills.some(
      (b) =>
        b.accountNumber.toLowerCase() === parsedResult.accountNumber.toLowerCase() &&
        b.serviceType === parsedResult.serviceType
    );

  const handleSaveResult = () => {
    if (!parsedResult) return;

    const newBill: BillItem = {
      id: `BILL-${parsedResult.serviceType.toUpperCase()}-${parsedResult.accountNumber}`,
      serviceType: parsedResult.serviceType,
      accountNumber: parsedResult.accountNumber,
      customerName: parsedResult.customerName,
      customerPhone: '+251 91 142 8891',
      amountDue: parsedResult.amountDue,
      status: parsedResult.status,
      dueDate: parsedResult.dueDate,
      dueDateAmharic: parsedResult.dueDateAmharic,
      issueDate: new Date().toISOString().split('T')[0],
      billingPeriod: 'መስከረም 2019 / Current Cycle',
      breakdown: parsedResult.breakdown,
      notes: `${parsedResult.serviceNameAm} በCivicPay AI የተመዘገበ`,
    };

    onSaveToMyBills(newBill);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const playVoiceReadout = () => {
    if (!parsedResult) return;
    setAudioPlaying(true);

    // Use Web Speech API if supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${parsedResult.serviceNameAm}። የሂሳብ ቁጥር ${parsedResult.accountNumber}። የክፍያ መጠን ${parsedResult.amountDue} ብር። ሁኔታው ያልተከፈለ ነው።`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(false), 3000);
    }
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'electricity':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'traffic':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'property_tax':
        return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'telecom':
        return <Radio className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-4 border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 shadow-lg">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'am'
                  ? 'የኢትዮጵያ ስማርት ቢል ማጣሪያ'
                  : lang === 'en'
                  ? 'Ethiopian Smart Civic Parser'
                  : 'የኢትዮጵያ ስማርት ቢል ማጣሪያ (Smart Parser)'}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {lang === 'am'
                ? 'የማዘጋጃ ቤት እና የመገልገያ ቢል ማጣሪያ'
                : lang === 'en'
                ? 'Check Civic & Utility Bills Instantly'
                : 'የመገልገያ ቢል ማጣሪያ (Instant Lookup)'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {lang === 'am'
                ? 'የመብራት፣ የውሃ፣ የትራፊክ ቅጣት እና ታክስ ቁጥርዎን በድምጽ ወይም በጽሑፍ ያስገቡ።'
                : lang === 'en'
                ? 'Query Electricity (EEU), Water (AAWSA), Traffic Fines, or Taxes via text or voice.'
                : 'የመብራት፣ ውሃ፣ ትራፊክ እና ታክስ ቁጥርዎን በድምጽ ወይም በጽሑፍ ያስገቡ።'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Area with Text & Voice */}
      <div className="glass-card rounded-2xl p-3.5 border border-slate-800 bg-slate-900/70 shadow-md">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                executeLookup();
              }
            }}
            placeholder={
              lang === 'am'
                ? 'ለምሳሌ፡ የመብራት ቁጥሬ 10293845 ነው፤ ስንት ደረሰ?'
                : lang === 'en'
                ? 'e.g., My electric meter is 10293845, what is due?'
                : 'ለምሳሌ፡ የመብራት ቁጥሬ 10293845 ነው፤ ስንት ደረሰ?'
            }
            className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-24 py-3 border border-slate-700/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
          />

          {/* Right Action Icons (Mic & Clear/Search) */}
          <div className="absolute right-2 flex items-center space-x-1.5">
            {/* Microphone Toggle Button */}
            <button
              onClick={toggleRecording}
              title={isRecording ? 'ማዳመጥ አቁም / Stop Voice' : 'በድምጽ ተናገር / Voice Input'}
              className={`relative p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-950 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Check Bill Button */}
            <button
              onClick={() => executeLookup()}
              disabled={isSearching || !query.trim()}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-medium transition-colors shadow-md shadow-emerald-950 cursor-pointer"
              title="ቢል አጣራ / Check Bill"
            >
              {isSearching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Voice Active Recording Visualizer Banner */}
        {isRecording && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-rose-500/30 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-xs font-semibold text-rose-300">
                  {lang === 'am' ? 'እየሰማሁ ነው...' : lang === 'en' ? 'Listening...' : 'እየሰማሁ ነው... (Listening)'}
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  0:0{recordingSeconds}s
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {lang === 'am' ? 'አንድ ቃል ይናገሩ' : 'Speak clearly or pick below'}
              </span>
            </div>

            {/* Simulated Live Audio Waveform */}
            <div className="flex items-center justify-center space-x-1.5 py-1">
              {[40, 75, 55, 95, 60, 85, 45, 90, 65, 35, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.max(12, (h * (recordingSeconds % 2 === 0 ? 0.9 : 1.3)) / 2.5)}px`,
                  }}
                />
              ))}
            </div>

            {/* Quick voice simulation suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 w-full">
                {lang === 'am' ? 'ፈጣን የድምጽ ምሳሌዎች:' : 'Quick voice test simulations:'}
              </span>
              {simulatedVoicePhrases.slice(0, 3).map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVoiceComplete(phrase)}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800/80 hover:bg-rose-950 hover:border-rose-500/40 border border-slate-700/60 text-slate-200 transition-colors cursor-pointer text-left truncate max-w-full"
                >
                  🎙️ {phrase}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick prompt template chips */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400">
              {lang === 'am'
                ? 'ፈጣን መጠይቆች:'
                : lang === 'en'
                ? 'Quick templates:'
                : 'ፈጣን መጠይቆች (Quick Templates):'}
            </span>
            <span className="text-[10px] text-slate-500">ጠቅ በማድረግ ይሞክሩ</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(sample.query)}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 hover:border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'en' ? sample.labelEn : sample.labelAm}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-3">
          <button
            onClick={() => executeLookup()}
            disabled={isSearching || !query.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>
                  {lang === 'am'
                    ? 'ከመንግሥት ዳታቤዝ በAI እየተጣራ ነው...'
                    : 'Querying official civic registry...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>
                  {lang === 'am'
                    ? 'ቢል አጣራ (Check Bill)'
                    : lang === 'en'
                    ? 'Check Bill'
                    : 'ቢል አጣራ (Check Bill)'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Parsing & Structured Result Card */}
      {parsedResult && (
        <div className="glass-card-glow rounded-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          {/* Card Header & Service Badge */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                {getServiceIcon(parsedResult.serviceType)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {lang === 'en' ? parsedResult.serviceNameEn : parsedResult.serviceNameAm}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {parsedResult.serviceType.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'en' ? parsedResult.providerEn : parsedResult.providerAm}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                parsedResult.status === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {parsedResult.status === 'paid' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'am' ? 'የተከፈለ / Paid' : 'Paid'}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'am' ? 'ያልተከፈለ / Pending' : 'Pending'}</span>
                </>
              )}
            </div>
          </div>

          {/* Account Number & Customer Details */}
          <div className="grid grid-cols-2 gap-2 py-3 border-b border-slate-800 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-medium">
                {lang === 'am' ? 'የቆጣሪ / መታወቂያ ቁጥር' : 'Account / Ref No.'}
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-mono font-bold text-slate-100 text-xs sm:text-sm">
                  {parsedResult.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(parsedResult.accountNumber)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                  title="ኮፒ አድርግ / Copy"
                >
                  {copiedAcc ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-medium">
                {lang === 'am' ? 'የተጠቃሚ ስም' : 'Customer Name'}
              </span>
              <span className="font-semibold text-slate-200 text-xs truncate block mt-0.5">
                {parsedResult.customerName}
              </span>
            </div>
          </div>

          {/* Amount Due Highlight Banner */}
          <div className="my-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">
                {lang === 'am'
                  ? 'የክፍያ መጠን (Amount Due)'
                  : lang === 'en'
                  ? 'Amount Due'
                  : 'የክፍያ መጠን (Amount Due)'}
              </span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {parsedResult.amountDue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs font-bold text-emerald-400">ETB (ብር)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">
                {lang === 'am' ? 'የመክፈያ ማብቂያ ቀን:' : 'Due Date:'}
              </span>
              <span className="text-xs font-bold text-amber-300 block">
                {parsedResult.dueDateAmharic}
              </span>
              <span className="text-[10px] text-slate-500">({parsedResult.dueDate})</span>
            </div>
          </div>

          {/* Itemized Breakdown List */}
          <div className="space-y-1.5 py-2">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {lang === 'am' ? 'ዝርዝር መግለጫ (Itemized Breakdown):' : 'Itemized Breakdown:'}
            </span>
            <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5">
              {parsedResult.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    {lang === 'en' ? item.labelEn : item.labelAm}
                  </span>
                  <span className="font-semibold text-slate-200 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Voice Readout & Confidence info */}
          <div className="flex items-center justify-between py-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI ትክክለኛነት ምዘና: {(parsedResult.confidence * 100).toFixed(0)}%</span>
            </div>

            <button
              onClick={playVoiceReadout}
              className="inline-flex items-center space-x-1 text-slate-300 hover:text-emerald-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 cursor-pointer transition-colors"
            >
              {audioPlaying ? (
                <VolumeX className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{audioPlaying ? 'እያነበበ ነው...' : 'ድምፅ አሰማ (Read Out)'}</span>
            </button>
          </div>

          {/* Action Buttons: Pay via Telebirr / CBE Birr & Save */}
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
            {parsedResult.status === 'unpaid' ? (
              <div className="grid grid-cols-2 gap-2">
                {/* Telebirr Pay Button */}
                <button
                  onClick={() =>
                    onPayBill(
                      {
                        id: `BILL-${parsedResult.serviceType.toUpperCase()}-${parsedResult.accountNumber}`,
                        serviceType: parsedResult.serviceType,
                        accountNumber: parsedResult.accountNumber,
                        customerName: parsedResult.customerName,
                        amountDue: parsedResult.amountDue,
                        status: parsedResult.status,
                        dueDate: parsedResult.dueDate,
                        dueDateAmharic: parsedResult.dueDateAmharic,
                        breakdown: parsedResult.breakdown,
                      },
                      'Telebirr'
                    )
                  }
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-950 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>በቴሌብር ክፈል (Telebirr)</span>
                </button>

                {/* CBE Birr Pay Button */}
                <button
                  onClick={() =>
                    onPayBill(
                      {
                        id: `BILL-${parsedResult.serviceType.toUpperCase()}-${parsedResult.accountNumber}`,
                        serviceType: parsedResult.serviceType,
                        accountNumber: parsedResult.accountNumber,
                        customerName: parsedResult.customerName,
                        amountDue: parsedResult.amountDue,
                        status: parsedResult.status,
                        dueDate: parsedResult.dueDate,
                        dueDateAmharic: parsedResult.dueDateAmharic,
                        breakdown: parsedResult.breakdown,
                      },
                      'CBE Birr'
                    )
                  }
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-950 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>በCBE Birr ክፈል</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  onViewReceipt({
                    id: `BILL-${parsedResult.serviceType.toUpperCase()}-${parsedResult.accountNumber}`,
                    serviceType: parsedResult.serviceType,
                    accountNumber: parsedResult.accountNumber,
                    customerName: parsedResult.customerName,
                    amountDue: parsedResult.amountDue,
                    status: parsedResult.status,
                    dueDate: parsedResult.dueDate,
                    dueDateAmharic: parsedResult.dueDateAmharic,
                    breakdown: parsedResult.breakdown,
                    paidVia: 'Telebirr',
                    paidAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  })
                }
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ደረሰኝ እይ / አትም (View Paid Receipt)</span>
              </button>
            )}

            {/* Save to My Bills Action */}
            <button
              onClick={handleSaveResult}
              disabled={isAlreadySaved || savedSuccess}
              className={`w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                savedSuccess || isAlreadySaved
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
            >
              {savedSuccess || isAlreadySaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {lang === 'am'
                      ? 'በ"የእኔ ቢሎች" ውስጥ ተቀምጧል'
                      : 'Saved in My Bills'}
                  </span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {lang === 'am'
                      ? 'ወደ "የእኔ ቢሎች" አስቀምጥ (Save to My Bills)'
                      : 'Save to My Bills'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
