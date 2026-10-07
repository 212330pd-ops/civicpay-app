import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BillItem } from '../types';
import { SERVICE_METADATA } from '../data/mockBills';

interface PaymentModalProps {
  bill: BillItem;
  initialMethod: 'Telebirr' | 'CBE Birr';
  onClose: () => void;
  onPaymentSuccess: (billId: string, method: 'Telebirr' | 'CBE Birr', txId: string) => void;
  lang: 'am' | 'en' | 'both';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  bill,
  initialMethod,
  onClose,
  onPaymentSuccess,
  lang,
}) => {
  const [method, setMethod] = useState<'Telebirr' | 'CBE Birr'>(initialMethod);
  const [phone, setPhone] = useState('0911428891');
  const [pin, setPin] = useState('••••');
  const [pinDigits, setPinDigits] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  const meta = SERVICE_METADATA[bill.serviceType];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment transaction with gateway delay
    await new Promise((res) => setTimeout(res, 1200));

    const generatedTx =
      method === 'Telebirr'
        ? `TLB-${bill.serviceType.toUpperCase().slice(0, 3)}-${Math.floor(1000000 + Math.random() * 9000000)}`
        : `CBE-${bill.serviceType.toUpperCase().slice(0, 3)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    setTxId(generatedTx);
    setIsProcessing(false);
    setIsSuccess(true);

    // Blast celebratory confetti
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#eab308', '#f43f5e'],
      });
    } catch {
      // fallback
    }

    onPaymentSuccess(bill.id, method, generatedTx);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {lang === 'am' ? 'የክፍያ ማረጋገጫ' : 'Settle Utility Bill'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {meta.providerAm} • #{bill.accountNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handlePay} className="mt-4 space-y-4">
            {/* Amount Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                የሚከፈለው ሂሳብ (Total Settle Amount)
              </span>
              <div className="flex items-baseline justify-center space-x-1.5 mt-1">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {bill.amountDue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs font-bold text-emerald-400">ETB (ብር)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ደንበኛ: <span className="text-slate-200 font-semibold">{bill.customerName}</span>
              </p>
            </div>

            {/* Wallet Selection Tabs */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                የክፍያ ዘዴ ይምረጡ (Select Payment Wallet):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('Telebirr')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    method === 'Telebirr'
                      ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <span className="font-bold text-xs">ቴሌብር (Telebirr)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Ethio Telecom Mobile Money
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('CBE Birr')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    method === 'CBE Birr'
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    <span className="font-bold text-xs">CBE Birr</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Commercial Bank of Ethiopia
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {method} ስልክ ቁጥር (Mobile Number)
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0911234567"
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm font-mono rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* PIN Entry Simulation */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {method} ሚስጥር ቁጥር (4-Digit PIN)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={pinDigits}
                  onChange={(e) => setPinDigits(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 text-white text-sm font-mono tracking-widest rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:border-emerald-500 outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                የተጠበቀ የኢትዮጵያ ፋይናንስ ምስጠራ (Simulated 256-bit encryption)
              </span>
            </div>

            {/* Security Notice */}
            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                ክፍያዎ በቀጥታ ለ{meta.providerAm} ይተላለፋል። ምንም አይነት ተጨማሪ የአገልግሎት ክፍያ የለም።
              </span>
            </div>

            {/* Confirm Payment Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                method === 'Telebirr'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-950/60'
                  : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 shadow-purple-950/60'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ክፍያው በ{method} እየተረጋገጠ ነው...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    ክፍያውን አጽድቅ ({bill.amountDue.toFixed(2)} ETB በ{method})
                  </span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Payment Success Confirmation */
          <div className="mt-4 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                ክፍያው ተሳክቷል! (Payment Successful)
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {bill.amountDue.toFixed(2)} ETB በ{method} ተከፍሏል
              </h3>
              <p className="text-xs text-slate-400 mt-1">{meta.nameAm} ሙሉ በሙሉ ተጠናቋል።</p>
            </div>

            {/* Transaction Receipt snippet */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>የግብይት መለያ (Transaction ID):</span>
                <span className="font-mono text-emerald-400 font-bold">{txId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>የቆጣሪ / መለያ ቁጥር:</span>
                <span className="font-mono text-slate-200">{bill.accountNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>የተከፈለበት ቀንና ሰዓት:</span>
                <span className="text-slate-200">
                  {new Date().toISOString().replace('T', ' ').slice(0, 16)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>የከፋይ ስልክ:</span>
                <span className="text-slate-200 font-mono">{phone}</span>
              </div>
            </div>

            {/* SMS Simulation Badge */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-center space-x-1.5">
              <span>📩 የማረጋገጫ የ短信 (SMS) መልዕክት ወደ {phone} ተልኳል።</span>
            </div>

            {/* Done button */}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              ተመለስ (Return to Dashboard)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
