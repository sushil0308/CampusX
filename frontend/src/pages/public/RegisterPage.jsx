import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Building2, User, Mail, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    rollNumber: '',
    department: 'CSE',
    cgpa: 8.0,
    graduationYear: 2025,
    companyName: '',
    designation: 'Technical Recruiter',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const payload = {
        ...formData,
        role,
        cgpa: role === 'STUDENT' ? parseFloat(formData.cgpa) : undefined,
        graduationYear: role === 'STUDENT' ? parseInt(formData.graduationYear) : undefined,
      };
      const user = await register(payload);
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else navigate('/recruiter/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full glass-card rounded-3xl p-6 sm:p-8 border-slate-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white">Create Your CampusX Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the campus placement network</p>

          {/* Role Toggle */}
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl mt-4">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                role === 'STUDENT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                role === 'RECRUITER' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recruiter</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Rohit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Verma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={role === 'STUDENT' ? 'rohit.verma@campusx.edu' : 'recruiter@company.com'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {role === 'STUDENT' ? (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Academic Credentials</p>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Roll No.</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="21CS099"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EE">EE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Company Affiliation</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Adobe, Intel"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Your Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Talent Partner"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Complete Registration</span>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
