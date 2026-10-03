import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  ShieldCheck,
  Lock,
  Edit2,
  Trash2,
  KeyRound,
  Check,
  X,
  AlertCircle,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminRole, AdminUser } from '../../types';

export const AdminRoleManagement: React.FC = () => {
  const {
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    currentAdmin,
    vendors,
    language,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<AdminRole>('SUPPORT_STAFF');
  const [vendorId, setVendorId] = useState<string>('');
  const [avatar, setAvatar] = useState('👨‍💼');

  const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN';

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setPin('');
    setRole('SUPPORT_STAFF');
    setVendorId('');
    setAvatar('👨‍💼');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username);
    setPin(user.pin);
    setRole(user.role);
    setVendorId(user.vendorId || '');
    setAvatar(user.avatar);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !pin) return;

    if (editingUser) {
      updateAdminUser(editingUser.id, {
        name,
        username,
        pin,
        role,
        vendorId: vendorId || undefined,
        avatar,
      });
    } else {
      addAdminUser({
        name,
        username,
        pin,
        role,
        vendorId: vendorId || undefined,
        avatar,
        active: true,
      });
    }

    setIsModalOpen(false);
  };

  const getRoleBadge = (r: AdminRole) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';
      case 'STORE_MANAGER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'SUPPORT_STAFF':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
    }
  };

  const getRoleTitle = (r: AdminRole) => {
    if (language === 'km') {
      if (r === 'SUPER_ADMIN') return 'អភិបាលជាន់ខ្ពស់ (Super Admin)';
      if (r === 'STORE_MANAGER') return 'អ្នកគ្រប់គ្រងហាង (Store Manager)';
      if (r === 'SUPPORT_STAFF') return 'បុគ្គលិកផ្នែកលក់/ឆាត (Support Staff)';
    }
    return r;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#2481cc]" />
            <span>
              {language === 'km'
                ? 'ប្រព័ន្ធគ្រប់គ្រងសិទ្ធិអ្នកគ្រប់គ្រង (RBAC)'
                : 'Role-Based Access Control (RBAC)'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'km'
              ? 'កំណត់អត្តសញ្ញាណ ផ្តល់សិទ្ធិ និងគ្រប់គ្រងគណនីបុគ្គលិកយ៉ាងមានសុវត្ថិភាព'
              : 'Safely identify, assign roles, and manage permissions'}
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'km' ? 'បង្កើតគណនីថ្មី' : 'Add New Admin'}</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            {language === 'km'
              ? 'អ្នកកំពុងចូលជា Store Manager/Staff។ មានតែ Super Admin ប៉ុណ្ណោះដែលអាចបង្កើត ឬលុបគណនីបុគ្គលិកបាន។'
              : 'Only Super Admin accounts have permission to create or delete staff members.'}
          </span>
        </div>
      )}

      {/* Admin Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {adminUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{user.avatar}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {user.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>

              {/* Status & Permissions info */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between text-[11px]">
                  <span>{language === 'km' ? 'តួនាទី' : 'Role Title'}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {getRoleTitle(user.role)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>{language === 'km' ? 'លេខសម្ងាត់ PIN' : 'Security PIN'}:</span>
                  <span className="font-mono font-bold tracking-widest text-slate-500">
                    •••• ({user.pin})
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>{language === 'km' ? 'ហាងគ្រប់គ្រង' : 'Assigned Store'}:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>
                      {user.vendorId
                        ? vendors.find((v) => v.id === user.vendorId)?.nameKh.split('(')[0].trim() || user.vendorId
                        : language === 'km'
                        ? 'ផ្សារទាំងមូល (Master)'
                        : 'All Stores (Master)'}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>{language === 'km' ? 'ស្ថានភាព' : 'Status'}:</span>
                  <span className="font-semibold text-emerald-600">
                    {user.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {isSuperAdmin && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{language === 'km' ? 'កែប្រែ' : 'Edit'}</span>
                </button>
                {adminUsers.length > 1 && user.id !== currentAdmin.id && (
                  <button
                    onClick={() => deleteAdminUser(user.id)}
                    className="px-2.5 py-1 text-xs rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{language === 'km' ? 'លុប' : 'Delete'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Permissions Matrix Explanation */}
      <div className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-[#2481cc]" />
          <span>{language === 'km' ? 'តារាងសិទ្ធិអនុញ្ញាតប្រព័ន្ធ (Permissions Matrix)' : 'Permissions Matrix'}</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Permission Scope</th>
                <th className="py-2.5 px-3">Super Admin</th>
                <th className="py-2.5 px-3">Store Manager</th>
                <th className="py-2.5 px-3">Support Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'ផ្ទាំងស្ថិតិការលក់ជាក់ស្តែង (Analytics)' : 'Sales Analytics'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-slate-500 font-medium">✓ View only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'គ្រប់គ្រងផលិតផល (បន្ថែម / កែប្រែ / លុប)' : 'Products (Add / Edit / Delete)'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-amber-600 font-medium">✕ View only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'ប្រភេទផលិតផល Categories (បន្ថែម / កែប្រែ / លុប)' : 'Categories (Add / Edit / Delete)'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-amber-600 font-medium">✕ View only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'គូប៉ុងបញ្ចុះតម្លៃ Coupons (បង្កើត / កែប្រែ / លុប)' : 'Coupons (Create / Edit / Delete)'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-amber-600 font-medium">✕ View only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'ព័ត៌មាន & សាខាហាង (បន្ថែម / កែប្រែ / លុប)' : 'Store Branches & Info (Add/Edit/Del)'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-amber-600 font-medium">✕ View only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'អាជ្ញាប័ណ្ណឱសថបុរាណ (បញ្ចូល / កែប្រែ / លុប)' : 'Medical Licenses (Add/Edit/Del)'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Add/Edit/Del)</td>
                <td className="py-2.5 px-3 text-amber-600 font-medium">✕ View only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'ការកុម្ម៉ង់ (ប្តូរស្ថានភាព & បញ្ជាក់បង់ប្រាក់)' : 'Orders (Status & Payment Verify)'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Update Status)</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full (Update Status)</td>
                <td className="py-2.5 px-3 text-amber-600 font-medium">✕ View only (Chat/Invoice)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'ការឆ្លើយតប Live Chat ជាមួយអតិថិជន' : 'Customer Support & Live Chat'}
                </td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'គ្រប់គ្រងគណនីបុគ្គលិក Staff (បង្កើត/លុប)' : 'Staff Management (Add/Edit/Del)'}
                </td>
                <td className="py-2.5 px-3 text-purple-600 font-bold">✓ Full (Super Admin only)</td>
                <td className="py-2.5 px-3 text-rose-500 font-semibold">✕ No</td>
                <td className="py-2.5 px-3 text-rose-500 font-semibold">✕ No</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {language === 'km' ? 'ប្រវត្តិសកម្មភាពប្រព័ន្ធ System Audit Logs' : 'Audit Logs'}
                </td>
                <td className="py-2.5 px-3 text-purple-600 font-bold">✓ View & Clear</td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">✓ View only</td>
                <td className="py-2.5 px-3 text-rose-500 font-semibold">✕ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2481cc]" />
                <span>
                  {editingUser
                    ? language === 'km'
                      ? 'កែប្រែព័ត៌មានអ្នកគ្រប់គ្រង'
                      : 'Edit Admin User'
                    : language === 'km'
                    ? 'បង្កើតគណនីអ្នកគ្រប់គ្រងថ្មី'
                    : 'Add New Admin'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 pt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះពេញ *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. គឹម ហេង (Kim Heng)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះសម្គាល់គណនី (Username) *' : 'Username *'}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. heng.support"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'លេខកូដសម្ងាត់ PIN (Security PIN) *' : 'Security PIN *'}
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="e.g. 3456"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc] font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'តួនាទី និងសិទ្ធិ (Role) *' : 'Role & Scope *'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (អភិបាលជាន់ខ្ពស់)</option>
                  <option value="STORE_MANAGER">STORE_MANAGER (អ្នកគ្រប់គ្រងហាង)</option>
                  <option value="SUPPORT_STAFF">SUPPORT_STAFF (បុគ្គលិកផ្នែកលក់/ឆាត)</option>
                </select>
              </div>

              {/* Store Assignment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ហាងដែលត្រូវគ្រប់គ្រង (Store Assignment)' : 'Store Assignment'}
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                >
                  <option value="">
                    👑 {language === 'km' ? 'ផ្សារទាំងមូល (Marketplace Master - All Stores)' : 'All Stores (Marketplace Super Master)'}
                  </option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      🏪 {v.nameKh} ({v.ownerName})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {language === 'km'
                    ? 'ជ្រើសរើស "ផ្សារទាំងមូល" ប្រសិនបើអ្នកចង់ឱ្យគាត់មើល និងគ្រប់គ្រងបានគ្រប់ហាង។'
                    : 'Select "All Stores" to allow overseeing every vendor in the marketplace.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'រូបតំណាង (Avatar)' : 'Avatar'}
                </label>
                <div className="flex gap-2">
                  {['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍🚀', '👑'].map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setAvatar(emo)}
                      className={`text-2xl p-1.5 rounded-xl border ${
                        avatar === emo ? 'border-[#2481cc] bg-sky-50' : 'border-slate-200'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2481cc] text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {editingUser ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
