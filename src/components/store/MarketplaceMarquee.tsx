import React from 'react';
import {
  Sparkles,
  Truck,
  Store,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MarketplaceMarqueeProps {
  onRegisterStoreClick?: () => void;
}

export const MarketplaceMarquee: React.FC<MarketplaceMarqueeProps> = ({
  onRegisterStoreClick,
}) => {
  const { language, setActiveTab, vendors } = useApp();

  const handleMerchantClick = () => {
    if (onRegisterStoreClick) {
      onRegisterStoreClick();
    } else {
      setActiveTab('admin');
    }
  };

  const marqueeItemsKm = [
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
      text: 'សូមស្វាគមន៍មកកាន់ Phsar24 (ផ្សារ២៤) ផ្សារអនឡាញទំនិញគ្រប់ប្រភេទឈានមុខគេនៅកម្ពុជា!',
      badge: 'Phsar24.app',
      badgeColor: 'bg-blue-100 text-[#2481cc] dark:bg-blue-950 dark:text-sky-300',
    },
    {
      icon: <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
      text: 'សេវាដឹកជញ្ជូនរហ័សទូទាំង ២៤ ខេត្ត-ក្រុង (Express ១-២ ម៉ោងក្នុងរាជធានីភ្នំពេញ) ដល់មុខផ្ទះ!',
      badge: 'Express Delivery',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      icon: <Store className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
      text: `បណ្តុំហាងលក់ទំនិញជាង ${vendors.length}+ ហាងដៃគូផ្លូវការ • ឱកាសពិសេស៖ ចុះឈ្មោះបើកហាងលក់ Free ដោយខ្លួនឯងថ្ងៃនេះ!`,
      badge: 'ចុះឈ្មោះហាង Free',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      action: handleMerchantClick,
    },
    {
      icon: <CreditCard className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
      text: 'ស្កេនទូទាត់ប្រាក់ងាយស្រួល & សុវត្ថិភាព ១០០% តាម Bakong KHQR, ABA Mobile & ACLEDA!',
      badge: 'Bakong KHQR',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />,
      text: 'ទំនិញគុណភាពពិត ១០០% មានការធានាផ្លូវការ ៧ ថ្ងៃ និងពិនិត្យទំនិញផ្ទាល់ដៃមុនទូទាត់ប្រាក់!',
      badge: 'ធានា ៧ ថ្ងៃ',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    },
    {
      icon: <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
      text: 'បញ្ជាទិញងាយស្រួល ២៤/៧ លើ Telegram MiniApp & គេហទំព័រ ដោយមិនចាំបាច់ដំឡើង App ឡើយ!',
      badge: 'Online 24/7',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
  ];

  const marqueeItemsEn = [
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
      text: "Welcome to Phsar24 (ផ្សារ២៤) - Cambodia's Premier Online Multi-Vendor Marketplace!",
      badge: 'Phsar24.app',
      badgeColor: 'bg-blue-100 text-[#2481cc] dark:bg-blue-950 dark:text-sky-300',
    },
    {
      icon: <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
      text: 'Express Delivery across 24 Provinces (1-2 Hours in Phnom Penh) straight to your door!',
      badge: 'Express Delivery',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      icon: <Store className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
      text: `Over ${vendors.length}+ Official Partner Shops • Register your own store for FREE today!`,
      badge: 'Join as Merchant',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      action: handleMerchantClick,
    },
    {
      icon: <CreditCard className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
      text: 'Fast & Secure Payments with Bakong KHQR, ABA Mobile & ACLEDA Cashless Banking!',
      badge: 'Bakong KHQR',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />,
      text: '100% Genuine Quality Products • 7-Day Guarantee • Inspect your parcel before paying!',
      badge: '7-Day Guarantee',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    },
    {
      icon: <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
      text: 'Shop 24/7 on Telegram MiniApp & WebApp without installing separate apps!',
      badge: 'Online 24/7',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
  ];

  const items = language === 'km' ? marqueeItemsKm : marqueeItemsEn;

  return (
    <div className="mb-3.5 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/90 dark:from-[#17212b] dark:via-slate-900 dark:to-[#17212b] rounded-2xl border border-sky-200/80 dark:border-sky-900/40 p-1 sm:p-1.5 shadow-2xs overflow-hidden relative group">
      <div className="flex items-center">
        {/* Left Fixed Badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#2481cc] text-white font-bold text-[11px] shadow-xs z-20 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="tracking-tight">
            {language === 'km' ? 'ផ្សារ២៤ HOT' : 'NEWS'}
          </span>
        </div>

        {/* Smooth Scrolling Container */}
        <div className="relative flex-1 overflow-hidden ml-2">
          {/* Left Fade Gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-blue-50 dark:from-[#17212b] to-transparent pointer-events-none z-10" />

          {/* Right Fade Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-indigo-50 dark:from-[#17212b] to-transparent pointer-events-none z-10" />

          {/* Marquee Track (Repeated twice for seamless infinite looping) */}
          <div
            className="animate-marquee py-0.5 items-center cursor-default"
            style={{ animationDuration: '68s' }}
          >
            {/* First Set */}
            <div className="flex items-center gap-6 pr-6 shrink-0">
              {items.map((item, idx) => (
                <div
                  key={`m1-${idx}`}
                  onClick={item.action}
                  className={`flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap ${
                    item.action ? 'cursor-pointer hover:text-[#2481cc] transition-colors' : ''
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  {item.action && (
                    <ArrowRight className="w-3 h-3 text-[#2481cc] animate-pulse" />
                  )}
                  <span className="text-slate-300 dark:text-slate-700 font-bold ml-1">•</span>
                </div>
              ))}
            </div>

            {/* Second Duplicate Set for 100% Seamless Loop */}
            <div className="flex items-center gap-6 pr-6 shrink-0" aria-hidden="true">
              {items.map((item, idx) => (
                <div
                  key={`m2-${idx}`}
                  onClick={item.action}
                  className={`flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 whitespace-nowrap ${
                    item.action ? 'cursor-pointer hover:text-[#2481cc] transition-colors' : ''
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  {item.action && (
                    <ArrowRight className="w-3 h-3 text-[#2481cc] animate-pulse" />
                  )}
                  <span className="text-slate-300 dark:text-slate-700 font-bold ml-1">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
