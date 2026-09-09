import React from 'react';
import { GraduationCap, Briefcase, Shield, Search, Calendar, Clock, Star, ArrowRight, CheckCircle2, Sparkles, UserPlus, LogIn } from 'lucide-react';

export default function LandingPage({ onOpenAuth, onQuickLogin }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200/60 px-3.5 py-1 text-xs font-bold text-brand-700 mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
          <span>Next-Gen Academic Advisory Management</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Effortless Faculty & Staff <br />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Appointment Booking
          </span>
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Connect students with faculty members seamlessly. Search by department, reserve verified open slots, manage meeting notes, and enforce 48-hour response SLAs.
        </p>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200 shadow-sm">
            <Search className="h-3.5 w-3.5 text-brand-600" />
            <span>Faculty Name & Dept Search</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <span>48-Hour Response SLA</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200 shadow-sm">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
            <span>5-Star Student Ratings</span>
          </div>
        </div>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        {/* Student Card */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Student Portal</h3>
            <p className="mt-1 text-xs text-slate-500 mb-6">For undergraduate & postgraduate students</p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                <span>Search faculty by name or department</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                <span>Book verified open time slots</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                <span>Track appointment status & remarks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                <span>Submit star ratings for completed sessions</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenAuth('student', 'login')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Student Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuth('student', 'register')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register as Student</span>
            </button>
          </div>
        </div>

        {/* Faculty / Staff Card */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Faculty / Staff</h3>
            <p className="mt-1 text-xs text-slate-500 mb-6">For professors, instructors & academic staff</p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Publish recurring weekly availability slots</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Accept or decline student requests</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Declined requests automatically free up slots</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Mark completed with session remarks</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenAuth('staff', 'login')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Faculty Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuth('staff', 'register')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register as Faculty</span>
            </button>
          </div>
        </div>

        {/* Administrator Card */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Administrator</h3>
            <p className="mt-1 text-xs text-slate-500 mb-6">For department heads & institutional admins</p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Overall appointment metrics & analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Per-faculty advisory volume breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                <span>48-hour overdue appointment escalation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Audit trail and review controls</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenAuth('admin', 'login')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Admin Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuth('admin', 'register')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register Admin</span>
            </button>
          </div>
        </div>

      </div>

      {/* 1-Click Demo Accounts Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Instant Demo Logins</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any button below to instantly authenticate into that role with pre-seeded demo data:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onQuickLogin('student', 'john.smith@college.edu', 'student123')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 border border-brand-200 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition-colors"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>John Smith (Student)</span>
            </button>

            <button
              onClick={() => onQuickLogin('staff', 'sarah.johnson@college.edu', 'staff123')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Dr. Sarah Johnson (Staff)</span>
            </button>

            <button
              onClick={() => onQuickLogin('admin', 'admin@college.edu', 'admin123')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>System Admin (Admin)</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
