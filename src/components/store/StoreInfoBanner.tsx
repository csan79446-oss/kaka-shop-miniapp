import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Send,
  Mail,
  ExternalLink,
  Store,
  ChevronRight,
  X,
  Info,
  Check,
  Copy,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Bell,
  FileCheck,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecureCertificateViewer } from '../certificates/SecureCertificateViewer';

export const StoreInfoBanner: React.FC = () => {
  const {
    storeInfo,
    primaryStoreLocation,
    storeLocations,
    storeInfoItems,
    language,
    setActiveTab,
    sendChatMessage,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'branches' | 'policies' | 'contacts'>('branches');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleChatWithShop = (branchName?: string) => {
    setIsModalOpen(false);
    setActiveTab('chat');
    sendChatMessage(
      language === 'km'
        ? `ជំរាបសួរ Phsar24 (ផ្សារ២៤)! ខ្ញុំចង់សាកសួរព័ត៌មានទីតាំង ${branchName ? `(${branchName})` : ''} និងទំនិញដែលមានក្នុងស្តុក។`
        : `Hello Phsar24! I would like to inquire about ${branchName ? `branch ${branchName}` : 'store location'} and available items.`
    );
  };

  const activeBranches = storeLocations.filter((b) => b.isActive);
  const activeInfoItems = storeInfoItems.filter((i) => i.isActive);

  return (
    <>
      {/* Sleek, Compact Store Location & Info Card */}
      <div className="mb-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#17212b] dark:to-[#0f141c] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/40 text-[#2481cc] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Store className="w-5 h-5 text-[#2481cc]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {language === 'km'
                    ? (primaryStoreLocation?.nameKh || storeInfo.nameKh).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24 (ផ្សារ២៤)')
                    : (primaryStoreLocation?.nameEn || storeInfo.nameEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')}
                </h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
                  {language === 'km' ? 'បើកដំណើរការ' : 'Open'}
                </span>
                {activeBranches.length > 1 && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-50 dark:bg-sky-950/50 text-[#2481cc] font-medium border border-sky-200 dark:border-sky-800 shrink-0">
                    +{activeBranches.length - 1} {language === 'km' ? 'សាខាទៀត' : 'more'}
                  </span>
                )}
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-1.5 mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  {language === 'km'
                    ? (primaryStoreLocation?.addressKh || storeInfo.addressKh).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')
                    : (primaryStoreLocation?.addressEn || storeInfo.addressEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')}
                </span>
              </div>

              {/* Working Hours & Quick Contact */}
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="text-[10px] sm:text-[11px]">
                    {language === 'km'
                      ? primaryStoreLocation?.workingHoursKh || storeInfo.workingHoursKh
                      : primaryStoreLocation?.workingHoursEn || storeInfo.workingHoursEn}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300">
                  <Phone className="w-3 h-3 text-[#2481cc] shrink-0" />
                  <span>{primaryStoreLocation?.phone || storeInfo.phone1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1 transition-all active:scale-95"
            title="ព័ត៌មានលម្អិតហាង / Store Details"
          >
            <span>{language === 'km' ? 'ព័ត៌មានហាង' : 'Details'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Verified Traditional Medicine License Badge Banner */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{language === 'km' ? '🌿 ឱសថបុរាណមានអាជ្ញាប័ណ្ណក្រសួងសុខាភិបាល & GMP' : '🌿 Licensed Traditional Herbal Medicine'}</span>
          </div>
          <button
            onClick={() => setIsCertModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'km' ? 'ពិនិត្យលិខិតអនុញ្ញាតផ្លូវការ' : 'View Verified Licenses'}</span>
          </button>
        </div>
      </div>

      {/* Store Information Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-scale-up flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-[#2481cc] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'km' ? storeInfo.nameKh : storeInfo.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'km' ? storeInfo.taglineKh : storeInfo.taglineEn}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 px-3 shrink-0">
              <button
                onClick={() => setModalTab('branches')}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  modalTab === 'branches'
                    ? 'border-[#2481cc] text-[#2481cc]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {language === 'km'
                    ? `សាខាហាង (${activeBranches.length})`
                    : `Branches (${activeBranches.length})`}
                </span>
              </button>

              <button
                onClick={() => setModalTab('policies')}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  modalTab === 'policies'
                    ? 'border-[#2481cc] text-[#2481cc]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {language === 'km'
                    ? `គោលការណ៍ (${activeInfoItems.length})`
                    : `Policies (${activeInfoItems.length})`}
                </span>
              </button>

              <button
                onClick={() => setModalTab('contacts')}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  modalTab === 'contacts'
                    ? 'border-[#2481cc] text-[#2481cc]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'ទំនាក់ទំនង' : 'Contacts'}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
              {/* TAB 1: ALL BRANCHES (អាសយដ្ឋានសាខាទាំងអស់) */}
              {modalTab === 'branches' && (
                <div className="space-y-3">
                  {activeBranches.map((branch) => (
                    <div
                      key={branch.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        branch.isPrimary
                          ? 'border-sky-200 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {language === 'km' ? branch.nameKh : branch.nameEn}
                          </h5>
                          {branch.isPrimary && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#2481cc] text-white">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              <span>{language === 'km' ? 'ចម្បង' : 'Main'}</span>
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleCopy(
                              language === 'km' ? branch.addressKh : branch.addressEn,
                              `addr-${branch.id}`
                            )
                          }
                          className="text-[11px] text-[#2481cc] hover:underline flex items-center gap-1 font-semibold"
                        >
                          {copiedText === `addr-${branch.id}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>
                            {copiedText === `addr-${branch.id}`
                              ? language === 'km'
                                ? 'បានចម្លង'
                                : 'Copied'
                              : language === 'km'
                              ? 'ចម្លង'
                              : 'Copy'}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 leading-snug">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{language === 'km' ? branch.addressKh : branch.addressEn}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                            📞 {branch.phone}
                          </span>
                          <span className="text-slate-400">
                            ⏰ {language === 'km' ? branch.workingHoursKh : branch.workingHoursEn}
                          </span>
                        </div>

                        {branch.googleMapsUrl && (
                          <a
                            href={branch.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2481cc] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Google Maps</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: POLICIES & NOTICES (គោលការណ៍ និងសេចក្តីជូនដំណឹង) */}
              {modalTab === 'policies' && (
                <div className="space-y-3">
                  {activeInfoItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#2481cc] flex items-center justify-center shrink-0">
                          {item.category === 'delivery' && <Truck className="w-3.5 h-3.5" />}
                          {item.category === 'warranty' && <ShieldCheck className="w-3.5 h-3.5" />}
                          {item.category === 'policy' && <RotateCcw className="w-3.5 h-3.5" />}
                          {item.category === 'notice' && <Bell className="w-3.5 h-3.5" />}
                          {item.category === 'contact' && <Phone className="w-3.5 h-3.5" />}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {language === 'km' ? item.titleKh : item.titleEn}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                        {language === 'km' ? item.contentKh : item.contentEn}
                      </p>
                    </div>
                  ))}

                  {activeInfoItems.length === 0 && (
                    <p className="text-center text-slate-400 py-6">
                      {language === 'km' ? 'មិនទាន់មានគោលការណ៍បន្ថែមទេ' : 'No policies added yet'}
                    </p>
                  )}
                </div>
              )}

              {/* TAB 3: CONTACT CHANNELS */}
              {modalTab === 'contacts' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Hotline 1 */}
                    <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="text-[10px] text-slate-400">Hotline 1</div>
                          <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            {storeInfo.phone1}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(storeInfo.phone1, 'p1')}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        {copiedText === 'p1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Hotline 2 */}
                    {storeInfo.phone2 && (
                      <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <div>
                            <div className="text-[10px] text-slate-400">Hotline 2</div>
                            <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                              {storeInfo.phone2}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(storeInfo.phone2!, 'p2')}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          {copiedText === 'p2' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {/* Telegram */}
                    <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#2481cc]" />
                        <div>
                          <div className="text-[10px] text-slate-400">Telegram Admin</div>
                          <div className="font-mono font-bold text-xs text-[#2481cc]">
                            @{storeInfo.telegramUsername}
                          </div>
                        </div>
                      </div>
                      <a
                        href={`https://t.me/${storeInfo.telegramUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#2481cc] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Email */}
                    <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="text-[10px] text-slate-400">Email</div>
                          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                            {storeInfo.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(storeInfo.email, 'email')}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        {copiedText === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleChatWithShop()}
                className="flex-1 py-2.5 px-3 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'km' ? 'ឆាតសួរនាំ KAKA Shop' : 'Chat with Store'}</span>
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-300 transition-colors"
              >
                {language === 'km' ? 'បិទ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Secure Certificate Viewer Modal with Anti-Download and Anti-Screenshot protection */}
      <SecureCertificateViewer
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </>
  );
};
