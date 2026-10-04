import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, Sparkles, Store, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MerchantSelfRegistration } from './MerchantSelfRegistration';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, adminUsers, vendors, getVendorById, language } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);
  const [showQuickSwitch, setShowQuickSwitch] = useState(false);

  if (isRegistering) {
    return <MerchantSelfRegistration onBackToLogin={() => setIsRegistering(false)} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username.trim() || pin.trim(), pin.trim() || undefined);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const handleQuickRoleLogin = (userPin: string) => {
    loginAdmin(userPin);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-fade-in">
      <div className="bg-white dark:bg-[#17212b] rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-[#2481cc]/10 text-[#2481cc] flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {language === 'km'
              ? 'ផ្ទាំងគ្រប់គ្រង Phsar24 Admin'
              : 'Phsar24 Admin Portal'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'ប្រព័ន្ធគ្រប់គ្រងសុវត្ថិភាព និងការអនុញ្ញាតសិទ្ធិ'
              : 'Secure Role-Based Access & Operations'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'km' ? 'ឈ្មោះគណនី (ស្រេចចិត្ត)' : 'Username (Optional)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. vibol.superadmin"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'km' ? 'លេខកូដសម្ងាត់ PIN (Security PIN) *' : 'Security PIN *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc] tracking-widest font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs text-center border border-rose-200 font-medium">
              {language === 'km'
                ? 'លេខសម្ងាត់ PIN មិនត្រឹមត្រូវទេ! សូមសាកល្បងម្តងទៀត'
                : 'Invalid PIN or credentials! Please try again.'}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{language === 'km' ? 'ចូលប្រព័ន្ធ' : 'Authenticate & Login'}</span>
          </button>

          {/* Self Register Store Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 py-1 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>
                {language === 'km'
                  ? '🏪 តើលោកអ្នកជាម្ចាស់ហាងមែនទេ? ចុះឈ្មោះបើកហាងថ្មីនៅទីនេះ'
                  : '🏪 Are you a merchant? Register your store here'}
              </span>
            </button>
          </div>
        </form>

        {/* Quick Demo Role Logins - Hidden by default for real security & privacy */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          {showQuickSwitch ? (
            <div className="text-left animate-fade-in">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {language === 'km' ? 'ចូលរហ័សតាមតួនាទី (Quick Switch):' : 'Quick Role Logins:'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickSwitch(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-medium"
                >
                  {language === 'km' ? 'លាក់វិញ' : 'Hide'}
                </button>
              </div>

              <div className="space-y-2">
                {adminUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickRoleLogin(user.pin)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2481cc] dark:hover:border-[#50a7ea] bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between transition-all group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{user.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#2481cc]">
                            {user.name}
                          </span>
                          {user.vendorId ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <Store className="w-2.5 h-2.5" />
                              <span>{vendors.find((v) => v.id === user.vendorId)?.nameKh.split('(')[0].trim() || user.vendorId}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              👑 {language === 'km' ? 'គ្រប់គ្រងគ្រប់ហាងទាំងអស់' : 'All Stores Master'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          PIN: {user.pin} · {user.role}
                        </div>
                        <div className="text-[10px] text-[#2481cc] dark:text-sky-400 mt-0.5 font-medium">
                          {user.role === 'SUPER_ADMIN'
                            ? language === 'km'
                              ? '👑 ម្ចាស់ផ្សារ (Marketplace Owner) - ត្រួតពិនិត្យ និងមើលការលក់បានគ្រប់ហាង'
                              : '👑 Marketplace Super Admin - Oversees all vendors & operations'
                            : user.role === 'STORE_MANAGER'
                            ? language === 'km'
                              ? '⚡ ម្ចាស់ហាង/អ្នកគ្រប់គ្រង - គ្រប់គ្រងទំនិញ និងការលក់សម្រាប់តែហាងខ្លួនឯង'
                              : '⚡ Store Manager - Manages inventory & orders for own store only'
                            : language === 'km'
                            ? '👁️ បុគ្គលិកជំនួយ - សិទ្ធិមើល និងឆ្លើយតបឆាតភ្ញៀវ'
                            : '👁️ Support Staff - View-only & customer live chat'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold group-hover:bg-[#2481cc] group-hover:text-white transition-colors">
                      {language === 'km' ? 'ចូលភ្លាម' : 'Login'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowQuickSwitch(true)}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{language === 'km' ? 'ចូលរហ័សសម្រាប់អ្នកអភិវឌ្ឍន៍ (Demo Switch)' : 'Developer Demo Switch'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
