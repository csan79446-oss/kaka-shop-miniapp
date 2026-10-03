import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  Ticket,
  Copy,
  ToggleLeft,
  ToggleRight,
  Gift,
  DollarSign,
  Percent,
  Truck,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coupon } from '../../types';
import { RbacNoticeBanner } from './RbacNoticeBanner';

export const AdminCouponManagement: React.FC = () => {
  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    language,
    formatPrice,
    canManageContent,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [descriptionKh, setDescriptionKh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(0);
    setMaxDiscount(0);
    setExpiryDate('2026-12-31');
    setMaxUsage(100);
    setDescriptionKh('');
    setDescriptionEn('');
    setIsActive(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderAmount(c.minOrderAmount || 0);
    setMaxDiscount(c.maxDiscount || 0);
    setExpiryDate(c.expiryDate ? c.expiryDate.slice(0, 10) : '2026-12-31');
    setMaxUsage(c.maxUsage || 100);
    setDescriptionKh(c.descriptionKh);
    setDescriptionEn(c.descriptionEn);
    setIsActive(c.active);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code.trim()) {
      setErrorMsg(
        language === 'km' ? 'សូមបញ្ចូលកូដគូប៉ុង' : 'Please enter coupon code'
      );
      return;
    }

    const cleanCode = code.trim().toUpperCase();

    if (!editingCoupon && coupons.some((c) => c.code === cleanCode)) {
      setErrorMsg(
        language === 'km'
          ? 'កូដគូប៉ុងនេះមានរួចហើយ'
          : 'Coupon code already exists'
      );
      return;
    }

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: cleanCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || undefined,
        maxDiscount: Number(maxDiscount) || undefined,
        expiryDate,
        maxUsage: Number(maxUsage) || undefined,
        active: isActive,
        descriptionKh: descriptionKh.trim() || `${cleanCode} បញ្ចុះតម្លៃ`,
        descriptionEn: descriptionEn.trim() || `${cleanCode} discount`,
      });
    } else {
      addCoupon({
        code: cleanCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || undefined,
        maxDiscount: Number(maxDiscount) || undefined,
        expiryDate,
        maxUsage: Number(maxUsage) || undefined,
        active: isActive,
        descriptionKh: descriptionKh.trim() || `${cleanCode} បញ្ចុះតម្លៃ`,
        descriptionEn: descriptionEn.trim() || `${cleanCode} discount`,
      });
    }

    setIsModalOpen(false);
  };

  const applyPreset = (type: '15' | 'ship' | 'fixed') => {
    if (type === '15') {
      setCode(`SALE${Math.floor(10 + Math.random() * 90)}`);
      setDiscountType('percentage');
      setDiscountValue(15);
      setMinOrderAmount(20);
      setMaxDiscount(10);
      setDescriptionKh('បញ្ចុះតម្លៃ 15% សម្រាប់ការកុម្ម៉ង់លើសពី $20');
      setDescriptionEn('15% OFF for orders over $20');
    } else if (type === 'ship') {
      setCode(`FREESHIP${Math.floor(10 + Math.random() * 90)}`);
      setDiscountType('free_shipping');
      setDiscountValue(1.5);
      setMinOrderAmount(15);
      setDescriptionKh('ដឹកជញ្ជូនឥតគិតថ្លៃ');
      setDescriptionEn('Free standard delivery');
    } else {
      setCode(`GIFT${Math.floor(10 + Math.random() * 90)}`);
      setDiscountType('fixed');
      setDiscountValue(3.0);
      setMinOrderAmount(15);
      setDescriptionKh('បញ្ចុះតម្លៃ $3.00 ភ្លាមៗ');
      setDescriptionEn('$3.00 instant discount');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <RbacNoticeBanner moduleNameKh="គូប៉ុងបញ្ចុះតម្លៃ" moduleNameEn="coupons & promo codes" />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'km' ? 'គ្រប់គ្រងគូប៉ុងបញ្ចុះតម្លៃ' : 'Coupon & Promo Codes'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {coupons.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'km'
                ? 'បង្កើតកូដបញ្ចុះតម្លៃ % ឬទឹកប្រាក់ និង Free ដឹកជញ្ជូនសម្រាប់អតិថិជន'
                : 'Create and manage percentage, cash, and free shipping coupons'}
            </p>
          </div>
        </div>

        {canManageContent ? (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'km' ? 'បង្កើតគូប៉ុងថ្មី' : 'Create Coupon'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'km' ? 'សិទ្ធិមើលប៉ុណ្ណោះ' : 'View Only'}</span>
          </div>
        )}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {coupons.map((c) => {
          const isExpired =
            c.expiryDate && new Date(c.expiryDate) < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={c.id}
              className={`bg-white dark:bg-[#17212b] p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                !c.active || isExpired
                  ? 'border-slate-200 dark:border-slate-800 opacity-60'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-sm tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <span>{c.code}</span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="text-amber-600 hover:text-amber-800"
                        title="Copy"
                      >
                        {copiedCode === c.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </span>

                    {canManageContent ? (
                      <button
                        onClick={() => updateCoupon(c.id, { active: !c.active })}
                        className="text-xs"
                        title={c.active ? 'Disable' : 'Enable'}
                      >
                        {c.active ? (
                          <ToggleRight className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {c.active ? 'Active' : 'Disabled'}
                      </span>
                    )}
                  </div>

                  {canManageContent ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-400 hover:text-[#2481cc] rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>View</span>
                    </span>
                  )}
                </div>

                {/* Badge & Discount */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg font-black text-[#2481cc] flex items-center gap-1">
                    {c.discountType === 'percentage' && (
                      <>
                        <Percent className="w-4 h-4" />
                        <span>{c.discountValue}% OFF</span>
                      </>
                    )}
                    {c.discountType === 'fixed' && (
                      <>
                        <DollarSign className="w-4 h-4" />
                        <span>${c.discountValue.toFixed(2)} OFF</span>
                      </>
                    )}
                    {c.discountType === 'free_shipping' && (
                      <>
                        <Truck className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-600 dark:text-purple-400 text-sm">FREE SHIPPING</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {language === 'km' ? c.descriptionKh : c.descriptionEn}
                </p>

                {/* Conditions */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                  {c.minOrderAmount ? (
                    <div>
                      {language === 'km'
                        ? `កុម្ម៉ង់អប្បបរមា៖ $${c.minOrderAmount}`
                        : `Min Order: $${c.minOrderAmount}`}
                    </div>
                  ) : null}

                  {c.maxDiscount ? (
                    <div>
                      {language === 'km'
                        ? `បញ្ចុះអតិបរមា៖ $${c.maxDiscount}`
                        : `Max Discount: $${c.maxDiscount}`}
                    </div>
                  ) : null}

                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {language === 'km' ? 'ផុតកំណត់៖ ' : 'Expires: '}
                      {c.expiryDate}
                    </span>
                    {isExpired && (
                      <span className="text-rose-500 font-bold ml-1">
                        ({language === 'km' ? 'ផុតកំណត់ហើយ' : 'Expired'})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {language === 'km' ? 'ចំនួនប្រើប្រាស់៖' : 'Times Used:'}
                </span>
                <span className="font-bold font-mono text-slate-800 dark:text-white">
                  {c.usageCount} {c.maxUsage ? `/ ${c.maxUsage}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#17212b] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-scale-up">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {editingCoupon
                    ? language === 'km'
                      ? 'កែប្រែគូប៉ុង'
                      : 'Edit Coupon'
                    : language === 'km'
                    ? 'បង្កើតគូប៉ុងបញ្ចុះតម្លៃថ្មី'
                    : 'Create New Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Presets */}
              {!editingCoupon && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    {language === 'km' ? 'គំរូរហ័ស (Quick Presets)' : 'Quick Presets'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset('15')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#2481cc] border border-sky-200 dark:border-sky-800"
                    >
                      15% OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('ship')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-800"
                    >
                      Free Shipping
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('fixed')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800"
                    >
                      $3 OFF
                    </button>
                  </div>
                </div>
              )}

              {/* Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'កូដគូប៉ុង (Coupon Code) *' : 'Coupon Code *'}
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KAKA2026, SUMMER20"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              {/* Discount Type */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                    discountType === 'percentage'
                      ? 'border-[#2481cc] bg-sky-50 dark:bg-sky-950/50 text-[#2481cc]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  <span>{language === 'km' ? 'ភាគរយ %' : 'Percent %'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                    discountType === 'fixed'
                      ? 'border-[#2481cc] bg-sky-50 dark:bg-sky-950/50 text-[#2481cc]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{language === 'km' ? 'ទឹកប្រាក់ $' : 'Amount $'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiscountType('free_shipping')}
                  className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                    discountType === 'free_shipping'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Free Ship</span>
                </button>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {discountType === 'percentage'
                    ? language === 'km'
                      ? 'តម្លៃបញ្ចុះជាភាគរយ (%)'
                      : 'Discount Percentage (%)'
                    : discountType === 'fixed'
                    ? language === 'km'
                      ? 'តម្លៃបញ្ចុះជាប្រាក់ ($)'
                      : 'Discount Amount ($)'
                    : language === 'km'
                    ? 'តម្លៃសេវាដឹកជញ្ជូនដែលត្រូវកាត់ ($)'
                    : 'Waived Shipping Fee ($)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              {/* Min Spend & Expiry */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'កុម្ម៉ង់អប្បបរមា ($)' : 'Min Order ($)'}
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'កាលបរិច្ឆេទផុតកំណត់' : 'Expiry Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ការពិពណ៌នា (ភាសាខ្មែរ)' : 'Description (Khmer)'}
                </label>
                <input
                  type="text"
                  value={descriptionKh}
                  onChange={(e) => setDescriptionKh(e.target.value)}
                  placeholder="ឧ. បញ្ចុះតម្លៃ 15% សម្រាប់ការកុម្ម៉ង់ចាប់ពី $20"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  {editingCoupon
                    ? language === 'km'
                      ? 'រក្សាទុក'
                      : 'Save Changes'
                    : language === 'km'
                    ? 'បង្កើតគូប៉ុង'
                    : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
