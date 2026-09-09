import React from 'react';
import { Calendar, User, LogOut, Shield, GraduationCap, Briefcase, Sparkles } from 'lucide-react';

export default function Navbar({ currentUser, currentRole, onLogout, onQuickLogin, onOpenAuth }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onLogout ? null : null}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">Appointment Hub</span>
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-700/10">v2.0 Pro</span>
            </div>
            <p className="text-xs text-slate-500">Academic Faculty & Staff Scheduling</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-right">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.email}</div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 uppercase text-xs">
                  {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                </div>
              </div>

              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                currentRole === 'admin' 
                  ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20' 
                  : currentRole === 'staff' 
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                  : 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-700/20'
              }`}>
                {currentRole === 'admin' && <Shield className="h-3 w-3" />}
                {currentRole === 'staff' && <Briefcase className="h-3 w-3" />}
                {currentRole === 'student' && <GraduationCap className="h-3 w-3" />}
                {currentRole === 'staff' ? 'Faculty' : currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
              </span>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Sign out of your session"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Quick Demo Logins Dropdown */}
              <div className="relative group">
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Demo Switcher</span>
                </button>
                <div className="absolute right-0 top-full mt-1.5 hidden w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl group-hover:block z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">1-Click Test Logins</div>
                  <button
                    onClick={() => onQuickLogin('student', 'john.smith@college.edu', 'student123')}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-md transition-colors"
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-brand-600" />
                    <span>John Smith (Student)</span>
                  </button>
                  <button
                    onClick={() => onQuickLogin('staff', 'sarah.johnson@college.edu', 'staff123')}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Dr. Sarah Johnson (Staff)</span>
                  </button>
                  <button
                    onClick={() => onQuickLogin('admin', 'admin@college.edu', 'admin123')}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-purple-600" />
                    <span>System Admin (Admin)</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('student', 'login')}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
