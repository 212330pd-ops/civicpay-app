import React, { useState } from 'react';
import {
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  CreditCard,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Receipt,
  Copy,
  Check,
  Zap,
  Droplets,
  ShieldAlert,
  Building2,
  Radio,
  Search,
} from 'lucide-react';
import { BillItem, BillStatus, ServiceType } from '../types';
import { SERVICE_METADATA } from '../data/mockBills';

interface MyBillsTabProps {
  bills: BillItem[];
  onPayBill: (bill: BillItem, method: 'Telebirr' | 'CBE Birr') => void;
  onViewReceipt: (bill: BillItem) => void;
  onDeleteBill: (id: string) => void;
  onAddNewBill: (bill: BillItem) => void;
  lang: 'am' | 'en' | 'both';
}

export const MyBillsTab: React.FC<MyBillsTabProps> = ({
  bills,
  onPayBill,
  onViewReceipt,
  onDeleteBill,
  onAddNewBill,
  lang,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New bill modal state
  const [newService, setNewService] = useState<ServiceType>('electricity');
  const [newAcc, setNewAcc] = useState('');
  const [newName, setNewName] = useState('ዮናስ ታደሰ (Yonas Tadesse)');
  const [newAmount, setNewAmount] = useState('450.00');

  // Compute metrics
  const unpaidBills = bills.filter((b) => b.status === 'unpaid');
  const paidBills = bills.filter((b) => b.status === 'paid');
  const totalUnpaidAmount = unpaidBills.reduce((acc, curr) => acc + curr.amountDue, 0);

  // Filter bills
  const filteredBills = bills.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && b.serviceType !== serviceFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchAcc = b.accountNumber.toLowerCase().includes(q);
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchType = b.serviceType.toLowerCase().includes(q);
      if (!matchAcc && !matchName && !matchType) return false;
    }
    return true;
  });

  const handleCopyAcc = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcc.trim()) return;

    const meta = SERVICE_METADATA[newService];
    const created: BillItem = {
      id: `BILL-${newService.toUpperCase()}-${newAcc.trim()}`,
      serviceType: newService,
      accountNumber: newAcc.trim(),
      customerName: newName.trim() || 'የተጠቃሚ ስም',
      customerPhone: '+251 91 142 8891',
      amountDue: parseFloat(newAmount) || 350.0,
      status: 'unpaid',
      dueDate: '2026-10-30',
      dueDateAmharic: 'ጥቅምት 20, 2019',
      issueDate: new Date().toISOString().split('T')[0],
      billingPeriod: 'መስከረም 2019',
      breakdown: [
        { labelAm: 'መደበኛ ክፍያ', labelEn: 'Base Service Fee', value: `${(parseFloat(newAmount) * 0.85).toFixed(2)} ETB` },
        { labelAm: 'ተ.እ.ታ (VAT 15%)', labelEn: 'VAT (15%)', value: `${(parseFloat(newAmount) * 0.15).toFixed(2)} ETB` },
      ],
      notes: `${meta.nameAm} በእጅ የተጨመረ`,
    };

    onAddNewBill(created);
    setShowAddModal(false);
    setNewAcc('');
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'electricity':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'traffic':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'property_tax':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'telecom':
        return <Radio className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Total Unpaid Summary Banner Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === 'am'
                ? 'ድምር ያልተከፈለ ዕዳ'
                : lang === 'en'
                ? 'Total Unpaid Balance'
                : 'ድምር ያልተከፈለ ዕዳ (Unpaid Total)'}
            </span>
          </div>

          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {unpaidBills.length} {lang === 'am' ? 'ያልተከፈሉ' : 'Unpaid Bills'}
          </span>
        </div>

        {/* Big Amount Figure */}
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-3xl font-black text-white font-mono tracking-tight">
            {totalUnpaidAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-sm font-bold text-emerald-400">ETB (ብር)</span>
        </div>

        {/* Subtitle breakdown */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{paidBills.length} የተከፈሉ (Paid)</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'አዲስ ቢል መዝግብ' : '+ Add Bill'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={lang === 'am' ? 'ቢል ፈልግ (በቁጥር ወይም ስም)...' : 'Search saved bills...'}
            className="w-full bg-slate-900/80 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {lang === 'am' ? 'ሁሉንም' : 'All'} ({bills.length})
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'unpaid'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {lang === 'am' ? 'ያልተከፈለ' : 'Unpaid'} ({unpaidBills.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {lang === 'am' ? 'የተከፈለ' : 'Paid'} ({paidBills.length})
          </button>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {filteredBills.length === 0 ? (
          <div className="text-center py-12 rounded-2xl glass-card border border-slate-800/80">
            <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              {lang === 'am' ? 'ምንም የተቀመጠ ቢል አልተገኘም' : 'No saved bills match criteria'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'am'
                ? 'በማጣሪያው ትር ላይ ፈልገው ማስቀመጥ ወይም እዚህ መመዝገብ ይችላሉ።'
                : 'Lookup a bill or tap + Add Bill to add one.'}
            </p>
          </div>
        ) : (
          filteredBills.map((bill) => {
            const meta = SERVICE_METADATA[bill.serviceType];
            const isExpanded = expandedId === bill.id;

            return (
              <div
                key={bill.id}
                className="glass-card rounded-2xl p-3.5 border border-slate-800/80 hover:border-slate-700 transition-all shadow-md bg-slate-900/60"
              >
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getServiceIcon(bill.serviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-white">
                          {lang === 'en' ? meta.nameEn : meta.nameAm}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{bill.accountNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-[200px]">
                        {bill.customerName}
                      </p>
                    </div>
                  </div>

                  {/* Status tag */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bill.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {bill.status === 'paid' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{lang === 'am' ? 'የተከፈለ' : 'Paid'}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>{lang === 'am' ? 'ያልተከፈለ' : 'Unpaid'}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount and Due date row */}
                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'am' ? 'የክፍያ መጠን' : 'Amount'}
                    </span>
                    <div className="flex items-baseline space-x-1">
                      <span className="font-extrabold text-white text-base sm:text-lg font-mono">
                        {bill.amountDue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">ETB</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'am' ? 'ማብቂያ ቀን:' : 'Due:'}
                    </span>
                    <span className="text-xs font-semibold text-amber-300">
                      {bill.dueDateAmharic}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-in fade-in duration-200">
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800/60">
                        <span>አገልግሎት ሰጪ (Provider):</span>
                        <span className="text-slate-200 font-medium">{meta.providerAm}</span>
                      </div>
                      {bill.breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-400">
                          <span>{lang === 'en' ? item.labelEn : item.labelAm}:</span>
                          <span className="text-slate-200 font-mono">{item.value}</span>
                        </div>
                      ))}
                      {bill.paidVia && (
                        <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800/60 font-medium">
                          <span>የተከፈለበት መንገድ:</span>
                          <span>
                            {bill.paidVia} ({bill.paidAt})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions row */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopyAcc(bill.id, bill.accountNumber)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      title="ኮፒ አድርግ"
                    >
                      {copiedId === bill.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : bill.id)}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'ደብቅ' : 'ዝርዝር'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteBill(bill.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950 cursor-pointer"
                      title="አስወግድ / Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Payment / Receipt Trigger */}
                  {bill.status === 'unpaid' ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onPayBill(bill, 'Telebirr')}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] shadow-sm cursor-pointer flex items-center space-x-1"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>ቴሌብር</span>
                      </button>
                      <button
                        onClick={() => onPayBill(bill, 'CBE Birr')}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold text-[11px] shadow-sm cursor-pointer flex items-center space-x-1"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>CBE</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onViewReceipt(bill)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Receipt className="w-3 h-3" />
                      <span>{lang === 'am' ? 'ደረሰኝ እይ' : 'Receipt'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-base text-white mb-1">
              {lang === 'am' ? 'አዲስ ቢል መመዝገቢያ' : 'Register New Bill'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'am'
                ? 'የቆጣሪ ወይም የትራፊክ ሰሌዳ ቁጥር ያስገቡ'
                : 'Enter meter or reference details'}
            </p>

            <form onSubmit={handleCreateBill} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  የአገልግሎት ዓይነት (Service)
                </label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value as ServiceType)}
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 outline-none"
                >
                  <option value="electricity">⚡ የመብራት ክፍያ (EEU)</option>
                  <option value="water">💧 የውሃ ቢል (AAWSA)</option>
                  <option value="traffic">🚗 የትራፊክ ቅጣት (TMA)</option>
                  <option value="property_tax">🏠 የቤትና መሬት ታክስ</option>
                  <option value="telecom">📱 የቴሌኮም ቢል</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  የቆጣሪ / መለያ ቁጥር (Account / Plate)
                </label>
                <input
                  type="text"
                  required
                  value={newAcc}
                  onChange={(e) => setNewAcc(e.target.value)}
                  placeholder="ለምሳሌ፡ 10928374 ወይም AA-2-A9910"
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  የተጠቃሚ ስም (Customer Name)
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  የክፍያ መጠን (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  ሰርዝ (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  መዝግብ (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
