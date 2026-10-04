import React from 'react';
import { ShoppingBag, MessageSquare, Receipt, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TelegramBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language, unreadChatCount, currentAdmin, isDedicatedStoreMode } = useApp();

  const allNavItems = [
    {
      id: 'store' as const,
      labelKh: 'ទំនិញ',
      labelEn: 'Store',
      icon: ShoppingBag,
    },
    {
      id: 'chat' as const,
      labelKh: 'ឆាតកុម្ម៉ង់',
      labelEn: 'Live Chat',
      icon: MessageSquare,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      id: 'orders' as const,
      labelKh: 'ការកុម្ម៉ង់',
      labelEn: 'Orders',
      icon: Receipt,
    },
    {
      id: 'admin' as const,
      labelKh: 'គ្រប់គ្រង',
      labelEn: 'Admin',
      icon: ShieldCheck,
      highlight: Boolean(currentAdmin),
    },
  ];

  // In Dedicated Storefront mode (when customers visit through shop link ?store=...),
  // hide the Admin tab completely from customers unless an admin has already logged in!
  const navItems = isDedicatedStoreMode && !currentAdmin
    ? allNavItems.filter((item) => item.id !== 'admin')
    : allNavItems;

  const gridColsClass = navItems.length === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#17212b]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className={`max-w-md mx-auto grid ${gridColsClass} items-center h-16 px-2`}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-all ${
                isActive
                  ? 'text-[#2481cc] dark:text-[#50a7ea]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-sm animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {language === 'km' ? item.labelKh : item.labelEn}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#2481cc] dark:bg-[#50a7ea]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
