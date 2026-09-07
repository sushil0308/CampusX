import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { GraduationCap, Sparkles, ArrowRight, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickLoginAs, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await login(email, password);
      redirectUser(user.role);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (roleKey) => {
    setErrorMessage('');
    try {
      const user = await quickLoginAs(roleKey);
      redirectUser(user.role);
    } catch (err) {
      setErrorMessage('Failed to sign in demo user: ' + err.message);
    }
  };

  const redirectUser = (role) => {
    if (role === 'STUDENT') navigate('/student/dashboard');
    else if (role === 'RECRUITER') navigate('/recruiter/dashboard');
    else if (role === 'PLACEMENT_OFFICER') navigate('/officer/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Column: Quick Demo Switcher Cards (For Interview Demonstrations) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-indigo-500/20 flex flex-col justify-between relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>1-Click Interview Demo Accounts</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Instant Demo Access</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
              Select any pre-configured role to immediately explore complete workflows without typing credentials.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('STUDENT')}
                className="w-full text-left p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">🎓 Student</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      CSE (CGPA 8.85)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Arjun Sharma • Ready with interviews & applications</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('RECRUITER')}
                className="w-full text-left p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">💼 Recruiter</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                      Google Talent Lead
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sarah Jenkins • Shortlist candidates & schedule interviews</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('OFFICER')}
                className="w-full text-left p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">🏛️ Placement Officer</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      Placement Cell Head
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Dr. Rajesh Nambiar • College KPIs, reports & drive approvals</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="w-full text-left p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">⚙️ System Admin</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                      Superuser
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Full platform access, user activation & audit log inspection</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60">
            Powered by Spring Boot 3 Security & BCrypt JWT.
          </p>
        </div>

        {/* Right Column: Manual Login Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-slate-200 dark:border-slate-800 flex flex-col justify-center shadow-md">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to CampusX</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter your registered email and password</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.arjun@campusx.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Sign In with Credentials</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold">
              Create student or recruiter account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
