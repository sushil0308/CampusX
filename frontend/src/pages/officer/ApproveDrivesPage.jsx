import React, { useState, useEffect } from 'react';
import { drivesApi } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/EmptyState';
import { Briefcase, CheckCircle2, XCircle, Building2, Calendar } from 'lucide-react';

export const ApproveDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await drivesApi.getAllDrives();
      if (res.data.success) {
        setDrives(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await drivesApi.updateStatus(id, newStatus);
      loadDrives();
    } catch (err) {
      alert('Failed to update drive status');
    }
  };

  if (loading) return <LoadingSpinner text="Loading campus placement drives..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Placement Drive Governance</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review, approve, and oversee job drives before they are published to eligible students.
        </p>
      </div>

      <div className="glass-card rounded-2xl border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Drive & Company</th>
                <th className="py-3.5 px-4">Role Title</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Criteria (CGPA/Branch)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {drives.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {d.title}
                    <p className="text-[11px] text-indigo-400 font-semibold">{d.company?.name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{d.jobRole}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-400">{d.packageLpa} LPA</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>Min: <span className="font-bold text-white">{d.minCgpa} CGPA</span></div>
                    <div className="text-[10px] text-slate-500">{d.allowedBranches}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {d.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(d.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm"
                        >
                          Approve
                        </button>
                      )}
                      {d.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(d.id, 'COMPLETED')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
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
