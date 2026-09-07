import React, { useState, useEffect } from 'react';
import { recruiterApi } from '../../services/api';
import { LoadingSpinner } from '../../components/common/EmptyState';
import { Building2, Save, CheckCircle2, AlertCircle, Globe, MapPin, Mail, Phone } from 'lucide-react';

export const CompanyProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      const res = await recruiterApi.getProfile();
      if (res.data.success && res.data.data.company) {
        const c = res.data.data.company;
        setForm({
          name: c.name || '',
          description: c.description || '',
          website: c.website || '',
          location: c.location || '',
          industry: c.industry || '',
          logoUrl: c.logoUrl || '',
          contactEmail: c.contactEmail || '',
          contactPhone: c.contactPhone || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await recruiterApi.updateCompany(form);
      if (res.data.success) {
        setSuccessMsg('Company details updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading corporate profile..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Company Profile & Branding</h2>
        <p className="text-xs text-slate-400 mt-1">
          Update your organization's presence shown to student applicants across placement drives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 border-slate-800 space-y-5">
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center space-x-4 pb-4 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-md">
            <img
              src={form.logoUrl || 'https://via.placeholder.com/64'}
              alt={form.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Logo URL</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://upload.wikimedia.org/...logo.svg"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industry Sector</label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              placeholder="e.g. Enterprise Software / Cloud / AI"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">About Organization</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Overview of company culture, products, and engineering scale..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Careers Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://careers.company.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Office Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Bangalore, India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Campus Contact Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              placeholder="campus-hiring@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Company Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
