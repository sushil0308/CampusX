import React, { useState, useEffect } from 'react';
import { interviewApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import {
  Calendar,
  Clock,
  Video,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewApi.getStudentInterviews();
      if (res.data.success) {
        setInterviews(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your interview schedules..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Technical & HR Interviews</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review interview rounds, meeting room links, and interviewer feedback.
        </p>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((item) => {
            const app = item.application;
            const drive = app?.placementDrive;
            const company = drive?.company;
            const isScheduled = item.status === 'SCHEDULED';

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border-slate-800 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <img
                        src={company?.logoUrl || 'https://via.placeholder.com/48'}
                        alt={company?.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          {item.roundName}
                        </span>
                        <Badge variant={isScheduled ? 'warning' : 'default'}>
                          {item.status}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {drive?.title} • {company?.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center text-slate-300 font-semibold">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          {new Date(item.scheduledAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          {item.durationMinutes} Minutes
                        </span>
                        {item.interviewerName && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
                              Interviewer: {item.interviewerName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.meetingLink && isScheduled && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 whitespace-nowrap"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Virtual Interview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {item.feedback && (
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-indigo-400">Interviewer Notes: </span>
                    {item.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No interview sessions"
          message="Once your profile is shortlisted, scheduled technical and HR interview rounds will appear here."
        />
      )}
    </div>
  );
};
