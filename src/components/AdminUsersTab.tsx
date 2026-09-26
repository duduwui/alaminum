import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types/auth';
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/authService';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  User as UserIcon,
  ShieldCheck,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalNotification, setModalNotification] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchQuery, pageSize]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q)) ||
          (u.company && u.company.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const regularUsersCount = users.filter((u) => u.role === 'user').length;
  const activeCount = users.filter((u) => u.status === 'active').length;

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName('');
    setFormPassword('');
    setModalNotification('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormPassword('');
    setModalNotification('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user account "${name}"?`)) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    try {
      const updated = await updateUser(user.id, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalNotification('');

    if (!formName || (!editingUser && formPassword.length < 8)) {
      setModalNotification('Enter a username and a password of at least 8 characters.');
      return;
    }

    try {
      if (editingUser) {
        const updateData: Partial<User> = {
          username: formName,
          status: editingUser.status
        };
        if (formPassword.trim()) {
          (updateData as any).password = formPassword.trim();
        }
        const updated = await updateUser(editingUser.id, updateData);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setModalNotification('User updated successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setModalNotification('');
        }, 800);
      } else {
        if (!formPassword) {
          setModalNotification('Password is required for new accounts');
          return;
        }
        const newUser = await createUser({
          username: formName,
          password: formPassword,
          role: 'admin'
        });
        setUsers((prev) => [newUser, ...prev]);
        setModalNotification('New account created successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setModalNotification('');
        }, 800);
      }
    } catch (err: any) {
      setModalNotification(err.message || 'Operation failed');
    }
  };

  return (
    <main className="p-6 space-y-6 flex-1 overflow-y-auto">
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-extrabold text-slate-900">Administrator accounts</h3><p className="text-xs text-slate-500 mt-1">Create admins with a username and password. Clients create their own accounts by email.</p></div><button type="button" onClick={() => setShowPasswordChange(!showPasswordChange)} className="text-xs font-bold text-red-700">Change my password</button></div>
      {showPasswordChange && <form onSubmit={async (event) => { event.preventDefault(); setPasswordChangeMessage(''); try { const token = localStorage.getItem('dh_admin_token'); const headers: Record<string, string> = { 'Content-Type': 'application/json' }; if (token) headers['Authorization'] = `Bearer ${token}`; const response = await fetch('/api/auth/change-password', { method: 'POST', headers, credentials: 'include', body: JSON.stringify({ currentPassword, newPassword }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setPasswordChangeMessage('Password changed.'); setCurrentPassword(''); setNewPassword(''); } catch (error: any) { setPasswordChangeMessage(error.message || 'Could not change password.'); } }} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap items-end gap-3"><label className="text-xs font-bold text-slate-700">Current password<input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1 block rounded-lg border border-slate-200 p-2" /></label><label className="text-xs font-bold text-slate-700">New password<input required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 block rounded-lg border border-slate-200 p-2" /></label><button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">Save password</button>{passwordChangeMessage && <span role="status" className="text-xs text-slate-700">{passwordChangeMessage}</span>}</form>}
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Total User Accounts</span>
          <h3 className="text-2xl font-black text-slate-900">{users.length}</h3>
          <p className="text-xs text-slate-400">All registered system accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase">Administrators</span>
          <h3 className="text-2xl font-black text-red-600">{adminsCount}</h3>
          <p className="text-xs text-slate-400">Full management and pricing privileges</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase">Client / Buyer Users</span>
          <h3 className="text-2xl font-black text-red-600">{regularUsersCount}</h3>
          <p className="text-xs text-slate-400">Registered architectural clients</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase">Active Accounts</span>
          <h3 className="text-2xl font-black text-emerald-600">{activeCount} / {users.length}</h3>
          <p className="text-xs text-slate-400">Enabled for platform access</p>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search user by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="user">Regular Clients</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Admin</span>
          </button>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Company & Location</th>
                <th className="p-4">Quotations</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No user accounts found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                          u.role === 'admin' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.role === 'admin' && u.id !== 'usr-admin-1' ? `@${u.name}` : u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {u.id === 'usr-admin-1' ? 'Super Admin' : 'Admin'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                          Client
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{u.phone || '—'}</p>
                      <span className="text-[10px] text-slate-400">Direct mobile</span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{u.company || 'Private Client'}</p>
                      <p className="text-[11px] text-slate-500">{u.city || 'Erbil'}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                        {u.requestsCount || 0} RFQs
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        disabled={u.id === 'usr-admin-1' || u.role !== 'admin'}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {u.status === 'active' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.id !== 'usr-admin-1' && u.role === 'admin' && <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>}
                        {u.id !== 'usr-admin-1' && u.role === 'admin' && <button
                          type="button"
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, filteredUsers.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredUsers.length}</span> users
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-600 font-bold">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
              >
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-900">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  {editingUser ? <Edit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingUser ? `Edit Account: ${editingUser.name}` : 'Create Admin Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {modalNotification && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600" />
                  <span>{modalNotification}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Admin username *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. doorhome.manager"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {editingUser ? 'New Password (leave blank to keep)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? '••••••••' : 'Set login password'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUsersTab;
