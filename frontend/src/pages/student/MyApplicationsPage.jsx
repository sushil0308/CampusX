import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  Ban,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await applicationApi.withdraw(id);
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  if (loading) return <LoadingSpinner text="Loading your applications history..." />;

  const getWorkflowSteps = (status) => {
    const steps = [
      { key: 'APPLIED', label: 'Submitted' },
      { key: 'SHORTLISTED', label: 'Shortlisted' },
      { key: 'INTERVIEW_SCHEDULED', label: 'Interview' },
      { key: 'SELECTED', label: 'Selected' },
    ];

    const order = {
      APPLIED: 1,
      SHORTLISTED: 2,
      INTERVIEW_SCHEDULED: 3,
      SELECTED: 4,
      REJECTED: -1,
      WITHDRAWN: -1,
    };

    const currentStep = order[status] || 1;

    return { steps, currentStep, isRejected: status === 'REJECTED', isWithdrawn: status === 'WITHDRAWN' };
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">My Placement Applications</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time recruitment progression across all company drives.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const drive = app.placementDrive;
            const company = drive?.company;
            const { steps, currentStep, isRejected, isWithdrawn } = getWorkflowSteps(app.status);

            return (
              <div
                key={app.id}
                className="glass-card rounded-2xl p-6 border-slate-800 space-y-5 hover:border-slate-700 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <img
                        src={company?.logoUrl || 'https://via.placeholder.com/48'}
                        alt={company?.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{drive?.title}</h3>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {company?.name} • CTC: <span className="text-emerald-400 font-semibold">{drive?.packageLpa} LPA</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    {app.status === 'APPLIED' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center space-x-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Workflow Timeline */}
                {!isRejected && !isWithdrawn ? (
                  <div className="pt-2">
                    <div className="relative flex items-center justify-between">
                      {/* Connection Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 w-full z-0">
                        <div
                          className="h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                          style={{
                            width: `${((Math.min(currentStep, 4) - 1) / (steps.length - 1)) * 100}%`,
                          }}
                        ></div>
                      </div>

                      {/* Step Nodes */}
                      {steps.map((step, idx) => {
                        const isDone = currentStep >= idx + 1;
                        const isCurrent = currentStep === idx + 1;

                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-slate-950'
                                  : isCurrent
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 animate-pulse'
                                  : 'bg-slate-800 text-slate-500 ring-4 ring-slate-950'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
                                isDone || isCurrent ? 'text-slate-200' : 'text-slate-600'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                    {isRejected ? (
                      <p className="text-rose-400 font-semibold flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1.5" /> This application was not shortlisted for further rounds.
                      </p>
                    ) : (
                      <p className="text-slate-400 font-medium">Application was withdrawn by candidate.</p>
                    )}
                  </div>
                )}

                {/* Candidate Note */}
                {app.coverNote && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Your Note: </span>
                    {app.coverNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck}
          title="No applications in this category"
          message="You have not submitted any applications matching the selected filter."
        />
      )}
    </div>
  );
};
