import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Star, BookOpen, CheckCircle2, AlertCircle, X, ChevronRight, MessageSquare, Filter } from 'lucide-react';
import { portalApi } from '../api';

export default function StudentPortal({ currentUser }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'appointments'
  const [staffList, setStaffList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Booking modal state
  const [bookingStaff, setBookingStaff] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Rating modal state
  const [ratingApptId, setRatingApptId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);

  useEffect(() => {
    loadDepartments();
    loadStaff('');
    loadAppointments();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadDepartments = async () => {
    try {
      const res = await portalApi.getDepartments();
      setDepartments(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadStaff = async (query) => {
    setLoading(true);
    try {
      const res = await portalApi.getStaffList(query);
      setStaffList(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await portalApi.getStudentAppointments(currentUser?.id);
      setAppointments(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStaff(searchQuery);
  };

  const filteredStaff = staffList.filter((staff) => {
    if (selectedDept === 'ALL') return true;
    return staff.department && staff.department.name.toLowerCase() === selectedDept.toLowerCase();
  });

  const openBookingModal = (staff) => {
    setBookingStaff(staff);
    if (staff.openSlots && staff.openSlots.length > 0) {
      setSelectedSlotId(staff.openSlots[0].id);
    } else {
      setSelectedSlotId('');
    }
    setPurpose('');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlotId || !purpose.trim()) {
      showNotification('error', 'Please select an open slot and enter meeting purpose.');
      return;
    }

    setSubmittingBooking(true);
    try {
      const res = await portalApi.bookAppointment({
        studentId: currentUser.id,
        staffId: bookingStaff.id,
        availabilityId: selectedSlotId,
        purpose: purpose.trim(),
      });

      if (res.data && res.data.success) {
        showNotification('success', `Appointment requested with ${bookingStaff.name}!`);
        setBookingStaff(null);
        loadStaff(searchQuery);
        loadAppointments();
        setActiveTab('appointments');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Failed to book appointment.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleRateAppointment = async (apptId, stars) => {
    try {
      await portalApi.rateAppointment(apptId, stars);
      showNotification('success', `Thank you! Rated ${stars} stars.`);
      setRatingApptId(null);
      loadAppointments();
      loadStaff(searchQuery);
    } catch (err) {
      showNotification('error', 'Failed to submit rating.');
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold shadow-xl transition-all ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-blue-800 p-8 text-white shadow-xl mb-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md mb-3">
            🎓 Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-sm text-blue-100 font-normal leading-relaxed">
            Search college faculty, view real-time open slots, and schedule one-on-one academic advisories.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-amber-300" />
              <span>{pendingCount} Pending Requests</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>{completedCount} Completed Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'browse'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse Faculty</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'appointments'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>My Appointments</span>
            {appointments.length > 0 && (
              <span className="ml-1 rounded-full bg-brand-100 px-1.5 py-0.2 text-[10px] text-brand-700 font-extrabold">
                {appointments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BROWSE FACULTY */}
      {/* ======================================================== */}
      {activeTab === 'browse' && (
        <div>
          {/* Search & Department Filters Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by faculty name or department..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-20 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Search
              </button>
            </form>

            {/* Department Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" /> Filter:
              </span>
              <button
                onClick={() => setSelectedDept('ALL')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDept === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.name)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedDept === dept.name ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Cards Grid */}
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">
              Loading faculty directory...
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Search className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No faculty members found</h3>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting another department filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedDept('ALL'); loadStaff(''); }}
                className="mt-4 rounded-xl bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-100 to-indigo-100 text-brand-700 font-bold text-sm border border-brand-200/50">
                          {staff.name.replace(/^(Dr\.|Prof\.)\s*/, '').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{staff.name}</h3>
                          <span className="inline-block text-xs font-medium text-brand-600 mt-0.5">
                            {staff.department ? staff.department.name : 'General Faculty'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-4 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-100">
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-bold text-slate-800 ml-1">
                          {staff.avgRating ? Number(staff.avgRating).toFixed(1) : '5.0'}
                        </span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-500">
                        {staff.totalRatings || 0} reviews
                      </span>
                    </div>

                    {/* Open Slots Indicator */}
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Available Slots
                      </div>
                      {staff.openSlots && staff.openSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {staff.openSlots.map((slot) => (
                            <span
                              key={slot.id}
                              className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-1 text-[11px] font-medium"
                            >
                              {slot.dayOfWeek.slice(0, 3)} {slot.timeSlot}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-lg text-center">
                          No open slots currently posted
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => openBookingModal(staff)}
                    disabled={!staff.openSlots || staff.openSlots.length === 0}
                    className="w-full mt-2 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {staff.openSlots && staff.openSlots.length > 0 ? 'Book Appointment' : 'No Open Slots'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MY APPOINTMENTS */}
      {/* ======================================================== */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">You have no scheduled appointments</h3>
              <p className="text-xs text-slate-500 mt-1">Browse faculty members and book a time slot to get started.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Browse Faculty
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{appt.staff?.name}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                          appt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          appt.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{appt.staff?.department}</p>
                    </div>

                    <div className="text-right text-xs text-slate-500 font-medium">
                      {appt.availability ? (
                        <div className="text-brand-700 font-semibold">{appt.availability.dayOfWeek} • {appt.availability.timeSlot}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                    <span className="font-semibold text-slate-600">Purpose:</span> {appt.purpose}
                  </div>

                  {/* Faculty Remarks */}
                  {appt.remarks && (
                    <div className="rounded-xl bg-blue-50/70 p-3 text-xs border border-blue-100 text-blue-900">
                      <span className="font-semibold">Faculty Feedback:</span> {appt.remarks}
                    </div>
                  )}

                  {/* Rating Section */}
                  {appt.status === 'COMPLETED' && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Session Rating:</span>
                      {appt.rating ? (
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          {[...Array(appt.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                          <span className="ml-1 text-slate-700">{appt.rating} / 5</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Not rated yet:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRateAppointment(appt.id, star)}
                                className="p-1 rounded hover:scale-125 transition-transform text-slate-300 hover:text-amber-400"
                                title={`Rate ${star} star`}
                              >
                                <Star className="h-4 w-4 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 pt-1">
                    Requested on {new Date(appt.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* BOOKING MODAL */}
      {/* ======================================================== */}
      {bookingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Book Appointment</h3>
                <p className="text-xs text-slate-500">with {bookingStaff.name} ({bookingStaff.department?.name})</p>
              </div>
              <button
                onClick={() => setBookingStaff(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Availability Slot
                </label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                >
                  {bookingStaff.openSlots?.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.dayOfWeek} — {slot.timeSlot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meeting Purpose / Agenda
                </label>
                <textarea
                  rows={3}
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Project guidance, Exam review, Thesis topic discussion..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBookingStaff(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 disabled:opacity-50"
                >
                  {submittingBooking ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
