import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  Smartphone,
  CreditCard,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Droplets,
  AlertOctagon,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { BillItem } from '../types';

interface HelpTabProps {
  bills: BillItem[];
  lang: 'am' | 'en' | 'both';
}

export const HelpTab: React.FC<HelpTabProps> = ({ bills, lang }) => {
  const [activeGuide, setActiveGuide] = useState<'telebirr' | 'cbe'>('telebirr');
  const [selectedBillForUssd, setSelectedBillForUssd] = useState<string>(
    bills[0]?.accountNumber || '10293845'
  );
  const [copiedUssd, setCopiedUssd] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Generate USSD code string
  const generatedUssd =
    activeGuide === 'telebirr'
      ? `*127*4*1*${selectedBillForUssd}#`
      : `*847*2*${selectedBillForUssd}#`;

  const handleCopyUssd = () => {
    navigator.clipboard?.writeText(generatedUssd);
    setCopiedUssd(true);
    setTimeout(() => setCopiedUssd(false), 2500);
  };

  const hotlines = [
    {
      nameAm: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU)',
      nameEn: 'Ethiopian Electric Utility',
      number: '905',
      desc: 'የመብራት መቆራረጥ እና የቆጣሪ ቅሬታዎች',
    },
    {
      nameAm: 'አዲስ አበባ ውሃና ፍሳሽ (AAWSA)',
      nameEn: 'Addis Ababa Water & Sewerage',
      number: '994',
      desc: 'የውሃ መስመር ብልሽት እና የቢል ማጣሪያ',
    },
    {
      nameAm: 'የትራፊክ ማኔጅመንት ኤጀንሲ (TMA)',
      nameEn: 'Traffic Management Agency',
      number: '8051 / 911',
      desc: 'የትራፊክ ቅጣት እና አደጋ ሪፖርት',
    },
    {
      nameAm: 'ቴሌብር የደንበኞች አገልግሎት',
      nameEn: 'Telebirr Customer Support',
      number: '127',
      desc: 'የቴሌብር ክፍያ እና የግብይት ጥያቄዎች',
    },
    {
      nameAm: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
      nameEn: 'Commercial Bank of Ethiopia',
      number: '951',
      desc: 'የሲቢኢ ብር (CBE Birr) የድጋፍ መስመር',
    },
  ];

  const faqs = [
    {
      qAm: 'ክፍያ ከፈጸምኩ በኋላ በስርዓቱ ላይ ለመታየት ስንት ጊዜ ይወስዳል?',
      qEn: 'How long does it take for payment to reflect?',
      aAm: 'በቴሌብር ወይም በCBE Birr የተፈጸመ ክፍያ በቅጽበት (በ1-3 ደቂቃ ውስጥ) በኤሌክትሪክና ውሃ ተቋማት ዳታቤዝ ላይ ይዘመናል። ስርዓቱ ቀሪ ሂሳብዎን ወዲያውኑ 0.00 ብር ያደርጋል።',
      aEn: 'Payments made via Telebirr or CBE Birr are processed and updated in the official database within 1-3 minutes.',
    },
    {
      qAm: 'የተሳሳተ የቆጣሪ ወይም የትራፊክ ቁጥር ከከፈልኩስ ምን ማድረግ አለብኝ?',
      qEn: 'What happens if I paid for an incorrect account number?',
      aAm: 'ክፍያው እንደተፈጸመ ወዲያውኑ የደረሰኝ ቁጥርዎን (Transaction ID) በመያዝ ወደ ተቋሙ የደንበኞች ማዕከል (EEU: 905 ወይም AAWSA: 994) ወይም ወደ ቴሌብር 127 ደውለው ማስተካከል ይችላሉ።',
      aEn: 'Contact the service hotline immediately with your Transaction Reference ID to request payment reconciliation.',
    },
    {
      qAm: 'የትራፊክ ቅጣት በ15 ቀናት ውስጥ ካልተከፈለ ምን ቅጣት አለው?',
      qEn: 'What are the penalties for overdue traffic fines?',
      aAm: 'የትራፊክ ቅጣት በ15 ቀናት ውስጥ ካልተከፈለ በየሳምንቱ 10% የዘገየ ቅጣት (Late penalty fee) የሚታከልበት ሲሆን፣ የመንጃ ፍቃድ እድሳትን ሊያግድ ይችላል።',
      aEn: 'Unpaid traffic fines incur a 10% weekly late penalty after 15 days and may restrict driver license renewal.',
    },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Header card */}
      <div className="rounded-2xl glass-card p-4 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <HelpCircle className="w-4 h-4" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            {lang === 'am'
              ? 'የክፍያ መመሪያ እና ድጋፍ'
              : lang === 'en'
              ? 'Settlement Guide & Help'
              : 'የክፍያ መመሪያ (Settlement Guide)'}
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          {lang === 'am'
            ? 'የመብራት፣ ውሃ እና ሌሎች የመንግስት ክፍያዎችን በቴሌብር እና በCBE Birr በቀላሉ የሚፈጽሙበት ዝርዝር መመሪያ።'
            : 'Detailed walkthrough for settling civic bills via Telebirr USSD/App and CBE Birr.'}
        </p>

        {/* Tab switcher: Telebirr vs CBE */}
        <div className="mt-3 grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveGuide('telebirr')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeGuide === 'telebirr'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>በቴሌብር (Telebirr)</span>
          </button>
          <button
            onClick={() => setActiveGuide('cbe')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeGuide === 'cbe'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>በCBE Birr</span>
          </button>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>
              {activeGuide === 'telebirr'
                ? 'የቴሌብር አከፋፈል ቅደም-ተከተል'
                : 'የCBE Birr አከፋፈል ቅደም-ተከተል'}
            </span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            {activeGuide === 'telebirr' ? 'USSD: *127#' : 'USSD: *847#'}
          </span>
        </div>

        {activeGuide === 'telebirr' ? (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-200">በሞባይልዎ *127# ይደውሉ</p>
                <p className="text-[11px] text-slate-400">
                  ወይም የቴሌብር መተግበሪያን (Telebirr SuperApp) ይክፈቱ።
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-200">"ክፍያ ፈጽም (Pay Bill)" የሚለውን ይምረጡ</p>
                <p className="text-[11px] text-slate-400">
                  በUSSD አማራጭ ቁጥር 4 ወይም በመተግበሪያው የመገልገያ ክፍያ (Utility) ምልክትን ይጫኑ።
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-200">የአገልግሎት ሰጪውን ይምረጡ</p>
                <p className="text-[11px] text-slate-400">
                  ኤሌክትሪክ (EEU)፣ ውሃና ፍሳሽ (AAWSA) ወይም የትራፊክ ቅጣት (TMA) ይምረጡ።
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <div>
                <p className="font-semibold text-slate-200">የቆጣሪ ቁጥር አስገብተው በPIN ያረጋግጡ</p>
                <p className="text-[11px] text-slate-400">
                  የሂሳብዎን መጠን ካረጋገጡ በኋላ ባለ 4-አሃዝ የቴሌብር ሚስጥር ቁጥርዎን ያስገቡ።
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-200">በስልክዎ *847# ይደውሉ</p>
                <p className="text-[11px] text-slate-400">
                  ወይም የCBE Birr / CBE Mobile Banking መተግበሪያን ይክፈቱ።
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-200">"ክፍያ (Pay Bill / Merchant)" የሚለውን ይጫኑ</p>
                <p className="text-[11px] text-slate-400">
                  የኢትዮጵያ ንግድ ባንክ የመገልገያ ክፍያ መለያ ቁጥር ይምረጡ።
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-200">የቆጣሪ ቁጥርዎን ያስገቡ</p>
                <p className="text-[11px] text-slate-400">
                  ባንኩ ወዲያውኑ የመጨረሻውን የክፍያ መጠን እና ስምዎን ያሳየዎታል።
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <div>
                <p className="font-semibold text-slate-200">የCBE Birr PIN ቁጥር በማስገባት ያጠናቁ</p>
                <p className="text-[11px] text-slate-400">
                  የክፍያ ማረጋገጫ የ短信 (SMS) መልዕክት በቅጽበት ይደርስዎታል።
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive USSD Generator & Quick Dial Tool */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/70 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {lang === 'am' ? 'ፈጣን የUSSD ኮድ ማዘጋጃ' : 'Instant USSD Code Dial'}
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          {lang === 'am'
            ? 'የሚከፍሉትን የቆጣሪ ቁጥር ይምረጡ፤ በቀጥታ የሚደወለውን የUSSD ኮድ በ1-ጠቅታ ይውሰዱ።'
            : 'Select account number to generate one-touch dial code.'}
        </p>

        {/* Account Selector */}
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-medium">
            የቆጣሪ / መለያ ቁጥር ይምረጡ:
          </label>
          <select
            value={selectedBillForUssd}
            onChange={(e) => setSelectedBillForUssd(e.target.value)}
            className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 outline-none"
          >
            {bills.map((b) => (
              <option key={b.id} value={b.accountNumber}>
                {b.accountNumber} ({b.customerName.slice(0, 16)} - {b.serviceType})
              </option>
            ))}
          </select>
        </div>

        {/* Output USSD Bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="font-mono font-bold text-sm sm:text-base text-emerald-400">
            {generatedUssd}
          </span>
          <button
            onClick={handleCopyUssd}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
          >
            {copiedUssd ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ተቀድቷል</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>ኮፒ (Copy)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Hotlines */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/60 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'am' ? 'የመንግሥትና ተቋማት የእርዳታ መስመሮች' : 'Official Civic Hotlines'}
          </span>
        </h3>

        <div className="grid grid-cols-1 gap-2 text-xs">
          {hotlines.map((h, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">
                  {lang === 'en' ? h.nameEn : h.nameAm}
                </h4>
                <p className="text-[11px] text-slate-400">{h.desc}</p>
              </div>
              <a
                href={`tel:${h.number.split('/')[0].trim()}`}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 text-emerald-400 font-mono font-bold text-xs border border-slate-700/80 flex items-center space-x-1"
              >
                <span>{h.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-slate-900/60 space-y-2">
        <h3 className="text-xs font-bold text-white mb-2">
          {lang === 'am' ? 'ተደጋጋሚ ጥያቄዎች (FAQ)' : 'Frequently Asked Questions'}
        </h3>
        {faqs.map((faq, idx) => {
          const isOpen = expandedFaq === idx;
          return (
            <div
              key={idx}
              className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40"
            >
              <button
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                className="w-full p-2.5 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
              >
                <span>{lang === 'en' ? faq.qEn : faq.qAm}</span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                )}
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2.5 pt-0 text-[11px] text-slate-400 border-t border-slate-800/50">
                  <p>{lang === 'en' ? faq.aEn : faq.aAm}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
