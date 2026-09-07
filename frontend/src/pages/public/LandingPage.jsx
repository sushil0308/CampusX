import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { drivesApi } from '../../services/api';
import {
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  Building,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';

export const LandingPage = () => {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    drivesApi.getAllDrives()
      .then((res) => {
        if (res.data.success) {
          setDrives(res.data.data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>2025 Campus Placement Season is Now Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Where Top Engineering Talent Meets{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Industry Titans
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            CampusX streamlines university placements with automated eligibility matching, structured interview scheduling, and instant offer management.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Student & Recruiter Portals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 font-semibold text-sm transition-all flex items-center justify-center"
            >
              Placement Cell Guidelines
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-5 border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">96.4%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Placement Rate</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">32.0 LPA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Highest Package</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">14.8 LPA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Average Package</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">180+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Partner Recruiters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drives Preview */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Drives</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Companies Currently Hiring On Campus</h2>
            </div>
            <Link
              to="/student/drives"
              className="mt-4 sm:mt-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center"
            >
              Browse all placement drives →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {drives.length > 0 ? (
              drives.map((drive) => (
                <div
                  key={drive.id}
                  className="glass-card rounded-2xl p-5 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:-translate-y-1 transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 dark:border-transparent p-1.5 flex items-center justify-center shadow-sm">
                      <img
                        src={drive.company?.logoUrl || 'https://via.placeholder.com/40'}
                        alt={drive.company?.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{drive.company?.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{drive.jobLocation}</p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-2">{drive.title}</h3>
                  <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{drive.packageLpa} LPA</span>
                    <span className="text-slate-500 dark:text-slate-400">Min {drive.minCgpa} CGPA</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                Loading placement drives...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Structured Placement Workflow Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">End-To-End Architecture</p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Engineered for Transparency & Speed</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto mt-3">
            Every step is automated through strict business validation, real-time eligibility criteria checks, and role-based access control.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Profile & Resume', desc: 'Students manage multi-tier profiles with education, skills, and projects.' },
              { step: '02', title: 'Eligibility Filter', desc: 'Real-time computation of CGPA, branch, and graduation year criteria.' },
              { step: '03', title: '1-Click Apply', desc: 'Instant submission with auto-validation and recruiter candidate dashboard.' },
              { step: '04', title: 'Interview Rounds', desc: 'Direct scheduling with Google Meet links, time slots, and status updates.' },
              { step: '05', title: 'Offer Letter', desc: 'Formal job offer generation with CTC breakdown and instant acceptance.' },
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border-slate-200 dark:border-slate-800 text-left relative overflow-hidden shadow-sm">
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800/80 absolute top-2 right-3 select-none">
                  {item.step}
                </span>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">Step {item.step}</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
