import React from 'react';
import { Inbox, Loader2 } from 'lucide-react';

export const EmptyState = ({ title = 'No data found', message = 'There are currently no items to display.', icon: Icon = Inbox, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
      <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <span className="text-xs font-medium text-slate-400">{text}</span>
    </div>
  );
};
