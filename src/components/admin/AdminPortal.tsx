import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Shield,
  History,
  Cloud,
  LogOut,
  User,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Store,
  FileCheck,
  Share2,
  Check,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';
import { AdminLogin } from './AdminLogin';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { AdminProductManagement } from './AdminProductManagement';
import { AdminCategoryManagement } from './AdminCategoryManagement';
import { AdminCouponManagement } from './AdminCouponManagement';
import { AdminOrderManagement } from './AdminOrderManagement';
import { AdminRoleManagement } from './AdminRoleManagement';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminDeployGuide } from './AdminDeployGuide';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminCertificateManagement } from './AdminCertificateManagement';
import { AdminVendorManagement } from './AdminVendorManagement';
import { StoreShareModal } from './StoreShareModal';
import { ChangePinModal } from './ChangePinModal';

export const AdminPortal: React.FC = () => {
  const {
    currentAdmin,
    logoutAdmin,
    language,
    vendors,
    getVendorById,
    selectedAdminVendorId,
    setSelectedAdminVendorId,
  } = useApp();

  const [shareVendorModal, setShareVendorModal] = useState<Vendor | null>(null);
  const [copiedMarketplaceLink, setCopiedMarketplaceLink] = useState(false);
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);

  const handleShareMarketplace = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://t.me/phsar24_bot/app';
    const cleanUrl = `${origin}?utm_source=admin_share`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanUrl);
      setCopiedMarketplaceLink(true);
      setTimeout(() => setCopiedMarketplaceLink(false), 2500);
    }
  };

  const [adminTab, setAdminTab] = useState<
    | 'analytics'
    | 'vendors'
    | 'products'
    | 'categories'
    | 'coupons'
    | 'orders'
    | 'store_info'
    | 'certificates'
    | 'roles'
    | 'audit'
    | 'deploy'
  >('analytics');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  // Support mouse wheel horizontal scrolling
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkScrollability();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  // Mouse drag handlers (អូសតាម Mouse - Drag & Drop scrolling)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScrollability();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTabClick = (tabId: typeof adminTab, e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setAdminTab(tabId);
    (e.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const isMarketplaceMaster = currentAdmin?.role === 'SUPER_ADMIN' && !currentAdmin?.vendorId;
  const activeShareVendor = currentAdmin?.vendorId
    ? getVendorById(currentAdmin.vendorId)
    : selectedAdminVendorId && selectedAdminVendorId !== 'all'
    ? getVendorById(selectedAdminVendorId)
    : vendors[0];

  const allTabs = [
    {
      id: 'analytics' as const,
      labelKh: 'ស្ថិតិលក់ជាក់ស្តែង',
      labelEn: 'Live Analytics',
      icon: LayoutDashboard,
      superAdminOnly: false,
    },
    {
      id: 'vendors' as const,
      labelKh: 'គ្រប់គ្រងហាងលក់ (Marketplace)',
      labelEn: 'Vendors (Marketplace)',
      icon: Store,
      superAdminOnly: true,
    },
    {
      id: 'products' as const,
      labelKh: 'គ្រប់គ្រងទំនិញ',
      labelEn: 'Products (CRUD)',
      icon: Package,
      superAdminOnly: false,
    },
    {
      id: 'categories' as const,
      labelKh: 'ប្រភេទផលិតផល',
      labelEn: 'Categories',
      icon: Layers,
      superAdminOnly: false,
    },
    {
      id: 'coupons' as const,
      labelKh: 'គូប៉ុងបញ្ចុះតម្លៃ',
      labelEn: 'Coupons',
      icon: Ticket,
      superAdminOnly: false,
    },
    {
      id: 'orders' as const,
      labelKh: 'បញ្ជីកុម្ម៉ង់',
      labelEn: 'Orders',
      icon: ShoppingBag,
      superAdminOnly: false,
    },
    {
      id: 'store_info' as const,
      labelKh: 'ព័ត៌មាន & អាសយដ្ឋានហាង',
      labelEn: 'Store Info',
      icon: Store,
      superAdminOnly: false,
    },
    {
      id: 'certificates' as const,
      labelKh: 'អាជ្ញាប័ណ្ណ & ឯកសារ',
      labelEn: 'Licenses & Permits',
      icon: FileCheck,
      superAdminOnly: false,
    },
    {
      id: 'roles' as const,
      labelKh: 'សិទ្ធិអ្នកគ្រប់គ្រង',
      labelEn: 'Roles & RBAC',
      icon: Shield,
      superAdminOnly: true,
    },
    {
      id: 'audit' as const,
      labelKh: 'ប្រវត្តិសកម្មភាព',
      labelEn: 'Audit Logs',
      icon: History,
      superAdminOnly: true,
    },
    {
      id: 'deploy' as const,
      labelKh: 'Deploy & Telegram',
      labelEn: 'Cloud & Bot',
      icon: Cloud,
      superAdminOnly: true,
    },
  ];

  const tabs = allTabs.filter((t) => !t.superAdminOnly || isMarketplaceMaster);

  // If a store manager is on a restricted tab, redirect them to 'products'
  useEffect(() => {
    if (currentAdmin && !isMarketplaceMaster && ['vendors', 'roles', 'audit', 'deploy'].includes(adminTab)) {
      setAdminTab('products');
    }
  }, [adminTab, isMarketplaceMaster, currentAdmin, setAdminTab]);

  if (!currentAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="pb-24 pt-2 max-w-4xl mx-auto space-y-4">
      {/* Top Admin User Profile Header */}
      <div className="bg-white dark:bg-[#17212b] p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-xs">
            {currentAdmin.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {currentAdmin.name}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  currentAdmin.role === 'SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200'
                    : currentAdmin.role === 'STORE_MANAGER'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200'
                }`}
              >
                {currentAdmin.role === 'SUPER_ADMIN'
                  ? 'Super Admin'
                  : currentAdmin.role === 'STORE_MANAGER'
                  ? 'Store Manager'
                  : 'Support Staff (View-Only)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap mt-0.5">
              <span>@{currentAdmin.username}</span>
              <span>·</span>
              <span>
                {currentAdmin.role === 'SUPPORT_STAFF'
                  ? language === 'km'
                    ? '👁️ សិទ្ធិមើលប៉ុណ្ណោះ (កែប្រែចាប់ពី Store Manager+)'
                    : '👁️ View-Only (Store Manager+ to edit)'
                  : language === 'km'
                  ? '✓ សិទ្ធិគ្រប់គ្រង និងកែប្រែទិន្នន័យ'
                  : '✓ Full Edit & Management Rights'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Link ផ្សាររួម (Marketplace Share Link) */}
          <button
            onClick={handleShareMarketplace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#2481cc] dark:text-sky-300 transition-colors shadow-2xs"
            title={language === 'km' ? 'ចម្លង Link ផ្សាររួម Phsar24 សម្រាប់ចែករំលែក' : 'Share General Marketplace Link'}
          >
            {copiedMarketplaceLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">{language === 'km' ? 'បានចម្លង ✓' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'Link ផ្សាររួម' : 'Market Link'}</span>
              </>
            )}
          </button>

          {/* បញ្ជីហាង (Store Directory & Vendor Management) */}
          <button
            onClick={() => setAdminTab('vendors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors shadow-2xs ${
              adminTab === 'vendors'
                ? 'bg-[#2481cc] text-white border-[#2481cc]'
                : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
            title={language === 'km' ? 'បើកមើលបញ្ជីហាង និងគ្រប់គ្រងហាងលក់ទាំងអស់' : 'Store Directory & Management'}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'km' ? `បញ្ជីហាង (${vendors.length})` : `Stores (${vendors.length})`}</span>
          </button>

          {activeShareVendor && (
            <button
              onClick={() => setShareVendorModal(activeShareVendor)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#2481cc] dark:text-sky-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shadow-2xs"
              title={language === 'km' ? 'យក Link ហាង & QR សម្រាប់ផ្ញើឱ្យអតិថិជន' : 'Store Link & QR'}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'Link ហាង & QR' : 'Store Link & QR'}</span>
            </button>
          )}

          {/* ប្តូរលេខសម្ងាត់ PIN (Change Security PIN) */}
          <button
            onClick={() => setIsChangePinModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 transition-colors shadow-2xs"
            title={language === 'km' ? 'ប្តូរលេខកូដសម្ងាត់ PIN' : 'Change Security PIN'}
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{language === 'km' ? 'ប្តូរ PIN' : 'Change PIN'}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
            title="ចាកចេញ / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'km' ? 'ចាកចេញ' : 'Logout'}
            </span>
          </button>
        </div>
      </div>

      {/* Marketplace Master Global Store Selector Bar */}
      {currentAdmin.role === 'SUPER_ADMIN' && !currentAdmin.vendorId && (
        <div className="bg-sky-50/80 dark:bg-sky-950/30 p-2.5 sm:p-3 rounded-2xl border border-sky-200/80 dark:border-sky-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#2481cc] text-white flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {language === 'km' ? 'ផ្ទាំងត្រួតពិនិត្យផ្សាររួម (Marketplace Master Control)' : 'Marketplace Master Filter'}
              </span>
              <span className="text-[11px] text-slate-500">
                {language === 'km'
                  ? 'ជ្រើសរើសហាងដើម្បីត្រួតពិនិត្យទំនិញ និងការលក់របស់ហាងនោះ ឬមើលទាំងអស់'
                  : 'Select a store to filter products & orders, or view all stores.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={selectedAdminVendorId || 'all'}
              onChange={(e) => setSelectedAdminVendorId(e.target.value === 'all' ? null : e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-sky-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2481cc] shadow-2xs focus:ring-2 focus:ring-[#2481cc]"
            >
              <option value="all">🏪 {language === 'km' ? 'គ្រប់ហាងទាំងអស់ (All Marketplace Stores)' : 'All Marketplace Stores'}</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.isVerified ? '✓ ' : ''}{v.nameKh}
                </option>
              ))}
            </select>
            {selectedAdminVendorId && (
              <button
                type="button"
                onClick={() => setSelectedAdminVendorId(null)}
                className="text-[11px] text-rose-500 hover:text-rose-600 px-2 py-1 font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50"
              >
                {language === 'km' ? 'មើលទាំងអស់' : 'View All'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Store Manager Specific Banner (when logged in as a specific vendor's manager) */}
      {currentAdmin.vendorId && (
        <div className="bg-emerald-50/90 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  {language === 'km' ? '🔒 គណនីគ្រប់គ្រងហាងផ្តាច់មុខ៖' : '🔒 Dedicated Store Manager:'}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  {vendors.find((v) => v.id === currentAdmin.vendorId)?.nameKh || currentAdmin.vendorId}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                {language === 'km'
                  ? 'អ្នកអាចមើល និងគ្រប់គ្រងតែទំនិញ និងការកុម្ម៉ង់ក្នុងហាងផ្ទាល់ខ្លួនរបស់អ្នកប៉ុណ្ណោះ។'
                  : 'You only see and manage products & orders for your specific store.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs - Swipeable & Draggable (អូសពីឆ្វេងទៅស្តាំ ឬពីស្តាំទៅឆ្វេង) */}
      <div className="relative group">
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={handleScrollLeft}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-[#17212b]/95 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            aria-label="Scroll left"
            title={language === 'km' ? 'អូសទៅឆ្វេង' : 'Scroll left'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={handleScrollRight}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 dark:bg-[#17212b]/95 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            aria-label="Scroll right"
            title={language === 'km' ? 'អូសទៅស្តាំ' : 'Scroll right'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Left Fade Gradient */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-100/90 dark:from-[#0e1621] to-transparent pointer-events-none z-10 rounded-l-xl" />
        )}

        {/* Right Fade Gradient */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100/90 dark:from-[#0e1621] to-transparent pointer-events-none z-10 rounded-r-xl" />
        )}

        {/* Draggable & Touch-Swipeable Tabs Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth px-1"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {tabs.map((tab) => {
            const isActive = adminTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={(e) => handleTabClick(tab.id, e)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 min-h-[38px] select-none shadow-2xs ${
                  isActive
                    ? 'bg-[#2481cc] text-white shadow-md scale-102 ring-2 ring-[#2481cc]/30'
                    : 'bg-white dark:bg-[#17212b] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'km' ? tab.labelKh : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Views */}
      <div>
        {adminTab === 'analytics' && <AdminAnalyticsDashboard />}
        {adminTab === 'vendors' && (
          <AdminVendorManagement onInspectVendor={() => setAdminTab('products')} />
        )}
        {adminTab === 'products' && <AdminProductManagement />}
        {adminTab === 'categories' && <AdminCategoryManagement />}
        {adminTab === 'coupons' && <AdminCouponManagement />}
        {adminTab === 'orders' && <AdminOrderManagement />}
        {adminTab === 'store_info' && <AdminStoreSettings />}
        {adminTab === 'certificates' && <AdminCertificateManagement />}
        {adminTab === 'roles' && <AdminRoleManagement />}
        {adminTab === 'audit' && <AdminAuditLogs />}
        {adminTab === 'deploy' && <AdminDeployGuide />}
      </div>
      {shareVendorModal && (
        <StoreShareModal
          vendor={shareVendorModal}
          isOpen={!!shareVendorModal}
          onClose={() => setShareVendorModal(null)}
        />
      )}
      {isChangePinModalOpen && (
        <ChangePinModal
          isOpen={isChangePinModalOpen}
          onClose={() => setIsChangePinModalOpen(false)}
        />
      )}
    </div>
  );
};
