import React from 'react';
import { ShieldCheck, Target, Users, BookOpen, Building, CheckCircle } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">About The Platform</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">Campus Placement & Training Cell</h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3 leading-relaxed">
          Empowering university graduates with transparent recruitment pipelines, automated eligibility checks, and real-time placement analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card rounded-2xl p-6 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Fair Opportunity Policy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our automated eligibility engine evaluates candidates purely against verified academic data (CGPA, branch, graduation year) without bias or manual gatekeeping.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Enterprise Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict role-based access control, cryptographic BCrypt password hashing, stateless JWT session tokens, and end-to-end transactional audit logging.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Corporate Relations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct coordination with Fortune 500 tech companies, fast-growing unicorns, and global consulting conglomerates for on-campus and virtual hiring drives.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Code of Conduct for Students</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>Students must maintain an accurate profile with authentic CGPA and verified marks.</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>Once an interview is scheduled, attendance in formal attire is mandatory unless formally excused.</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>Upon accepting a formal job offer above 15 LPA, a student is marked as "Placed" to allow peers opportunities in standard drives.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
