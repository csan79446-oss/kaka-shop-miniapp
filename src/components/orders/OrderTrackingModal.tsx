import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Truck,
  CheckCircle,
  Clock,
  Package,
  AlertCircle,
  Phone,
  Send,
  MapPin,
  FileText,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { ReceiptModal } from './ReceiptModal';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhoneOrOrderNo?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialPhoneOrOrderNo = '',
}) => {
  const { orders, language, formatPrice, getVendorById, vendors } = useApp();
  const [searchInput, setSearchInput] = useState(initialPhoneOrOrderNo);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);

  // Normalize phone number (strip whitespace, dashes)
  const cleanTerm = searchInput.trim().replace(/[\s-]/g, '').toLowerCase();

  const matchedOrders = useMemo(() => {
    if (!cleanTerm) {
      // If no search input, show latest 3 orders
      return orders.slice(0, 3);
    }

    return orders.filter((order) => {
      const cleanPhone = (order.customerPhone || '').replace(/[\s-]/g, '').toLowerCase();
      const cleanOrderNum = (order.orderNumber || '').replace(/[#\s-]/g, '').toLowerCase();
      const cleanId = (order.id || '').toLowerCase();
      const cleanCustomerName = (order.customerName || '').toLowerCase();

      return (
        cleanPhone.includes(cleanTerm) ||
        cleanOrderNum.includes(cleanTerm) ||
        cleanId.includes(cleanTerm) ||
        cleanCustomerName.includes(cleanTerm)
      );
    });
  }, [orders, cleanTerm]);

  if (!isOpen) return null;

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'confirmed':
      case 'processing':
        return 2;
      case 'delivering':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          labelKh: 'រង់ចាំការបញ្ជាក់',
          labelEn: 'Pending Approval',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200',
          icon: Clock,
        };
      case 'confirmed':
        return {
          labelKh: 'បានបញ្ជាក់ការកុម្ម៉ង់',
          labelEn: 'Confirmed',
          color: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200',
          icon: CheckCircle,
        };
      case 'processing':
        return {
          labelKh: 'ហាងកំពុងរៀបចំទំនិញ',
          labelEn: 'Packing Items',
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200',
          icon: Package,
        };
      case 'delivering':
        return {
          labelKh: 'កំពុងដឹកជញ្ជូន 🛵',
          labelEn: 'Out for Delivery 🛵',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 animate-pulse',
          icon: Truck,
        };
      case 'completed':
        return {
          labelKh: 'បានទទួលជោគជ័យ 🎉',
          labelEn: 'Delivered 🎉',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          labelKh: 'បានបោះបង់',
          labelEn: 'Cancelled',
          color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200',
          icon: AlertCircle,
        };
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white dark:bg-[#17212b] w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-500 via-[#2481cc] to-sky-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  {language === 'km' ? 'តាមដានការដឹកជញ្ជូនរហ័ស' : 'Express Order Tracker'}
                </h3>
                <p className="text-[11px] text-white/80">
                  {language === 'km'
                    ? 'វាយលេខទូរស័ព្ទ ឬលេខវិក្កយបត្រដើម្បីពិនិត្យ'
                    : 'Search by Phone Number or Order #'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  language === 'km'
                    ? 'វាយលេខទូរស័ព្ទ (ឧ. 012889977) ឬលេខកុម្ម៉ង់...'
                    : 'Enter phone number (e.g. 012889977) or order #...'
                }
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2481cc] shadow-2xs font-mono"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Helper Suggestion */}
            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
              <span>
                {cleanTerm
                  ? `${language === 'km' ? 'រកឃើញ' : 'Found'} ${matchedOrders.length} ${language === 'km' ? 'ការកុម្ម៉ង់' : 'orders'}`
                  : language === 'km'
                  ? 'ការកុម្ម៉ង់ថ្មីៗក្នុងប្រព័ន្ធ'
                  : 'Recent Orders in System'}
              </span>
              {orders.length > 0 && !cleanTerm && (
                <button
                  type="button"
                  onClick={() => setSearchInput(orders[0].customerPhone)}
                  className="text-[#2481cc] hover:underline font-medium"
                >
                  {language === 'km' ? 'សាកល្បងលេខចុងក្រោយ' : 'Try latest'}
                </button>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {matchedOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'km' ? 'រកមិនឃើញការកុម្ម៉ង់ទេ' : 'No Orders Found'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  {language === 'km'
                    ? 'សូមពិនិត្យមើលលេខទូរស័ព្ទ ឬលេខបញ្ជាទិញម្តងទៀត ថាបានវាយត្រឹមត្រូវឬនៅ'
                    : 'Please double-check the phone number or order number entered.'}
                </p>
              </div>
            ) : (
              matchedOrders.map((order) => {
                const currentStep = getStepProgress(order.status);
                const badge = getStatusBadge(order.status);
                const BadgeIcon = badge.icon;

                // Identify unique vendors in this order
                const vendorIdsInOrder = Array.from(
                  new Set(order.items.map((i) => i.product.vendorId || 'vendor-01'))
                );
                const orderVendors = vendorIdsInOrder
                  .map((id) => getVendorById(id))
                  .filter(Boolean);

                return (
                  <div
                    key={order.id}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3.5"
                  >
                    {/* Order Top Bar */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{language === 'km' ? badge.labelKh : badge.labelEn}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('km-KH', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">
                          {language === 'km' ? 'ទឹកប្រាក់សរុប' : 'Total'}
                        </span>
                        <span className="font-bold text-sm text-[#2481cc] font-mono">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Visual 4-Step Tracker */}
                    {order.status !== 'cancelled' ? (
                      <div className="pt-2 pb-1">
                        <div className="relative flex items-center justify-between">
                          {/* Connecting Progress Line */}
                          <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-700 z-0">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{
                                width:
                                  currentStep === 1
                                    ? '10%'
                                    : currentStep === 2
                                    ? '40%'
                                    : currentStep === 3
                                    ? '75%'
                                    : '100%',
                              }}
                            />
                          </div>

                          {/* Step 1: Placed */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                currentStep >= 1
                                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              ✓
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                              {language === 'km' ? 'បានកុម្ម៉ង់' : 'Placed'}
                            </span>
                          </div>

                          {/* Step 2: Packing */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                currentStep >= 2
                                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {currentStep >= 2 ? '✓' : '2'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                              {language === 'km' ? 'វេចខ្ចប់' : 'Packing'}
                            </span>
                          </div>

                          {/* Step 3: Delivering */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                currentStep >= 3
                                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 animate-bounce'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {currentStep >= 3 ? '🛵' : '3'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                              {language === 'km' ? 'ដឹកជញ្ជូន' : 'Delivering'}
                            </span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                currentStep >= 4
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {currentStep >= 4 ? '🎉' : '4'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                              {language === 'km' ? 'ដល់ដៃ' : 'Delivered'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {language === 'km'
                            ? 'ការកុម្ម៉ង់នេះត្រូវបានបោះបង់'
                            : 'This order was cancelled'}
                        </span>
                      </div>
                    )}

                    {/* Stores in this Order & Direct Merchant Telegram Notification */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <Store className="w-3.5 h-3.5 text-[#2481cc]" />
                        <span>
                          {language === 'km' ? 'ហាងដែលត្រូវដឹកទំនិញ៖' : 'Fulfilling Merchant Shops:'}
                        </span>
                      </div>

                      {orderVendors.map((vendor) => {
                        if (!vendor) return null;
                        const vendorItems = order.items.filter(
                          (i) => (i.product.vendorId || 'vendor-01') === vendor.id
                        );
                        const vendorTotal = vendorItems.reduce(
                          (sum, i) => sum + i.product.price * i.quantity,
                          0
                        );

                        // Pre-formatted Telegram message to the vendor
                        const tgText = encodeURIComponent(
                          `🔔 ការកុម្ម៉ង់ Phsar24 #${order.orderNumber}\n` +
                          `🏪 ហាង៖ ${vendor.nameKh}\n` +
                          `👤 អតិថិជន៖ ${order.customerName} (${order.customerPhone})\n` +
                          `📍 អាសយដ្ឋាន៖ ${order.customerAddress}\n` +
                          `📦 ទំនិញ៖\n` +
                          vendorItems.map((i) => `• ${i.product.nameKh} x${i.quantity} ($${(i.product.price * i.quantity).toFixed(2)})`).join('\n') +
                          `\n💰 សរុបហាងនេះ៖ $${vendorTotal.toFixed(2)} (${order.paymentMethod.toUpperCase()})\n` +
                          `⚡ ស្ថានភាព៖ ${order.status}`
                        );

                        const tgUrl = `https://t.me/${vendor.telegramUsername.replace('@', '')}?text=${tgText}`;

                        return (
                          <div
                            key={vendor.id}
                            className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={vendor.logo}
                                alt={vendor.nameKh}
                                className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-200"
                              />
                              <div className="min-w-0 truncate">
                                <span className="font-bold text-xs text-slate-800 dark:text-white block truncate">
                                  {language === 'km' ? vendor.nameKh : vendor.nameEn}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {vendorItems.length} {language === 'km' ? 'មុខទំនិញ' : 'items'} • ${vendorTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <a
                              href={tgUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-[#2481cc] hover:bg-[#1d6fa5] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 shadow-2xs transition-colors"
                              title="ឆាត ឬផ្ញើដំណឹងកុម្ម៉ង់ទៅ Telegram ម្ចាស់ហាងផ្ទាល់"
                            >
                              <Send className="w-3 h-3" />
                              <span>{language === 'km' ? 'ឆាត Telegram ហាង' : 'Telegram'}</span>
                            </a>
                          </div>
                        );
                      })}
                    </div>

                    {/* Customer & Address Summary */}
                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {order.customerAddress || 'រាជធានីភ្នំពេញ'} ({order.customerPhone})
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForReceipt(order)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#2481cc]" />
                        <span>{language === 'km' ? 'វិក្កយបត្រ (E-Receipt)' : 'View Receipt'}</span>
                      </button>

                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'km' ? 'ទូរស័ព្ទ' : 'Call'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              {language === 'km'
                ? 'ត្រូវការជំនួយបន្ថែម? សូមទាក់ទងមកកាន់ Hotline ផ្សារ២៤: +855 12 889 977'
                : 'Need immediate help? Call Phsar24 Hotline: +855 12 889 977'}
            </span>
          </div>
        </div>
      </div>

      {/* Official E-Receipt Modal */}
      {selectedOrderForReceipt && (
        <ReceiptModal
          order={selectedOrderForReceipt}
          onClose={() => setSelectedOrderForReceipt(null)}
        />
      )}
    </>
  );
};
