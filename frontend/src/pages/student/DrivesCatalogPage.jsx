import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { drivesApi } from '../../services/api';
import { Badge, StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Building
} from 'lucide-react';

export const DrivesCatalogPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [minPackage, setMinPackage] = useState(0);

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

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === 'ALL' ||
      drive.allowedBranches?.includes('ALL') ||
      drive.allowedBranches?.includes(selectedBranch);

    const matchesPackage = (drive.packageLpa || 0) >= minPackage;

    return matchesSearch && matchesBranch && matchesPackage;
  });

  if (loading) return <LoadingSpinner text="Loading placement opportunities..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Active Placement Drives</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse corporate recruitment drives. Real-time eligibility is automatically evaluated for your profile.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border-slate-800 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or company name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Branch Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="ALL">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>

        {/* Min Package Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Min CTC:</span>
          <select
            value={minPackage}
            onChange={(e) => setMinPackage(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 w-full md:w-auto"
          >
            <option value={0}>Any CTC</option>
            <option value={10}>≥ 10 LPA</option>
            <option value={20}>≥ 20 LPA</option>
            <option value={25}>≥ 25 LPA</option>
          </select>
        </div>
      </div>

      {/* Drives Grid */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDrives.map((drive) => {
            const isEligible = drive.eligibility?.eligible;
            const reasons = drive.eligibility?.reasons || [];

            return (
              <div
                key={drive.id}
                className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
              >
                <div>
                  {/* Top Company Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <img
                          src={drive.company?.logoUrl || 'https://via.placeholder.com/48'}
                          alt={drive.company?.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">{drive.company?.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{drive.jobLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility Badge / Applied Badge */}
                    <div>
                      {drive.applied ? (
                        <StatusBadge status={drive.applicationStatus || 'APPLIED'} />
                      ) : isEligible ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400" />
                          Not Eligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Drive Role Title */}
                  <h3 className="text-base font-bold text-white">{drive.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {drive.description}
                  </p>

                  {/* Criteria Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 font-bold">
                      CTC: {drive.packageLpa} LPA
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                      Min CGPA: {drive.minCgpa}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                      Branches: {drive.allowedBranches}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                      Batch: {drive.graduationYear || '2025'}
                    </span>
                  </div>

                  {/* If Not Eligible, display clear explanation */}
                  {!isEligible && !drive.applied && reasons.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                      <p className="font-semibold text-[11px] uppercase tracking-wider text-rose-400 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Eligibility Discrepancies:
                      </p>
                      {reasons.map((r, i) => (
                        <p key={i} className="text-[11px]">• {r}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex items-center text-slate-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    <span>Deadline: {drive.applicationDeadline || 'Rolling'}</span>
                  </div>

                  <Link
                    to={`/student/drives/${drive.id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <span>View Details & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No placement drives found"
          message="No active drives match your current search and filter criteria."
        />
      )}
    </div>
  );
};
