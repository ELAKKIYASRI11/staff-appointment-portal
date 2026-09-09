import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar, Star, AlertTriangle, RefreshCw, CheckCircle2, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { portalApi } from '../api';

export default function AdminPortal({ currentUser }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filterStaffQuery, setFilterStaffQuery] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await portalApi.getAdminStats();
      setStats(res.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEscalationScan = async () => {
    setScanning(true);
    try {
      const res = await portalApi.checkOverdue();
      const count = res.data?.flaggedCount || 0;
      showNotification('success', `Scan complete! ${count} overdue appointment(s) flagged.`);
      loadStats();
    } catch (err) {
      showNotification('error', 'Failed to run escalation scan.');
    } finally {
      setScanning(false);
    }
  };

  const handleResolveFlag = async (id) => {
    try {
      await portalApi.resolveFlag(id);
      showNotification('success', `Flag cleared for appointment #${id}.`);
      loadStats();
    } catch (err) {
      showNotification('error', 'Failed to resolve flag.');
    }
  };

  const filteredStaff = stats?.staffOverview?.filter(st => {
    if (!filterStaffQuery.trim()) return true;
    const q = filterStaffQuery.toLowerCase();
    return st.name.toLowerCase().includes(q) || st.department.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-xl transition-all ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl mb-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md mb-3">
            ⚙️ Administrator Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="mt-2 text-sm text-purple-200 font-normal leading-relaxed">
            Monitor institutional appointment metrics, faculty performance indicators, and manage the 48-hour response escalation queue.
          </p>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.totalAppointments || 0}</div>
          <p className="text-xs text-brand-600 font-medium mt-0.5">Across all departments</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portal Rating</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats?.avgRating ? Number(stats.avgRating).toFixed(1) : '5.0'} ★
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Weighted institutional score</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Faculty</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.totalStaff || 0}</div>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">Instructors & Advisers</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flagged Overdue</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              stats?.flaggedAppointments?.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats?.flaggedAppointments?.length || 0}
          </div>
          <p className="text-xs text-amber-600 font-medium mt-0.5">Requires intervention</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 48-HOUR ESCALATION OVERSIGHT PANEL */}
      {/* ======================================================== */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/50 to-white p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">48-Hour Escalation Center</h2>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                Auto-Monitored
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Pending student appointment requests older than 48 hours without faculty response get flagged for admin review.
            </p>
          </div>

          <button
            onClick={handleRunEscalationScan}
            disabled={scanning}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning...' : 'Check Now'}</span>
          </button>
        </div>

        {/* Flagged Appointments List */}
        <div className="mt-5 space-y-3">
          {!stats?.flaggedAppointments || stats.flaggedAppointments.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-emerald-100 text-emerald-800 text-xs font-medium">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>All appointment requests are currently within the 48-hour response window. No overdue requests flagged.</span>
            </div>
          ) : (
            stats.flaggedAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-amber-200 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{appt.student?.name}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="font-bold text-xs text-slate-900">{appt.staff?.name}</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                      PENDING &gt; 48H
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">Purpose:</span> {appt.purpose}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Requested on: {new Date(appt.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleResolveFlag(appt.id)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Clear Flag
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* FACULTY PERFORMANCE DIRECTORY */}
      {/* ======================================================== */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Faculty Advisory Performance</h2>
            <p className="text-xs text-slate-500">Per-faculty appointment breakdown, department distribution, and student ratings.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filterStaffQuery}
              onChange={(e) => setFilterStaffQuery(e.target.value)}
              placeholder="Search faculty or department..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total Sessions</th>
                <th className="py-3 px-4">Student Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold text-xs">
                      {staff.name.replace(/^(Dr\.|Prof\.)\s*/, '').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div>{staff.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{staff.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {staff.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {staff.appointmentCount} bookings
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-amber-600">
                        {staff.avgRating ? Number(staff.avgRating).toFixed(1) : '5.0'} ★
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({staff.totalRatings} ratings)
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
