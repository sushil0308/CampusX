import React, { useState, useEffect } from 'react';
import { officerApi } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/EmptyState';
import {
  Users,
  Building2,
  Briefcase,
  Award,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  PieChart,
  BarChart3
} from 'lucide-react';

export const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await officerApi.getDashboard();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading campus placement analytics..." />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">University Placement Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics on student placement percentage, compensation tiers, and corporate participation.
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Placement Rate"
          value={`${stats?.placementPercentage || 0}%`}
          subtitle={`${stats?.placedStudents || 0} of ${stats?.totalStudents || 0} students placed`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Highest CTC Package"
          value={`${stats?.highestPackageLpa || 0} LPA`}
          subtitle="Top corporate offer"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Average CTC Package"
          value={`${stats?.averagePackageLpa || 0} LPA`}
          subtitle="Across all accepted offers"
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Partner Companies"
          value={stats?.registeredCompanies || 0}
          subtitle={`${stats?.activeDrives || 0} live placement drives`}
          icon={Building2}
          color="blue"
        />
      </div>

      {/* Branch-Wise Placement Breakdown */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Department-Wise Placement Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Success rates by academic branch</p>
          </div>
          <span className="text-xs font-semibold text-indigo-400">Class of 2025</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {stats?.branchWiseStats?.map((branch) => (
            <div key={branch.branch} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{branch.branch}</span>
                <span className="text-xs font-extrabold text-emerald-400">{branch.placementPercentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${branch.placementPercentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Placed: {branch.placedStudents}</span>
                <span>Total: {branch.totalStudents}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Corporate Recruiters */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Top Campus Hiring Partners</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Recruiter Company</th>
                <th className="pb-3">Highest Offer (LPA)</th>
                <th className="pb-3">Offers Extended</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.topRecruiters?.map((recruiter, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 font-bold text-white flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>{recruiter.companyName}</span>
                  </td>
                  <td className="py-3.5 font-extrabold text-emerald-400">{recruiter.packageLpa} LPA</td>
                  <td className="py-3.5 text-slate-200 font-semibold">{recruiter.offersCount} candidates</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      Active Partner
                    </span>
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
