import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  Building2,
  Users,
  CheckSquare,
  BarChart3,
  ShieldAlert,
  Settings,
  Bell,
  FileText
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isStudent, isRecruiter, isOfficer, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'My Profile & CV' },
    { to: '/student/drives', icon: Briefcase, label: 'Placement Drives' },
    { to: '/student/applications', icon: FileCheck, label: 'Applications' },
    { to: '/student/interviews', icon: Calendar, label: 'Interviews' },
    { to: '/student/offers', icon: Award, label: 'Job Offers' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruiter/company', icon: Building2, label: 'Company Profile' },
    { to: '/recruiter/drives', icon: Briefcase, label: 'Manage Drives' },
    { to: '/recruiter/create-drive', icon: CheckSquare, label: 'Post New Drive' },
    { to: '/recruiter/applicants', icon: Users, label: 'All Applicants' },
    { to: '/recruiter/interviews', icon: Calendar, label: 'Interviews' },
  ];

  const officerLinks = [
    { to: '/officer/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/officer/students', icon: Users, label: 'Student Directory' },
    { to: '/officer/companies', icon: Building2, label: 'Recruiter Approval' },
    { to: '/officer/drives', icon: Briefcase, label: 'Drive Oversight' },
    { to: '/officer/reports', icon: BarChart3, label: 'Placement Analytics' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Hub' },
    { to: '/admin/users', icon: Users, label: 'User Directory' },
    { to: '/admin/audit-logs', icon: ShieldAlert, label: 'Audit Trail' },
  ];

  let links = [];
  if (isStudent) links = studentLinks;
  else if (isRecruiter) links = recruiterLinks;
  else if (isOfficer) links = officerLinks;
  else if (isAdmin) links = adminLinks;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md hidden md:block min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {user?.role?.replace('_', ' ')} PORTAL
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/90 dark:hover:bg-slate-900/80'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 px-3">
        <div className="bg-slate-100/80 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800/60">
          <p className="text-[11px] font-semibold text-slate-900 dark:text-white">Need Assistance?</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Placement Cell is active Mon-Fri, 9am-5pm.
          </p>
          <a
            href="mailto:placement-support@campusx.edu"
            className="inline-block mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
          >
            Contact Placement Cell →
          </a>
        </div>
      </div>
    </aside>
  );
};
