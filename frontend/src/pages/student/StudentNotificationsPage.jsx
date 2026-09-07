import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { Bell, CheckCheck, ExternalLink, Calendar, FileCheck, Award, Info } from 'lucide-react';

export const StudentNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getAll();
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your notifications..." />;

  const getIcon = (type) => {
    switch (type) {
      case 'INTERVIEW_ALERT':
        return <Calendar className="w-5 h-5 text-amber-400" />;
      case 'OFFER_ALERT':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'APPLICATION_UPDATE':
        return <FileCheck className="w-5 h-5 text-indigo-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time updates regarding drives, interview calls, and placement decisions.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-indigo-400" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`glass-card rounded-2xl p-5 border transition-all flex items-start justify-between gap-4 ${
                !item.read ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                  <p className="text-[10px] text-slate-500 mt-2">
                    {new Date(item.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {item.link && (
                  <Link
                    to={item.link}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!item.read && (
                  <button
                    onClick={() => handleMarkOne(item.id)}
                    className="p-2 text-slate-400 hover:text-slate-200"
                    title="Mark read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="Inbox is clear"
          message="You don't have any notifications right now."
        />
      )}
    </div>
  );
};
