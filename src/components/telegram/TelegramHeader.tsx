import React from 'react';
import {
  Globe,
  DollarSign,
  ShoppingCart,
  Smartphone,
  Monitor,
  Shield,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TelegramHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    cartItemCount,
    setIsCartOpen,
    setIsTrackingOpen,
    isTelegramView,
    setIsTelegramView,
    currentAdmin,
    setActiveTab,
    storeInfo,
    primaryStoreLocation,
    isDedicatedStoreMode,
    dedicatedVendor,
  } = useApp();

  const storeDisplayName = isDedicatedStoreMode && dedicatedVendor
    ? (language === 'km' ? dedicatedVendor.nameKh : dedicatedVendor.nameEn)
    : (language === 'km' ? 'Phsar24 (ផ្សារ២៤)' : 'Phsar24 Marketplace');

  return (
    <header className="sticky top-0 z-30 bg-[#2481cc] text-white shadow-sm transition-colors">
      <div className="max-w-4xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 overflow-hidden">
        {/* Brand Zone - constrained with flex-1 and min-w-0 to NEVER overflow or overlap */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <div className="relative shrink-0">
            {isDedicatedStoreMode && dedicatedVendor?.logo ? (
              <img
                src={dedicatedVendor.logo}
                alt={dedicatedVendor.nameKh}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-white/40 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-extrabold text-xs sm:text-sm text-white border border-white/30 shadow-inner tracking-tighter">
                P24
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 border-2 border-[#2481cc]"></div>
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1
                className="font-bold text-xs sm:text-sm md:text-base tracking-tight truncate block leading-tight text-white"
                title={storeDisplayName}
              >
                {storeDisplayName}
              </h1>
            </div>

            <div className="text-[10px] sm:text-xs text-white/85 flex items-center gap-1.5 leading-tight mt-0.5 min-w-0 truncate">
              <span className="shrink-0 font-medium">
                {isDedicatedStoreMode
                  ? (language === 'km' ? 'ហាងផ្លូវការ' : 'Official Store')
                  : (language === 'km' ? 'ផ្សារអនឡាញផ្លូវការ' : 'Official Market')}
              </span>
              <span className="text-white/50 shrink-0">·</span>
              <span className="text-emerald-200 font-medium shrink-0">Online 24/7</span>
              <span className="text-white/50 hidden sm:inline shrink-0">·</span>
              <span className="text-white/70 text-[10px] hidden sm:inline truncate">
                📍 {isDedicatedStoreMode && dedicatedVendor ? dedicatedVendor.city : storeInfo.city}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls - cleanly spaced and shrunk appropriately */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 active:scale-95"
            title="ប្តូរភាសា / Change Language"
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="uppercase font-mono">{language}</span>
          </button>

          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'KHR' : 'USD')}
            className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 active:scale-95"
            title="ប្តូររូបិយប័ណ្ណ / Change Currency"
          >
            <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="font-mono">{currency}</span>
          </button>

          {/* Frame View Toggle (Only shown on large desktop screens to save mobile space) */}
          <button
            onClick={() => setIsTelegramView(!isTelegramView)}
            className="hidden lg:flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            title={isTelegramView ? 'Switch to Full Web View' : 'Switch to Telegram MiniApp View'}
          >
            {isTelegramView ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[11px]">Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">TMA</span>
              </>
            )}
          </button>

          {/* Admin Fast Access Badge */}
          {currentAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1 text-[11px] sm:text-xs p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-amber-400 text-amber-950 font-bold shadow-xs hover:bg-amber-300 transition-colors shrink-0 active:scale-95"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 shrink-0 fill-amber-950/20" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Express Order Tracking Button */}
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-white transition-all shrink-0 active:scale-95 shadow-xs"
            title={language === 'km' ? 'តាមដានការដឹកជញ្ជូនរហ័ស / Track Order' : 'Track Order'}
          >
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">{language === 'km' ? 'តាមដាន' : 'Track'}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center animate-scale shadow-sm">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
