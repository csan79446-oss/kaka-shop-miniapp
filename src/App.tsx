import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TelegramHeader } from './components/telegram/TelegramHeader';
import { TelegramBottomNav } from './components/telegram/TelegramBottomNav';
import { ProductCatalog } from './components/store/ProductCatalog';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { LiveChatOrder } from './components/chat/LiveChatOrder';
import { CartDrawer } from './components/cart/CartDrawer';
import { CustomerOrders } from './components/orders/CustomerOrders';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { AdminPortal } from './components/admin/AdminPortal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    isTelegramView,
    isTrackingOpen,
    setIsTrackingOpen,
    trackingPhoneQuery,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#e4e7eb] dark:bg-[#090d14] flex flex-col items-center justify-start sm:py-6 selection:bg-[#2481cc]/20 transition-colors">
      {/* Outer Shell container: TMA Phone Frame or Fluid Web */}
      <div
        className={`w-full bg-[#f4f4f5] dark:bg-[#0f141c] flex flex-col min-h-screen sm:min-h-0 sm:shadow-2xl transition-all ${
          isTelegramView
            ? 'max-w-[440px] sm:rounded-[36px] sm:border-[8px] sm:border-[#1e293b] sm:overflow-hidden sm:min-h-[850px]'
            : 'max-w-5xl sm:rounded-3xl sm:border border-slate-200 dark:border-slate-800'
        }`}
      >
        {/* Telegram Phone Notch / Bezel Simulator on Desktop */}
        {isTelegramView && (
          <div className="hidden sm:flex items-center justify-between px-6 py-2 bg-[#1e293b] text-white text-[11px] font-mono select-none">
            <span className="font-semibold">9:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-white rounded-xs p-0.5">
                <div className="w-full h-full bg-white rounded-2xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Telegram MiniApp Header */}
        <TelegramHeader />

        {/* Main Scrollable Content */}
        <main className="flex-1 px-3 sm:px-4 pt-3 pb-20">
          {activeTab === 'store' && <ProductCatalog />}
          {activeTab === 'chat' && <LiveChatOrder />}
          {activeTab === 'orders' && <CustomerOrders />}
          {activeTab === 'admin' && <AdminPortal />}
        </main>

        {/* Modals & Overlays */}
        <ProductDetailModal />
        <CartDrawer />
        <OrderTrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          initialPhoneOrOrderNo={trackingPhoneQuery}
        />

        {/* Fixed Bottom Tab Bar */}
        <TelegramBottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
