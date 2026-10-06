import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MerchantSelfRegistration } from './MerchantSelfRegistration';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, language } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);

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
                placeholder="e.g. smuntha.superadmin"
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
      </div>
    </div>
  );
};
