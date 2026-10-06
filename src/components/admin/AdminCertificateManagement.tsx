import React, { useState, useRef } from 'react';
import {
  FileCheck,
  Plus,
  ShieldCheck,
  Lock,
  Eye,
  Trash2,
  Edit3,
  Calendar,
  Building,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  X,
  Award,
  Sparkles,
  Sliders,
  Check,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicalLicense } from '../../types';
import { SecureCertificateViewer } from '../certificates/SecureCertificateViewer';
import { RbacNoticeBanner } from './RbacNoticeBanner';

export const AdminCertificateManagement: React.FC = () => {
  const {
    licenses,
    addLicense,
    updateLicense,
    deleteLicense,
    licenseSecurityConfig,
    updateLicenseSecurityConfig,
    language,
    canManageContent,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<MedicalLicense | null>(null);
  const [previewLicenseId, setPreviewLicenseId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingLicense, setDeletingLicense] = useState<MedicalLicense | null>(null);

  // Form State
  const [titleKh, setTitleKh] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issuingAuthorityKh, setIssuingAuthorityKh] = useState('');
  const [issuingAuthorityEn, setIssuingAuthorityEn] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [documentType, setDocumentType] = useState<MedicalLicense['documentType']>('moh_license');
  const [documentImage, setDocumentImage] = useState('');
  const [notesKh, setNotesKh] = useState('');
  const [notesEn, setNotesEn] = useState('');
  const [verified, setVerified] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingLicense(null);
    setTitleKh('');
    setTitleEn('');
    setLicenseNumber(`CAM-MOH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setIssuingAuthorityKh('ក្រសួងសុខាភិបាល នៃព្រះរាជាណាចក្រកម្ពុជា (នាយកដ្ឋានឱសថ)');
    setIssuingAuthorityEn('Ministry of Health of Cambodia (Department of Drugs)');
    setIssueDate(new Date().toISOString().split('T')[0]);
    // 5 years default validity
    const d = new Date();
    d.setFullYear(d.getFullYear() + 5);
    setExpiryDate(d.toISOString().split('T')[0]);
    setDocumentType('moh_license');
    setDocumentImage('');
    setNotesKh('ទទួលបានការអនុញ្ញាតស្របច្បាប់ក្នុងការលក់ និងចែកចាយឱសថបុរាណធម្មជាតិ។');
    setNotesEn('Authorized for distribution of natural traditional medicine.');
    setVerified(true);
    setIsModalOpen(true);
  };

  const openEditModal = (lic: MedicalLicense) => {
    setEditingLicense(lic);
    setTitleKh(lic.titleKh);
    setTitleEn(lic.titleEn);
    setLicenseNumber(lic.licenseNumber);
    setIssuingAuthorityKh(lic.issuingAuthorityKh);
    setIssuingAuthorityEn(lic.issuingAuthorityEn);
    setIssueDate(lic.issueDate);
    setExpiryDate(lic.expiryDate);
    setDocumentType(lic.documentType);
    setDocumentImage(lic.documentImage);
    setNotesKh(lic.notesKh || '');
    setNotesEn(lic.notesEn || '');
    setVerified(lic.verified);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDocumentImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleKh.trim() || !licenseNumber.trim()) {
      alert(language === 'km' ? 'សូមបំពេញចំណងជើង និងលេខអាជ្ញាប័ណ្ណ!' : 'Please fill in title and license number!');
      return;
    }

    // Default template image if none uploaded
    const finalImage =
      documentImage ||
      `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="100%" height="100%">
          <rect width="800" height="1120" fill="#fffdf7"/>
          <rect x="25" y="25" width="750" height="1070" fill="none" stroke="#059669" stroke-width="8" rx="8"/>
          <text x="400" y="100" font-family="'Kantumruy Pro', serif" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">ព្រះរាជាណាចក្រកម្ពុជា</text>
          <text x="400" y="130" font-family="'Kantumruy Pro', serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">ជាតិ សាសនា ព្រះមហាក្សត្រ</text>
          <circle cx="400" cy="220" r="45" fill="#ecfdf5" stroke="#059669" stroke-width="3"/>
          <text x="400" y="320" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#047857" text-anchor="middle">${titleKh}</text>
          <rect x="230" y="350" width="340" height="34" rx="17" fill="#f1f5f9"/>
          <text x="400" y="372" font-family="monospace" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">No: ${licenseNumber}</text>
          <rect x="80" y="420" width="640" height="240" rx="12" fill="#ffffff" stroke="#cbd5e1"/>
          <text x="110" y="460" font-family="'Kantumruy Pro', sans-serif" font-size="14" fill="#64748b">ស្ថាប័នចេញអាជ្ញាប័ណ្ណ៖</text>
          <text x="280" y="460" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">${issuingAuthorityKh}</text>
          <text x="110" y="500" font-family="'Kantumruy Pro', sans-serif" font-size="14" fill="#64748b">សុពលភាព៖</text>
          <text x="280" y="500" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#059669">${issueDate} ដល់ ${expiryDate}</text>
          <g transform="translate(500, 750)">
            <circle cx="100" cy="80" r="60" fill="none" stroke="#dc2626" stroke-width="4"/>
            <text x="100" y="85" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">★ បានអនុម័ត ★</text>
          </g>
        </svg>
      `)}`;

    if (editingLicense) {
      updateLicense(editingLicense.id, {
        titleKh: titleKh.trim(),
        titleEn: titleEn.trim() || titleKh.trim(),
        licenseNumber: licenseNumber.trim(),
        issuingAuthorityKh: issuingAuthorityKh.trim(),
        issuingAuthorityEn: issuingAuthorityEn.trim() || issuingAuthorityKh.trim(),
        issueDate,
        expiryDate,
        documentType,
        documentImage: finalImage,
        notesKh: notesKh.trim(),
        notesEn: notesEn.trim(),
        verified,
      });
    } else {
      addLicense({
        titleKh: titleKh.trim(),
        titleEn: titleEn.trim() || titleKh.trim(),
        licenseNumber: licenseNumber.trim(),
        issuingAuthorityKh: issuingAuthorityKh.trim(),
        issuingAuthorityEn: issuingAuthorityEn.trim() || issuingAuthorityKh.trim(),
        issueDate,
        expiryDate,
        documentType,
        documentImage: finalImage,
        notesKh: notesKh.trim(),
        notesEn: notesEn.trim(),
        verified,
      });
    }

    setIsModalOpen(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openPreview = (licId?: string) => {
    setPreviewLicenseId(licId || licenses[0]?.id || null);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <RbacNoticeBanner moduleNameKh="អាជ្ញាប័ណ្ណ & វិញ្ញាបនបត្រ" moduleNameEn="licenses & certificates" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#17212b] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'km' ? 'គ្រប់គ្រងលិខិតអនុញ្ញាត & អាជ្ញាប័ណ្ណឱសថបុរាណ' : 'License & Certificate Management'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                {licenses.length} {language === 'km' ? 'ច្បាប់' : 'Items'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'km'
                ? 'បញ្ចូល និងគ្រប់គ្រងអាជ្ញាប័ណ្ណក្រសួងសុខាភិបាល ស្តង់ដារ GMP ជាមួយនឹងប្រព័ន្ធការពារហាម Screenshot & Download'
                : 'Upload & manage MoH permits, GMP certificates with anti-screenshot & view-only protection'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openPreview()}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="តេស្តមើលផ្ទាំងការពារសុវត្ថិភាព"
          >
            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'km' ? 'តេស្តមើលផ្ទាំងសុវត្ថិភាព' : 'Test Protected Viewer'}</span>
          </button>

          {canManageContent ? (
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'km' ? 'បញ្ចូលលិខិតអនុញ្ញាតថ្មី' : 'Add New Permit'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'km' ? 'សិទ្ធិមើលប៉ុណ្ណោះ' : 'View Only'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Security Protection Settings Card */}
      <div className="bg-gradient-to-br from-emerald-950/20 to-teal-950/10 dark:from-emerald-950/40 dark:to-slate-900 p-5 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {language === 'km'
                ? 'ប្រព័ន្ធសុវត្ថិភាពការពារឯកសារផ្លូវការ (Document Security Guards)'
                : 'Document Security & Anti-Theft Guards'}
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ប្រព័ន្ធដំណើរការសកម្ម' : 'Active Protection'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Watermark Toggle */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {language === 'km' ? '💧 ជ័រទឹកការពារ (Watermark)' : '💧 Security Watermark'}
              </span>
              <input
                type="checkbox"
                disabled={!canManageContent}
                checked={licenseSecurityConfig?.watermarkEnabled ?? true}
                onChange={(e) =>
                  updateLicenseSecurityConfig({ watermarkEnabled: e.target.checked })
                }
                className={`w-4 h-4 text-emerald-600 rounded accent-emerald-600 ${!canManageContent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'km'
                ? 'បោះត្រាឈ្មោះហាង និងកាលបរិច្ឆេទពេញផ្ទៃឯកសារ ការពារការកាត់ត'
                : 'Stamps dynamic shop copyright & date diagonally across documents'}
            </p>
          </div>

          {/* Anti-Screenshot Toggle */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {language === 'km' ? '🛡️ ហាម Screenshot & Print' : '🛡️ Anti-Screenshot & Print'}
              </span>
              <input
                type="checkbox"
                disabled={!canManageContent}
                checked={licenseSecurityConfig?.antiScreenshotEnabled ?? true}
                onChange={(e) =>
                  updateLicenseSecurityConfig({ antiScreenshotEnabled: e.target.checked })
                }
                className={`w-4 h-4 text-emerald-600 rounded accent-emerald-600 ${!canManageContent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'km'
                ? 'ចាប់ស្ទាក់ប៊ូតុង PrintScreen, Win+Shift+S, Cmd+Shift+3/4 និងបិទ Print'
                : 'Traps PrintScreen, Ctrl+P, Snipping Tool shortcut, clears clipboard'}
            </p>
          </div>

          {/* Blur on Focus Loss Toggle */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {language === 'km' ? '👁️ បិទបាំងពេលប្តូរអេក្រង់' : '👁️ Blur on Focus Loss'}
              </span>
              <input
                type="checkbox"
                disabled={!canManageContent}
                checked={licenseSecurityConfig?.blurOnFocusLossEnabled ?? true}
                onChange={(e) =>
                  updateLicenseSecurityConfig({ blurOnFocusLossEnabled: e.target.checked })
                }
                className={`w-4 h-4 text-emerald-600 rounded accent-emerald-600 ${!canManageContent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'km'
                ? 'ព្រិលឯកសារពេលអតិថិជនចុចទៅក្រៅ ដើម្បីទប់ស្កាត់ការថតពីខាងក្រៅ'
                : 'Blurs certificate whenever window loses focus (defeats snipping overlay)'}
            </p>
          </div>
        </div>
      </div>

      {/* Licenses List */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>{language === 'km' ? 'បញ្ជីលិខិតអនុញ្ញាត និងវិញ្ញាបនបត្រផ្លូវការ' : 'Registered Licenses & Certificates'}</span>
          <span className="text-xs font-normal text-slate-400">
            {language === 'km' ? 'អតិថិជនអាចមើលពិនិត្យបានក្នុងកម្មវិធី' : 'Visible in customer app in View-Only mode'}
          </span>
        </h3>

        {licenses.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#17212b] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {language === 'km' ? 'មិនទាន់មានលិខិតអនុញ្ញាតនៅឡើយទេ' : 'No licenses or permits registered yet'}
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'km' ? 'បញ្ចូលលិខិតអនុញ្ញាតដំបូង' : 'Add First License'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {licenses.map((lic) => (
              <div
                key={lic.id}
                className="bg-white dark:bg-[#17212b] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-md transition-all group"
              >
                {/* Certificate Preview Top */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div
                    onClick={() => openPreview(lic.id)}
                    className="w-16 h-20 bg-white rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 cursor-pointer relative group-hover:scale-102 transition-transform"
                    title="ចុចដើម្បីមើលគំរូពេញលេញ"
                  >
                    <img
                      src={lic.documentImage}
                      alt={lic.titleKh}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase truncate">
                        {lic.documentType.replace('_', ' ')}
                      </span>
                      {lic.verified && (
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-bold shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'km' ? 'ស្របច្បាប់' : 'Verified'}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {language === 'km' ? lic.titleKh : lic.titleEn}
                    </h4>

                    <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                      <span>No: {lic.licenseNumber}</span>
                      <button
                        onClick={() => handleCopy(lic.licenseNumber, lic.id)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Copy No"
                      >
                        {copiedId === lic.id ? (
                          <Check className="w-2.5 h-2.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 text-xs space-y-2 flex-1">
                  <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      {language === 'km' ? lic.issuingAuthorityKh : lic.issuingAuthorityEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {lic.issueDate} ➜ {lic.expiryDate}
                    </span>
                  </div>

                  {lic.notesKh && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
                      {language === 'km' ? lic.notesKh : lic.notesEn}
                    </p>
                  )}
                </div>

                {/* Action Buttons Footer */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openPreview(lic.id)}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ពិនិត្យមើល' : 'View'}</span>
                  </button>

                  {canManageContent ? (
                    <>
                      <button
                        onClick={() => openEditModal(lic)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="កែសម្រួល / Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingLicense(lic)}
                        className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="លុប / Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-500" /> View only
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Medical License */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-scale-up flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingLicense
                      ? language === 'km'
                        ? 'កែសម្រួលលិខិតអនុញ្ញាត / អាជ្ញាប័ណ្ណ'
                        : 'Edit License / Permit'
                      : language === 'km'
                      ? 'បញ្ចូលលិខិតអនុញ្ញាត ឬអាជ្ញាប័ណ្ណថ្មី'
                      : 'Add New License / Permit'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'km'
                      ? 'ឯកសារនេះនឹងត្រូវបានការពារដោយប្រព័ន្ធហាម Screenshot & Download'
                      : 'This document will be protected by anti-screenshot & anti-download guards'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Title Kh */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះលិខិត / អាជ្ញាប័ណ្ណ (ភាសាខ្មែរ) *' : 'Document Title (Khmer) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleKh}
                    onChange={(e) => setTitleKh(e.target.value)}
                    placeholder="ឧ. លិខិតអនុញ្ញាតអាជីវកម្មឱសថបុរាណផ្លូវការ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Title En */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះលិខិត (ភាសាអង់គ្លេស)' : 'Document Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Official Traditional Medicine Permit"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* License Number */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'លេខអាជ្ញាប័ណ្ណ / License No. *' : 'License Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. CAM-MOH-TRM/2026/0988"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ប្រភេទឯកសារ' : 'Document Type'}
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="moh_license">អាជ្ញាប័ណ្ណក្រសួងសុខាភិបាល (MoH License)</option>
                    <option value="gmp_cert">វិញ្ញាបនបត្រស្តង់ដារ GMP (GMP Certified)</option>
                    <option value="traditional_permit">លិខិតអនុញ្ញាតឱសថបុរាណ (Traditional Permit)</option>
                    <option value="organic_test">លិខិតវិភាគមន្ទីរពិសោធន៍ / ធម្មជាតិ (Lab / Organic Test)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Issuing Authority Kh */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ស្ថាប័នចេញអាជ្ញាប័ណ្ណ (ភាសាខ្មែរ)' : 'Issuing Authority (Khmer)'}
                  </label>
                  <input
                    type="text"
                    value={issuingAuthorityKh}
                    onChange={(e) => setIssuingAuthorityKh(e.target.value)}
                    placeholder="ក្រសួងសុខាភិបាល នៃព្រះរាជាណាចក្រកម្ពុជា"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Issuing Authority En */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ស្ថាប័នចេញ (ភាសាអង់គ្លេស)' : 'Issuing Authority (English)'}
                  </label>
                  <input
                    type="text"
                    value={issuingAuthorityEn}
                    onChange={(e) => setIssuingAuthorityEn(e.target.value)}
                    placeholder="Ministry of Health of Cambodia"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Issue Date */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'កាលបរិច្ឆេទចេញ' : 'Issue Date'}
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'កាលបរិច្ឆេទផុតកំណត់' : 'Expiry Date'}
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Document Image Upload / Preview */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'រូបភាពលិខិតអនុញ្ញាត / អាជ្ញាប័ណ្ណ' : 'License / Permit Document Image'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'km' ? 'ជ្រើសរើសរូបភាពពីទូរស័ព្ទ / កុំព្យូទ័រ' : 'Upload Image File'}</span>
                  </button>

                  {documentImage && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'km' ? 'រូបភាពរួចរាល់' : 'Image Loaded'}</span>
                    </span>
                  )}
                </div>

                {documentImage && (
                  <div className="mt-2 w-32 h-44 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs relative">
                    <img
                      src={documentImage}
                      alt="License Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Legal Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'កំណត់ចំណាំ និងវិសាលភាពស្របច្បាប់' : 'Legal Notes & Scope'}
                </label>
                <textarea
                  rows={2}
                  value={notesKh}
                  onChange={(e) => setNotesKh(e.target.value)}
                  placeholder="ឧ. ទទួលបានការអនុញ្ញាតស្របច្បាប់ពេញលេញក្នុងការលក់ និងចែកចាយឱសថបុរាណធម្មជាតិ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Verified Status */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verified-check"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                />
                <label
                  htmlFor="verified-check"
                  className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {language === 'km'
                    ? 'បញ្ជាក់ថាឯកសារនេះមានសុពលភាពផ្លូវការ (Verified Active)'
                    : 'Mark as officially verified & active'}
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md active:scale-95 transition-all"
                >
                  {editingLicense
                    ? language === 'km'
                      ? 'រក្សាទុកការកែប្រែ'
                      : 'Save Changes'
                    : language === 'km'
                    ? 'បញ្ចូលឯកសារ'
                    : 'Create License'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Protected Certificate Viewer */}
      <SecureCertificateViewer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        initialLicenseId={previewLicenseId || undefined}
      />

      {/* Delete License In-App Confirmation Modal */}
      {deletingLicense && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-scale space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              {language === 'km' ? 'បញ្ជាក់ការលុបឯកសារ' : 'Confirm Delete License'}
            </h4>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                {deletingLicense.titleKh}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
                {deletingLicense.licenseNumber}
              </span>
            </div>

            <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed font-medium">
              {language === 'km'
                ? '⚠️ តើលោកអ្នកប្រាកដជាចង់លុបឯកសារអាជ្ញាប័ណ្ណនេះមែនទេ?'
                : '⚠️ Are you sure you want to delete this official license/permit document?'}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingLicense(null)}
                className="py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {language === 'km' ? 'ទេ, ត្រឡប់ក្រោយ' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteLicense(deletingLicense.id);
                  setDeletingLicense(null);
                }}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-98 transition-all"
              >
                {language === 'km' ? 'យល់ព្រមលុប' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
