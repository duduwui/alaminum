import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types/auth';
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/authService';
import {
  UserPlus,
  ShieldCheck,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AdminUsersTab: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // In-session revealed plain-text passwords for admins created or modified in this session
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [visibleRowPasswords, setVisibleRowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalNotification, setModalNotification] = useState('');
  const [createdAdminResult, setCreatedAdminResult] = useState<{ name: string; pass: string } | null>(null);

  // Password Visibility States
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Password Change Banner State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setLoadError(err.message || 'Could not load administrator accounts. Please verify your session.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter only administrators (clean and strictly admins as requested)
  const admins = useMemo(() => {
    return users.filter((u) => u.role === 'admin' || u.role === 'super_admin');
  }, [users]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormName('');
    setFormPassword('');
    setModalNotification('');
    setCreatedAdminResult(null);
    setShowModalPassword(true); // Default to visible so they can see what they type
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name || user.username || '');
    setFormPassword(revealedPasswords[user.id] || '');
    setModalNotification('');
    setCreatedAdminResult(null);
    setShowModalPassword(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete admin account "${name}"?`)) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete admin');
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

  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalNotification('');

    const trimmedName = formName.trim();
    if (!trimmedName || (!editingUser && formPassword.length < 8)) {
      setModalNotification('Enter a name (min 2 chars) and a password (min 8 chars).');
      return;
    }

    try {
      if (editingUser) {
        const updateData: any = {
          username: trimmedName
        };
        if (formPassword.trim()) {
          updateData.password = formPassword.trim();
        }
        const updated = await updateUser(editingUser.id, updateData);
        if (formPassword.trim()) {
          setRevealedPasswords((prev) => ({ ...prev, [editingUser.id]: formPassword.trim() }));
          setVisibleRowPasswords((prev) => ({ ...prev, [editingUser.id]: true }));
        }
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setModalNotification('Admin updated successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setModalNotification('');
        }, 900);
      } else {
        if (!formPassword) {
          setModalNotification('Password is required for new accounts');
          return;
        }
        const enteredPass = formPassword.trim();
        const newUser = await createUser({
          username: trimmedName,
          password: enteredPass,
          role: 'admin'
        });
        setRevealedPasswords((prev) => ({ ...prev, [newUser.id]: enteredPass }));
        setVisibleRowPasswords((prev) => ({ ...prev, [newUser.id]: true }));
        setUsers((prev) => [newUser, ...prev]);
        setCreatedAdminResult({ name: trimmedName, pass: enteredPass });
        setModalNotification('New admin created successfully!');
      }
    } catch (err: any) {
      setModalNotification(err.message || 'Operation failed');
    }
  };

  return (
    <main className="p-3 sm:p-6 space-y-5 flex-1 overflow-y-auto">
      {/* Top Banner & Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Administrator Accounts
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {admins.length} {admins.length === 1 ? 'Admin' : 'Admins'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Manage administrative credentials. Create accounts in English, Arabic, or Kurdish. Use the eye toggle to view passwords while typing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Change my password</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Admin</span>
          </button>
        </div>
      </div>

      {/* Load Error & Retry Banner */}
      {loadError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{loadError}</span>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Password Change Form Dropdown */}
      {showPasswordChange && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setPasswordChangeMessage('');
            try {
              const token = localStorage.getItem('dh_admin_token');
              const headers: Record<string, string> = { 'Content-Type': 'application/json' };
              if (token) headers['Authorization'] = `Bearer ${token}`;
              const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword })
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.error);
              setPasswordChangeMessage('Password successfully changed.');
              setCurrentPassword('');
              setNewPassword('');
              setTimeout(() => setShowPasswordChange(false), 1500);
            } catch (error: any) {
              setPasswordChangeMessage(error.message || 'Could not change password.');
            }
          }}
          className="rounded-2xl border border-red-200/80 bg-red-50/40 p-4 sm:p-5 flex flex-wrap items-end gap-3.5 animate-in fade-in"
        >
          {/* Current Password with Eye Icon */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Current password</label>
            <div className="relative w-full sm:w-56">
              <input
                required
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white pr-9 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                title={showCurrentPassword ? 'Hide current password' : 'View current password'}
              >
                {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* New Password with Eye Icon */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">New password (min 8 chars)</label>
            <div className="relative w-full sm:w-56">
              <input
                required
                minLength={8}
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white pr-9 p-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                title={showNewPassword ? 'Hide new password' : 'View new password'}
              >
                {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 hover:bg-black px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Save password
          </button>
          {passwordChangeMessage && (
            <span role="status" className="text-xs font-bold text-slate-800">
              {passwordChangeMessage}
            </span>
          )}
        </form>
      )}

      {/* Admins Table / Responsive List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Desktop & Tablet Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[380px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Admin Name</th>
                <th className="p-4">Password</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                      <span>Loading administrators...</span>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    No administrators found. Click &quot;Create Admin&quot; to add one.
                  </td>
                </tr>
              ) : (
                admins.map((u) => {
                  const hasPlainPass = Boolean(revealedPasswords[u.id]);
                  const isPassVisible = Boolean(visibleRowPasswords[u.id]);
                  const currentDisplayPass = hasPlainPass && isPassVisible
                    ? revealedPasswords[u.id]
                    : '••••••••';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name (Supports Arabic, Kurdish, English with dir="auto") */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs bg-red-600 text-white shrink-0 shadow-xs">
                            {u.name?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm" dir="auto">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-slate-400" dir="ltr">
                              {u.id === 'usr-admin-1' ? 'Super Administrator' : `@${u.username || u.name}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Password with Eye Toggle */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-800 font-bold text-xs bg-slate-100 px-2 py-1 rounded-md tracking-wider">
                            {currentDisplayPass}
                          </span>

                          {/* Eye toggle icon */}
                          {hasPlainPass ? (
                            <button
                              type="button"
                              onClick={() => {
                                setVisibleRowPasswords((prev) => ({
                                  ...prev,
                                  [u.id]: !prev[u.id]
                                }));
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title={isPassVisible ? 'Hide password' : 'View password'}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(u)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title="Encrypted with scrypt. Click 'Change' to set and view a new password."
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Copy button if plain password is known */}
                          {hasPlainPass && isPassVisible && (
                            <button
                              type="button"
                              onClick={() => handleCopyCredentials(revealedPasswords[u.id], u.id)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              title="Copy password"
                            >
                              {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {u.id !== 'usr-admin-1' && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(u)}
                              className="text-[10px] text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer ml-1"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.id !== 'usr-admin-1' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(u)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer"
                                title="Edit Admin"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(u.id, u.name)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
                                title="Delete Admin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  {editingUser ? <Edit className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900" dir="auto">
                  {editingUser ? `Edit Admin: ${editingUser.name}` : 'Create Admin Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            {createdAdminResult ? (
              /* Success Card with Credentials & 1-Click Copy */
              <div className="p-5 sm:p-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-black text-sm">Administrator Created!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    The admin account is ready. Save or share these credentials securely:
                  </p>
                  <div className="mt-3 p-3 bg-white/90 rounded-xl border border-emerald-200/70 space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans text-[11px] font-bold">Name:</span>
                      <span className="font-bold text-slate-900" dir="auto">{createdAdminResult.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans text-[11px] font-bold">Password:</span>
                      <span className="font-bold text-red-600">{createdAdminResult.pass}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCopyCredentials(`Username: ${createdAdminResult.name}\nPassword: ${createdAdminResult.pass}`, 'modal')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                  >
                    {copiedId === 'modal' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === 'modal' ? 'Copied!' : 'Copy Credentials'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCreatedAdminResult(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
                {modalNotification && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{modalNotification}</span>
                  </div>
                )}

                {/* Name / Username (Supports English, Arabic, Kurdish) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 block">Admin Name / Username *</label>
                    <span className="text-[10px] text-slate-400">English, Arabic or Kurdish</span>
                  </div>
                  <input
                    type="text"
                    required
                    dir="auto"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. علي or doorhome.admin"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Password with Eye Toggle Button */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 block">
                      {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                    </label>
                    <span className="text-[10px] text-slate-400">Min 8 chars</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      required={!editingUser}
                      minLength={editingUser ? undefined : 8}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder={editingUser ? '••••••••' : 'Minimum 8 characters'}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                      title={showModalPassword ? 'Hide password' : 'View password'}
                    >
                      {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUsersTab;
