import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/EmptyState';
import {
  ShieldAlert,
  Users,
  Building2,
  Briefcase,
  Activity,
  ArrowRight,
  Clock,
  UserCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading system administration dashboard..." />;

  const roleDist = stats?.roleDistribution || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">System Administration Hub</h2>
        <p className="text-xs text-slate-400 mt-1">
          Global user access management, platform health, and security audit log monitor.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Accounts"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.activeUsers || 0} active accounts`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Placement Drives"
          value={stats?.totalDrives || 0}
          subtitle="System-wide job postings"
          icon={Briefcase}
          color="emerald"
        />
        <StatCard
          title="Registered Companies"
          value={stats?.totalCompanies || 0}
          subtitle="Verified corporate partners"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="System Health"
          value="100% OK"
          subtitle="Spring Boot API • Active"
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Role Distribution & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">User Base By Role</h3>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-semibold text-white">🎓 Students</span>
              <span className="font-extrabold text-indigo-400">{roleDist['STUDENT'] || 0} users</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-semibold text-white">💼 Recruiters</span>
              <span className="font-extrabold text-emerald-400">{roleDist['RECRUITER'] || 0} users</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-semibold text-white">🏛️ Placement Officers</span>
              <span className="font-extrabold text-purple-400">{roleDist['PLACEMENT_OFFICER'] || 0} users</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-semibold text-white">⚙️ System Administrators</span>
              <span className="font-extrabold text-rose-400">{roleDist['ADMIN'] || 0} users</span>
            </div>
          </div>
          <Link
            to="/admin/users"
            className="block text-center py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors mt-2"
          >
            Manage User Accounts →
          </Link>
        </div>

        {/* Recent Audit Logs Snapshot */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent System Audit Trail</h3>
            <Link
              to="/admin/audit-logs"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Full Trail
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {stats?.recentLogs?.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      {log.targetEntity}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{log.details}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    By: <span className="text-indigo-300 font-medium">{log.performedBy}</span> • IP: {log.ipAddress}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
