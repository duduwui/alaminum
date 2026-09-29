import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, TrendingUp, Users, BarChart2, Globe } from 'lucide-react';

interface DayRow {
  date: string;
  visits: number;
  unique: number;
  volumePct: number;
}

interface VisitsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string | null;
}

type Tab = 'daily' | 'weekly' | 'monthly' | 'total';

const DAY_NAMES: Record<number, { en: string }> = {
  0: { en: 'Sunday' },
  1: { en: 'Monday' },
  2: { en: 'Tuesday' },
  3: { en: 'Wednesday' },
  4: { en: 'Thursday' },
  5: { en: 'Friday' },
  6: { en: 'Saturday' },
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  // ISO week: Monday as first day
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return `${monday.getFullYear()}-W${String(getISOWeek(monday)).padStart(2, '0')}`;
}

function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export const VisitsHistoryModal: React.FC<VisitsHistoryModalProps> = ({ isOpen, onClose, adminToken }) => {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [dailyData, setDailyData] = useState<DayRow[]>([]);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
      const res = await fetch('/api/visits/history', { headers, credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDailyData(data.daily || []);
        setTotalDays(data.totalDays || 0);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [isOpen, adminToken]);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  if (!isOpen) return null;

  // Aggregate for weekly view
  const weeklyMap = new Map<string, { visits: number; uniqueSet: Set<string>; dates: string[] }>();
  // We don't have per-visitor IDs in history, so we approximate unique from daily unique
  dailyData.forEach(row => {
    const wk = getWeekKey(row.date);
    if (!weeklyMap.has(wk)) weeklyMap.set(wk, { visits: 0, uniqueSet: new Set(), dates: [] });
    const e = weeklyMap.get(wk)!;
    e.visits += row.visits;
    e.dates.push(row.date);
    // approximate: sum unique per day (overcount if same user visits multiple days)
    // We store as a number since we don't have individual IDs
  });

  // Build weekly rows
  const weeklyRows = Array.from(weeklyMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([wk, d]) => {
      const sorted = [...d.dates].sort();
      const from = sorted[0];
      const to = sorted[sorted.length - 1];
      // Sum unique from daily (approximate)
      const uniqueApprox = dailyData.filter(r => d.dates.includes(r.date)).reduce((s, r) => s + r.unique, 0);
      return { key: wk, from, to, visits: d.visits, unique: uniqueApprox };
    });
  const maxWeekVisits = weeklyRows.reduce((m, r) => Math.max(m, r.visits), 1);

  // Build monthly rows
  const monthlyMap = new Map<string, { visits: number; unique: number }>();
  dailyData.forEach(row => {
    const mk = getMonthKey(row.date);
    if (!monthlyMap.has(mk)) monthlyMap.set(mk, { visits: 0, unique: 0 });
    const e = monthlyMap.get(mk)!;
    e.visits += row.visits;
    e.unique += row.unique;
  });
  const monthlyRows = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([mk, d]) => {
      const [year, month] = mk.split('-');
      return { key: mk, label: `${MONTH_NAMES[parseInt(month) - 1]} ${year}`, visits: d.visits, unique: d.unique };
    });
  const maxMonthVisits = monthlyRows.reduce((m, r) => Math.max(m, r.visits), 1);

  // Total
  const totalVisits = dailyData.reduce((s, r) => s + r.visits, 0);
  const totalUnique = dailyData.reduce((s, r) => s + r.unique, 0);

  const today = new Date().toISOString().split('T')[0];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'daily', label: 'Daily Log' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'total', label: 'All-Time' },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="font-black text-base tracking-tight">Traffic & Visits History Log</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 pb-0 border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-700 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Loading traffic data…</div>
          ) : (

            <>
              {/* ─── DAILY TAB ─── */}
              {activeTab === 'daily' && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-600 font-medium">Total visits & unique browsers per calendar day:</p>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{totalDays} days logged</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-left">Day</th>
                          <th className="p-3 text-right text-blue-700">Visits</th>
                          <th className="p-3 text-right">Unique</th>
                          <th className="p-3 text-right w-32">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dailyData.length === 0 && (
                          <tr><td colSpan={5} className="p-6 text-center text-slate-400">No data yet</td></tr>
                        )}
                        {dailyData.map(row => {
                          const d = new Date(row.date);
                          const isToday = row.date === today;
                          return (
                            <tr key={row.date} className={`hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50' : ''}`}>
                              <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                {row.date}
                                {isToday && <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded">TODAY</span>}
                              </td>
                              <td className="p-3 text-slate-500">{DAY_NAMES[d.getDay()]?.en}</td>
                              <td className="p-3 text-right font-black text-blue-700 text-sm">{row.visits.toLocaleString()}</td>
                              <td className="p-3 text-right font-bold text-slate-700">{row.unique.toLocaleString()}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-[10px] text-slate-400 w-8 text-right">{row.volumePct}%</span>
                                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.volumePct}%` }} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ─── WEEKLY TAB ─── */}
              {activeTab === 'weekly' && (
                <>
                  <p className="text-xs text-slate-600 font-medium mb-3">Aggregated visits per ISO week (Mon–Sun). Resets every Monday:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3 text-left">Week</th>
                          <th className="p-3 text-left">Range</th>
                          <th className="p-3 text-right text-blue-700">Visits</th>
                          <th className="p-3 text-right">Unique (est.)</th>
                          <th className="p-3 text-right w-32">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {weeklyRows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No data yet</td></tr>}
                        {weeklyRows.map(row => {
                          const pct = Math.round((row.visits / maxWeekVisits) * 100);
                          const isCurrent = row.dates?.includes(today);
                          return (
                            <tr key={row.key} className={`hover:bg-slate-50 ${isCurrent ? 'bg-blue-50' : ''}`}>
                              <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                {row.key}
                                {isCurrent && <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded">THIS WEEK</span>}
                              </td>
                              <td className="p-3 text-slate-500">{row.from} → {row.to}</td>
                              <td className="p-3 text-right font-black text-blue-700 text-sm">{row.visits.toLocaleString()}</td>
                              <td className="p-3 text-right font-bold text-slate-700">{row.unique.toLocaleString()}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
                                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ─── MONTHLY TAB ─── */}
              {activeTab === 'monthly' && (
                <>
                  <p className="text-xs text-slate-600 font-medium mb-3">Aggregated visits per calendar month. Resets on the 1st of each month:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3 text-left">Month</th>
                          <th className="p-3 text-right text-blue-700">Visits</th>
                          <th className="p-3 text-right">Unique (est.)</th>
                          <th className="p-3 text-right w-32">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {monthlyRows.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-400">No data yet</td></tr>}
                        {monthlyRows.map(row => {
                          const pct = Math.round((row.visits / maxMonthVisits) * 100);
                          const isCurrentMonth = row.key === getMonthKey(today);
                          return (
                            <tr key={row.key} className={`hover:bg-slate-50 ${isCurrentMonth ? 'bg-blue-50' : ''}`}>
                              <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                {row.label}
                                {isCurrentMonth && <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded">THIS MONTH</span>}
                              </td>
                              <td className="p-3 text-right font-black text-blue-700 text-sm">{row.visits.toLocaleString()}</td>
                              <td className="p-3 text-right font-bold text-slate-700">{row.unique.toLocaleString()}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
                                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ─── ALL-TIME TAB ─── */}
              {activeTab === 'total' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 font-medium">All-time cumulative traffic. Never resets.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                      <BarChart2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-3xl font-black text-blue-700">{totalVisits.toLocaleString()}</p>
                      <p className="text-xs font-bold text-blue-600 mt-1">Total Visits</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">All sessions ever recorded</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                      <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-3xl font-black text-emerald-700">{totalUnique.toLocaleString()}</p>
                      <p className="text-xs font-bold text-emerald-600 mt-1">Est. Unique Browsers</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Distinct visitor IDs per day</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                      <Globe className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                      <p className="text-3xl font-black text-slate-700">{totalDays}</p>
                      <p className="text-xs font-bold text-slate-600 mt-1">Days with Traffic</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Days that had at least 1 visit</p>
                    </div>
                  </div>
                  {/* Top days */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-blue-600" /> Top 5 Busiest Days</h4>
                    <div className="space-y-2">
                      {[...dailyData].sort((a, b) => b.visits - a.visits).slice(0, 5).map((row, i) => (
                        <div key={row.date} className="flex items-center gap-3 text-xs">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-[10px]">{i + 1}</span>
                          <span className="font-bold text-slate-700 w-28">{row.date}</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.volumePct}%` }} />
                          </div>
                          <span className="font-black text-blue-700 w-16 text-right">{row.visits.toLocaleString()} visits</span>
                          <span className="text-slate-500 w-16 text-right">{row.unique} unique</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitsHistoryModal;
