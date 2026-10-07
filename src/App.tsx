import React, { useState } from 'react';
import {
  Search,
  Receipt,
  HelpCircle,
  Zap,
  Droplets,
  ShieldAlert,
  Building2,
  Calendar,
  Sparkles,
  Phone,
  CheckCircle,
} from 'lucide-react';
import { ActiveTab, BillItem } from './types';
import { INITIAL_MOCK_BILLS } from './data/mockBills';
import { Header } from './components/Header';
import { LookupTab } from './components/LookupTab';
import { MyBillsTab } from './components/MyBillsTab';
import { HelpTab } from './components/HelpTab';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lookup');
  const [bills, setBills] = useState<BillItem[]>(INITIAL_MOCK_BILLS);
  const [lang, setLang] = useState<'am' | 'en' | 'both'>('am');

  // Modal states
  const [selectedBillForPay, setSelectedBillForPay] = useState<{
    bill: BillItem;
    method: 'Telebirr' | 'CBE Birr';
  } | null>(null);
  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState<BillItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveToMyBills = (newBill: BillItem) => {
    // If bill already exists, update it, else prepend
    setBills((prev) => {
      const existsIndex = prev.findIndex(
        (b) =>
          b.accountNumber.toLowerCase() === newBill.accountNumber.toLowerCase() &&
          b.serviceType === newBill.serviceType
      );
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newBill;
        return copy;
      }
      return [newBill, ...prev];
    });
    showToast(
      lang === 'am'
        ? `ቢል #${newBill.accountNumber} በ"የእኔ ቢሎች" ተመዝግቧል!`
        : `Bill #${newBill.accountNumber} saved to My Bills!`
    );
  };

  const handlePayBill = (bill: BillItem, method: 'Telebirr' | 'CBE Birr') => {
    setSelectedBillForPay({ bill, method });
  };

  const handlePaymentSuccess = (billId: string, method: 'Telebirr' | 'CBE Birr', txId: string) => {
    const paidTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId || b.accountNumber === selectedBillForPay?.bill.accountNumber) {
          return {
            ...b,
            status: 'paid',
            paidAt: paidTime,
            paidVia: method,
            paymentReference: txId,
          };
        }
        return b;
      })
    );
    showToast(
      lang === 'am'
        ? `ክፍያዎ በ${method} ተሳክቷል! የግብይት ቁጥር: ${txId}`
        : `Settled via ${method}! Ref: ${txId}`
    );
  };

  const handleDeleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    showToast(lang === 'am' ? 'ቢሉ ተሰርዟል' : 'Bill removed');
  };

  const handleAddNewBill = (bill: BillItem) => {
    setBills((prev) => [bill, ...prev]);
    showToast(
      lang === 'am'
        ? `አዲስ ቢል #${bill.accountNumber} ተመዝግቧል!`
        : `New bill #${bill.accountNumber} registered!`
    );
  };

  const unpaidCount = bills.filter((b) => b.status === 'unpaid').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Main Container: Mobile Card Layout */}
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col border-x border-slate-900 bg-slate-950/40 backdrop-blur-sm min-h-screen">
        {/* Sticky Header */}
        <Header lang={lang} setLang={setLang} unpaidCount={unpaidCount} />

        {/* Ethiopian Calendar & System Status Pill */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300">
              {lang === 'en' ? 'Meskerem 27, 2017 E.C.' : 'መስከረም 27, 2017 ዓ.ም'}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>EEU & AAWSA Live Gateway</span>
          </div>
        </div>

        {/* Tab Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'lookup' && (
            <LookupTab
              bills={bills}
              onSaveToMyBills={handleSaveToMyBills}
              onPayBill={handlePayBill}
              onViewReceipt={(b) => setSelectedBillForReceipt(b)}
              lang={lang}
            />
          )}

          {activeTab === 'my_bills' && (
            <MyBillsTab
              bills={bills}
              onPayBill={handlePayBill}
              onViewReceipt={(b) => setSelectedBillForReceipt(b)}
              onDeleteBill={handleDeleteBill}
              onAddNewBill={handleAddNewBill}
              lang={lang}
            />
          )}

          {activeTab === 'help' && <HelpTab bills={bills} lang={lang} />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="sticky bottom-0 z-30 w-full glass-panel border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-2 py-1.5">
          <div className="grid grid-cols-3 gap-1">
            {/* Tab 1: Lookup */}
            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'lookup'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-bold tracking-tight">
                {lang === 'am' ? 'ቢል ማጣሪያ' : lang === 'en' ? 'Lookup' : 'ማጣሪያ (Lookup)'}
              </span>
            </button>

            {/* Tab 2: My Bills */}
            <button
              onClick={() => setActiveTab('my_bills')}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'my_bills'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Receipt className="w-5 h-5 mb-0.5" />
                {unpaidCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-sm animate-pulse">
                    {unpaidCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold tracking-tight">
                {lang === 'am' ? 'የእኔ ቢሎች' : lang === 'en' ? 'My Bills' : 'የእኔ ቢሎች (Bills)'}
              </span>
            </button>

            {/* Tab 3: Help */}
            <button
              onClick={() => setActiveTab('help')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-bold tracking-tight">
                {lang === 'am' ? 'የክፍያ መመሪያ' : lang === 'en' ? 'Help & Guide' : 'መመሪያ (Help)'}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Interactive Payment Modal */}
      {selectedBillForPay && (
        <PaymentModal
          bill={selectedBillForPay.bill}
          initialMethod={selectedBillForPay.method}
          onClose={() => setSelectedBillForPay(null)}
          onPaymentSuccess={(billId, method, txId) => {
            handlePaymentSuccess(billId, method, txId);
          }}
          lang={lang}
        />
      )}

      {/* Official Receipt Modal */}
      {selectedBillForReceipt && (
        <ReceiptModal
          bill={selectedBillForReceipt}
          onClose={() => setSelectedBillForReceipt(null)}
          lang={lang}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
