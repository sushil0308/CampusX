import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../services/api';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { Briefcase, PlusCircle, Users, Calendar, MapPin } from 'lucide-react';

export const ManageDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await recruiterApi.getMyDrives();
      if (res.data.success) {
        setDrives(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your company placement drives..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Placement Drives Oversight</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your company's campus recruitment campaigns and applicant pools.
          </p>
        </div>
        <Link
          to="/recruiter/create-drive"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Drive</span>
        </Link>
      </div>

      {drives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {drive.jobRole}
                  </span>
                  <StatusBadge status={drive.status} />
                </div>

                <h3 className="text-base font-bold text-white mb-2">{drive.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {drive.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-xl bg-slate-900 border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-slate-400">CTC Package: </span>
                    <span className="font-extrabold text-emerald-400">{drive.packageLpa} LPA</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Min CGPA: </span>
                    <span className="font-bold text-white">{drive.minCgpa}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Branches: </span>
                    <span className="font-semibold text-slate-300">{drive.allowedBranches}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Deadline: </span>
                    <span className="font-semibold text-slate-300">{drive.applicationDeadline || 'Rolling'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  {drive.totalApplicants} Registered Candidates
                </span>
                <Link
                  to={`/recruiter/applicants?driveId=${drive.id}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center space-x-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Review Candidates</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No drives published yet"
          message="Post your first campus recruitment drive to start receiving qualified student applications."
          action={
            <Link
              to="/recruiter/create-drive"
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Create Placement Drive
            </Link>
          }
        />
      )}
    </div>
  );
};
