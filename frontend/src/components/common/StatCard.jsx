import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) => {
  const colorSchemes = {
    indigo: {
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400',
      glow: 'hover:border-indigo-500/40',
    },
    emerald: {
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'hover:border-emerald-500/40',
    },
    amber: {
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'hover:border-amber-500/40',
    },
    purple: {
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-400',
      glow: 'hover:border-purple-500/40',
    },
    blue: {
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-400',
      glow: 'hover:border-blue-500/40',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div
      className={`glass-card rounded-2xl p-5 border ${scheme.border} ${scheme.glow} transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          {trend}
        </div>
      )}
    </div>
  );
};
