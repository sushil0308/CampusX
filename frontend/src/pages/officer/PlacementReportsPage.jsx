import React, { useState, useEffect } from 'react';
import { officerApi } from '../../services/api';
import { LoadingSpinner } from '../../components/common/EmptyState';
import { BarChart3, Download, Printer, CheckCircle2, Award, TrendingUp } from 'lucide-react';

export const PlacementReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    officerApi.getDashboard().then((res) => {
      if (res.data.success) {
        setStats(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner text="Compiling official placement report..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Institutional Placement Report</h2>
          <p className="text-xs text-slate-400 mt-1">
            Certified placement audit statement for institutional accreditation (NAAC/NIRF).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="glass-card rounded-3xl p-8 border-slate-800 space-y-8 print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white">CampusX Placement Cell</h3>
            <p className="text-xs text-slate-400 mt-1">Annual Placement Audit Statement • Batch of 2025</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Certified Record</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Graduating Batch</p>
            <p className="text-2xl font-black text-white mt-1">{stats?.totalStudents || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Students Placed</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.placedStudents || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Placement Success %</p>
            <p className="text-2xl font-black text-indigo-400 mt-1">{stats?.placementPercentage || 0}%</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Average CTC</p>
            <p className="text-2xl font-black text-purple-400 mt-1">{stats?.averagePackageLpa || 0} LPA</p>
          </div>
        </div>

        {/* Department Table */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Academic Department Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Enrolled Candidates</th>
                  <th className="pb-3">Verified Offers</th>
                  <th className="pb-3">Placement Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.branchWiseStats?.map((b) => (
                  <tr key={b.branch}>
                    <td className="py-3 font-bold text-white">{b.branch}</td>
                    <td className="py-3 text-slate-300">{b.totalStudents}</td>
                    <td className="py-3 text-emerald-400 font-bold">{b.placedStudents}</td>
                    <td className="py-3 font-extrabold text-indigo-400">{b.placementPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Major Recruiters */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Tier 1 Participating Organizations</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats?.topRecruiters?.map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="font-bold text-white text-xs">{r.companyName}</p>
                <p className="text-[11px] text-emerald-400 font-bold mt-1">Up to {r.packageLpa} LPA</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{r.offersCount} Selected Students</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
