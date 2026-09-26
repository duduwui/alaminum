import React, { useState, useEffect, useMemo } from 'react';
import {
  FinancialRecord,
  FinancialCategory,
  PaymentStatus,
  PaymentMethod
} from '../types/finance';
import {
  fetchFinancials,
  createFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
  calculateFinancialSummary,
  exportFinancesToCSV
} from '../services/financeService';
import { DOORHOME_CONTACT } from '../data/winhomeData';
import { CurrencyType, formatCurrency } from '../utils/currency';
import {
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Download,
  Receipt,
  Check,
  Edit,
  Trash2,
  Printer,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminFinancialsTabProps {
  currency?: CurrencyType;
}

export const AdminFinancialsTab: React.FC<AdminFinancialsTabProps> = ({
  currency = 'USD'
}) => {
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFinance, setEditingFinance] = useState<FinancialRecord | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<FinancialRecord | null>(null);
  const [notification, setNotification] = useState('');

  // Form State
  const [formClient, setFormClient] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProject, setFormProject] = useState('');
  const [formCategory, setFormCategory] = useState<FinancialCategory>('Aluminum Systems');
  const [formTotal, setFormTotal] = useState<number>(12000);
  const [formPaid, setFormPaid] = useState<number>(6000);
  const [formMethod, setFormMethod] = useState<PaymentMethod>('Bank Transfer (Trade Bank of Iraq)');
  const [formMilestone, setFormMilestone] = useState('50% Down Payment Advance');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formItemsCount, setFormItemsCount] = useState<number>(1);

  const loadFinances = async () => {
    setLoading(true);
    try {
      const data = await fetchFinancials();
      setFinances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinances();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, periodFilter, searchQuery, pageSize]);

  const summary = useMemo(() => calculateFinancialSummary(finances), [finances]);

  const filteredFinances = useMemo(() => {
    return finances.filter((f) => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (periodFilter === 'month') {
        if (!f.date.startsWith('2026-09')) return false;
      } else if (periodFilter === 'last_month') {
        if (!f.date.startsWith('2026-08')) return false;
      } else if (periodFilter === 'q3') {
        if (!f.date.startsWith('2026-07') && !f.date.startsWith('2026-08') && !f.date.startsWith('2026-09')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.id.toLowerCase().includes(q) ||
          f.clientName.toLowerCase().includes(q) ||
          f.projectName.toLowerCase().includes(q) ||
          f.paymentMethod.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [finances, statusFilter, categoryFilter, periodFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredFinances.length / pageSize));
  const paginatedFinances = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFinances.slice(start, start + pageSize);
  }, [filteredFinances, currentPage, pageSize]);

  const handleOpenAdd = () => {
    setEditingFinance(null);
    setFormClient('');
    setFormPhone('');
    setFormProject('');
    setFormCategory('Aluminum Systems');
    setFormTotal(12000);
    setFormPaid(6000);
    setFormMethod('Bank Transfer (Trade Bank of Iraq)');
    setFormMilestone('50% Down Payment Advance');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormItemsCount(1);
    setNotification('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: FinancialRecord) => {
    setEditingFinance(rec);
    setFormClient(rec.clientName);
    setFormPhone(rec.clientPhone || '');
    setFormProject(rec.projectName);
    setFormCategory(rec.category);
    setFormTotal(rec.totalAmount);
    setFormPaid(rec.paidAmount);
    setFormMethod(rec.paymentMethod);
    setFormMilestone(rec.milestone);
    setFormDate(rec.date);
    setFormNotes(rec.notes || '');
    setFormItemsCount(rec.itemsCount || 1);
    setNotification('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, client: string) => {
    if (confirm(`Are you sure you want to delete invoice ${id} for ${client}?`)) {
      try {
        await deleteFinancialRecord(id);
        setFinances((prev) => prev.filter((f) => f.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete record');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('');

    if (!formClient || !formProject || formTotal <= 0) {
      setNotification('Please fill in client, project, and positive total amount.');
      return;
    }

    const pending = Math.max(0, formTotal - formPaid);
    let status: PaymentStatus = 'pending';
    if (pending === 0) status = 'paid';
    else if (formPaid > 0) status = 'partial';

    try {
      if (editingFinance) {
        const updated = await updateFinancialRecord(editingFinance.id, {
          clientName: formClient,
          clientPhone: formPhone,
          projectName: formProject,
          category: formCategory,
          totalAmount: formTotal,
          paidAmount: formPaid,
          pendingAmount: pending,
          paymentMethod: formMethod,
          status,
          milestone: formMilestone,
          date: formDate,
          notes: formNotes,
          itemsCount: formItemsCount
        });
        setFinances((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        setNotification('Invoice record updated successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setNotification('');
        }, 800);
      } else {
        const newRecord = await createFinancialRecord({
          clientName: formClient,
          clientPhone: formPhone,
          projectName: formProject,
          category: formCategory,
          totalAmount: formTotal,
          paidAmount: formPaid,
          pendingAmount: pending,
          paymentMethod: formMethod,
          status,
          milestone: formMilestone,
          date: formDate,
          notes: formNotes,
          itemsCount: formItemsCount
        });
        setFinances((prev) => [newRecord, ...prev]);
        setNotification('New invoice recorded successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setNotification('');
        }, 800);
      }
    } catch (err: any) {
      setNotification(err.message || 'Operation failed');
    }
  };

  const handleQuickPay = async (rec: FinancialRecord) => {
    try {
      const updated = await updateFinancialRecord(rec.id, {
        paidAmount: rec.totalAmount,
        pendingAmount: 0,
        status: 'paid',
        milestone: '100% Fully Settled'
      });
      setFinances((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-6 space-y-6 flex-1 overflow-y-auto">
      {/* Top Financial KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Gross Revenue Pipeline</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatCurrency(summary.grossPipeline, currency)}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{finances.length} project contracts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase">Realized Cash Inflow</span>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">
            {formatCurrency(summary.realizedCollected, currency)}
          </h3>
          <p className="text-xs text-slate-400">
            {Math.round((summary.realizedCollected / (summary.grossPipeline || 1)) * 100)}% collection efficiency
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase">Pending Receivables</span>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-600">
            {formatCurrency(summary.pendingReceivables, currency)}
          </h3>
          <p className="text-xs text-slate-400">Awaiting fabrication/delivery milestones</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase">Est. Net Operating Profit</span>
          <h3 className="text-2xl sm:text-3xl font-black text-red-600">
            {formatCurrency(summary.netOperatingProfit, currency)}
          </h3>
          <p className="text-xs text-slate-400">Average 28% industrial net margin</p>
        </div>
      </div>

      {/* Visual Operational Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900">Monthly Invoiced Revenue & Realized Cash Flow (2026)</h4>
              <p className="text-xs text-slate-500">Fabrication milestones across Erbil, Baghdad & Sulaymaniyah projects</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +14.2% MoM Growth
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
            {[
              { month: 'Apr', total: 32000, collected: 29000, heightTotal: '45%', heightCollected: '40%' },
              { month: 'May', total: 46000, collected: 42000, heightTotal: '60%', heightCollected: '55%' },
              { month: 'Jun', total: 58000, collected: 50000, heightTotal: '75%', heightCollected: '65%' },
              { month: 'Jul', total: 42000, collected: 36000, heightTotal: '55%', heightCollected: '48%' },
              { month: 'Aug', total: 68000, collected: 58000, heightTotal: '85%', heightCollected: '72%' },
              { month: 'Sep (Current)', total: 84000, collected: 62000, heightTotal: '100%', heightCollected: '78%' }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full max-w-[42px] flex items-end gap-1 h-full justify-center">
                  <div
                    style={{ height: bar.heightTotal }}
                    className="w-1/2 bg-red-500/30 rounded-t-md group-hover:bg-red-500/50 transition-all"
                    title={`Gross Invoiced: ${formatCurrency(bar.total, currency)}`}
                  />
                  <div
                    style={{ height: bar.heightCollected }}
                    className="w-1/2 bg-red-600 rounded-t-md group-hover:bg-red-700 transition-all shadow-sm"
                    title={`Collected Cash: ${formatCurrency(bar.collected, currency)}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/30 inline-block" />
              <span>Invoiced Pipeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-600 inline-block" />
              <span className="font-bold text-slate-900">Realized Collections</span>
            </div>
          </div>
        </div>

        {/* Fabrication Cost & Material Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-900">Material Cost Structure</h4>
            <p className="text-xs text-slate-500">Breakdown of factory manufacturing outflow</p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Aluminum Billet & Extrusions', share: 54, color: 'bg-red-600' },
              { label: 'Saint-Gobain Acoustic Glazing', share: 26, color: 'bg-red-500' },
              { label: 'German Roto Hardware & Gaskets', share: 12, color: 'bg-indigo-500' },
              { label: 'CNC Fabrication, Labour & Crating', share: 8, color: 'bg-amber-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div style={{ width: `${item.share}%` }} className={`h-full ${item.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Monthly Fulfillment:</span>
            <span className="font-black text-emerald-600">82.8% of Target</span>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice ID, client, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">All Dates</option>
            <option value="month">This Month (Sep 2026)</option>
            <option value="last_month">Last Month (Aug 2026)</option>
            <option value="q3">Q3 2026</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Fully Settled (Paid)</option>
            <option value="partial">Milestone (Partial)</option>
            <option value="pending">Pending Deposit</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="Aluminum Systems">Aluminum Systems</option>
            <option value="uPVC Profiles">uPVC Profiles</option>
            <option value="Curtain Wall & Facades">Curtain Wall & Facades</option>
            <option value="Accessories & Hardware">Accessories & Hardware</option>
          </select>

          <button
            type="button"
            onClick={() => exportFinancesToCSV(filteredFinances)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Invoice</span>
          </button>
        </div>
      </div>

      {/* Financials Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Invoice / Date</th>
                <th className="p-4">Client & Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Total Value</th>
                <th className="p-4">Paid (Collected)</th>
                <th className="p-4">Pending</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status & Milestone</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedFinances.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No financial records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedFinances.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-red-700 block">{rec.id}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{rec.date}</span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{rec.clientName}</p>
                      <p className="text-[11px] text-slate-500 max-w-[220px] truncate">{rec.projectName}</p>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {rec.category}
                      </span>
                    </td>

                    <td className="p-4 font-black text-slate-900">
                      {formatCurrency(rec.totalAmount, currency)}
                    </td>

                    <td className="p-4 font-bold text-emerald-600">
                      {formatCurrency(rec.paidAmount, currency)}
                    </td>

                    <td className="p-4 font-bold text-amber-600">
                      {rec.pendingAmount > 0 ? (
                        formatCurrency(rec.pendingAmount, currency)
                      ) : (
                        <span className="text-slate-400 font-normal">$0</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="text-[11px] font-semibold text-slate-600 block">{rec.paymentMethod}</span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            rec.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : rec.status === 'partial'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {rec.status === 'paid' && <Check className="w-3 h-3" />}
                          {rec.status}
                        </span>
                        <p className="text-[10px] text-slate-400">{rec.milestone}</p>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingInvoice(rec)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="View & Print Official Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>

                        {rec.pendingAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => handleQuickPay(rec)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors font-bold text-[11px] cursor-pointer"
                            title="Mark Balance as Paid"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                          title="Edit transaction"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(rec.id, rec.clientName)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredFinances.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, filteredFinances.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredFinances.length}</span> records
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-600 font-bold">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
              >
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-900">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECORD / EDIT INVOICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden text-slate-900">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingFinance ? `Edit Invoice: ${editingFinance.id}` : 'Record New Invoice & Milestone Payment'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notification && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{notification}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="Kak Dana Farhad"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Client Phone</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+964 750 445 8899"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Project Description *</label>
                <input
                  type="text"
                  required
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  placeholder="Dream City Luxury Villa - 15 Windows & Slide Units"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  >
                    <option value="Aluminum Systems">Aluminum Systems</option>
                    <option value="uPVC Profiles">uPVC Profiles</option>
                    <option value="Curtain Wall & Facades">Curtain Wall & Facades</option>
                    <option value="Accessories & Hardware">Accessories & Hardware</option>
                    <option value="Installation & Engineering">Installation & Service</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Total Contract ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formTotal}
                    onChange={(e) => setFormTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-black text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Paid Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPaid}
                    onChange={(e) => setFormPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-emerald-700 font-black text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Payment Method</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  >
                    <option value="Bank Transfer (Trade Bank of Iraq)">Bank Transfer (Trade Bank of Iraq)</option>
                    <option value="FIB Mobile Banking">FIB Mobile Banking</option>
                    <option value="FastPay Iraq">FastPay Iraq</option>
                    <option value="Cash (Erbil Office)">Cash (Erbil Office)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Milestone / Term</label>
                  <input
                    type="text"
                    value={formMilestone}
                    onChange={(e) => setFormMilestone(e.target.value)}
                    placeholder="50% Advance Received"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Invoice Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Items / Systems Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formItemsCount}
                    onChange={(e) => setFormItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-700 uppercase text-[10px]">Administrative Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Payment receipt wire note, branch, or site inspection notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  {editingFinance ? 'Save Transaction Changes' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Official Invoice & Receipt</span>
                <h3 className="text-xl font-black text-slate-900">{viewingInvoice.id}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-black text-sm text-slate-900">DOORHOME COMPANY</h4>
                  <p className="text-slate-500">Aluminum & uPVC Architectural Solutions</p>
                  <p className="text-slate-500">Erbil Industrial Area, Kurdistan, Iraq</p>
                  <p className="text-slate-500">Hotline: {DOORHOME_CONTACT.hotline}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">Date: <span className="font-mono text-slate-900">{viewingInvoice.date}</span></p>
                  <p className="font-bold text-slate-700">Status: <span className="font-bold uppercase text-emerald-600">{viewingInvoice.status}</span></p>
                  <p className="font-bold text-slate-700">Payment: <span className="text-slate-900">{viewingInvoice.paymentMethod}</span></p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400">Billed Client & Project</p>
                <h4 className="text-sm font-black text-slate-900">{viewingInvoice.clientName}</h4>
                <p className="text-slate-600 font-medium">{viewingInvoice.projectName}</p>
                <p className="text-slate-500">{viewingInvoice.clientPhone}</p>
              </div>

              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">{viewingInvoice.projectName}</td>
                    <td className="p-3">{viewingInvoice.category}</td>
                    <td className="p-3 text-right">{viewingInvoice.itemsCount || 1} units</td>
                    <td className="p-3 text-right font-black text-slate-900">
                      {formatCurrency(viewingInvoice.totalAmount, currency)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Contract Value:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(viewingInvoice.totalAmount, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Realized Amount Paid:</span>
                  <span className="font-bold">
                    {formatCurrency(viewingInvoice.paidAmount, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-amber-700 font-bold pt-2 border-t border-slate-200">
                  <span>Outstanding Pending Balance:</span>
                  <span className="font-bold">
                    {formatCurrency(viewingInvoice.pendingAmount, currency)}
                  </span>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 italic">
                  Milestone Note: "{viewingInvoice.milestone}" {viewingInvoice.notes && `• ${viewingInvoice.notes}`}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminFinancialsTab;
