import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Search,
  Phone,
  MapPin,
  MessageSquare,
  Printer,
  Check,
  FileSpreadsheet,
  FileText,
  Lock,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { ReceiptModal } from '../orders/ReceiptModal';
import { RbacNoticeBanner } from './RbacNoticeBanner';

export const AdminOrderManagement: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    language,
    formatPrice,
    setActiveTab,
    sendAgentReply,
    exportOrdersCsv,
    canManageContent,
    selectedAdminVendorId,
    getVendorById,
    currentAdmin,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);
    const adminVendorId = currentAdmin?.vendorId || selectedAdminVendorId;
    const matchVendor = !adminVendorId || adminVendorId === 'all' || order.vendorId === adminVendorId;
    return matchStatus && matchSearch && matchVendor;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'delivering':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
    }
  };

  const getStatusLabelKh = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'រង់ចាំបញ្ជាក់';
      case 'confirmed':
        return 'បានបញ្ជាក់';
      case 'processing':
        return 'កំពុងរៀបចំ';
      case 'delivering':
        return 'កំពុងដឹកជញ្ជូន';
      case 'completed':
        return 'បានបញ្ចប់';
      case 'cancelled':
        return 'បានបោះបង់';
    }
  };

  const handleOpenChatWithCustomer = (order: Order) => {
    setActiveTab('chat');
    sendAgentReply(
      `សួស្តីបង ${order.customerName}! ក្រុមការងារផ្នែកគ្រប់គ្រង KAKA Shop កំពុងពិនិត្យការកុម្ម៉ង់លេខ #${order.orderNumber} របស់បង។`
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <RbacNoticeBanner moduleNameKh="បញ្ជីការកុម្ម៉ង់" moduleNameEn="orders & payments" />

      {/* Top Banner */}
      <div className="bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2481cc]" />
            <span>{language === 'km' ? 'គ្រប់គ្រងបញ្ជីការកុម្ម៉ង់' : 'Order Pipeline & Fulfillment'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'km'
              ? 'ត្រួតពិនិត្យ ផ្ទៀងផ្ទាត់ការបង់ប្រាក់ និងប្តូរស្ថានភាពដឹកជញ្ជូន'
              : 'Review orders, verify payments, and update delivery progression'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportOrdersCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all"
            title="ទាញយកទិន្នន័យបញ្ជីកុម្ម៉ង់ជា File Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{language === 'km' ? 'ទាញយក Excel/CSV' : 'Export CSV'}</span>
          </button>

          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-2 rounded-xl">
            {orders.length} Orders
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'km'
                ? 'ស្វែងរកតាមលេខកុម្ម៉ង់ ឈ្មោះ ឬលេខទូរស័ព្ទ...'
                : 'Search by order #, customer name, phone...'
            }
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none"
        >
          <option value="all">{language === 'km' ? 'គ្រប់ស្ថានភាព (All)' : 'All Statuses'}</option>
          <option value="pending">⏳ រង់ចាំបញ្ជាក់ (Pending)</option>
          <option value="confirmed">✓ បានបញ្ជាក់ (Confirmed)</option>
          <option value="processing">📦 កំពុងរៀបចំ (Processing)</option>
          <option value="delivering">🚚 កំពុងដឹកជញ្ជូន (Delivering)</option>
          <option value="completed">🎉 បានបញ្ចប់ (Completed)</option>
          <option value="cancelled">✕ បានបោះបង់ (Cancelled)</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              {language === 'km' ? 'រកមិនឃើញការកុម្ម៉ង់ទេ' : 'No matching orders found'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-sm text-[#2481cc]">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {language === 'km' ? getStatusLabelKh(order.status) : order.status}
                  </span>
                  {order.vendorId && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2481cc] bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-900/40">
                      <Store className="w-2.5 h-2.5" />
                      <span>{getVendorById(order.vendorId)?.nameKh || order.vendorId}</span>
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    via {order.createdVia}
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>

              {/* Customer & Delivery details */}
              <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{order.customerName}</span>
                    <span className="text-slate-400 font-normal">({order.customerPhone})</span>
                  </div>
                  <div className="flex items-start gap-1 text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{order.customerAddress}</span>
                  </div>
                  {order.notes && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 italic">
                      Note: {order.notes}
                    </div>
                  )}
                </div>

                {/* Items preview & Payment Status */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1 mb-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] gap-2">
                        <span className="truncate">
                          {item.product.nameKh}
                          {(item.selectedColor || item.selectedSize) && (
                            <span className="text-[10px] text-slate-500 font-mono ml-1 bg-slate-200/60 dark:bg-slate-800 px-1 py-0.2 rounded">
                              {item.selectedColor || ''}
                              {item.selectedSize ? ` / ${item.selectedSize}` : ''}
                            </span>
                          )}
                          <span className="text-slate-400 font-mono ml-1">× {item.quantity}</span>
                        </span>
                        <span className="font-mono font-semibold shrink-0">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-xs">
                    <div>
                      <span>{language === 'km' ? 'សរុប (Total)' : 'Total'}: {formatPrice(order.totalAmount)}</span>
                      {order.couponCode && (
                        <span className="text-[10px] text-emerald-600 font-mono ml-1.5">
                          (Code: {order.couponCode})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="uppercase text-[10px] text-slate-400">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          order.paymentStatus === 'verified' || order.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Status Changer */}
                  <select
                    disabled={!canManageContent}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className={`text-xs font-semibold py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-opacity ${
                      !canManageContent ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300'
                    }`}
                    title={
                      !canManageContent
                        ? language === 'km'
                          ? '🔒 អនុញ្ញាតកែប្រែចាប់ពី Store Manager ឡើងទៅ'
                          : '🔒 Restricted to Store Manager and above'
                        : undefined
                    }
                  >
                    <option value="pending">⏳ រង់ចាំ (Pending)</option>
                    <option value="confirmed">✓ បានបញ្ជាក់ (Confirmed)</option>
                    <option value="processing">📦 កំពុងរៀបចំ (Processing)</option>
                    <option value="delivering">🚚 កំពុងដឹក (Delivering)</option>
                    <option value="completed">🎉 បញ្ចប់ (Completed)</option>
                    <option value="cancelled">✕ បោះបង់ (Cancelled)</option>
                  </select>

                  {/* Payment status toggle */}
                  {order.paymentStatus !== 'verified' && (
                    <button
                      disabled={!canManageContent}
                      onClick={() => updateOrderPaymentStatus(order.id, 'verified')}
                      className={`text-xs px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1 transition-all ${
                        !canManageContent
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-emerald-100 cursor-pointer active:scale-95'
                      }`}
                      title={
                        !canManageContent
                          ? language === 'km'
                            ? '🔒 អនុញ្ញាតបញ្ជាក់បង់ប្រាក់ចាប់ពី Store Manager ឡើងទៅ'
                            : '🔒 Verification restricted to Store Manager and above'
                          : undefined
                      }
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'km' ? 'បញ្ជាក់បង់ប្រាក់' : 'Verify Paid'}</span>
                    </button>
                  )}

                  {!canManageContent && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200/80 dark:border-amber-800/40 font-mono">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Store Manager+</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Open customer chat */}
                  <button
                    onClick={() => handleOpenChatWithCustomer(order)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                    title="ឆាតជាមួយអតិថិជន / Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2481cc]" />
                    <span>{language === 'km' ? 'ឆាត' : 'Chat'}</span>
                  </button>

                  {/* View Invoice */}
                  <button
                    onClick={() => setSelectedOrderForInvoice(order)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                    title="មើលវិក្កយបត្រ / Invoice"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'វិក្កយបត្រ' : 'Invoice'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Receipt Modal */}
      {selectedOrderForInvoice && (
        <ReceiptModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
};
