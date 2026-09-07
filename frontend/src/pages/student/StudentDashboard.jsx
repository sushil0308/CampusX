import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentApi, interviewApi, drivesApi } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import {
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Building
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [eligibleDrives, setEligibleDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, interviewsRes, drivesRes] = await Promise.all([
        studentApi.getDashboard(),
        interviewApi.getStudentInterviews(),
        drivesApi.getAllDrives(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (interviewsRes.data.success) {
        // Filter scheduled interviews
        setUpcomingInterviews(
          interviewsRes.data.data.filter((i) => i.status === 'SCHEDULED')
        );
      }
      if (drivesRes.data.success) {
        // Filter eligible drives that haven't been applied to yet
        setEligibleDrives(
          drivesRes.data.data
            .filter((d) => d.eligibility?.eligible && !d.applied)
            .slice(0, 3)
        );
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your placement dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Placed Announcement Banner */}
      {stats?.isPlaced && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>🎉 Officially Placed!</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold">
                  {stats.placedPackageLpa} LPA
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Congratulations on accepting the offer from <span className="font-semibold text-white">{stats.placedCompany}</span>.
              </p>
            </div>
          </div>
          <Link
            to="/student/offers"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            View Offer Letter
          </Link>
        </div>
      )}

      {/* Profile Completion Bar */}
      <div className="glass-card rounded-2xl p-5 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Profile Readiness Score</span>
            </span>
            <span className="text-xs font-extrabold text-indigo-400">
              {stats?.profileCompletionPercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${stats?.profileCompletionPercentage || 0}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Add projects, internships, and upload your resume to maximize your shortlisting chances.
          </p>
        </div>
        <Link
          to="/student/profile"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Update Profile →
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Eligible Drives"
          value={stats?.eligibleDrivesCount || 0}
          subtitle="Matching your CGPA & branch"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Applications Sent"
          value={stats?.appliedDrivesCount || 0}
          subtitle="Active submissions"
          icon={FileCheck}
          color="blue"
        />
        <StatCard
          title="Upcoming Interviews"
          value={stats?.upcomingInterviewsCount || 0}
          subtitle="Scheduled technical rounds"
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Job Offers"
          value={stats?.offersReceivedCount || 0}
          subtitle="Official offers extended"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Main Grid: Interviews & Eligible Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews Card */}
        <div className="glass-card rounded-2xl p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Upcoming Interviews</h3>
              </div>
              <Link to="/student/interviews" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                View All
              </Link>
            </div>

            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 2).map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {interview.roundName}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">
                          {interview.application?.placementDrive?.company?.name || 'Recruiter'}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            {new Date(interview.scheduledAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>•</span>
                          <span>{interview.durationMinutes} mins</span>
                        </div>
                      </div>

                      {interview.meetingLink && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-md shadow-indigo-600/20"
                        >
                          <span>Join Meet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No pending interviews"
                message="You have no interview sessions scheduled currently."
              />
            )}
          </div>
        </div>

        {/* Recommended Eligible Drives */}
        <div className="glass-card rounded-2xl p-5 border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Recommended Eligible Drives</h3>
              </div>
              <Link to="/student/drives" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                Explore All
              </Link>
            </div>

            {eligibleDrives.length > 0 ? (
              <div className="space-y-3">
                {eligibleDrives.map((drive) => (
                  <div
                    key={drive.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={drive.company?.logoUrl || 'https://via.placeholder.com/36'}
                          alt={drive.company?.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{drive.company?.name}</h4>
                        <p className="text-xs text-slate-300 font-medium line-clamp-1">{drive.title}</p>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                          <span className="text-emerald-400 font-bold">{drive.packageLpa} LPA</span>
                          <span>•</span>
                          <span>Deadline: {drive.applicationDeadline || 'Rolling'}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/student/drives/${drive.id}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="All caught up!"
                message="You have applied to all currently eligible drives or check back later."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
