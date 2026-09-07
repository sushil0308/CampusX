import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { drivesApi } from '../../services/api';
import { ArrowLeft, CheckSquare, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export const CreateDrivePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    jobRole: 'Software Development Engineer',
    description: '',
    jobLocation: 'Bangalore / Hyderabad, India',
    jobType: 'Full-time',
    packageLpa: 18.0,
    minCgpa: 7.0,
    graduationYear: 2025,
    applicationDeadline: '',
  });

  const [branches, setBranches] = useState({
    CSE: true,
    IT: true,
    ECE: true,
    EE: false,
    MECH: false,
    CIVIL: false,
  });

  const handleBranchToggle = (b) => {
    setBranches({ ...branches, [b]: !branches[b] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const selected = Object.keys(branches).filter((b) => branches[b]);
    const allowedBranchesStr = selected.length === 6 ? 'ALL' : selected.join(',');

    try {
      const payload = {
        ...form,
        packageLpa: parseFloat(form.packageLpa),
        minCgpa: parseFloat(form.minCgpa),
        graduationYear: parseInt(form.graduationYear),
        allowedBranches: allowedBranchesStr,
      };
      const res = await drivesApi.createDrive(payload);
      if (res.data.success) {
        navigate('/recruiter/drives');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create placement drive');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/recruiter/drives"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Drive Management</span>
      </Link>

      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Post New Placement Drive</h2>
        <p className="text-xs text-slate-400 mt-1">
          Specify role expectations, compensation packages, and strict eligibility thresholds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border-slate-800 space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Drive Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. SDE 1 - Core Backend & Cloud"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Designation / Role</label>
            <input
              type="text"
              required
              value={form.jobRole}
              onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
              placeholder="e.g. Software Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Description & Requirements</label>
          <textarea
            rows={4}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Outline core responsibilities, preferred technologies (Java, React, Cloud), and evaluation rounds..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Annual CTC Package (LPA)</label>
            <input
              type="number"
              step="0.1"
              required
              value={form.packageLpa}
              onChange={(e) => setForm({ ...form, packageLpa: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Location</label>
            <input
              type="text"
              required
              value={form.jobLocation}
              onChange={(e) => setForm({ ...form, jobLocation: e.target.value })}
              placeholder="Bangalore / Remote"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hiring Type</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="Full-time">Full-time (FTE)</option>
              <option value="Internship">Internship Only</option>
              <option value="FTE + Internship">FTE + 6 Month Internship</option>
            </select>
          </div>
        </div>

        {/* Eligibility Controls Box */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Candidate Eligibility Rules</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Minimum CGPA Threshold</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={form.minCgpa}
                onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Graduation Batch Year</label>
              <input
                type="number"
                required
                value={form.graduationYear}
                onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={form.applicationDeadline}
                onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-2">Allowed Engineering Branches</label>
            <div className="flex flex-wrap gap-3">
              {Object.keys(branches).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBranchToggle(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    branches[b]
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {branches[b] ? '✓ ' : '+ '} {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
            <span>Publish Placement Drive</span>
          </button>
        </div>
      </form>
    </div>
  );
};
