import React, { useState, useEffect } from 'react';
import { officerApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { Users, Search, GraduationCap, Award, ExternalLink } from 'lucide-react';

export const ManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [placementFilter, setPlacementFilter] = useState('ALL');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await officerApi.getStudents();
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    const name = `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase();
    const roll = (s.rollNumber || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || roll.includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || s.department === branchFilter;
    const matchesPlacement =
      placementFilter === 'ALL' ||
      (placementFilter === 'PLACED' && s.placed) ||
      (placementFilter === 'UNPLACED' && !s.placed);

    return matchesSearch && matchesBranch && matchesPlacement;
  });

  if (loading) return <LoadingSpinner text="Loading student database..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Student Academic & Placement Directory</h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor student profile completeness, eligibility standings, and hiring outcomes.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or roll number..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>

        <div>
          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLACED">Placed Candidates</option>
            <option value="UNPLACED">Seeking Placement</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      {filtered.length > 0 ? (
        <div className="glass-card rounded-2xl border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">CGPA</th>
                  <th className="py-3.5 px-4">Profile Readiness</th>
                  <th className="py-3.5 px-4">Placement Status</th>
                  <th className="py-3.5 px-4 text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {s.user?.firstName} {s.user?.lastName}
                      <p className="text-[11px] text-slate-500 font-normal">{s.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{s.rollNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {s.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400">{s.cgpa}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${s.profileCompletionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {s.profileCompletionPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.placed ? (
                        <div>
                          <Badge variant="success">Placed 🎉</Badge>
                          <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            {s.placedCompany} ({s.placedPackageLpa} LPA)
                          </p>
                        </div>
                      ) : (
                        <Badge variant="default">Seeking Placement</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {s.resumeUrl ? (
                        <a
                          href={s.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1"
                        >
                          <span>PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600">No CV</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No students match criteria"
          message="Adjust search keywords or clear branch filters."
        />
      )}
    </div>
  );
};
