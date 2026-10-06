import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Upload,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  DollarSign,
  FileVideo,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { checkR2Status, uploadToR2, R2StatusResult } from '../../utils/r2Upload';
import { useApp } from '../../context/AppContext';

interface CloudflareR2ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareR2Modal: React.FC<CloudflareR2ModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [status, setStatus] = useState<R2StatusResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [testUploading, setTestUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    checkR2Status()
      .then((res) => setStatus(res))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTestUploading(true);
    setUploadedUrl(null);
    try {
      const res = await uploadToR2(file, 'products');
      setUploadedUrl(res.url);
    } catch (err: any) {
      console.error('Test upload failed:', err);
    } finally {
      setTestUploading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#17212b] rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto animate-scale">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f38020]/10 text-[#f38020] flex items-center justify-center shadow-xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Cloudflare R2 Object Storage
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  $0 Egress Bandwidth
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'km'
                  ? 'ផ្ទុករូបភាព និងវីដេអូទំនិញឥតគិតថ្លៃ Bandwidth និងល្បឿនលឿនកម្រិតពិភពលោក'
                  : 'High-speed media storage with zero egress bandwidth fees'}
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

        {/* Status Card */}
        <div
          className={`p-4 rounded-2xl border ${
            status?.configured
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {status?.configured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  {status?.configured
                    ? language === 'km'
                      ? 'Cloudflare R2 ដំណើរការផ្សាយផ្ទាល់ (Active Live)'
                      : 'Cloudflare R2 Active (Live)'
                    : language === 'km'
                    ? 'ប្រព័ន្ធត្រៀមរួចរាល់ (Ready for R2 API Keys)'
                    : 'System Ready for Cloudflare R2 Credentials'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 dark:bg-black/30">
                  Bucket: {status?.bucket || 'phsar24-media'}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {status?.message}
              </p>
              {status?.publicDomain && (
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 pt-1 truncate">
                  CDN Public Domain: <span className="font-bold">{status.publicDomain}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Overview */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Free Egress</div>
            <div className="text-[10px] text-slate-400">មើលវីដេអូឥតគិតលុយ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Edge CDN</div>
            <div className="text-[10px] text-slate-400">ល្បឿនលឿនក្បែរកម្ពុជា</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <FileVideo className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">10GB Free/Mo</div>
            <div className="text-[10px] text-slate-400">ផ្ទុកវីដេអូទំនិញបានច្រើន</div>
          </div>
        </div>

        {/* Test Upload Playground */}
        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#f38020]" />
              <span>{language === 'km' ? 'សាកល្បង Upload រូប ឬវីដេអូ (Test Upload)' : 'Test Upload Media'}</span>
            </span>
            <label className="px-3 py-1.5 rounded-xl bg-[#f38020] hover:bg-[#d66f19] text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1 transition-colors">
              {testUploading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3" />
                  <span>{language === 'km' ? 'ជ្រើសរើស File' : 'Choose File'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleTestUpload}
                disabled={testUploading}
                className="hidden"
              />
            </label>
          </div>

          {uploadedUrl && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Upload ទទួលបានជោគជ័យ!</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(uploadedUrl, 'uploaded_url')}
                  className="text-[10px] font-mono text-[#2481cc] hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'uploaded_url' ? 'បានចម្លង ✓' : 'ចម្លង URL'}
                </button>
              </div>
              <p className="font-mono text-[10px] text-slate-500 truncate bg-slate-50 dark:bg-slate-900 p-1 rounded border border-slate-100 dark:border-slate-800">
                {uploadedUrl}
              </p>
            </div>
          )}
        </div>

        {/* Quick Setup Guide (4 Steps) */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
            {language === 'km' ? 'របៀបភ្ជាប់ Cloudflare R2 ក្នុងរយៈពេល ២ នាទី៖' : 'How to Connect Cloudflare R2 in 2 Minutes:'}
          </span>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>ចូលទៅកាន់ <strong>Cloudflare Dashboard</strong> ➔ ចុចលើម៉ឺនុយ <strong>R2 Object Storage</strong></span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>ចុច <strong>Create bucket</strong> (ដាក់ឈ្មោះថា <code>phsar24-media</code>) ➔ Settings ➔ បើក <strong>Public Development URL</strong></span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>ចុច <strong>Manage R2 API Tokens</strong> ➔ Create Token (សិទ្ធិ Object Read & Write)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
              <span>ចម្លង <strong>Account ID, Access Key ID, Secret Key</strong> ដាក់ចូលក្នុង <code>.env</code> ឬ Environment Variables លើ Vercel/Cloud Run!</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#f38020] hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Cloudflare Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'km' ? 'យល់ព្រម' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
