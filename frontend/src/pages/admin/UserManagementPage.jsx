import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import { Users, Search, UserCheck, UserX, Shield, RefreshCw } from 'lucide-react';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentActive) => {
    try {
      await adminApi.toggleUserStatus(id, !currentActive);
      loadUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await adminApi.updateUserRole(id, newRole);
      loadUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = u.email.toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner text="Loading platform user directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">User Account Governance</h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit user permissions, assign administrative roles, and toggle account activation.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="glass-card rounded-2xl p-4 border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="RECRUITER">Recruiters</option>
            <option value="PLACEMENT_OFFICER">Placement Officers</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="RECRUITER">RECRUITER</option>
                      <option value="PLACEMENT_OFFICER">PLACEMENT_OFFICER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.active ? 'success' : 'danger'}>
                      {u.active ? 'Active' : 'Deactivated'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.active)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        u.active
                          ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-500/30'
                          : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30'
                      }`}
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
