import React, { useRef, useState, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  Plus,
  Check,
  Package,
  TrendingUp,
  Tag,
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  Video,
  Play,
  Store,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  X,
  Phone,
  Send,
  Share2,
  Layers,
  Sparkles,
  Copy,
  Building2,
  Globe,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Vendor } from '../../types';
import { MarketplaceMarquee } from './MarketplaceMarquee';
import { StoreShareModal } from '../admin/StoreShareModal';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    vendors,
    selectedVendorId,
    setSelectedVendorId,
    getVendorById,
    getStoreShareLinks,
    setActiveTab,
    isDedicatedStoreMode,
    exitDedicatedStoreMode,
    dedicatedVendor,
    language,
    formatPrice,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    sendProductInquiryToChat,
    setSelectedProduct,
    openProductModal,
    cart,
    setIsTrackingOpen,
  } = useApp();

  const [shareModalVendor, setShareModalVendor] = useState<Vendor | null>(null);
  const [isStoreDirectoryOpen, setIsStoreDirectoryOpen] = useState(false);
  const [copiedMarketplaceLink, setCopiedMarketplaceLink] = useState(false);

  // Vendor Carousel Drag & Scroll State
  const vendorScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollVendorLeft, setCanScrollVendorLeft] = useState(false);
  const [canScrollVendorRight, setCanScrollVendorRight] = useState(false);
  const isVendorDraggingRef = useRef(false);
  const vendorStartXRef = useRef(0);
  const vendorScrollLeftRef = useRef(0);
  const vendorHasMovedRef = useRef(false);

  const checkVendorScrollability = () => {
    const el = vendorScrollRef.current;
    if (!el) return;
    setCanScrollVendorLeft(el.scrollLeft > 6);
    setCanScrollVendorRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  useEffect(() => {
    checkVendorScrollability();
    window.addEventListener('resize', checkVendorScrollability);
    return () => window.removeEventListener('resize', checkVendorScrollability);
  }, [vendors]);

  // Support mouse wheel horizontal scrolling on vendors bar
  useEffect(() => {
    const el = vendorScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkVendorScrollability();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleVendorScrollLeft = () => {
    if (vendorScrollRef.current) {
      vendorScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkVendorScrollability, 300);
    }
  };

  const handleVendorScrollRight = () => {
    if (vendorScrollRef.current) {
      vendorScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkVendorScrollability, 300);
    }
  };

  const handleVendorMouseDown = (e: React.MouseEvent) => {
    const el = vendorScrollRef.current;
    if (!el) return;
    isVendorDraggingRef.current = true;
    vendorHasMovedRef.current = false;
    vendorStartXRef.current = e.pageX - el.offsetLeft;
    vendorScrollLeftRef.current = el.scrollLeft;
  };

  const handleVendorMouseMove = (e: React.MouseEvent) => {
    if (!isVendorDraggingRef.current || !vendorScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - vendorScrollRef.current.offsetLeft;
    const walk = (x - vendorStartXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      vendorHasMovedRef.current = true;
    }
    vendorScrollRef.current.scrollLeft = vendorScrollLeftRef.current - walk;
    checkVendorScrollability();
  };

  const handleVendorMouseUp = () => {
    isVendorDraggingRef.current = false;
  };

  const handleVendorClick = (vendorId: string, e: React.MouseEvent) => {
    if (vendorHasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setSelectedVendorId(vendorId);
  };

  const handleShareMarketplace = () => {
    let origin = typeof window !== 'undefined' ? window.location.origin : 'https://kaka-shop.app';
    if (origin.includes('aistudio.google.com') || origin.includes('ais-dev-')) {
      origin = 'https://ais-pre-3crkstm7r5kqckgblfl2ll-491459478722.asia-southeast1.run.app';
    }
    const marketUrl = origin;
    const shareMessage = `🛍️ សូមស្វាគមន៍មកកាន់ផ្សារអនឡាញ KAKA Marketplace!
រុករក និងកុម្ម៉ង់ទិញទំនិញពីហាងល្បីៗជាច្រើននៅកម្ពុជា ជាមួយសេវាដឹកជញ្ជូនរហ័ស និងទូទាត់តាម ABA / Bakong KHQR៖
👉 ${marketUrl}`;

    navigator.clipboard.writeText(shareMessage);
    setCopiedMarketplaceLink(true);
    setTimeout(() => setCopiedMarketplaceLink(false), 2500);
  };

  // Categories Horizontal Carousel State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [products, categories]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 3) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
    checkScrollability();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCategoryClick = (catId: string, e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      return;
    }
    setSelectedCategory(catId);
    (e.currentTarget as HTMLElement).scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  const activeVendor = selectedVendorId !== 'all' ? getVendorById(selectedVendorId) : null;

  const visibleCategories =
    isDedicatedStoreMode && dedicatedVendor
      ? categories.filter(
          (c) =>
            c.id === 'all' ||
            products.some(
              (p) => p.vendorId === dedicatedVendor.id && p.category === c.id
            )
        )
      : selectedVendorId !== 'all'
      ? categories.filter(
          (c) =>
            c.id === 'all' ||
            products.some(
              (p) => p.vendorId === selectedVendorId && p.category === c.id
            )
        )
      : categories.filter(
          (c) =>
            c.id === 'all' ||
            products.some((p) => p.category === c.id)
        );

  // Auto-reset selected category to 'all' if the selected category is not in visible categories
  useEffect(() => {
    if (
      selectedCategory !== 'all' &&
      !visibleCategories.some((c) => c.id === selectedCategory)
    ) {
      setSelectedCategory('all');
    }
  }, [visibleCategories, selectedCategory, setSelectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Strict Merchant Isolation: In dedicated store mode, ONLY products belonging to this vendor can be shown
    const effectiveVendorId =
      isDedicatedStoreMode && dedicatedVendor ? dedicatedVendor.id : selectedVendorId;
    const matchesVendor =
      effectiveVendorId === 'all' ? true : product.vendorId === effectiveVendorId;

    return matchesCategory && matchesSearch && matchesVendor;
  });

  const getBadgeStyle = (badge?: Product['badge']) => {
    switch (badge) {
      case 'hot':
        return 'bg-rose-500 text-white';
      case 'sale':
        return 'bg-amber-500 text-white';
      case 'new':
        return 'bg-emerald-600 text-white';
      case 'featured':
        return 'bg-indigo-600 text-white';
      default:
        return 'hidden';
    }
  };

  const getBadgeLabel = (badge?: Product['badge']) => {
    if (language === 'km') {
      if (badge === 'hot') return 'ពេញនិយម';
      if (badge === 'sale') return 'បញ្ចុះតម្លៃ';
      if (badge === 'new') return 'ទំនិញថ្មី';
      if (badge === 'featured') return 'ពិសេស';
    } else {
      if (badge === 'hot') return 'HOT';
      if (badge === 'sale') return 'SALE';
      if (badge === 'new') return 'NEW';
      if (badge === 'featured') return 'TOP';
    }
    return '';
  };

  return (
    <div className="pb-24 pt-2">
      {/* Search & Express Track Bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'km'
                ? 'ស្វែងរកទំនិញតាមឈ្មោះ ឬប្រភេទ...'
                : 'Search products by name or category...'
            }
            className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2481cc]/40 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Track Order Button */}
        <button
          type="button"
          onClick={() => setIsTrackingOpen(true)}
          className="px-3 py-2.5 bg-white dark:bg-[#17212b] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors"
          title={language === 'km' ? 'តាមដានការដឹកជញ្ជូនរហ័សតាមលេខទូរស័ព្ទ' : 'Track Order by Phone'}
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">{language === 'km' ? 'តាមដាន' : 'Track'}</span>
        </button>
      </div>

      {/* Dedicated Storefront Header (Single Store Isolation) */}
      {isDedicatedStoreMode && dedicatedVendor ? (
        <div className="mb-4 relative overflow-hidden rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/90 via-white to-sky-50 dark:from-[#151f2b] dark:via-[#192534] dark:to-[#151f2b] p-4 sm:p-5 shadow-sm">
          {/* Top Banner Tag */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2481cc]/10 text-[#2481cc] dark:text-sky-300 text-xs font-bold border border-[#2481cc]/20">
              <Store className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ហាងផ្លូវការផ្តាច់មុខ (Official Storefront)' : 'Official Storefront'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareModalVendor(dedicatedVendor)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                title={language === 'km' ? 'ចែករំលែក Link ហាង' : 'Share Store Link'}
              >
                <Share2 className="w-3.5 h-3.5 text-[#2481cc]" />
                <span>{language === 'km' ? 'ចែករំលែក' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Store Info Row */}
          <div className="flex items-start gap-3.5">
            <img
              src={dedicatedVendor.logo}
              alt={dedicatedVendor.nameKh}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {language === 'km' ? dedicatedVendor.nameKh : dedicatedVendor.nameEn}
                </h2>
                {dedicatedVendor.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់រួច' : 'Verified'}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {language === 'km' ? dedicatedVendor.descriptionKh : dedicatedVendor.descriptionEn}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dedicatedVendor.rating}</span>
                  <span className="text-slate-400 font-normal">({dedicatedVendor.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dedicatedVendor.city}</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ {products.filter((p) => p.vendorId === dedicatedVendor.id).length} {language === 'km' ? 'មុខទំនិញក្នុងស្តុក' : 'items'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="mt-3.5 pt-3 border-t border-blue-100/80 dark:border-blue-900/40 flex items-center gap-2">
            <a
              href={`tel:${dedicatedVendor.ownerPhone}`}
              className="flex-1 py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dedicatedVendor.ownerPhone}</span>
            </a>

            <a
              href={`https://t.me/${dedicatedVendor.telegramUsername.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-1.5 px-3 bg-[#2481cc] hover:bg-[#1d6fa5] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ឆាត Telegram ផ្ទាល់' : 'Telegram'}</span>
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Marketplace News & Promotion Marquee Ticker (អក្សររត់ផ្សព្វផ្សាយ Phsar24) */}
          <MarketplaceMarquee onRegisterStoreClick={() => setActiveTab('admin')} />

          {/* Multi-Vendor Marketplace Stores Bar (Scrollable Left/Right with Drag & Link) */}
          <div className="mb-4 bg-white dark:bg-[#17212b] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between px-1 gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Store className="w-4 h-4 text-[#2481cc]" />
                <span>{language === 'km' ? 'ហាងលក់ក្នុងផ្សារអនឡាញ (Marketplace Shops)' : 'Browse by Marketplace Store'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#2481cc] dark:bg-blue-950 dark:text-sky-300 font-semibold border border-blue-200 dark:border-blue-900">
                {vendors.length} {language === 'km' ? 'ហាង' : 'shops'}
              </span>
            </div>

            {/* Store Pills Carousel with Left/Right Arrows and Mouse Drag */}
            <div className="relative group/carousel">
              {/* Left Arrow Button */}
              {canScrollVendorLeft && (
                <button
                  type="button"
                  onClick={handleVendorScrollLeft}
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#2481cc] hover:text-white transition-all backdrop-blur-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Scrollable Container (Left & Right Drag + Wheel) */}
              <div
                ref={vendorScrollRef}
                onScroll={checkVendorScrollability}
                onMouseDown={handleVendorMouseDown}
                onMouseMove={handleVendorMouseMove}
                onMouseUp={handleVendorMouseUp}
                onMouseLeave={handleVendorMouseUp}
                className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none"
                style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              >
                {/* All Stores Pill */}
                <button
                  type="button"
                  onClick={(e) => handleVendorClick('all', e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    selectedVendorId === 'all'
                      ? 'bg-[#2481cc] text-white shadow-xs scale-102 ring-2 ring-[#2481cc]/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? 'ហាងទាំងអស់' : 'All Stores'}</span>
                  <span className="text-[10px] opacity-75 font-mono">({products.length})</span>
                </button>

                {/* Individual Vendor Pills */}
                {vendors.map((vendor) => {
                  const isSelected = selectedVendorId === vendor.id;
                  const vendorProductCount = products.filter((p) => p.vendorId === vendor.id).length;

                  return (
                    <button
                      key={vendor.id}
                      type="button"
                      onClick={(e) => handleVendorClick(vendor.id, e)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 border ${
                        isSelected
                          ? 'bg-[#2481cc] text-white border-[#2481cc] shadow-xs scale-102 ring-2 ring-[#2481cc]/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={vendor.logo}
                        alt={vendor.nameKh}
                        className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-white/40 pointer-events-none"
                      />
                      <span className="max-w-[130px] truncate">
                        {language === 'km' ? vendor.nameKh.split('(')[0].trim() : vendor.nameEn.split('&')[0].trim()}
                      </span>
                      {vendor.isVerified && (
                        <CheckCircle2
                          className={`w-3 h-3 shrink-0 ${
                            isSelected ? 'text-white' : 'text-blue-500'
                          }`}
                        />
                      )}
                      <span className="text-[10px] opacity-75 font-mono">({vendorProductCount})</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              {canScrollVendorRight && (
                <button
                  type="button"
                  onClick={handleVendorScrollRight}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#2481cc] hover:text-white transition-all backdrop-blur-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Vendor Spotlight Banner (When a specific vendor is selected) */}
          {activeVendor && (
            <div className="mb-4 relative overflow-hidden rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-[#17212b] dark:via-[#1e2a38] dark:to-[#17212b] p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeVendor.logo}
                    alt={activeVendor.nameKh}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {language === 'km' ? activeVendor.nameKh : activeVendor.nameEn}
                      </h3>
                      {activeVendor.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{language === 'km' ? 'ហាងផ្លូវការ' : 'Official Vendor'}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{activeVendor.rating}</span>
                        <span className="text-slate-400 font-normal">({activeVendor.reviewCount})</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{activeVendor.city}</span>
                      </div>
                      {activeVendor.ownerPhone && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{activeVendor.ownerPhone}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-1">
                      {language === 'km' ? activeVendor.descriptionKh : activeVendor.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShareModalVendor(activeVendor)}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-[#2481cc] border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors shadow-2xs"
                    title={language === 'km' ? 'ចែករំលែក Link ហាង' : 'Share Store Link'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVendorId('all')}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 hover:border-rose-200 transition-colors shadow-2xs"
                    title={language === 'km' ? 'បង្ហាញហាងទាំងអស់វិញ' : 'View all stores'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Banner / Live Order Notice */}
      <div className="mb-4 p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20 border border-sky-100 dark:border-sky-900/40 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2481cc] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              {language === 'km' ? 'បញ្ជាទិញតាមរយៈ Live Chat ផ្ទាល់!' : 'Direct Chat Ordering Available!'}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {language === 'km'
                ? 'ចុចប៊ូតុងឆាត ដើម្បីសួរនាំ និងទទួលវិក្កយបត្រភ្លាមៗ'
                : 'Tap Chat button to inquire and get instant invoice'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills - Swipeable & Draggable (អូសពីឆ្វេងទៅស្តាំ ឬពីស្តាំទៅឆ្វេង) */}
      <div className="relative mb-4 group">
        {/* Left Navigation Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={handleScrollLeft}
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-[#17212b]/95 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable & Draggable container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategoryClick(cat.id, e)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] select-none shadow-xs ${
                  isSelected
                    ? 'bg-[#2481cc] text-white shadow-md scale-102 ring-2 ring-[#2481cc]/30'
                    : 'bg-white dark:bg-[#17212b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{language === 'km' ? cat.nameKh : cat.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Right Navigation Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={handleScrollRight}
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-[#17212b]/95 border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product List Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {language === 'km' ? 'រកមិនឃើញទំនិញដែលស្វែងរកទេ' : 'No products found'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'km' ? 'សូមសាកល្បងពាក្យគន្លឹះផ្សេងទៀត' : 'Try adjusting your search query or filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const inCart = cart.find((i) => i.product.id === product.id);
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col hover:border-[#2481cc]/40 transition-all shadow-xs group"
              >
                {/* Product Image Area */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={product.image}
                    alt={product.nameKh}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback container
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Fallback container if image fails */}
                  <div className="absolute inset-0 hidden items-center justify-center bg-slate-800 text-white text-xs">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${getBadgeStyle(
                        product.badge
                      )}`}
                    >
                      {getBadgeLabel(product.badge)}
                    </span>
                  )}

                  {/* Video Badge & Instant Play Button */}
                  {product.video && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal(product, 'video');
                      }}
                      className="absolute top-2 right-2 bg-black/80 hover:bg-rose-600 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-md z-10 active:scale-95 transition-all group/vbtn"
                      title={language === 'km' ? 'ចុចទស្សនាវីដេអូបង្ហាញផ្ទាល់' : 'Watch live video preview'}
                    >
                      <Play className="w-2.5 h-2.5 text-rose-400 fill-rose-400 group-hover/vbtn:text-white group-hover/vbtn:fill-white animate-pulse" />
                      <span>{language === 'km' ? 'វីដេអូ' : 'Video'}</span>
                    </button>
                  )}

                  {/* Stock tag */}
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {isOutOfStock
                      ? (language === 'km' ? 'អស់ស្តុក' : 'Out of stock')
                      : `${language === 'km' ? 'សល់' : 'Stock:'} ${product.stock}`}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal">
                          ({product.reviewCount || 12})
                        </span>
                      </div>
                      {product.colors && product.colors.length > 0 && (
                        <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-[9px]">
                          {product.colors.length} {language === 'km' ? 'ពណ៌' : 'colors'}
                        </span>
                      )}
                    </div>
                    {/* Vendor Badge */}
                    {(() => {
                      const vendor = product.vendorId ? getVendorById(product.vendorId) : null;
                      if (!vendor) return null;
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVendorId(vendor.id);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#2481cc] font-medium bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full transition-colors mb-1.5 group/vchip"
                          title={language === 'km' ? `មើលទំនិញក្នុងហាង ${vendor.nameKh}` : `View store: ${vendor.nameEn}`}
                        >
                          <Store className="w-2.5 h-2.5 text-[#2481cc] shrink-0" />
                          <span className="truncate max-w-[130px] font-semibold">
                            {language === 'km' ? vendor.nameKh.split('(')[0].trim() : vendor.nameEn.split('&')[0].trim()}
                          </span>
                          {vendor.isVerified && (
                            <CheckCircle2 className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                          )}
                        </button>
                      );
                    })()}

                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-[#2481cc] transition-colors">
                      {language === 'km' ? product.nameKh : product.nameEn}
                    </h3>
                    {(product.isTraditionalMedicine || product.category === 'herbal') && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{language === 'km' ? '🌿 ឱសថបុរាណមានអាជ្ញាប័ណ្ណ' : '🌿 Licensed Herbal'}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                      {language === 'km' ? product.descriptionKh : product.descriptionEn}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-[#2481cc] dark:text-[#50a7ea]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Dual Action Buttons: Chat to Order & Add to Cart */}
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {/* Chat to Order Button */}
                      <button
                        onClick={() => sendProductInquiryToChat(product, 'order')}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg text-[11px] font-medium transition-colors border border-emerald-200 dark:border-emerald-800/50"
                        title="កុម្ម៉ង់ទិញតាមឆាត / Chat to Order"
                      >
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {language === 'km' ? 'ឆាតទិញ' : 'Chat'}
                        </span>
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={isOutOfStock}
                        className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : inCart
                            ? 'bg-[#2481cc] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                        }`}
                        title="ដាក់ក្នុងកន្ត្រក / Add to Cart"
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3 h-3 shrink-0" />
                            <span className="truncate">({inCart.quantity})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {language === 'km' ? 'កន្ត្រក' : 'Cart'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Store Share Modal */}
      {shareModalVendor && (
        <StoreShareModal
          vendor={shareModalVendor}
          isOpen={!!shareModalVendor}
          onClose={() => setShareModalVendor(null)}
        />
      )}

      {/* Marketplace All Partner Stores Directory Modal */}
      {isStoreDirectoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto animate-scale">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#2481cc]/10 text-[#2481cc] flex items-center justify-center shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{language === 'km' ? 'បណ្តុំហាងលក់ក្នុងផ្សារ KAKA Marketplace' : 'All Partner Stores Directory'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#2481cc] dark:bg-blue-950 dark:text-sky-300 font-bold border border-blue-200 dark:border-blue-900">
                      {vendors.length} {language === 'km' ? 'ហាងដៃគូ' : 'Stores'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'km'
                      ? 'ទស្សនា និងជួយផ្សព្វផ្សាយគ្រប់ហាងលក់ទាំងអស់ដែលបានចុះឈ្មោះ'
                      : 'Explore and promote all registered merchant partner shops'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStoreDirectoryOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Share Marketplace Public Link Banner */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:via-sky-950/30 dark:to-indigo-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <Globe className="w-5 h-5 text-[#2481cc] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'km' ? 'Link ផ្សាររួម (ផ្សព្វផ្សាយគ្រប់ហាងទាំងអស់)' : 'Public Marketplace Link (All Stores)'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {language === 'km'
                      ? 'តំណភ្ជាប់នេះអាចផ្ញើ ឬផុសលើ Facebook, TikTok, Telegram ដើម្បីនាំភ្ញៀវចូលមើលគ្រប់ហាងទាំងអស់!'
                      : 'Share this link to introduce customers to all verified merchant shops in the marketplace.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShareMarketplace}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-xs ${
                  copiedMarketplaceLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2481cc] hover:bg-[#1d6fae] text-white'
                }`}
              >
                {copiedMarketplaceLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'បានចម្លងរួចរាល់ ✓' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ចម្លង Link ផ្សាររួម' : 'Copy Market Link'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {vendors.map((vendor) => {
                const vendorProductCount = products.filter((p) => p.vendorId === vendor.id).length;

                return (
                  <div
                    key={vendor.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs hover:border-[#2481cc]/40 dark:hover:border-[#2481cc]/40 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={vendor.logo}
                          alt={vendor.nameKh}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {language === 'km' ? vendor.nameKh : vendor.nameEn}
                            </h4>
                            {vendor.isVerified && (
                              <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{vendor.city}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {vendorProductCount} {language === 'km' ? 'ទំនិញ' : 'items'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{vendor.rating}</span>
                            <span className="text-slate-400 font-normal">({vendor.reviewCount} ការវាយតម្លៃ)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVendorId(vendor.id);
                          setIsStoreDirectoryOpen(false);
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <Store className="w-3 h-3 text-[#2481cc]" />
                        <span>{language === 'km' ? 'ចូលមើលទំនិញ' : 'Shop'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShareModalVendor(vendor);
                        }}
                        className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[#2481cc] dark:text-sky-300 text-[11px] font-bold border border-blue-200 dark:border-blue-900 transition-colors flex items-center gap-1 shadow-2xs"
                        title="យក Link ហាង & QR Code"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{language === 'km' ? 'Link ហាង & QR' : 'Share'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Merchant Onboarding Banner */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {language === 'km'
                    ? 'តើលោកអ្នកជាម្ចាស់ហាងដែរឬទេ? ចុះឈ្មោះបើកហាងថ្មីជាមួយយើងឥឡូវនេះ!'
                    : 'Are you a merchant? Register and open your online storefront today!'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsStoreDirectoryOpen(false);
                  setActiveTab('admin');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap shadow-2xs transition-colors text-center"
              >
                {language === 'km' ? 'ចុះឈ្មោះបើកហាង 🏪' : 'Register Store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
