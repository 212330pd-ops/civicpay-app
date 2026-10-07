import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  QrCode,
  Download,
  Building,
} from 'lucide-react';
import { BillItem } from '../types';
import { SERVICE_METADATA } from '../data/mockBills';

interface ReceiptModalProps {
  bill: BillItem;
  onClose: () => void;
  lang: 'am' | 'en' | 'both';
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ bill, onClose, lang }) => {
  const [copied, setCopied] = useState(false);
  const meta = SERVICE_METADATA[bill.serviceType];
  const refCode = bill.paymentReference || `REC-ET-${bill.accountNumber.slice(0, 6)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              {lang === 'am' ? 'ዲጂታል የክፍያ ደረሰኝ' : 'Digital Civic Receipt'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden shadow-inner print:bg-white print:text-black">
          {/* Subtle Paid Watermark Stamp */}
          <div className="absolute right-4 top-16 -rotate-12 border-2 border-emerald-500/30 rounded-xl px-3 py-1 pointer-events-none select-none">
            <span className="text-emerald-400/40 font-black text-xl tracking-widest uppercase">
              PAID • ተከፍሏል
            </span>
          </div>

          {/* Ethiopian Civic Institution Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-800">
            <div className="inline-block p-1 rounded-full bg-slate-900 mb-1 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400">🇪🇹 FDRE CIVIC PORTAL</span>
            </div>
            <h4 className="font-extrabold text-sm text-white tracking-wide">{meta.providerAm}</h4>
            <p className="text-[11px] text-slate-400">{meta.providerEn}</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">
              ደረሰኝ ቁጥር (Receipt No): {refCode}
            </p>
          </div>

          {/* Details Table */}
          <div className="py-3 space-y-2 text-xs border-b border-dashed border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">የደንበኛ ስም (Customer):</span>
              <span className="font-semibold text-slate-200">{bill.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">የቆጣሪ / ሰሌዳ ቁጥር:</span>
              <span className="font-mono text-slate-200 font-bold">{bill.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">የአገልግሎት ዓይነት:</span>
              <span className="text-slate-200">{meta.nameAm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">የተከፈለበት ቀን:</span>
              <span className="text-slate-200">
                {bill.paidAt || new Date().toISOString().replace('T', ' ').slice(0, 16)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">የክፍያ ቻናል:</span>
              <span className="text-emerald-400 font-semibold">{bill.paidVia || 'Telebirr Wallet'}</span>
            </div>
          </div>

          {/* Itemized Breakdown */}
          <div className="py-3 space-y-1.5 text-xs border-b border-dashed border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              የክፍያ ዝርዝር መረጃ (Breakdown)
            </span>
            {bill.breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-400 text-[11px]">
                <span>{item.labelAm}</span>
                <span className="font-mono text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Total Paid Row */}
          <div className="pt-3 pb-2 flex justify-between items-baseline">
            <span className="font-bold text-xs uppercase text-slate-300">ጠቅላላ የተከፈለ ሂሳብ:</span>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-400 font-mono">
                {bill.amountDue.toFixed(2)} ETB
              </span>
              <span className="text-[10px] text-slate-400 block">የተከፈለ / Fully Settled</span>
            </div>
          </div>

          {/* Verification Barcode / QR placeholder */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded bg-white p-0.5 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-black" />
              </div>
              <div>
                <span className="block font-medium text-slate-400">ዲጂታል ትክክለኛነት ማረጋገጫ</span>
                <span>በኢትዮጵያ መንግስት ዳታቤዝ የተረጋገጠ</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-slate-600">SECURE #9102-ET</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>ተቀድቷል</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>ቁጥር ኮፒ (Copy)</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-md shadow-emerald-950"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>አትም / ደረሰኝ (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
