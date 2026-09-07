import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { ShieldAlert, RefreshCw, Clock, Globe } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs();
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading system audit log trail..." />;

  const getActionBadgeColor = (action) => {
    if (action.includes('LOGIN')) return 'bg-blue-950 text-blue-300 border-blue-500/30';
    if (action.includes('OFFER')) return 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
    if (action.includes('APPLICATION')) return 'bg-indigo-950 text-indigo-300 border-indigo-500/30';
    if (action.includes('INTERVIEW')) return 'bg-amber-950 text-amber-300 border-amber-500/30';
    if (action.includes('ROLE') || action.includes('STATUS')) return 'bg-purple-950 text-purple-300 border-purple-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Security & Activity Audit Trail</h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable chronological record of authentication events, drive submissions, and status transitions.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Trail</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Event Action</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Event Details</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getActionBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-indigo-300 font-semibold font-sans">
                    {log.performedBy}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-sans">
                    {log.targetEntity} #{log.entityId}
                  </td>

                  <td className="py-3.5 px-4 text-slate-200 font-sans max-w-xs truncate">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-500">
                    {log.ipAddress}
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
