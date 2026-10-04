import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Order, Vendor } from '../../types';
import { generateKhqrString, getKhqrQrImageUrl } from '../../utils/khqr';
import { useApp } from '../../context/AppContext';

interface BakongPaymentModalProps {
  isOpen: boolean;
  order: Order;
  vendor?: Vendor | null;
  onClose: () => void;
  onPaymentSuccess: (receiptImage?: string) => void;
}

export const BakongPaymentModal: React.FC<BakongPaymentModalProps> = ({
  isOpen,
  order,
  vendor,
  onClose,
  onPaymentSuccess,
}) => {
  const { language, formatPrice } = useApp();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'slip'>('scan');

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const merchantName = vendor?.nameEn || 'Phsar24 Merchant';
  const merchantNameKh = vendor?.nameKh || 'Phsar24 ផ្សារអនឡាញ';
  const bakongId = vendor?.bakongId || vendor?.bankAccountNumber || 'kaka_gadgets@aba';
  const totalAmount = order.totalAmount;
  const rielAmount = Math.round(totalAmount * 4100);

  // Generate real standard EMVCo KHQR String
  const khqrPayload = generateKhqrString({
    bakongId,
    merchantName: vendor?.nameEn || 'Phsar24 Store',
    amount: totalAmount,
    currency: 'USD',
    billNumber: order.orderNumber,
    storeLabel: vendor?.slug || 'Store',
  });

  const qrImageUrl = getKhqrQrImageUrl(khqrPayload, 340);

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(totalAmount.toFixed(2));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyQrString = () => {
    navigator.clipboard.writeText(khqrPayload);
    setCopiedQr(true);
    setTimeout(() => setCopiedQr(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSlipImage(result);
      setActiveTab('slip');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPaid = () => {
    setIsVerifying(true);
    // Simulate real-time verification process (1.2s)
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerifiedSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(slipImage || undefined);
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#17212b] rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-scale">
        
        {/* Official Bakong Red KHQR Header */}
        <div className="bg-[#e1251b] text-white px-5 pt-4 pb-3 relative text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1 rounded-full bg-black/15 hover:bg-black/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3 h-3" />
            <span>National Bank of Cambodia</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black tracking-wider uppercase">KHQR</h2>
            <span className="text-xs bg-white text-[#e1251b] font-bold px-1.5 py-0.5 rounded">
              OFFICIAL
            </span>
          </div>

          <p className="text-[11px] text-white/90 mt-0.5">
            {language === 'km'
              ? 'ស្កេនទូទាត់ប្រាក់តាមគ្រប់ធនាគារក្នុងប្រទេសកម្ពុជា'
              : 'Scan with any Banking App (ABA, ACLEDA, Bakong, Wing...)'}
          </p>
        </div>

        {/* Store & Order Details */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {vendor?.logo ? (
                <img
                  src={vendor.logo}
                  alt={vendor.nameKh}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#2481cc]/10 text-[#2481cc] flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {language === 'km' ? merchantNameKh : merchantName}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  {bakongId}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-mono">#{order.orderNumber}</span>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់រួច' : 'Verified'}</span>
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="text-center py-2 bg-gradient-to-br from-red-50/60 via-slate-50 to-rose-50/50 dark:from-red-950/20 dark:via-slate-900/40 dark:to-rose-950/20 rounded-2xl border border-red-200/70 dark:border-red-900/40 relative">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {language === 'km' ? 'ចំនួនទឹកប្រាក់ដែលត្រូវទូទាត់' : 'Payment Total Amount'}
            </span>
            <div className="flex items-baseline justify-center gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#e1251b] font-mono tracking-tight">
                {formatPrice(totalAmount)}
              </span>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#e1251b] font-medium inline-flex items-center gap-1 shadow-2xs"
                title="Copy Amount"
              >
                {copiedAmount ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAmount ? 'បានចម្លង' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ≈ ៛{rielAmount.toLocaleString()} KHR (អត្រា 1$ = 4,100៛)
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('scan')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'scan'
                  ? 'bg-white dark:bg-slate-900 text-[#e1251b] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ស្កេន QR Code' : 'Scan KHQR'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('slip')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                activeTab === 'slip'
                  ? 'bg-white dark:bg-slate-900 text-[#e1251b] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ផ្ញើស្លីបផ្ទេរប្រាក់' : 'Upload Slip'}</span>
              {slipImage && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Tab 1: QR Code Scanner View */}
          {activeTab === 'scan' && (
            <div className="flex flex-col items-center">
              {/* Official KHQR White Card Frame */}
              <div className="relative p-4 bg-white rounded-3xl border-2 border-[#e1251b] shadow-md flex flex-col items-center">
                {/* Red Top Tag */}
                <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-[#e1251b] text-white text-[10px] font-black tracking-widest uppercase shadow-xs">
                  KHQR
                </div>

                <img
                  src={qrImageUrl}
                  alt="Bakong KHQR"
                  className="w-56 h-56 object-contain rounded-xl"
                />

                {/* Subtag Footer */}
                <div className="mt-2 text-center">
                  <span className="text-[11px] font-bold text-slate-800 block">
                    {merchantName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Scan with ABA, ACLEDA, Wing, Bakong...
                  </span>
                </div>
              </div>

              {/* Countdown and Action buttons */}
              <div className="flex items-center justify-between w-full mt-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-[11px]">
                    {language === 'km' ? 'សុពលភាព៖' : 'Expires in:'}
                  </span>
                  <span className="font-mono font-bold text-rose-500">{timerDisplay}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={qrImageUrl}
                    download={`KHQR-${order.orderNumber}.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#e1251b] inline-flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ទាញយក QR' : 'Save QR'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyQrString}
                    className="p-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#e1251b] inline-flex items-center gap-1 transition-colors"
                    title="Copy KHQR String"
                  >
                    {copiedQr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQr ? 'បានចម្លង' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Upload Payment Slip */}
          {activeTab === 'slip' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-900/30">
                {slipImage ? (
                  <div className="space-y-2">
                    <img
                      src={slipImage}
                      alt="Payment Receipt Slip"
                      className="max-h-48 mx-auto rounded-xl object-contain shadow-xs border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <label className="text-[11px] font-bold text-[#2481cc] hover:underline cursor-pointer">
                        {language === 'km' ? 'ផ្លាស់ប្តូររូបភាពថ្មី' : 'Change Slip'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() => setSlipImage(null)}
                        className="text-[11px] font-bold text-rose-500 hover:underline"
                      >
                        {language === 'km' ? 'លុបចេញ' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center py-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#e1251b] flex items-center justify-center mb-2">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {language === 'km' ? 'ចុចទីនេះដើម្បី Upload ស្លីបផ្ទេរប្រាក់' : 'Upload Bank Transfer Slip'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG ឬ Screenshot ពី ABA / Bakong Mobile
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                {language === 'km'
                  ? '💡 បងអាចភ្ជាប់រូបភាពវិក្កយបត្រដើម្បីឱ្យម្ចាស់ហាងរៀបចំទំនិញដឹកជូនភ្លាមៗ'
                  : 'Attaching your payment receipt speeds up order processing & delivery.'}
              </p>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isVerifying || isVerifiedSuccess}
              onClick={handleConfirmPaid}
              className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 ${
                isVerifiedSuccess
                  ? 'bg-emerald-600 shadow-emerald-500/25'
                  : 'bg-[#e1251b] hover:bg-[#c71e15] shadow-red-500/25'
              }`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់ការទូទាត់ប្រាក់...' : 'Verifying Payment...'}</span>
                </>
              ) : isVerifiedSuccess ? (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>{language === 'km' ? 'ការទូទាត់ត្រូវបានបញ្ជាក់ជោគជ័យ! ✓' : 'Payment Confirmed! ✓'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {language === 'km'
                      ? 'ខ្ញុំបានបង់ប្រាក់រួចរាល់ (Confirm I Have Paid)'
                      : 'I Have Paid (Confirm Payment)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
