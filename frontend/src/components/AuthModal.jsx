import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Briefcase, Shield, User, Mail, Lock, Hash, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi, portalApi } from '../api';

export default function AuthModal({ isOpen, onClose, initialRole = 'student', initialMode = 'login', onAuthSuccess }) {
  const [role, setRole] = useState(initialRole);
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setMode(initialMode);
      setError('');
      setSuccessMsg('');
      loadDepartments();
    }
  }, [isOpen, initialRole, initialMode]);

  const loadDepartments = async () => {
    try {
      const res = await portalApi.getDepartments();
      setDepartments(res.data || []);
      if (res.data && res.data.length > 0 && !departmentId) {
        setDepartmentId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await authApi.login(email, password, role);
        if (res.data && res.data.success) {
          onAuthSuccess(res.data.user, res.data.role);
          onClose();
        }
      } else {
        // Register mode
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const payload = {
          role,
          name,
          email,
          password,
          rollNumber: role === 'student' ? rollNumber : undefined,
          departmentId: role === 'staff' ? departmentId : undefined,
        };

        const res = await authApi.register(payload);
        if (res.data && res.data.success) {
          setSuccessMsg('Account created successfully! Logging you in...');
          // Auto-login after successful registration
          const loginRes = await authApi.login(email, password, role);
          if (loginRes.data && loginRes.data.success) {
            setTimeout(() => {
              onAuthSuccess(loginRes.data.user, loginRes.data.role);
              onClose();
            }, 800);
          }
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Authentication failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const setPresetCredentials = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-500">
              Select your role and enter your details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 mx-6 mt-5 rounded-xl">
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'student' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('staff'); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'staff' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'admin' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Mode Switcher (Login / Register) */}
        <div className="flex border-b border-slate-100 px-6 pt-3">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 mr-6 transition-all ${
              mode === 'login' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              mode === 'register' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register as {role === 'staff' ? 'Faculty' : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-100">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Fields */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          {/* Student Roll Number */}
          {mode === 'register' && role === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll / Student ID</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. CS101"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          {/* Faculty Department */}
          {mode === 'register' && role === 'staff' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Confirm Password (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Processing...' : mode === 'login' ? `Sign In as ${role === 'staff' ? 'Faculty' : role.charAt(0).toUpperCase() + role.slice(1)}` : 'Complete Registration'}
          </button>

          {/* Quick Pre-filled Credentials for Easy Testing */}
          {mode === 'login' && (
            <div className="pt-2 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 mb-1.5">Need a quick demo login?</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {role === 'student' && (
                  <button
                    type="button"
                    onClick={() => setPresetCredentials('john.smith@college.edu', 'student123')}
                    className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                  >
                    John Smith (CS101)
                  </button>
                )}
                {role === 'staff' && (
                  <button
                    type="button"
                    onClick={() => setPresetCredentials('sarah.johnson@college.edu', 'staff123')}
                    className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Dr. Sarah Johnson (CS)
                  </button>
                )}
                {role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => setPresetCredentials('admin@college.edu', 'admin123')}
                    className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                  >
                    admin@college.edu
                  </button>
                )}
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
