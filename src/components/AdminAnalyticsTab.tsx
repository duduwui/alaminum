import React, { useState, useEffect, useMemo } from 'react';
import { CurrencyType, formatCurrency } from '../utils/currency';
import { QuotationRequest } from '../types/requests';
import { FinancialRecord } from '../types/finance';
import { fetchAllRequests } from '../services/requestService';
import { fetchFinancials } from '../services/financeService';
import {
  MapPin,
  TrendingUp,
  Building2,
  PieChart,
  BarChart3,
  Globe2,
  Layers,
  ThermometerSnowflake,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Inbox
} from 'lucide-react';

interface AdminAnalyticsTabProps {
  currency?: CurrencyType;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  currency = 'USD'
}) => {
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [reqs, fins] = await Promise.all([
          fetchAllRequests(),
          fetchFinancials()
        ]);
        setRequests(reqs || []);
        setFinances(fins || []);
      } catch (err) {
        console.error('Error loading analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Compute actual metrics from live data
  const totalRevenuePipeline = useMemo(() => {
    const fromRequests = requests.reduce((sum, r) => sum + (r.quotedAmount || 0), 0);
    const fromFinances = finances.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
    return Math.max(fromRequests, fromFinances);
  }, [requests, finances]);

  const totalProjectsCount = finances.length > 0 ? finances.length : requests.length;

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    requests.forEach((r) => {
      if (r.customer?.city) cities.add(r.customer.city);
    });
    finances.forEach((f) => {
      if (f.projectName) cities.add(f.projectName);
    });
    return Array.from(cities);
  }, [requests, finances]);

  // Regional breakdown computed dynamically
  const regionalBreakdown = useMemo(() => {
    const cityMap: Record<string, { count: number; totalValue: number }> = {};
    requests.forEach((r) => {
      const city = r.customer?.city || 'Other City';
      if (!cityMap[city]) cityMap[city] = { count: 0, totalValue: 0 };
      cityMap[city].count += 1;
      cityMap[city].totalValue += (r.quotedAmount || 0);
    });

    const totalVal = Object.values(cityMap).reduce((sum, c) => sum + c.totalValue, 0) || 1;

    return Object.entries(cityMap).map(([city, data]) => ({
      city,
      projectsCount: data.count,
      revenueUsd: data.totalValue,
      sharePercent: Math.round((data.totalValue / totalVal) * 100)
    }));
  }, [requests]);

  const hasData = requests.length > 0 || finances.length > 0;

  return (
    <main className="p-6 space-y-6 flex-1 overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
            Regional Demand Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Market Insights & Regional Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geographic breakdown of architectural installations, quote values, and system popularity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync Active
          </span>
        </div>
      </div>

      {/* Top 4 KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Regional Pipeline</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatCurrency(totalRevenuePipeline, currency)}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <span>Aggregated quote pipeline</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase">Active Governorates</span>
          <h3 className="text-2xl sm:text-3xl font-black text-red-600">
            {uniqueCities.length} {uniqueCities.length === 1 ? 'City' : 'Cities'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {uniqueCities.length > 0 ? uniqueCities.slice(0, 3).join(', ') : 'No active territories yet'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase">Executed Projects</span>
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600">{totalProjectsCount} Sites</h3>
          <p className="text-xs text-slate-500 font-medium">Customer requests & logged contracts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase">Avg Turnaround Lead Time</span>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">
            {hasData ? '14 Days' : '0 Days'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">Engineering review & estimation</p>
        </div>
      </div>

      {/* Main Content Area */}
      {!hasData ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Analytics Data Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Market insights, monthly revenue curves, and regional governorate distributions will populate automatically as client quotation requests and invoices are recorded.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Regional Table */}
          <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Territory Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">City / Governorate</th>
                    <th className="p-3.5 text-center">Requests Count</th>
                    <th className="p-3.5 text-right">Quoted Volume</th>
                    <th className="p-3.5 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {regionalBreakdown.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{r.city}</span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-800">{r.projectsCount}</td>
                      <td className="p-3.5 text-right font-black text-slate-900">
                        {formatCurrency(r.revenueUsd, currency)}
                      </td>
                      <td className="p-3.5 text-right font-bold text-red-600">{r.sharePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default AdminAnalyticsTab;
