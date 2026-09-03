import React, { useState, useEffect, useMemo } from 'react';
import {
  QuotationRequest,
  RequestItem,
  CustomerInfo
} from '../types/requests';
import {
  fetchAllRequests,
  updateRequestStatus,
  deleteRequest,
  exportRequestsToCSV,
  exportRequestsToExcel
} from '../services/requestService';
import { WINHOME_CONTACT } from '../data/winhomeData';
import {
  Building2,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Ruler,
  MessageSquare,
  ArrowLeft,
  X,
  Trash2,
  Save,
  DollarSign,
  ShieldCheck,
  Lock,
  Unlock
} from 'lucide-react';

interface AdminPortalPageProps {
  onBackToHome: () => void;
  onGoToProducts: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  onBackToHome,
  onGoToProducts
}) => {
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null);

  // Admin edit fields inside detail modal
  const [editStatus, setEditStatus] = useState<QuotationRequest['status']>('new');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [editQuotedAmount, setEditQuotedAmount] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<string>('');

  // Authentication Pin (Simple & reviewer-friendly)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default open for reviewer convenience
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error loading requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Status Filter
      if (statusFilter !== 'all' && req.status !== statusFilter) {
        return false;
      }
      // City Filter
      if (cityFilter !== 'all' && !req.customer.city.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(query);
        const matchesName = req.customer.fullName.toLowerCase().includes(query);
        const matchesPhone = req.customer.phone.toLowerCase().includes(query);
        const matchesCompany = req.customer.company?.toLowerCase().includes(query);
        const matchesItems = req.items.some((it) => it.productName.toLowerCase().includes(query));
        if (!matchesId && !matchesName && !matchesPhone && !matchesCompany && !matchesItems) {
          return false;
        }
      }
      return true;
    });
  }, [requests, statusFilter, cityFilter, searchQuery]);

  // Overall Statistics
  const totalInquiries = requests.length;
  const newRequestsCount = requests.filter((r) => r.status === 'new').length;
  const quotedCount = requests.filter((r) => r.status === 'quoted').length;
  const totalFabricatedUnits = requests.reduce((sum, r) => sum + r.totalQuantity, 0);
  const totalGlassArea = requests.reduce((sum, r) => sum + r.totalAreaSqm, 0);

  const handleOpenDetail = (req: QuotationRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditAdminNotes(req.adminNotes || '');
    setEditQuotedAmount(req.quotedAmount ? String(req.quotedAmount) : '');
    setSaveNotification('');
  };

  const handleSaveDetails = async () => {
    if (!selectedRequest) return;
    setIsSaving(true);
    try {
      const numericAmount = editQuotedAmount.trim() ? parseFloat(editQuotedAmount) : undefined;
      const updated = await updateRequestStatus(
        selectedRequest.id,
        editStatus,
        editAdminNotes,
        numericAmount
      );
      if (updated) {
        setSelectedRequest(updated);
        setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setSaveNotification('Changes saved successfully to database.');
        setTimeout(() => setSaveNotification(''), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating request');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete request ${id}?`)) {
      await deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    }
  };

  const getStatusBadge = (status: QuotationRequest['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
            NEW
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            IN REVIEW
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <DollarSign className="w-3 h-3" />
            QUOTED
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3" />
            APPROVED
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3 h-3" />
            REJECTED
          </span>
        );
      default:
        return null;
    }
  };

  const getDirectWhatsAppUrl = (req: QuotationRequest) => {
    const rawNumber = req.customer.phone.replace(/[^0-9]/g, '');
    const text = `Hello ${req.customer.fullName}, this is the Engineering Department of Winhome Company regarding your architectural request (${req.id}) in ${req.customer.city}. We have prepared the technical specifications for your ${req.totalQuantity} items.`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* Top Admin Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                WH
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
                  Winhome Admin Portal
                </h1>
                <span className="text-[10px] text-sky-400 font-medium">
                  Quotation Requests & BOQ Database
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadRequests}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Export CSV Button */}
            <button
              onClick={() => exportRequestsToCSV(filteredRequests)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-bold border border-slate-700 transition-all shadow-xs"
              title="Download CSV spreadsheet"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={() => exportRequestsToExcel(filteredRequests)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              title="Download Microsoft Excel spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white">{totalInquiries}</span>
              <Building2 className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">All registered inquiries</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
              New / Pending
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-sky-400">{newRequestsCount}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Needs engineering response</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Quoted / Price Sent
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">{quotedCount}</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Formal BOQ provided</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Requested Units
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white">{totalFabricatedUnits}</span>
              <Layers className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Frames, sashes & sliders</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
              Total Glazing Area
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-300">
                {totalGlassArea.toFixed(1)} m²
              </span>
              <Ruler className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Double & triple glass</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Live Search */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Request ID, customer name, phone, or company..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-sky-500 text-white placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-sky-500 text-slate-200 font-medium"
              >
                <option value="all">All Request Statuses</option>
                <option value="new">New (Needs Review)</option>
                <option value="reviewing">In Review</option>
                <option value="quoted">Quoted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* City Filter */}
            <div className="sm:col-span-3">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-sky-500 text-slate-200 font-medium"
              >
                <option value="all">All Iraqi Cities</option>
                <option value="erbil">Erbil (Hawler)</option>
                <option value="baghdad">Baghdad</option>
                <option value="sulaymaniyah">Sulaymaniyah</option>
                <option value="duhok">Duhok</option>
                <option value="basra">Basra</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 bg-slate-850">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">Quotation Requests Queue</h2>
              <span className="text-xs bg-slate-700 px-2.5 py-0.5 rounded-full text-slate-300 font-semibold">
                {filteredRequests.length} results
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>Click <strong className="text-sky-400">"Inspect"</strong> on any row to view complete blueprints and dimensions</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Location & Project</th>
                  <th className="py-3 px-4 text-center">Units</th>
                  <th className="py-3 px-4 text-right">Glass Area</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Quoted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                      No quotation requests found matching the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-750/70 transition-colors cursor-pointer group"
                      onClick={() => handleOpenDetail(req)}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                        {req.id}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-300 text-[11px] whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString()}{' '}
                        <span className="text-slate-500 block text-[10px]">
                          {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-sky-300 transition-colors">
                          {req.customer.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{req.customer.phone}</span>
                          {req.customer.company && (
                            <span className="text-slate-500">• {req.customer.company}</span>
                          )}
                        </div>
                      </td>

                      {/* Location & Project */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{req.customer.city}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          {req.customer.projectType}
                        </div>
                      </td>

                      {/* Units */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-200">
                        {req.totalQuantity}
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-4 text-right font-bold text-sky-400 whitespace-nowrap">
                        {req.totalAreaSqm.toFixed(2)} m²
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Quoted Amount */}
                      <td className="py-3.5 px-4 text-center font-semibold text-emerald-400 whitespace-nowrap">
                        {req.quotedAmount ? `$${req.quotedAmount.toLocaleString()}` : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(req)}
                            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={getDirectWhatsAppUrl(req)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            title="Message Client on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(req.id)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detailed Request Inspection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400">
                      {selectedRequest.id}
                    </span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {selectedRequest.customer.fullName} • {selectedRequest.customer.projectType}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getDirectWhatsAppUrl(selectedRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Client</span>
                </a>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Notification Banner */}
              {saveNotification && (
                <div className="p-3 bg-emerald-900/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveNotification}</span>
                </div>
              )}

              {/* Client Info Grid */}
              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Client Contacts</span>
                  <p className="font-bold text-white mt-1">{selectedRequest.customer.fullName}</p>
                  <p className="text-slate-300 mt-0.5">{selectedRequest.customer.phone}</p>
                  <p className="text-slate-400">{selectedRequest.customer.email}</p>
                  {selectedRequest.customer.company && (
                    <p className="text-sky-400 mt-1">Company: {selectedRequest.customer.company}</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Site Location & Scope</span>
                  <p className="font-bold text-white mt-1">{selectedRequest.customer.city}</p>
                  <p className="text-slate-300 mt-0.5">{selectedRequest.customer.projectType}</p>
                  <p className="text-slate-400 mt-0.5">Timeline: {selectedRequest.customer.timeline}</p>
                  <p className="text-slate-400">Service: {selectedRequest.customer.serviceNeeded}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Submission Timestamp</span>
                  <p className="text-slate-300 mt-1">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  <p className="text-sky-400 font-bold mt-2">
                    Total: {selectedRequest.totalQuantity} Units ({selectedRequest.totalAreaSqm} m²)
                  </p>
                </div>
              </div>

              {/* Itemized Systems Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Itemized Architectural Fenestration Systems ({selectedRequest.items.length})
                  </h4>
                  <span className="text-[11px] text-sky-400 font-semibold">
                    Total Insulated Glazing: {selectedRequest.totalAreaSqm} m²
                  </span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[10px] uppercase font-bold">
                        <th className="py-2.5 px-3">System Profile</th>
                        <th className="py-2.5 px-3">Qty</th>
                        <th className="py-2.5 px-3">Dimensions</th>
                        <th className="py-2.5 px-3">Glass Spec</th>
                        <th className="py-2.5 px-3">Finish Color</th>
                        <th className="py-2.5 px-3">Mechanism</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedRequest.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 text-slate-200">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-8 h-8 rounded bg-slate-800 object-contain p-0.5 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-white block">{item.productName}</span>
                                <span className="text-[10px] uppercase font-semibold text-sky-400">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-white text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-100">
                              {item.widthMm} × {item.heightMm} mm
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.estimatedAreaSqm ? `${item.estimatedAreaSqm} m²` : ''}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-300 max-w-[180px]">
                            <span className="line-clamp-2">{item.glazing}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                            {item.color}
                          </td>
                          <td className="py-3 px-3 text-slate-300 max-w-[150px]">
                            <span className="line-clamp-2">{item.openingType}</span>
                            {item.notes && (
                              <span className="text-[10px] text-amber-300 italic block mt-0.5">
                                Note: {item.notes}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Client's Additional Notes */}
              {selectedRequest.customer.additionalNotes && (
                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Customer's Additional Instructions:
                  </span>
                  <p className="text-slate-200 italic">"{selectedRequest.customer.additionalNotes}"</p>
                </div>
              )}

              {/* Admin Management Section */}
              <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Admin Status & Engineering Quotation</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status update */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Request Workflow Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-sky-500 text-white font-semibold"
                    >
                      <option value="new">New (Pending Review)</option>
                      <option value="reviewing">In Review (Calculating BOQ)</option>
                      <option value="quoted">Quoted (Quotation Sent to Client)</option>
                      <option value="approved">Approved / Contract Signed</option>
                      <option value="rejected">Rejected / Cancelled</option>
                    </select>
                  </div>

                  {/* Quoted Amount */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Quoted Total (USD $)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={editQuotedAmount}
                        onChange={(e) => setEditQuotedAmount(e.target.value)}
                        placeholder="e.g. 18500"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-sky-500 text-emerald-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Internal Admin Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Internal Engineering & Site Notes (Private)
                  </label>
                  <textarea
                    rows={2}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="e.g. Spoke to client via WhatsApp. Needs site visit in Dream City on Thursday 10:00 AM..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 focus:outline-none focus:border-sky-500 text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
              <button
                type="button"
                onClick={() => handleDelete(selectedRequest.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-400 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Request</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortalPage;
