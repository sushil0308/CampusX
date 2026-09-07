import React, { useState, useEffect } from 'react';
import { studentApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/EmptyState';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('academic');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [showEduModal, setShowEduModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Forms
  const [academicForm, setAcademicForm] = useState({
    rollNumber: '',
    department: 'CSE',
    cgpa: 8.0,
    graduationYear: 2025,
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
  });

  const [eduForm, setEduForm] = useState({
    degree: '',
    institution: '',
    boardOrUniversity: '',
    startYear: 2021,
    endYear: 2025,
    score: '',
    completed: false,
  });

  const [skillForm, setSkillForm] = useState({
    skillName: '',
    category: 'Programming',
    proficiencyLevel: 'INTERMEDIATE',
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
  });

  const [internshipForm, setInternshipForm] = useState({
    companyName: '',
    role: '',
    description: '',
    location: '',
    certificateUrl: '',
  });

  const [certForm, setCertForm] = useState({
    title: '',
    issuingOrganization: '',
    credentialId: '',
    credentialUrl: '',
  });

  useEffect(() => {
    loadFullProfile();
  }, []);

  const loadFullProfile = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getFullProfile();
      if (res.data.success) {
        const d = res.data.data;
        setProfileData(d);
        if (d.profile) {
          setAcademicForm({
            rollNumber: d.profile.rollNumber || '',
            department: d.profile.department || 'CSE',
            cgpa: d.profile.cgpa || 8.0,
            graduationYear: d.profile.graduationYear || 2025,
            bio: d.profile.bio || '',
            githubUrl: d.profile.githubUrl || '',
            linkedinUrl: d.profile.linkedinUrl || '',
            portfolioUrl: d.profile.portfolioUrl || '',
            resumeUrl: d.profile.resumeUrl || '',
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAcademic = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await studentApi.updateProfile({
        ...academicForm,
        cgpa: parseFloat(academicForm.cgpa),
        graduationYear: parseInt(academicForm.graduationYear),
      });
      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!');
        loadFullProfile();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addEducation({
        ...eduForm,
        startYear: parseInt(eduForm.startYear),
        endYear: parseInt(eduForm.endYear),
      });
      setShowEduModal(false);
      loadFullProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add education');
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Delete this education record?')) return;
    try {
      await studentApi.deleteEducation(id);
      loadFullProfile();
    } catch (err) {
      alert('Failed to delete education');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addSkill(skillForm);
      setShowSkillModal(false);
      loadFullProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await studentApi.deleteSkill(skillId);
      loadFullProfile();
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addProject(projectForm);
      setShowProjectModal(false);
      loadFullProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await studentApi.deleteProject(id);
      loadFullProfile();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addInternship(internshipForm);
      setShowInternshipModal(false);
      loadFullProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add internship');
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Delete internship?')) return;
    try {
      await studentApi.deleteInternship(id);
      loadFullProfile();
    } catch (err) {
      alert('Failed to delete internship');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addCertification(certForm);
      setShowCertModal(false);
      loadFullProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add certification');
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete certification?')) return;
    try {
      await studentApi.deleteCertification(id);
      loadFullProfile();
    } catch (err) {
      alert('Failed to delete certification');
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile credentials..." />;

  const tabs = [
    { id: 'academic', label: 'Academic & Bio', icon: User },
    { id: 'education', label: 'Education History', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Tech', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Internships', icon: Briefcase },
    { id: 'certifications', label: 'Certifications', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-600/30">
            {profileData?.firstName ? profileData.firstName[0] : 'S'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">
                {profileData?.firstName} {profileData?.lastName}
              </h2>
              <Badge variant="primary">{profileData?.profile?.department || 'CSE'}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Roll No: <span className="text-slate-300 font-semibold">{profileData?.profile?.rollNumber}</span> • CGPA:{' '}
              <span className="text-emerald-400 font-bold">{profileData?.profile?.cgpa}</span> • Batch of{' '}
              <span className="text-slate-300 font-semibold">{profileData?.profile?.graduationYear}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-medium">Profile Completeness:</span>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
            {profileData?.profile?.profileCompletionPercentage || 0}%
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Academic & Bio Form */}
      {activeTab === 'academic' && (
        <form onSubmit={handleUpdateAcademic} className="glass-card rounded-2xl p-6 border-slate-800 space-y-6">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Roll Number</label>
              <input
                type="text"
                value={academicForm.rollNumber}
                onChange={(e) => setAcademicForm({ ...academicForm, rollNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Branch</label>
              <select
                value={academicForm.department}
                onChange={(e) => setAcademicForm({ ...academicForm, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EE">Electrical Engineering (EE)</option>
                <option value="MECH">Mechanical Engineering (MECH)</option>
                <option value="CIVIL">Civil Engineering (CIVIL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={academicForm.cgpa}
                onChange={(e) => setAcademicForm({ ...academicForm, cgpa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Graduation Year</label>
              <input
                type="number"
                value={academicForm.graduationYear}
                onChange={(e) => setAcademicForm({ ...academicForm, graduationYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Bio</label>
            <textarea
              rows={3}
              value={academicForm.bio}
              onChange={(e) => setAcademicForm({ ...academicForm, bio: e.target.value })}
              placeholder="Write a brief professional summary about your technical interests and career aspirations..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub URL</label>
              <input
                type="url"
                value={academicForm.githubUrl}
                onChange={(e) => setAcademicForm({ ...academicForm, githubUrl: e.target.value })}
                placeholder="https://github.com/your-handle"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn URL</label>
              <input
                type="url"
                value={academicForm.linkedinUrl}
                onChange={(e) => setAcademicForm({ ...academicForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/your-handle"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portfolio Website</label>
              <input
                type="url"
                value={academicForm.portfolioUrl}
                onChange={(e) => setAcademicForm({ ...academicForm, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resume PDF URL</label>
              <input
                type="url"
                value={academicForm.resumeUrl}
                onChange={(e) => setAcademicForm({ ...academicForm, resumeUrl: e.target.value })}
                placeholder="https://campusx.edu/resumes/my-resume.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Education History */}
      {activeTab === 'education' && (
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Education Milestones</h3>
            <button
              onClick={() => setShowEduModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {profileData?.educations?.length > 0 ? (
              profileData.educations.map((edu) => (
                <div key={edu.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {edu.institution} {edu.boardOrUniversity && `• ${edu.boardOrUniversity}`}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      <span>
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </span>
                      {edu.score && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{edu.score}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No education records added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Skills */}
      {activeTab === 'skills' && (
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Verified Technical Skills</h3>
            <button
              onClick={() => setShowSkillModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {profileData?.skills?.length > 0 ? (
              profileData.skills.map((item) => (
                <div
                  key={item.id}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center space-x-2 text-xs"
                >
                  <span className="font-semibold text-white">{item.skill?.name}</span>
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">
                    {item.proficiencyLevel}
                  </span>
                  <button
                    onClick={() => handleDeleteSkill(item.skill?.id)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6">No skills added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Projects */}
      {activeTab === 'projects' && (
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Technical Projects</h3>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData?.projects?.length > 0 ? (
              profileData.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.technologies.split(',').map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-xs mt-3 pt-3 border-t border-slate-800">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 col-span-2 text-center">No projects added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Internships */}
      {activeTab === 'experience' && (
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Internships & Industry Experience</h3>
            <button
              onClick={() => setShowInternshipModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Internship</span>
            </button>
          </div>

          <div className="space-y-3">
            {profileData?.internships?.length > 0 ? (
              profileData.internships.map((intern) => (
                <div key={intern.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{intern.role}</h4>
                    <p className="text-xs font-semibold text-indigo-400 mt-0.5">{intern.companyName} {intern.location && `• ${intern.location}`}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{intern.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteInternship(intern.id)}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No internships recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Certifications */}
      {activeTab === 'certifications' && (
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Licenses & Certifications</h3>
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certificate</span>
            </button>
          </div>

          <div className="space-y-3">
            {profileData?.certifications?.length > 0 ? (
              profileData.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{cert.issuingOrganization}</p>
                    {cert.credentialId && (
                      <p className="text-[11px] text-slate-500 mt-1">ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No certifications added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Education Modal */}
      <Modal isOpen={showEduModal} onClose={() => setShowEduModal(false)} title="Add Education Record">
        <form onSubmit={handleAddEducation} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Degree / Course</label>
            <input
              type="text"
              required
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              placeholder="e.g. B.Tech Computer Science"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">College / Institute</label>
            <input
              type="text"
              required
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              placeholder="e.g. National Institute of Technology"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Year</label>
              <input
                type="number"
                value={eduForm.startYear}
                onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Year</label>
              <input
                type="number"
                value={eduForm.endYear}
                onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Score</label>
              <input
                type="text"
                value={eduForm.score}
                onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })}
                placeholder="8.85 CGPA"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold mt-4"
          >
            Save Education
          </button>
        </form>
      </Modal>

      {/* Skill Modal */}
      <Modal isOpen={showSkillModal} onClose={() => setShowSkillModal(false)} title="Add Technical Skill">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={skillForm.skillName}
              onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })}
              placeholder="e.g. Kotlin, Kubernetes, Redis"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="Programming">Programming</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Cloud">Cloud</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency</label>
              <select
                value={skillForm.proficiencyLevel}
                onChange={(e) => setSkillForm({ ...skillForm, proficiencyLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold mt-4"
          >
            Add Skill to Profile
          </button>
        </form>
      </Modal>

      {/* Project Modal */}
      <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="Add Technical Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="e.g. Distributed Task Queue"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies Used (comma separated)</label>
            <input
              type="text"
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
              placeholder="e.g. Java, Spring Boot, Redis, Docker"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Highlight architectural decisions, optimizations, and metrics..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Link</label>
              <input
                type="url"
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live URL</label>
              <input
                type="url"
                value={projectForm.liveUrl}
                onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold mt-4"
          >
            Save Project
          </button>
        </form>
      </Modal>

      {/* Internship Modal */}
      <Modal isOpen={showInternshipModal} onClose={() => setShowInternshipModal(false)} title="Add Internship Experience">
        <form onSubmit={handleAddInternship} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={internshipForm.companyName}
                onChange={(e) => setInternshipForm({ ...internshipForm, companyName: e.target.value })}
                placeholder="e.g. Razorpay, Swiggy"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={internshipForm.role}
                onChange={(e) => setInternshipForm({ ...internshipForm, role: e.target.value })}
                placeholder="e.g. SDE Intern"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description of Work</label>
            <textarea
              rows={3}
              value={internshipForm.description}
              onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold mt-4"
          >
            Save Experience
          </button>
        </form>
      </Modal>

      {/* Certificate Modal */}
      <Modal isOpen={showCertModal} onClose={() => setShowCertModal(false)} title="Add Certification">
        <form onSubmit={handleAddCert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Certificate Title</label>
            <input
              type="text"
              required
              value={certForm.title}
              onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization</label>
            <input
              type="text"
              required
              value={certForm.issuingOrganization}
              onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
              placeholder="e.g. Amazon Web Services, Oracle"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold mt-4"
          >
            Save Certificate
          </button>
        </form>
      </Modal>
    </div>
  );
};
