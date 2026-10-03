import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Send,
  Store,
  ShieldCheck,
  Share2,
  Download,
  Sparkles,
} from 'lucide-react';
import { Vendor } from '../../types';
import { useApp } from '../../context/AppContext';

interface StoreShareModalProps {
  vendor: Vendor;
  isOpen: boolean;
  onClose: () => void;
}

export const StoreShareModal: React.FC<StoreShareModalProps> = ({
  vendor,
  isOpen,
  onClose,
}) => {
  const { language, getStoreShareLinks, enterDedicatedStore, setActiveTab } = useApp();
  const [copiedType, setCopiedType] = useState<'web' | 'tg' | null>(null);

  if (!isOpen) return null;

  const links = getStoreShareLinks(vendor);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    links.webUrl
  )}&margin=10`;

  const handleCopy = (text: string, type: 'web' | 'tg') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTestOpen = () => {
    enterDedicatedStore(vendor.slug);
    setActiveTab('store');
    onClose();
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `សូមស្វាគមន៍មកកាន់ហាង ${vendor.nameKh} នៅលើ Telegram MiniApp! មើលទំនិញ និងកុម្ម៉ង់ទិញបានភ្លាមៗ៖`
    );
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(links.telegramUrl)}&text=${text}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#17212b] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2481cc] flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{language === 'km' ? 'តំណភ្ជាប់ហាងផ្ទាល់ខ្លួន (Store Link)' : 'Dedicated Store Link'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'km'
                  ? 'អតិថិជនដែលចូលតាម Link នេះ នឹងឃើញតែទំនិញហាងនេះប៉ុណ្ណោះ'
                  : 'Customers opening this link will only see products from this store'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store Card Identity */}
        <div className="mt-4 p-3.5 bg-gradient-to-r from-blue-50/80 to-sky-50/50 dark:from-blue-950/30 dark:to-sky-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-center gap-3">
          <img
            src={vendor.logo}
            alt={vendor.nameKh}
            className="w-12 h-12 rounded-xl object-cover border border-white dark:border-slate-700 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {vendor.nameKh}
              </h4>
              {vendor.isVerified && (
                <ShieldCheck className="w-4 h-4 text-[#2481cc] shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {vendor.nameEn} · {vendor.city}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                🔒 {language === 'km' ? 'ហាងផ្តាច់មុខ (100% Isolated)' : '100% Dedicated'}
              </span>
              <span className="text-[10px] text-slate-400">
                Slug: <code className="font-mono text-[#2481cc]">{vendor.slug}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="mt-4 space-y-3.5">
          {/* 1. Direct Web Store Link */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#2481cc]" />
                <span>{language === 'km' ? '១. តំណភ្ជាប់វិបសាយផ្ទាល់ (Direct Web Link)' : '1. Direct Web URL'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {language === 'km' ? 'សម្រាប់ផ្ញើតាម Facebook/Tiktok/Web' : 'For Facebook/TikTok/Web'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={links.webUrl}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300 select-all focus:outline-none"
              />
              <button
                onClick={() => handleCopy(links.webUrl, 'web')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                  copiedType === 'web'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2481cc] hover:bg-[#1d6fa5] text-white shadow-xs'
                }`}
              >
                {copiedType === 'web' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'បានចម្លង!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ចម្លង' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Telegram MiniApp Direct Link */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#2481cc]" />
                <span>{language === 'km' ? '២. តំណភ្ជាប់ Telegram MiniApp (startapp Link)' : '2. Telegram MiniApp Deep Link'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {language === 'km' ? 'បើកផ្ទាល់ក្នុង Telegram Bot' : 'Opens directly in Telegram'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={links.telegramUrl}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300 select-all focus:outline-none"
              />
              <button
                onClick={() => handleCopy(links.telegramUrl, 'tg')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                  copiedType === 'tg'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2481cc] hover:bg-[#1d6fa5] text-white shadow-xs'
                }`}
              >
                {copiedType === 'tg' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'បានចម្លង!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ចម្លង' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleShareTelegram}
                className="flex-1 py-1.5 px-3 bg-[#2481cc]/10 hover:bg-[#2481cc]/20 text-[#2481cc] dark:text-sky-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'ចែករំលែកទៅ Telegram ភ្លាមៗ' : 'Share to Telegram Chat'}</span>
              </button>
            </div>
          </div>

          {/* 3. QR Code for store counter */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-white rounded-2xl shadow-xs border border-slate-200 shrink-0">
              <img
                src={qrCodeUrl}
                alt={`QR Code for ${vendor.nameKh}`}
                className="w-28 h-28 object-contain rounded-lg"
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-slate-800 dark:text-slate-100">
                <QrCode className="w-4 h-4 text-[#2481cc]" />
                <span>{language === 'km' ? 'QR Code ហាង (Scan to Open)' : 'Store QR Code'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'km'
                  ? 'បងអាចបោះពុម្ព (Print) QR Code នេះបិទនៅមុខហាង ឬលើតុទូទាត់ ដើម្បីឱ្យភ្ញៀវស្កេនចូលមើលតែទំនិញហាងបង!'
                  : 'Print and display this QR code at your shop counter so walk-in customers can scan directly to your menu.'}
              </p>
              <a
                href={qrCodeUrl}
                target="_blank"
                rel="noreferrer"
                download={`qr-${vendor.slug}.png`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2481cc] dark:text-sky-400 hover:underline mt-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'ទាញយក File រូបភាព QR' : 'Download QR Image'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Security / Privacy Guarantee Banner */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            {language === 'km'
              ? '✨ ធានា ១០០%៖ អតិថិជនដែលបើកមើលតាម Link ឬ QR Code នេះ នឹងមិនឃើញទំនិញពីហាងដទៃឡើយ ហើយរបារប្តូរហាង (Store Switcher) ក៏ត្រូវបានលាក់បាត់ដោយស្វ័យប្រវត្តិ។'
              : '✨ 100% Guaranteed: Customers accessing via this link or QR will NEVER see other stores or other vendors\' products.'}
          </p>
        </div>

        {/* Notice about 403 Google Error */}
        <div className="mt-2.5 p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/50 text-[11px] text-blue-950 dark:text-blue-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[#2481cc] dark:text-sky-300">
            <span>💡 របៀបផ្ញើឱ្យអតិថិជន និងម្ចាស់ហាងបើកបាន ១០០% (ជៀសវាង Error 403)៖</span>
          </div>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            {language === 'km'
              ? 'សូមប្រើប៊ូតុង «ចម្លង (Copy)» លើ Link ឬ QR Code ខាងលើនេះដើម្បីផ្ញើ។ សូមកុំ Copy អាសយដ្ឋានចេញពីរបារខាងលើបង្អស់របស់ Browser ដែលមានពាក្យ "aistudio.google.com" ព្រោះ Link នោះជាផ្ទាំងកូដឯកជនរបស់អ្នកអភិវឌ្ឍន៍ដែលទាមទារ Google Account របស់បង (ទើបចេញ Error 403)។'
              : 'Always use the Copy buttons above. Do not copy the URL from your top browser address bar containing "aistudio.google.com", as that workspace requires your personal Google Account login.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleTestOpen}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2481cc] dark:text-sky-400 hover:underline px-2 py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'បើកមើលសាកល្បងឥឡូវនេះ (Preview)' : 'Preview Dedicated Store'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'km' ? 'រួចរាល់' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
