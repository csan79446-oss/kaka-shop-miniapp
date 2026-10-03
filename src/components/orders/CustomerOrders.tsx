import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  FileText,
  Send,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { ReceiptModal } from './ReceiptModal';

export const CustomerOrders: React.FC = () => {
  const {
    orders,
    language,
    formatPrice,
    sendChatMessage,
    setActiveTab,
    getVendorById,
    setIsTrackingOpen,
    setTrackingPhoneQuery,
  } = useApp();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          labelKh: 'រង់ចាំការបញ្ជាក់',
          labelEn: 'Pending',
          cls: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
          icon: Clock,
        };
      case 'confirmed':
        return {
          labelKh: 'បានបញ្ជាក់',
          labelEn: 'Confirmed',
          cls: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
          icon: CheckCircle,
        };
      case 'processing':
        return {
          labelKh: 'កំពុងរៀបចំ',
          labelEn: 'Processing',
          cls: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
          icon: Package,
        };
      case 'delivering':
        return {
          labelKh: 'កំពុងដឹកជញ្ជូន',
          labelEn: 'Delivering',
          cls: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
          icon: Truck,
        };
      case 'completed':
        return {
          labelKh: 'បានបញ្ចប់ជោគជ័យ',
          labelEn: 'Completed',
          cls: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          labelKh: 'បានបោះបង់',
          labelEn: 'Cancelled',
          cls: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
          icon: AlertCircle,
        };
    }
  };

  const handleInquireOrderInChat = (orderNumber: string) => {
    setActiveTab('chat');
    sendChatMessage(
      language === 'km'
        ? `សួស្តី! ខ្ញុំចង់សាកសួរព័ត៌មានអំពីការកុម្ម៉ង់លេខ #${orderNumber} របស់ខ្ញុំ`
        : `Hello! I want to check the status of my order #${orderNumber}`
    );
  };

  return (
    <div className="pb-24 pt-2 max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#2481cc]" />
          <span>{language === 'km' ? 'ប្រវត្តិការកុម្ម៉ង់របស់ខ្ញុំ' : 'My Orders'}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'km'
            ? 'តាមដានស្ថានភាពការដឹកជញ្ជូន និងវិក្កយបត្រ'
            : 'Track delivery progress and invoice details'}
        </p>
      </div>

      {/* Quick Express Tracker Trigger Banner (Feature 3) */}
      <div className="mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#2481cc] text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-xs sm:text-sm block leading-tight">
              {language === 'km' ? 'ស្វែងរក & តាមដានការដឹកជញ្ជូនរហ័ស' : 'Express Delivery Tracker'}
            </span>
            <span className="text-[11px] text-white/85 truncate block">
              {language === 'km' ? 'វាយលេខទូរស័ព្ទដើម្បីពិនិត្យដំណាក់កាលដឹកជញ្ជូន' : 'Enter phone number to track live order steps'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTrackingOpen(true)}
          className="px-3 py-1.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold shrink-0 shadow-xs transition-transform active:scale-95"
        >
          {language === 'km' ? 'តាមដានភ្លាម' : 'Track Now'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {language === 'km' ? 'មិនទាន់មានការកុម្ម៉ង់នៅឡើយទេ' : 'No orders placed yet'}
          </p>
          <button
            onClick={() => setActiveTab('store')}
            className="mt-4 px-4 py-2 bg-[#2481cc] text-white rounded-xl text-xs font-semibold"
          >
            {language === 'km' ? 'ទៅកាន់បញ្ជីទំនិញ' : 'Browse Store'}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const statusConfig = getStatusBadge(order.status);
            const StatusIcon = statusConfig.icon;
            const orderVendorIds = Array.from(
              new Set(order.items.map((i) => i.product.vendorId || 'vendor-01'))
            );
            const orderVendors = orderVendorIds
              .map((id) => getVendorById(id))
              .filter(Boolean);

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusConfig.cls}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>
                      {language === 'km'
                        ? statusConfig.labelKh
                        : statusConfig.labelEn}
                    </span>
                  </span>
                </div>

                {/* Items */}
                <div className="py-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.nameKh}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="truncate min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {language === 'km'
                              ? item.product.nameKh
                              : item.product.nameEn}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                            {item.selectedColor && (
                              <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded text-slate-600 dark:text-slate-300">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="bg-sky-50 dark:bg-sky-950/60 text-[#2481cc] font-mono px-1 py-0.2 rounded font-bold">
                                {item.selectedSize}
                              </span>
                            )}
                            <span className="text-slate-400 font-mono">
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-slate-900 dark:text-white shrink-0 ml-2">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer with Total and Action buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500">
                      {language === 'km' ? 'សរុបទឹកប្រាក់' : 'Total Amount'}:
                    </span>
                    <span className="text-sm font-bold text-[#2481cc] ml-1.5 font-mono">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Track Order Stepper Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingPhoneQuery(order.orderNumber);
                        setIsTrackingOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      title="តាមដានការដឹកជញ្ជូន / Track Order"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'km' ? 'តាមដាន' : 'Track'}</span>
                    </button>

                    {/* Direct Telegram to Store (Feature 1) */}
                    {orderVendors[0] && (
                      <a
                        href={`https://t.me/${(orderVendors[0].telegramUsername || 'phsar24_admin').replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2481cc] dark:text-sky-300 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        title={language === 'km' ? `ឆាត Telegram ហាង (${orderVendors[0].nameKh})` : `Telegram Store`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Telegram ហាង</span>
                      </a>
                    )}

                    {/* Official E-Receipt Button */}
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#2481cc] dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 transition-colors"
                      title="ទាញយកវិក្កយបត្រ / Download E-Receipt"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'km' ? 'វិក្កយបត្រ' : 'Receipt'}</span>
                    </button>

                    {/* Chat Inquiry Button */}
                    <button
                      onClick={() => handleInquireOrderInChat(order.orderNumber)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'km' ? 'ឆាត' : 'Chat'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
};
