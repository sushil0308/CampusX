import React, { useState, useEffect } from 'react';
import { interviewApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { Calendar, Clock, Video, User, ExternalLink, CheckCircle2 } from 'lucide-react';

export const RecruiterInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewApi.getRecruiterInterviews();
      if (res.data.success) {
        setInterviews(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInterview = async (id) => {
    const feedback = prompt('Enter interview notes / feedback for candidate:');
    if (feedback === null) return;
    try {
      await interviewApi.updateInterview(id, {
        status: 'COMPLETED',
        feedback,
      });
      loadInterviews();
    } catch (err) {
      alert('Failed to update interview');
    }
  };

  if (loading) return <LoadingSpinner text="Loading scheduled interviews..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Scheduled Technical Interviews</h2>
        <p className="text-xs text-slate-400 mt-1">
          Coordinate candidate meetings, track interviewer feedback, and advance rounds.
        </p>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((item) => {
            const student = item.application?.studentProfile;
            const user = student?.user;
            const drive = item.application?.placementDrive;

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border-slate-800 space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {item.roundName}
                    </span>
                    <Badge variant={item.status === 'SCHEDULED' ? 'warning' : 'success'}>
                      {item.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    Candidate: {user?.firstName} {user?.lastName} ({student?.department} • {student?.cgpa} CGPA)
                  </h3>
                  <p className="text-xs text-slate-400">Position: {drive?.title}</p>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center text-slate-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {new Date(item.scheduledAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span>{item.durationMinutes} mins</span>
                    {item.interviewerName && <span>• Host: {item.interviewerName}</span>}
                  </div>

                  {item.feedback && (
                    <p className="text-xs text-emerald-300 pt-1 font-medium">
                      Feedback: {item.feedback}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  {item.meetingLink && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Meeting</span>
                    </a>
                  )}

                  {item.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleCompleteInterview(item.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold"
                    >
                      Record Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled"
          message="Schedule interview rounds with shortlisted candidates from the Applicants page."
        />
      )}
    </div>
  );
};
