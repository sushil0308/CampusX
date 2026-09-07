import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';
import {
  GraduationCap,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAll();
      if (res.data.success) {
        setNotifications(res.data.data);
      }
      const countRes = await notificationApi.getUnreadCount();
      if (countRes.data.success) {
        setUnreadCount(countRes.data.data.unreadCount);
      }
    } catch (err) {
      // silently handle background notif fetch
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleSwitch = async (roleKey) => {
    await quickLoginAs(roleKey);
    if (roleKey === 'STUDENT') navigate('/student/dashboard');
    else if (roleKey === 'RECRUITER') navigate('/recruiter/dashboard');
    else if (roleKey === 'OFFICER') navigate('/officer/dashboard');
    else if (roleKey === 'ADMIN') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Campus<span className="text-indigo-600 dark:text-indigo-400">X</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                  Hire Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">University Placement Platform</p>
            </div>
          </Link>
        </div>

        {/* Center Quick Demo Switcher - Interview Showcase Feature */}
        <div className="hidden lg:flex items-center bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-full px-3 py-1 space-x-1 text-xs shadow-inner">
          <span className="text-slate-500 dark:text-slate-400 flex items-center font-medium pr-1.5 border-r border-slate-200 dark:border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 mr-1" /> Quick Demo:
          </span>
          <button
            onClick={() => handleRoleSwitch('STUDENT')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.role === 'STUDENT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            🎓 Student
          </button>
          <button
            onClick={() => handleRoleSwitch('RECRUITER')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.role === 'RECRUITER'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            💼 Recruiter
          </button>
          <button
            onClick={() => handleRoleSwitch('OFFICER')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.role === 'PLACEMENT_OFFICER'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            🏛️ Placement Officer
          </button>
          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              user?.role === 'ADMIN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            ⚙️ Admin
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2.5">
          {isAuthenticated ? (
            <>
              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifs && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-200/80 dark:divide-slate-800/50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3.5 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors ${
                              !n.read ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</h5>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                            {n.link && (
                              <Link
                                to={n.link}
                                onClick={() => setShowNotifs(false)}
                                className="inline-flex items-center text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium mt-2"
                              >
                                View details <ExternalLink className="w-3 h-3 ml-1" />
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.firstName ? user.firstName[0] : 'U'}
                  </div>
                  <div className="hidden sm:block leading-none">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                      {user?.fullName || user?.email}
                    </p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 text-xs">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                      <p className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-medium border border-indigo-200 dark:border-indigo-500/30">
                        {user?.role}
                      </span>
                    </div>

                    {user?.role === 'STUDENT' && (
                      <Link
                        to="/student/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      >
                        <UserIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> My Profile
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
