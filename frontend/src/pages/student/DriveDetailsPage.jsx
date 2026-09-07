import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { drivesApi, applicationApi } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/EmptyState';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  FileCheck,
  Send,
  ExternalLink,
  Ban
} from 'lucide-react';

export const DriveDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    loadDrive();
  }, [id]);

  const loadDrive = async () => {
    try {
      setLoading(true);
      const res = await drivesApi.getDriveById(id);
      if (res.data.success) {
        setDrive(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    try {
      const res = await applicationApi.apply({
        driveId: parseInt(id),
        coverNote,
      });
      if (res.data.success) {
        setShowApplyModal(false);
        loadDrive();
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw your application?')) return;
    try {
      if (drive.applicationId) {
        await applicationApi.withdraw(drive.applicationId);
        loadDrive();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  if (loading) return <LoadingSpinner text="Loading job drive details..." />;
  if (!drive) return <div className="text-center py-12 text-slate-400">Drive not found</div>;

  const eligibility = drive.eligibility;
  const isEligible = eligibility?.eligible;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        to="/student/drives"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all placement drives</span>
      </Link>

      {/* Hero Drive Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-lg">
              <img
                src={drive.company?.logoUrl || 'https://via.placeholder.com/64'}
                alt={drive.company?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  {drive.company?.name}
                </span>
                {drive.company?.website && (
                  <a
                    href={drive.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{drive.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {drive.jobLocation}
                </span>
                <span>•</span>
                <span>Job Type: {drive.jobType}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Deadline: {drive.applicationDeadline || 'Open'}
                </span>
              </div>
            </div>
          </div>

          {/* CTC and Status / Apply Action */}
          <div className="flex flex-col items-start md:items-end space-y-3">
            <div>
              <p className="text-[11px] text-slate-400 font-medium md:text-right">Annual Compensation</p>
              <p className="text-3xl font-black text-emerald-400">{drive.packageLpa} LPA</p>
            </div>

            {drive.applied ? (
              <div className="flex items-center space-x-2">
                <StatusBadge status={drive.applicationStatus} />
                {drive.applicationStatus === 'APPLIED' && (
                  <button
                    onClick={handleWithdraw}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 text-xs font-semibold border border-slate-700 hover:border-rose-500/40 transition-colors flex items-center space-x-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Withdraw</span>
                  </button>
                )}
              </div>
            ) : isEligible ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xl shadow-indigo-600/30 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply for Position</span>
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-3 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-700/60"
              >
                Ineligible to Apply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Description & Real-Time Eligibility Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Role Overview & Responsibilities</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {drive.description || 'No detailed job description provided.'}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Company Background</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {drive.company?.description || 'Company details are verified by the placement department.'}
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Industry Sector: </span>
              {drive.company?.industry || 'Technology'}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Automated Eligibility Evaluation Card */}
        <div className="glass-card rounded-2xl p-6 border-slate-800 h-fit space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Eligibility Evaluation</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Automated audit based on verified institutional records.
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-3 text-xs">
            {/* CGPA Item */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-200">CGPA Requirement</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Your CGPA: <span className="text-white font-bold">{eligibility?.studentCgpa || 0}</span> • Required: {drive.minCgpa}
                </p>
              </div>
              {eligibility?.cgpaEligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
            </div>

            {/* Branch Item */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-200">Allowed Branches</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Your branch: <span className="text-white font-bold">{eligibility?.studentBranch || 'N/A'}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Allowed: {drive.allowedBranches}
                </p>
              </div>
              {eligibility?.branchEligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
            </div>

            {/* Graduation Batch Item */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-200">Passing Batch</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Target Batch: <span className="text-white font-bold">{drive.graduationYear || '2025'}</span>
                </p>
              </div>
              {eligibility?.graduationYearEligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
            </div>

            {/* Application Deadline Item */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-200">Deadline Status</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {drive.applicationDeadline ? `Closes on ${drive.applicationDeadline}` : 'Open Application'}
                </p>
              </div>
              {eligibility?.deadlineValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Verdict Box */}
          <div
            className={`p-3.5 rounded-xl border ${
              isEligible
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isEligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
              <span className="text-xs font-bold">
                {isEligible ? 'You are eligible to apply!' : 'You do not meet all criteria'}
              </span>
            </div>
            {!isEligible && eligibility?.reasons?.length > 0 && (
              <div className="mt-2 space-y-1 text-[11px] text-rose-300">
                {eligibility.reasons.map((r, i) => (
                  <p key={i}>• {r}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply to ${drive.title}`}>
        <form onSubmit={handleApply} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300">
            Your verified academic profile (CGPA: {eligibility?.studentCgpa}, Branch: {eligibility?.studentBranch}) and resume will be automatically attached to this submission.
          </div>

          {applyError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
              {applyError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Candidate Note / Statement of Interest (Optional)
            </label>
            <textarea
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Highlight relevant projects, technologies, and why you are excited to join..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applying}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              {applying ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
