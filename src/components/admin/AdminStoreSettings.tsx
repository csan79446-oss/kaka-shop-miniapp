import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Send,
  Mail,
  ExternalLink,
  Save,
  Check,
  Building2,
  Globe,
  Plus,
  Edit2,
  Trash2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Bell,
  AlertCircle,
  X,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreInfo, StoreLocation, StoreInfoItem } from '../../types';
import { RbacNoticeBanner } from './RbacNoticeBanner';

export const AdminStoreSettings: React.FC = () => {
  const {
    storeInfo,
    updateStoreInfo,
    storeLocations,
    addStoreLocation,
    updateStoreLocation,
    deleteStoreLocation,
    setPrimaryStoreLocation,
    storeInfoItems,
    addStoreInfoItem,
    updateStoreInfoItem,
    deleteStoreInfoItem,
    language,
    canManageContent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'branches' | 'info_items' | 'general'>('branches');
  const [generalFormData, setGeneralFormData] = useState<StoreInfo>(storeInfo);
  const [generalSaved, setGeneralSaved] = useState(false);

  // Branch Modal State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<StoreLocation | null>(null);
  const [branchForm, setBranchForm] = useState<Omit<StoreLocation, 'id'>>({
    nameKh: '',
    nameEn: '',
    addressKh: '',
    addressEn: '',
    city: 'Phnom Penh',
    phone: '',
    telegramUsername: '',
    workingHoursKh: '៨:០០ ព្រឹក - ៩:០០ យប់',
    workingHoursEn: '8:00 AM - 9:00 PM',
    googleMapsUrl: '',
    isPrimary: false,
    isActive: true,
  });

  // Delete Branch Confirmation Modal State
  const [branchToDelete, setBranchToDelete] = useState<StoreLocation | null>(null);

  // Info Item Modal State
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingInfoItem, setEditingInfoItem] = useState<StoreInfoItem | null>(null);
  const [infoForm, setInfoForm] = useState<Omit<StoreInfoItem, 'id' | 'createdAt'>>({
    titleKh: '',
    titleEn: '',
    contentKh: '',
    contentEn: '',
    category: 'delivery',
    icon: 'Truck',
    isActive: true,
  });

  // Delete Info Item Confirmation Modal State
  const [infoToDelete, setInfoToDelete] = useState<StoreInfoItem | null>(null);

  // Open Branch Modal for Create
  const handleOpenCreateBranch = () => {
    setEditingBranch(null);
    setBranchForm({
      nameKh: '',
      nameEn: '',
      addressKh: '',
      addressEn: '',
      city: 'Phnom Penh',
      phone: storeInfo.phone1,
      telegramUsername: storeInfo.telegramUsername,
      workingHoursKh: '៨:០០ ព្រឹក - ៩:០០ យប់',
      workingHoursEn: '8:00 AM - 9:00 PM',
      googleMapsUrl: '',
      isPrimary: storeLocations.length === 0,
      isActive: true,
    });
    setIsBranchModalOpen(true);
  };

  // Open Branch Modal for Edit
  const handleOpenEditBranch = (branch: StoreLocation) => {
    setEditingBranch(branch);
    setBranchForm({
      nameKh: branch.nameKh,
      nameEn: branch.nameEn,
      addressKh: branch.addressKh,
      addressEn: branch.addressEn,
      city: branch.city,
      phone: branch.phone,
      telegramUsername: branch.telegramUsername || '',
      workingHoursKh: branch.workingHoursKh,
      workingHoursEn: branch.workingHoursEn,
      googleMapsUrl: branch.googleMapsUrl || '',
      isPrimary: branch.isPrimary,
      isActive: branch.isActive,
    });
    setIsBranchModalOpen(true);
  };

  // Submit Branch (Create or Update)
  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      updateStoreLocation(editingBranch.id, branchForm);
    } else {
      addStoreLocation(branchForm);
    }
    setIsBranchModalOpen(false);
    setEditingBranch(null);
  };

  // Confirm Delete Branch
  const handleConfirmDeleteBranch = () => {
    if (branchToDelete) {
      deleteStoreLocation(branchToDelete.id);
      setBranchToDelete(null);
    }
  };

  // Open Info Item Modal for Create
  const handleOpenCreateInfo = () => {
    setEditingInfoItem(null);
    setInfoForm({
      titleKh: '',
      titleEn: '',
      contentKh: '',
      contentEn: '',
      category: 'delivery',
      icon: 'Truck',
      isActive: true,
    });
    setIsInfoModalOpen(true);
  };

  // Open Info Item Modal for Edit
  const handleOpenEditInfo = (item: StoreInfoItem) => {
    setEditingInfoItem(item);
    setInfoForm({
      titleKh: item.titleKh,
      titleEn: item.titleEn,
      contentKh: item.contentKh,
      contentEn: item.contentEn,
      category: item.category,
      icon: item.icon || 'Truck',
      isActive: item.isActive,
    });
    setIsInfoModalOpen(true);
  };

  // Submit Info Item (Create or Update)
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInfoItem) {
      updateStoreInfoItem(editingInfoItem.id, infoForm);
    } else {
      addStoreInfoItem(infoForm);
    }
    setIsInfoModalOpen(false);
    setEditingInfoItem(null);
  };

  // Confirm Delete Info Item
  const handleConfirmDeleteInfo = () => {
    if (infoToDelete) {
      deleteStoreInfoItem(infoToDelete.id);
      setInfoToDelete(null);
    }
  };

  // Submit General Form
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreInfo(generalFormData);
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 2500);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <RbacNoticeBanner moduleNameKh="ព័ត៌មាន និងសាខាហាង" moduleNameEn="store branches and information" />

      {/* Top Banner & Tab Navigation */}
      <div className="bg-white dark:bg-[#17212b] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#2481cc]" />
            <span>{language === 'km' ? 'គ្រប់គ្រងព័ត៌មាន & អាសយដ្ឋានហាង' : 'Store Information & Branches Manager'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'km'
              ? 'Admin អាច បញ្ចូល (Add), កែប្រែ (Edit), ឬ លុប (Delete) អាសយដ្ឋានសាខាហាង និងគោលការណ៍ផ្សេងៗបានតាមចិត្ត'
              : 'Add, edit, or delete store addresses, branches, contact points, and customer policies'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 max-w-full overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'branches'
                ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'km' ? `អាសយដ្ឋាន/សាខា (${storeLocations.length})` : `Branches (${storeLocations.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('info_items')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'info_items'
                ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'km' ? `គោលការណ៍ហាង (${storeInfoItems.length})` : `Policies (${storeInfoItems.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'general'
                ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ព័ត៌មានទូទៅ' : 'Brand Profile'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STORE BRANCHES & ADDRESSES (បញ្ចូល / កែប្រែ / លុប អាសយដ្ឋានហាង) */}
      {/* ========================================================================= */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          {/* Action Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {language === 'km' ? 'បញ្ជីសាខា និងអាសយដ្ឋានហាងជាក់ស្តែង' : 'Physical Store Branches & Locations'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'km'
                  ? 'សាខាដែលបានកំណត់ជា "សាខាចម្បង" នឹងបង្ហាញលើក្បាលវិក្កយបត្រ និង Banner លើគេ'
                  : 'The primary branch appears on official invoices and top storefront banner'}
              </p>
            </div>

            {canManageContent ? (
              <button
                onClick={handleOpenCreateBranch}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'km' ? 'បញ្ចូលអាសយដ្ឋាន/សាខាថ្មី' : 'Add New Branch'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'km' ? 'សិទ្ធិមើលប៉ុណ្ណោះ' : 'View Only'}</span>
              </div>
            )}
          </div>

          {/* Locations Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeLocations.map((loc) => (
              <div
                key={loc.id}
                className={`bg-white dark:bg-[#17212b] rounded-2xl border p-4 sm:p-5 shadow-xs transition-all relative ${
                  loc.isPrimary
                    ? 'border-[#2481cc] ring-2 ring-sky-100 dark:ring-sky-950/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Badges Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    {loc.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-[#2481cc] border border-sky-200 dark:border-sky-800">
                        <Star className="w-3 h-3 fill-[#2481cc]" />
                        <span>{language === 'km' ? 'សាខាចម្បង (Primary)' : 'Primary'}</span>
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        loc.isActive
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {loc.isActive ? (language === 'km' ? 'បើកដំណើរការ' : 'Active') : (language === 'km' ? 'ផ្អាក' : 'Inactive')}
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  {canManageContent ? (
                    <div className="flex items-center gap-1">
                      {!loc.isPrimary && (
                        <button
                          onClick={() => setPrimaryStoreLocation(loc.id)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          title={language === 'km' ? 'ដាក់ជាសាខាចម្បង' : 'Set as Primary'}
                        >
                          {language === 'km' ? 'ដាក់ជាសាខាចម្បង' : 'Make Primary'}
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditBranch(loc)}
                        className="p-1.5 text-slate-500 hover:text-[#2481cc] hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-lg transition-colors"
                        title={language === 'km' ? 'កែប្រែ' : 'Edit'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setBranchToDelete(loc)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                        title={language === 'km' ? 'លុប' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-500" /> View only
                    </span>
                  )}
                </div>

                {/* Branch Details */}
                <div className="space-y-2 text-xs">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {loc.nameKh}
                    </h5>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {loc.nameEn}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-200 leading-snug">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{loc.addressKh}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                      {loc.addressEn}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-mono font-semibold">{loc.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{loc.workingHoursKh}</span>
                    </div>
                  </div>

                  {loc.googleMapsUrl && (
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#2481cc] hover:underline font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{language === 'km' ? 'តំណភ្ជាប់ Google Maps' : 'View on Google Maps'}</span>
                      </a>

                      {loc.telegramUsername && (
                        <span className="text-[11px] font-mono text-slate-500">
                          TG: @{loc.telegramUsername}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {storeLocations.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-[#17212b] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                {language === 'km' ? 'មិនទាន់មានអាសយដ្ឋាន/សាខាហាងនៅឡើយទេ' : 'No Store Branches Added Yet'}
              </h5>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {language === 'km'
                  ? 'សូមចុចប៊ូតុង "បញ្ចូលអាសយដ្ឋាន/សាខាថ្មី" ដើម្បីបន្ថែមសាខាហាងដំបូងរបស់អ្នក'
                  : 'Click the button below to add your first physical store address'}
              </p>
              <button
                onClick={handleOpenCreateBranch}
                className="mt-3 px-4 py-2 bg-[#2481cc] text-white rounded-xl text-xs font-semibold"
              >
                + {language === 'km' ? 'បញ្ចូលសាខាឥឡូវនេះ' : 'Add Branch Now'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STORE INFO ITEMS & POLICIES (បញ្ចូល / កែប្រែ / លុប ព័ត៌មាន & គោលការណ៍) */}
      {/* ========================================================================= */}
      {activeTab === 'info_items' && (
        <div className="space-y-4">
          {/* Action Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                {language === 'km' ? 'គោលការណ៍ សេវាកម្ម និងសេចក្តីជូនដំណឹងរបស់ហាង' : 'Store Policies, Services & Notices'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'km'
                  ? 'ព័ត៌មានទាំងនេះនឹងត្រូវបង្ហាញក្នុងផ្ទាំង Store Details Modal ជូនអតិថិជនបានដឹង'
                  : 'These items are highlighted to customers in the store details popup'}
              </p>
            </div>

            {canManageContent ? (
              <button
                onClick={handleOpenCreateInfo}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'km' ? 'បញ្ចូលព័ត៌មាន/គោលការណ៍ថ្មី' : 'Add New Policy'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'km' ? 'សិទ្ធិមើលប៉ុណ្ណោះ' : 'View Only'}</span>
              </div>
            )}
          </div>

          {/* Info Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeInfoItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs relative hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-[#2481cc] flex items-center justify-center shrink-0">
                      {item.category === 'delivery' && <Truck className="w-4 h-4" />}
                      {item.category === 'warranty' && <ShieldCheck className="w-4 h-4" />}
                      {item.category === 'policy' && <RotateCcw className="w-4 h-4" />}
                      {item.category === 'notice' && <Bell className="w-4 h-4" />}
                      {item.category === 'contact' && <Phone className="w-4 h-4" />}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {canManageContent ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditInfo(item)}
                        className="p-1.5 text-slate-500 hover:text-[#2481cc] hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-lg transition-colors"
                        title={language === 'km' ? 'កែប្រែ' : 'Edit'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setInfoToDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                        title={language === 'km' ? 'លុប' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-500" /> View only
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mt-2">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {item.titleKh}
                  </h5>
                  <div className="text-[11px] font-medium text-slate-400">
                    {item.titleEn}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    {item.contentKh}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.contentEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {storeInfoItems.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-[#17212b] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                {language === 'km' ? 'មិនទាន់មានគោលការណ៍ ឬព័ត៌មានបន្ថែមនៅឡើយទេ' : 'No Store Policies Added Yet'}
              </h5>
              <button
                onClick={handleOpenCreateInfo}
                className="mt-3 px-4 py-2 bg-[#2481cc] text-white rounded-xl text-xs font-semibold"
              >
                + {language === 'km' ? 'បញ្ចូលគោលការណ៍ថ្មី' : 'Add Policy'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GENERAL BRAND PROFILE (កែប្រែព័ត៌មានទូទៅ & ទំនាក់ទំនងចម្បង) */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <form onSubmit={handleGeneralSubmit} className="bg-white dark:bg-[#17212b] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'km' ? 'កែប្រែព័ត៌មានទូទៅ & Brand ហាង' : 'Edit General Brand Profile'}
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'km' ? 'ឈ្មោះចម្បង ពាក្យស្លោក និងទំនាក់ទំនងទូទៅ' : 'Main brand name, hotline, and social accounts'}
              </p>
            </div>

            {generalSaved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold animate-fade-in">
                <Check className="w-4 h-4" />
                <span>{language === 'km' ? 'បានរក្សាទុករួចរាល់!' : 'Changes Saved!'}</span>
              </div>
            )}
          </div>

          {/* Store Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'km' ? 'ឈ្មោះហាង (ជាភាសាខ្មែរ)' : 'Store Name (Khmer)'}
              </label>
              <input
                type="text"
                required
                value={generalFormData.nameKh}
                onChange={(e) => setGeneralFormData({ ...generalFormData, nameKh: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'km' ? 'ឈ្មោះហាង (English)' : 'Store Name (English)'}
              </label>
              <input
                type="text"
                required
                value={generalFormData.nameEn}
                onChange={(e) => setGeneralFormData({ ...generalFormData, nameEn: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
              />
            </div>
          </div>

          {/* Taglines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'km' ? 'ពាក្យស្លោក/ពិពណ៌នាខ្លី (Khmer)' : 'Tagline (Khmer)'}
              </label>
              <input
                type="text"
                value={generalFormData.taglineKh}
                onChange={(e) => setGeneralFormData({ ...generalFormData, taglineKh: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'km' ? 'ពាក្យស្លោក/ពិពណ៌នាខ្លី (English)' : 'Tagline (English)'}
              </label>
              <input
                type="text"
                value={generalFormData.taglineEn}
                onChange={(e) => setGeneralFormData({ ...generalFormData, taglineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'km' ? 'លេខទូរស័ព្ទទី១ (Hotline)' : 'Hotline 1'}
              </label>
              <input
                type="text"
                required
                value={generalFormData.phone1}
                onChange={(e) => setGeneralFormData({ ...generalFormData, phone1: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'km' ? 'លេខទូរស័ព្ទទី២ (ស្រេចចិត្ត)' : 'Hotline 2 (Optional)'}
              </label>
              <input
                type="text"
                value={generalFormData.phone2 || ''}
                onChange={(e) => setGeneralFormData({ ...generalFormData, phone2: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'km' ? 'Telegram Username ផ្លូវការ' : 'Official Telegram Handle'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={generalFormData.telegramUsername}
                  onChange={(e) =>
                    setGeneralFormData({
                      ...generalFormData,
                      telegramUsername: e.target.value.replace(/^@/, ''),
                    })
                  }
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {language === 'km' ? 'Email ហាង' : 'Store Email'}
              </label>
              <input
                type="email"
                required
                value={generalFormData.email}
                onChange={(e) => setGeneralFormData({ ...generalFormData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc] font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {!canManageContent && (
              <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'អនុញ្ញាតកែប្រែចាប់ពី Store Manager ឡើងទៅ' : 'Restricted to Store Manager & above'}</span>
              </span>
            )}
            <button
              type="submit"
              disabled={!canManageContent}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all ${
                canManageContent
                  ? 'bg-[#2481cc] hover:bg-[#1d6fae] text-white active:scale-98 cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{language === 'km' ? 'រក្សាទុកព័ត៌មានទូទៅ' : 'Save Brand Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STORE BRANCH (បញ្ចូល / កែប្រែ សាខា និងអាសយដ្ឋាន) */}
      {/* ========================================================================= */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-[#2481cc] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {editingBranch
                      ? language === 'km'
                        ? 'កែប្រែសាខា/អាសយដ្ឋានហាង'
                        : 'Edit Branch & Address'
                      : language === 'km'
                      ? 'បញ្ចូលសាខា/អាសយដ្ឋានហាងថ្មី'
                      : 'Add New Store Branch'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {language === 'km'
                      ? 'បំពេញព័ត៌មានទីតាំងជាក់ស្តែង និងលេខទាក់ទង'
                      : 'Provide address, city, phone, and Google Maps link'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleBranchSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះសាខា (Khmer) *' : 'Branch Name (Khmer) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. សាខាទី១ - ផ្សារដើមថ្កូវ"
                    value={branchForm.nameKh}
                    onChange={(e) => setBranchForm({ ...branchForm, nameKh: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះសាខា (English) *' : 'Branch Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Branch 1 - Doeum Thkov"
                    value={branchForm.nameEn}
                    onChange={(e) => setBranchForm({ ...branchForm, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'អាសយដ្ឋានលម្អិត (Khmer) *' : 'Full Address (Khmer) *'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="ឧ. ផ្ទះលេខ #168E, ផ្លូវ 271, សង្កាត់បឹងទំពុន, ខណ្ឌមានជ័យ, រាជធានីភ្នំពេញ..."
                  value={branchForm.addressKh}
                  onChange={(e) => setBranchForm({ ...branchForm, addressKh: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'អាសយដ្ឋានលម្អិត (English) *' : 'Full Address (English) *'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. #168E, Street 271, Sangkat Boeng Tumpun, Khan Meanchey, Phnom Penh..."
                  value={branchForm.addressEn}
                  onChange={(e) => setBranchForm({ ...branchForm, addressEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'លេខទូរស័ព្ទសាខា *' : 'Phone Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+855 12 889 977"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'រាជធានី / ខេត្ត' : 'City / Province'}
                  </label>
                  <input
                    type="text"
                    placeholder="Phnom Penh"
                    value={branchForm.city}
                    onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ម៉ោងធ្វើការ (Khmer)' : 'Working Hours (Khmer)'}
                  </label>
                  <input
                    type="text"
                    value={branchForm.workingHoursKh}
                    onChange={(e) => setBranchForm({ ...branchForm, workingHoursKh: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'Telegram សាខា (ស្រេចចិត្ត)' : 'Telegram (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="kakashop_admin"
                    value={branchForm.telegramUsername || ''}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        telegramUsername: e.target.value.replace(/^@/, ''),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'តំណភ្ជាប់ Google Maps (URL)' : 'Google Maps URL'}
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={branchForm.googleMapsUrl || ''}
                  onChange={(e) => setBranchForm({ ...branchForm, googleMapsUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc] font-mono text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={branchForm.isPrimary}
                    onChange={(e) => setBranchForm({ ...branchForm, isPrimary: e.target.checked })}
                    className="w-4 h-4 text-[#2481cc] rounded focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {language === 'km' ? 'កំណត់ជាសាខាចម្បង (Primary Branch)' : 'Set as Primary Branch'}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {language === 'km'
                        ? 'សាខានេះនឹងត្រូវជ្រើសជាអាសយដ្ឋានចម្បងលើវិក្កយបត្រ'
                        : 'This location will be used as default on receipts and banners'}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={branchForm.isActive}
                    onChange={(e) => setBranchForm({ ...branchForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                  />
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {language === 'km' ? 'បើកដំណើរការសាខានេះ (Active)' : 'Branch is currently active'}
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl font-semibold shadow-md active:scale-98 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingBranch
                      ? language === 'km'
                        ? 'រក្សាទុកការកែប្រែ'
                        : 'Update Branch'
                      : language === 'km'
                      ? 'បញ្ចូលសាខា'
                      : 'Add Branch'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STORE INFO / POLICY ITEM (បញ្ចូល / កែប្រែ គោលការណ៍ហាង) */}
      {/* ========================================================================= */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-[#2481cc] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {editingInfoItem
                      ? language === 'km'
                        ? 'កែប្រែព័ត៌មាន/គោលការណ៍ហាង'
                        : 'Edit Policy Item'
                      : language === 'km'
                      ? 'បញ្ចូលព័ត៌មាន/គោលការណ៍ហាងថ្មី'
                      : 'Add New Policy Item'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {language === 'km' ? 'កំណត់សេវាដឹកជញ្ជូន ការធានា ឬលក្ខខណ្ឌប្តូរទំនិញ' : 'Configure delivery, warranty, or returns notice'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInfoSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ប្រភេទព័ត៌មាន / Category *' : 'Category *'}
                </label>
                <select
                  value={infoForm.category}
                  onChange={(e) =>
                    setInfoForm({
                      ...infoForm,
                      category: e.target.value as StoreInfoItem['category'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                >
                  <option value="delivery">{language === 'km' ? '🚚 សេវាដឹកជញ្ជូន (Delivery)' : 'Delivery'}</option>
                  <option value="warranty">{language === 'km' ? '🛡️ ការធានាគុណភាព (Warranty)' : 'Warranty'}</option>
                  <option value="policy">{language === 'km' ? '🔄 គោលការណ៍ប្តូរទំនិញ (Return Policy)' : 'Return Policy'}</option>
                  <option value="notice">{language === 'km' ? '🔔 សេចក្តីជូនដំណឹងពិសេស (Special Notice)' : 'Special Notice'}</option>
                  <option value="contact">{language === 'km' ? '📞 ទំនាក់ទំនងបន្ថែម (Contact Info)' : 'Contact Point'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ចំណងជើង (Khmer) *' : 'Title (Khmer) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. សេវាដឹកជញ្ជូនរហ័សទូទាំងប្រទេស"
                  value={infoForm.titleKh}
                  onChange={(e) => setInfoForm({ ...infoForm, titleKh: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ចំណងជើង (English) *' : 'Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nationwide Express Delivery"
                  value={infoForm.titleEn}
                  onChange={(e) => setInfoForm({ ...infoForm, titleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ខ្លឹមសារលម្អិត (Khmer) *' : 'Content (Khmer) *'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="សរសេរការពិពណ៌នាលម្អិតជូនអតិថិជន..."
                  value={infoForm.contentKh}
                  onChange={(e) => setInfoForm({ ...infoForm, contentKh: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ខ្លឹមសារលម្អិត (English) *' : 'Content (English) *'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description in English..."
                  value={infoForm.contentEn}
                  onChange={(e) => setInfoForm({ ...infoForm, contentEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInfoModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl font-semibold shadow-md active:scale-98 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingInfoItem
                      ? language === 'km'
                        ? 'រក្សាទុក'
                        : 'Save'
                      : language === 'km'
                      ? 'បញ្ចូល'
                      : 'Add'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION MODAL: DELETE BRANCH (លុបសាខា/អាសយដ្ឋាន) */}
      {/* ========================================================================= */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'km' ? 'តើអ្នកពិតជាចង់លុបសាខានេះមែនទេ?' : 'Confirm Delete Store Branch?'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                "{branchToDelete.nameKh}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'km'
                  ? 'អាសយដ្ឋាននេះនឹងត្រូវដកចេញពីប្រព័ន្ធហាង។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។'
                  : 'This branch will be permanently removed from the storefront.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setBranchToDelete(null)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-300"
              >
                {language === 'km' ? 'បោះបង់' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmDeleteBranch}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                {language === 'km' ? 'យល់ព្រមលុប' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION MODAL: DELETE INFO ITEM (លុបគោលការណ៍/ព័ត៌មាន) */}
      {/* ========================================================================= */}
      {infoToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'km' ? 'តើអ្នកពិតជាចង់លុបព័ត៌មាននេះមែនទេ?' : 'Confirm Delete Policy Item?'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                "{infoToDelete.titleKh}"
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setInfoToDelete(null)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-300"
              >
                {language === 'km' ? 'បោះបង់' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmDeleteInfo}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                {language === 'km' ? 'យល់ព្រមលុប' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
