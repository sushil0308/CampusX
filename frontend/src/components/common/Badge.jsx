import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-500/30',
    blue: 'bg-blue-950/80 text-blue-300 border-blue-500/30',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'APPLIED':
      return <Badge variant="blue">Applied</Badge>;
    case 'SHORTLISTED':
      return <Badge variant="warning">Shortlisted</Badge>;
    case 'INTERVIEW_SCHEDULED':
      return <Badge variant="purple">Interview Scheduled</Badge>;
    case 'SELECTED':
      return <Badge variant="success">Selected 🎉</Badge>;
    case 'OFFERED':
      return <Badge variant="success">Offer Extended</Badge>;
    case 'ACCEPTED':
      return <Badge variant="success">Offer Accepted ✅</Badge>;
    case 'REJECTED':
      return <Badge variant="danger">Rejected</Badge>;
    case 'WITHDRAWN':
      return <Badge variant="default">Withdrawn</Badge>;
    case 'APPROVED':
    case 'ACTIVE':
      return <Badge variant="success">Active</Badge>;
    case 'PENDING_APPROVAL':
      return <Badge variant="warning">Pending Review</Badge>;
    case 'COMPLETED':
      return <Badge variant="default">Completed</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
