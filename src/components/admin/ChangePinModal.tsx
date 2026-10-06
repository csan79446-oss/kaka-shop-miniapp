import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../services/telegram';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({ isOpen, onClose }) => {
  const { currentAdmin, updateAdminUser, language } = useApp();

  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !currentAdmin) return null;

  const handleGeneratePin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setNewPin(randomPin);
    setConfirmPin(randomPin);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate current PIN
    if (currentPinInput !== currentAdmin.pin) {
      setError(
        language === 'km'
          ? 'លេខកូដ PIN បច្ចុប្បន្នមិនត្រឹមត្រូវទេ! សូមពិនិត្យម្តងទៀត'
          : 'Current PIN is incorrect! Please verify and try again.'
      );
      triggerHaptic?.('error');
      return;
    }

    // Validate new PIN length
    if (newPin.length < 4 || newPin.length > 6) {
      setError(
        language === 'km'
          ? 'លេខកូដ PIN ថ្មីត្រូវតែមានពី ៤ ទៅ ៦ ខ្ទង់'
          : 'New PIN must be between 4 and 6 digits.'
      );
      triggerHaptic?.('error');
      return;
    }

    // Validate confirmation
    if (newPin !== confirmPin) {
      setError(
        language === 'km'
          ? 'លេខកូដ PIN ថ្មីទាំងពីរមិនដូចគ្នាទេ! សូមផ្ទៀងផ្ទាត់ម្តងទៀត'
          : 'New PIN and confirmation do not match!'
      );
      triggerHaptic?.('error');
      return;
    }

    // Save changes
    updateAdminUser(currentAdmin.id, { pin: newPin });
    triggerHaptic?.('success');
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setCurrentPinInput('');
      setNewPin('');
      setConfirmPin('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#17212b] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{language === 'km' ? 'ប្តូរលេខកូដសម្ងាត់ PIN' : 'Change Security PIN'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'km'
                  ? 'កំណត់លេខកូដសម្ងាត់ថ្មីសម្រាប់ចូលគ្រប់គ្រងប្រព័ន្ធ'
                  : 'Set a new security PIN for admin portal access'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Info Card */}
        <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentAdmin.avatar || '👑'}</span>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                {currentAdmin.name}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                @{currentAdmin.username}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
            {currentAdmin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </span>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">
              {language === 'km'
                ? 'លេខកូដ PIN ថ្មីត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ! ✓'
                : 'Security PIN has been updated successfully! ✓'}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Current PIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'km' ? 'លេខកូដ PIN បច្ចុប្បន្ន (Current PIN) *' : 'Current PIN *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showCurrentPin ? 'text' : 'password'}
                required
                maxLength={6}
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono tracking-widest focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPin(!showCurrentPin)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New PIN */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'km' ? 'លេខកូដ PIN ថ្មី (New PIN 4-6 ខ្ទង់) *' : 'New PIN (4-6 digits) *'}
              </label>
              <button
                type="button"
                onClick={handleGeneratePin}
                className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{language === 'km' ? 'បង្កើត PIN ចៃដន្យ' : 'Auto Generate'}</span>
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPin ? 'text' : 'password'}
                required
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="4-6 ខ្ទង់ ឧ. 7890"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono tracking-widest focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New PIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'km' ? 'បញ្ជាក់លេខកូដ PIN ថ្មីម្តងទៀត (Confirm PIN) *' : 'Confirm New PIN *'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPin ? 'text' : 'password'}
                required
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="វាយលេខកូដថ្មីដដែលម្តងទៀត"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono tracking-widest focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {language === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={success}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md active:scale-98 transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'km' ? 'រក្សាទុក PIN ថ្មី' : 'Save New PIN'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
