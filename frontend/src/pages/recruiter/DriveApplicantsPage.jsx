import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applicationApi, interviewApi, offerApi, studentApi, recruiterApi } from '../../services/api';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
  FileText,
  ExternalLink,
  ChevronDown,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase
} from 'lucide-react';

export const DriveApplicantsPage = () => {
  const [searchParams] = useSearchParams();
  const driveIdParam = searchParams.get('driveId');

  const [applicants, setApplicants] = useState([]);
  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState(driveIdParam || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Interview Schedule Modal
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Round 1: Technical Coding',
    interviewType: 'ONLINE',
    scheduledAt: '',
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/xyz-demo-link',
    location: '',
    interviewerName: 'Staff SWE',
  });

  // Offer Modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    designation: 'Software Development Engineer',
    packageLpa: 24.0,
    joiningDate: '2025-07-15',
    offerExpiryDate: '2025-08-01',
    offerLetterUrl: 'https://campusx.edu/offers/sample-offer.pdf',
  });

  useEffect(() => {
    loadData();
  }, [selectedDriveId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const drivesRes = await recruiterApi.getMyDrives();
      if (drivesRes.data.success) {
        setDrives(drivesRes.data.data);
      }

      let appsRes;
      if (selectedDriveId && selectedDriveId !== 'ALL') {
        appsRes = await applicationApi.getDriveApplicants(selectedDriveId);
      } else {
        appsRes = await applicationApi.getCompanyApplicants();
      }

      if (appsRes.data.success) {
        setApplicants(appsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = async (app) => {
    setSelectedApplicant(app);
    setShowProfileModal(true);
    setLoadingStudent(true);
    try {
      const res = await studentApi.getStudentProfileById(app.studentProfile.id);
      if (res.data.success) {
        setStudentDetails(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status, feedback = '') => {
    try {
      await applicationApi.updateStatus(applicationId, { status, feedback });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await interviewApi.schedule({
        applicationId: selectedApplicant.id,
        ...interviewForm,
      });
      setShowInterviewModal(false);
      loadData();
      alert('Interview round scheduled and student notified successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleGenerateOffer = async (e) => {
    e.preventDefault();
    try {
      await offerApi.generateOffer({
        applicationId: selectedApplicant.id,
        ...offerForm,
        packageLpa: parseFloat(offerForm.packageLpa),
      });
      setShowOfferModal(false);
      loadData();
      alert('Official Job Offer generated and candidate notified!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate offer');
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const student = app.studentProfile;
    const name = app.studentFullName?.toLowerCase() || '';
    const roll = student?.rollNumber?.toLowerCase() || '';
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || roll.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner text="Loading candidate roster..." />;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Applicant Roster & Review</h2>
          <p className="text-xs text-slate-400 mt-1">
            Shortlist qualified candidates, schedule technical interviews, and issue employment offers.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="glass-card rounded-2xl p-4 border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name or roll no..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Drive Selector */}
        <div>
          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Hiring Drives</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.packageLpa} LPA)
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Application Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      {filteredApplicants.length > 0 ? (
        <div className="glass-card rounded-2xl border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Branch & CGPA</th>
                  <th className="py-3.5 px-4">Target Drive</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApplicants.map((app) => {
                  const student = app.studentProfile;
                  const drive = app.placementDrive;

                  return (
                    <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {app.studentFullName ? app.studentFullName[0] : 'S'}
                          </div>
                          <div>
                            <button
                              onClick={() => handleOpenProfile(app)}
                              className="font-bold text-white hover:text-indigo-400 text-left transition-colors"
                            >
                              {app.studentFullName}
                            </button>
                            <p className="text-[10px] text-slate-500">{student?.rollNumber}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-200">{student?.department}</span>
                          <span className="text-slate-500 mx-1">•</span>
                          <span className="font-extrabold text-emerald-400">{student?.cgpa} CGPA</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Class of {student?.graduationYear}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-200 line-clamp-1">{drive?.title}</p>
                        <p className="text-[10px] text-emerald-400">{drive?.packageLpa} LPA</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => handleOpenProfile(app)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                            title="Inspect Candidate CV"
                          >
                            View CV
                          </button>

                          {/* Quick Shortlist */}
                          {app.status === 'APPLIED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 font-semibold"
                            >
                              Shortlist
                            </button>
                          )}

                          {/* Schedule Interview */}
                          {(app.status === 'APPLIED' || app.status === 'SHORTLISTED') && (
                            <button
                              onClick={() => {
                                setSelectedApplicant(app);
                                setShowInterviewModal(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Interview</span>
                            </button>
                          )}

                          {/* Extend Offer */}
                          {(app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED') && (
                            <button
                              onClick={() => {
                                setSelectedApplicant(app);
                                setShowOfferModal(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1"
                            >
                              <Award className="w-3 h-3" />
                              <span>Offer</span>
                            </button>
                          )}

                          {/* Reject */}
                          {app.status !== 'REJECTED' && app.status !== 'SELECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No candidates found"
          message="No applicants match the current drive or status filter."
        />
      )}

      {/* Candidate Profile Inspector Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title={`Candidate CV: ${selectedApplicant?.studentFullName}`}
        maxWidth="max-w-3xl"
      >
        {loadingStudent ? (
          <LoadingSpinner text="Fetching full student academic dossier..." />
        ) : studentDetails ? (
          <div className="space-y-5 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">
                  {studentDetails.firstName} {studentDetails.lastName}
                </h4>
                <p className="text-slate-400 mt-0.5">
                  Roll: <span className="text-white font-semibold">{studentDetails.profile?.rollNumber}</span> • {studentDetails.profile?.department} • CGPA:{' '}
                  <span className="text-emerald-400 font-bold">{studentDetails.profile?.cgpa}</span>
                </p>
                <p className="text-slate-500 text-[11px] mt-1">{studentDetails.email} • {studentDetails.phone}</p>
              </div>

              {studentDetails.profile?.resumeUrl && (
                <a
                  href={studentDetails.profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center space-x-1.5 shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open PDF Resume</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Bio */}
            {studentDetails.profile?.bio && (
              <div>
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Professional Summary</span>
                <p className="text-slate-300 mt-1 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  {studentDetails.profile.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Technical Skills</span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {studentDetails.skills?.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium"
                  >
                    {s.skill?.name} ({s.proficiencyLevel})
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Projects</span>
              <div className="space-y-2 mt-1.5">
                {studentDetails.projects?.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h5 className="font-bold text-white">{p.title}</h5>
                    <p className="text-slate-400 mt-1">{p.description}</p>
                    {p.technologies && (
                      <p className="text-[11px] text-indigo-400 mt-1">Tech: {p.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Work & Internships</span>
              <div className="space-y-2 mt-1.5">
                {studentDetails.internships?.map((i) => (
                  <div key={i.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h5 className="font-bold text-white">{i.role} at {i.companyName}</h5>
                    <p className="text-slate-400 mt-1">{i.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        title={`Schedule Interview Round: ${selectedApplicant?.studentFullName}`}
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Round Name</label>
            <input
              type="text"
              required
              value={interviewForm.roundName}
              onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
              placeholder="e.g. Round 2: Architecture & Algorithms"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={interviewForm.scheduledAt}
                onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={interviewForm.durationMinutes}
                onChange={(e) => setInterviewForm({ ...interviewForm, durationMinutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Link (Google Meet / Teams)</label>
            <input
              type="url"
              required
              value={interviewForm.meetingLink}
              onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Interviewer Name</label>
            <input
              type="text"
              value={interviewForm.interviewerName}
              onChange={(e) => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setShowInterviewModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              Schedule & Notify Candidate
            </button>
          </div>
        </form>
      </Modal>

      {/* Offer Modal */}
      <Modal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        title={`Extend Official Offer: ${selectedApplicant?.studentFullName}`}
      >
        <form onSubmit={handleGenerateOffer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Offered Role / Designation</label>
            <input
              type="text"
              required
              value={offerForm.designation}
              onChange={(e) => setOfferForm({ ...offerForm, designation: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Annual CTC (LPA)</label>
              <input
                type="number"
                step="0.1"
                required
                value={offerForm.packageLpa}
                onChange={(e) => setOfferForm({ ...offerForm, packageLpa: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Joining Date</label>
              <input
                type="date"
                required
                value={offerForm.joiningDate}
                onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Letter PDF Link</label>
            <input
              type="url"
              required
              value={offerForm.offerLetterUrl}
              onChange={(e) => setOfferForm({ ...offerForm, offerLetterUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setShowOfferModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
            >
              Issue Employment Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
