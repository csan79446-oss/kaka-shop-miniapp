import React, { useState } from 'react';
import {
  Store,
  User,
  Phone,
  Send,
  MapPin,
  CreditCard,
  Lock,
  Key,
  Eye,
  EyeOff,
  Dices,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MerchantSelfRegistrationProps {
  onBackToLogin: () => void;
}

export const MerchantSelfRegistration: React.FC<MerchantSelfRegistrationProps> = ({
  onBackToLogin,
}) => {
  const { language, registerVendorSelf } = useApp();

  // Step 1: Store info, Step 2: Owner & Login, Step 3: Bank
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [nameKh, setNameKh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('gadgets');
  const [city, setCity] = useState('Phnom Penh');
  const [addressKh, setAddressKh] = useState('');

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('8888');
  const [showPassword, setShowPassword] = useState(false);

  const [bankName, setBankName] = useState('ABA Bank');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const autoGenerateUsername = (enName: string) => {
    const raw = enName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return raw ? `${raw}_admin` : 'store_admin';
  };

  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKh.trim() || !nameEn.trim()) {
      setErrorMsg(language === 'km' ? 'សូមបំពេញឈ្មោះហាងជាភាសាខ្មែរ និងអង់គ្លេស' : 'Please provide store name in Khmer & English');
      return;
    }
    setErrorMsg(null);
    if (!username) {
      setUsername(autoGenerateUsername(nameEn));
    }
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerPhone.trim() || !username.trim() || !pin.trim()) {
      setErrorMsg(language === 'km' ? 'សូមបំពេញលេខទូរស័ព្ទ Username និង PIN' : 'Please fill in phone, username, and PIN');
      return;
    }

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = registerVendorSelf({
      nameKh: nameKh.trim(),
      nameEn: nameEn.trim(),
      slug,
      category,
      city,
      addressKh: addressKh.trim() || city,
      ownerName: ownerName.trim() || nameKh.trim(),
      ownerPhone: ownerPhone.trim(),
      telegramUsername: telegramUsername.trim().replace(/^@/, ''),
      bankName,
      bankAccountName: bankAccountName.trim().toUpperCase() || ownerName.trim().toUpperCase(),
      bankAccountNumber: bankAccountNumber.trim(),
      username: username.trim().toLowerCase(),
      pin: pin.trim(),
    });

    if (!result.success) {
      setErrorMsg(result.messageKh || 'Registration failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4 animate-fade-in">
      <div className="bg-white dark:bg-[#17212b] rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={step === 2 ? () => setStep(1) : onBackToLogin}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 2 ? (language === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back') : (language === 'km' ? 'ទៅកាន់ Login' : 'Back to Login')}</span>
          </button>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2481cc] dark:bg-blue-950/60 dark:text-sky-300 border border-blue-200 dark:border-blue-900">
            {step === 1 ? 'ជំហាន ១/២ (ព័ត៌មានហាង)' : 'ជំហាន ២/២ (គណនី & ម្ចាស់ហាង)'}
          </span>
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2481cc] to-sky-400 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {language === 'km' ? 'ចុះឈ្មោះបើកហាងលក់ដោយខ្លួនឯង' : 'Self-Register Your Store'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'km'
              ? 'បង្កើតហាងផ្ទាល់ខ្លួន និងទទួលបាន Link & QR Code លក់ទំនិញភ្លាមៗ!'
              : 'Create your store to get dedicated store link & QR code instantly!'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl text-xs font-medium border border-rose-200 text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Store Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'ឈ្មោះហាង (ភាសាខ្មែរ) *' : 'Store Name (Khmer) *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameKh}
                  onChange={(e) => setNameKh(e.target.value)}
                  placeholder="ឧ. ហាង សប្បាយ ម៉ូត & ស្ទាយ"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'ឈ្មោះហាង (English) *' : 'Store Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    if (!username || username.endsWith('_admin')) {
                      setUsername(autoGenerateUsername(e.target.value));
                    }
                  }}
                  placeholder="e.g. Sabay Fashion Shop"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'ប្រភេទមុខទំនិញ (Category)' : 'Business Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                >
                  <option value="gadgets">Gadgets & Tech (អេឡិចត្រូនិក)</option>
                  <option value="fashion">Fashion & Apparel (សម្លៀកបំពាក់)</option>
                  <option value="health">Health & Medicine (សុខភាព & ថ្នាំ)</option>
                  <option value="beverage">Food & Beverage (ម្ហូប & ភេសជ្ជៈ)</option>
                  <option value="lifestyle">Lifestyle & Home (គេហដ្ឋាន)</option>
                  <option value="general">General (ទូទៅ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'រាជធានី / ខេត្ត' : 'City / Province'}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                >
                  <option value="Phnom Penh">រាជធានីភ្នំពេញ (Phnom Penh)</option>
                  <option value="Siem Reap">ខេត្តសៀមរាប (Siem Reap)</option>
                  <option value="Battambang">ខេត្តបាត់ដំបង (Battambang)</option>
                  <option value="Sihanoukville">ខេត្តព្រះសីហនុ (Sihanoukville)</option>
                  <option value="Kampot">ខេត្តកំពត (Kampot)</option>
                  <option value="Kandal">ខេត្តកណ្តាល (Kandal)</option>
                  <option value="Other">ខេត្តផ្សេងៗ (Other)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {language === 'km' ? 'អាសយដ្ឋានទីតាំងហាង' : 'Store Address'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={addressKh}
                  onChange={(e) => setAddressKh(e.target.value)}
                  placeholder="ឧ. ផ្ទះលេខ ១២ ផ្លូវ ២០០ សង្កាត់បឹងកេងកង១..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>{language === 'km' ? 'បន្តទៅកំណត់គណនី (Next)' : 'Continue to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Owner & Admin Login Credentials */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-3.5 text-xs">
            {/* Owner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'ឈ្មោះម្ចាស់ហាង *' : 'Owner Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="ឧ. សុខ វិបុល"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'លេខទូរស័ព្ទទំនាក់ទំនង *' : 'Phone Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                {language === 'km' ? 'Telegram Username (ស្រេចចិត្ត)' : 'Telegram Username'}
              </label>
              <div className="relative">
                <Send className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@your_shop_channel"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>
            </div>

            {/* Login Credentials Box */}
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/90 dark:border-indigo-900/60 space-y-2.5">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                  {language === 'km' ? 'កំណត់គណនីសម្រាប់ Login ចូលគ្រប់គ្រងហាង' : 'Manager Login Credentials'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះគណនី (Username) *' : 'Username *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                    placeholder="e.g. sabay_admin"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {language === 'km' ? 'លេខកូដសម្ងាត់ (PIN / Password) *' : 'PIN / Password *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setPin(generateRandomPin())}
                      className="text-[10px] text-indigo-600 font-semibold flex items-center gap-0.5"
                    >
                      <Dices className="w-2.5 h-2.5" />
                      <span>{language === 'km' ? 'ចៃដន្យ' : 'Random'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="e.g. 8888"
                      className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Bank Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                <CreditCard className="w-4 h-4 text-[#2481cc]" />
                <span>{language === 'km' ? 'គណនីធនាគារទទួលប្រាក់ (Payout Bank)' : 'Bank Account for Payout'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="ABA Bank">ABA Bank</option>
                    <option value="ACLEDA Bank">ACLEDA Bank</option>
                    <option value="Wing Bank">Wing Bank</option>
                    <option value="Bakong KHQR">Bakong KHQR</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder={language === 'km' ? 'លេខគណនី (Account No.)' : 'Account Number'}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'km' ? 'ចុះឈ្មោះ និងបើកហាងភ្លាមៗ (Open Store)' : 'Register & Launch Store'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
