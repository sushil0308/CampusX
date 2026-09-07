import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/EmptyState';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruiterData();
  }, []);

  const loadRecruiterData = async () => {
    try {
      setLoading(true);
      const [statsRes, drivesRes] = await Promise.all([
        recruiterApi.getDashboard(),
        recruiterApi.getMyDrives(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (drivesRes.data.success) {
        setDrives(drivesRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading recruiter dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Company Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-lg">
            <img
              src={stats?.companyLogo || 'https://via.placeholder.com/64'}
              alt={stats?.companyName}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white">{stats?.companyName || 'Recruiter Portal'}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Verified Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage on-campus placement drives, candidate evaluations, and technical interview rounds.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            to="/recruiter/create-drive"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Drive</span>
          </Link>
          <Link
            to="/recruiter/company"
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors text-center"
          >
            Company Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Drives"
          value={stats?.activeDrivesCount || 0}
          subtitle="Open for student applications"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Total Applicants"
          value={stats?.totalApplicantsCount || 0}
          subtitle="Candidates reviewed"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Shortlisted"
          value={stats?.shortlistedCandidatesCount || 0}
          subtitle="Advanced to technical rounds"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Interviews"
          value={stats?.scheduledInterviewsCount || 0}
          subtitle="Conducted or upcoming"
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Active Drives Table Card */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Your Campus Placement Drives</h3>
            <p className="text-xs text-slate-400 mt-0.5">Overview of active positions and candidate engagement</p>
          </div>
          <Link
            to="/recruiter/drives"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
          >
            <span>Manage Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Drive Title</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Compensation</th>
                <th className="pb-3">Min CGPA</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Applicants</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {drives.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 font-bold text-white">{d.title}</td>
                  <td className="py-3.5 text-slate-300">{d.jobRole}</td>
                  <td className="py-3.5 font-extrabold text-emerald-400">{d.packageLpa} LPA</td>
                  <td className="py-3.5 text-slate-300">{d.minCgpa}</td>
                  <td className="py-3.5">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 font-bold border border-slate-700">
                      {d.totalApplicants} candidates
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/recruiter/applicants?driveId=${d.id}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold"
                    >
                      View Candidates →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
