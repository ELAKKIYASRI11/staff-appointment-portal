import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, Star, Plus, User, MessageSquare, AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import { portalApi } from '../api';

export default function StaffPortal({ currentUser }) {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'availability'
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // New slot form
  const [dayOfWeek, setDayOfWeek] = useState('MONDAY');
  const [timeSlot, setTimeSlot] = useState('14:00');
  const [addingSlot, setAddingSlot] = useState(false);

  // Complete session modal
  const [completingAppt, setCompletingAppt] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadAppointments();
    loadSlots();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await portalApi.getStaffAppointments(currentUser?.id);
      setAppointments(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async () => {
    try {
      const res = await portalApi.getMySlots(currentUser?.id);
      setSlots(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAccept = async (id) => {
    try {
      await portalApi.acceptAppointment(id);
      showNotification('success', 'Appointment accepted.');
      loadAppointments();
    } catch (err) {
      showNotification('error', 'Failed to accept appointment.');
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm('Are you sure you want to decline this appointment? The slot will be released for other students.')) {
      return;
    }
    try {
      await portalApi.declineAppointment(id);
      showNotification('success', 'Appointment declined and time slot released.');
      loadAppointments();
      loadSlots();
    } catch (err) {
      showNotification('error', 'Failed to decline appointment.');
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    try {
      await portalApi.completeAppointment(completingAppt.id, remarks);
      showNotification('success', 'Appointment marked as completed.');
      setCompletingAppt(null);
      setRemarks('');
      loadAppointments();
    } catch (err) {
      showNotification('error', 'Failed to complete appointment.');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddingSlot(true);
    try {
      await portalApi.addSlot(currentUser.id, dayOfWeek, timeSlot);
      showNotification('success', `Added availability for ${dayOfWeek} at ${timeSlot}!`);
      loadSlots();
    } catch (err) {
      showNotification('error', 'Failed to add availability slot.');
    } finally {
      setAddingSlot(false);
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const acceptedCount = appointments.filter(a => a.status === 'ACCEPTED').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;
  const flaggedCount = appointments.filter(a => a.flagged).length;

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 p-8 text-white shadow-xl mb-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md mb-3">
            🧑‍🏫 Faculty Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Faculty'}
          </h1>
          <p className="mt-2 text-sm text-emerald-100 font-normal leading-relaxed">
            Manage incoming appointment requests, maintain your weekly availability slots, and track student sessions.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Requests</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{pendingCount}</div>
          <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting your response</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted Upcoming</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{acceptedCount}</div>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">Confirmed sessions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{completedCount}</div>
          <p className="text-xs text-blue-600 font-medium mt-0.5">Sessions concluded</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {currentUser?.avgRating ? Number(currentUser.avgRating).toFixed(1) : '5.0'} ★
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{currentUser?.totalRatings || 0} student ratings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Appointment Requests</span>
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-400 text-amber-950 px-1.5 py-0.2 text-[10px] font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'availability'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>My Availability ({slots.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: APPOINTMENT REQUESTS */}
      {/* ======================================================== */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No appointment requests yet</h3>
              <p className="text-xs text-slate-500 mt-1">Make sure you have active availability slots so students can book.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm space-y-3 transition-all ${
                    appt.flagged ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-300' : 'border-slate-200'
                  }`}
                >
                  {/* Flagged Alert Pill */}
                  {appt.flagged && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-amber-100/80 px-2.5 py-1 text-xs font-bold text-amber-800">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      <span>FLAGGED FOR ADMIN REVIEW (Pending &gt; 48 Hours)</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{appt.student?.name}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                          appt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          appt.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {appt.student?.rollNumber ? `Roll No: ${appt.student.rollNumber}` : appt.student?.email}
                      </p>
                    </div>

                    <div className="text-right text-xs font-semibold text-emerald-700">
                      {appt.availability ? `${appt.availability.dayOfWeek} • ${appt.availability.timeSlot}` : ''}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                    <span className="font-semibold text-slate-700">Purpose:</span> {appt.purpose}
                  </div>

                  {appt.remarks && (
                    <div className="rounded-xl bg-blue-50/70 p-3 text-xs border border-blue-100 text-blue-900">
                      <span className="font-semibold">Session Remarks:</span> {appt.remarks}
                    </div>
                  )}

                  {appt.rating && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 p-2 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>Student Rated: {appt.rating} / 5 Stars</span>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Requested {new Date(appt.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {appt.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAccept(appt.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleDecline(appt.id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Decline
                          </button>
                        </>
                      )}

                      {appt.status === 'ACCEPTED' && (
                        <button
                          onClick={() => { setCompletingAppt(appt); setRemarks(''); }}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Complete Session
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MANAGE AVAILABILITY */}
      {/* ======================================================== */}
      {activeTab === 'availability' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Slot Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Add Availability Slot</h3>
            <p className="text-xs text-slate-500 mb-4">Post a new recurring weekly time slot for student bookings.</p>
            
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot (24-Hour)</label>
                <input
                  type="time"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={addingSlot}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>{addingSlot ? 'Adding...' : 'Add Slot to Schedule'}</span>
              </button>
            </form>
          </div>

          {/* Slots List */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Your Weekly Availability Schedule</h3>
            <p className="text-xs text-slate-500 mb-4">Slots marked as Booked cannot be booked again until the session completes or declines.</p>

            {slots.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No availability slots defined yet. Use the form on the left to add slots.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/50"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800">{s.dayOfWeek}</span>
                      <div className="text-xs font-semibold text-emerald-700">{s.timeSlot}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      s.booked ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {s.booked ? 'Booked' : 'Open'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* COMPLETE SESSION MODAL */}
      {/* ======================================================== */}
      {completingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">Mark Appointment Complete</h3>
              <button onClick={() => setCompletingAppt(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="p-6 space-y-4">
              <div className="text-xs text-slate-600">
                Student: <strong>{completingAppt.student?.name}</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Notes / Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Discussed project structure and assigned next milestone tasks."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCompletingAppt(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Complete Session
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
