import React, { useState, useEffect } from 'react';
import { officerApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { Building2, CheckCircle2, XCircle, Globe, Mail, Phone, ExternalLink } from 'lucide-react';

export const ManageCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await officerApi.getCompanies();
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (id, currentStatus) => {
    try {
      await officerApi.toggleCompanyVerification(id, !currentStatus);
      loadCompanies();
    } catch (err) {
      alert('Failed to update company verification');
    }
  };

  if (loading) return <LoadingSpinner text="Loading corporate partners..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Corporate Partners & Recruiter Verification</h2>
        <p className="text-xs text-slate-400 mt-1">
          Verify registered employers before approving hiring drives on campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {companies.map((company) => (
          <div
            key={company.id}
            className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                    <img
                      src={company.logoUrl || 'https://via.placeholder.com/48'}
                      alt={company.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{company.name}</h3>
                    <p className="text-xs text-slate-400">{company.industry || 'Technology'}</p>
                  </div>
                </div>

                <Badge variant={company.verified ? 'success' : 'warning'}>
                  {company.verified ? 'Verified Employer' : 'Pending Verification'}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mt-3 leading-relaxed">
                {company.description || 'No description provided.'}
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-slate-800 mt-3">
                {company.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
                {company.contactEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{company.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-500">Location: {company.location || 'India'}</span>
              <button
                onClick={() => handleToggleVerify(company.id, company.verified)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  company.verified
                    ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                }`}
              >
                {company.verified ? 'Revoke Verification' : 'Verify Organization'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
