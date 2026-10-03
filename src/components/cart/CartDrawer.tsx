import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  CheckCircle,
  Tag,
  Check,
  FileText,
  Share2,
  Sparkles,
  MapPin,
  Store,
  Send,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, PaymentMethod, Vendor } from '../../types';
import { EXCHANGE_RATE_KHR } from '../../data/mockData';
import { ReceiptModal } from '../orders/ReceiptModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    discountAmount,
    finalCartTotal,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    createOrder,
    currency,
    formatPrice,
    language,
    setActiveTab,
    coupons,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeInfo,
    primaryStoreLocation,
    getVendorById,
    vendors,
    setIsTrackingOpen,
    setTrackingPhoneQuery,
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('khqr');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Promo code input state
  const [couponInput, setCouponInput] = useState('');
  const [couponNotice, setCouponNotice] = useState<{ msg: string; error: boolean } | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Multi-Store Cart Grouping (Feature 4)
  const cartGroupedByVendor = React.useMemo(() => {
    return cart.reduce((acc, item, originalIdx) => {
      const vId = item.product.vendorId || 'vendor-01';
      if (!acc[vId]) {
        acc[vId] = {
          vendor: getVendorById(vId) || vendors[0],
          items: [] as { item: typeof item; originalIdx: number }[],
          subtotal: 0,
        };
      }
      acc[vId].items.push({ item, originalIdx });
      acc[vId].subtotal += item.product.price * item.quantity;
      return acc;
    }, {} as Record<string, { vendor: Vendor | undefined; items: { item: typeof cart[0]; originalIdx: number }[]; subtotal: number }>);
  }, [cart, getVendorById, vendors]);

  // Unique vendors involved in placed order (Feature 1)
  const uniqueVendorsInOrder = React.useMemo(() => {
    if (!placedOrder) return [];
    const vIds = Array.from(
      new Set(placedOrder.items.map((i) => i.product.vendorId || 'vendor-01'))
    );
    return vIds.map((id) => getVendorById(id) || vendors[0]).filter(Boolean) as Vendor[];
  }, [placedOrder, getVendorById, vendors]);

  const getTelegramOrderUrl = (order: Order, vendor: Vendor) => {
    const vendorItems = order.items.filter(
      (i) => (i.product.vendorId || 'vendor-01') === vendor.id
    );
    const vendorTotal = vendorItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    const message =
      `🔔 ការកុម្ម៉ង់ថ្មីពី Phsar24 (ផ្សារ២៤)!\n` +
      `📄 លេខបញ្ជាទិញ៖ #${order.orderNumber}\n` +
      `🏪 ហាង៖ ${vendor.nameKh}\n` +
      `👤 អតិថិជន៖ ${order.customerName} (${order.customerPhone})\n` +
      `📍 អាសយដ្ឋានដឹកជញ្ជូន៖ ${order.customerAddress}\n` +
      `📦 ទំនិញក្នុងកញ្ចប់៖\n` +
      vendorItems
        .map(
          (i) =>
            `• ${i.product.nameKh} x${i.quantity} ($${(i.product.price * i.quantity).toFixed(2)})`
        )
        .join('\n') +
      `\n💰 សរុបទឹកប្រាក់ហាងនេះ៖ $${vendorTotal.toFixed(2)} (${order.paymentMethod.toUpperCase()})\n` +
      `📝 កំណត់សម្គាល់៖ ${order.notes || 'គ្មាន'}\n` +
      `⚡ ស្ថានភាព៖ កំពុងរង់ចាំការបញ្ជាក់`;

    return `https://t.me/${(vendor.telegramUsername || 'phsar24_admin').replace('@', '')}?text=${encodeURIComponent(message)}`;
  };

  if (!isCartOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim();
    if (!targetCode) return;
    const res = applyCoupon(targetCode);
    setCouponNotice({
      msg: language === 'km' ? res.messageKh : res.messageEn,
      error: !res.success,
    });
    if (res.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponNotice(null), 3500);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = createOrder({
      customerName,
      customerPhone,
      customerAddress,
      telegramUsername: '@tma_customer',
      items: [...cart],
      subtotal: cartSubtotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      deliveryFee: 0,
      totalAmount: finalCartTotal,
      currency,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      status: 'pending',
      notes,
      createdVia: 'cart',
    });

    setPlacedOrder(newOrder);
    clearCart();
    setStep('success');
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep('cart');
      setPlacedOrder(null);
    }, 300);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="bg-white dark:bg-[#17212b] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-slide-left">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2481cc]" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {step === 'cart' && (language === 'km' ? 'កន្ត្រកទំនិញ' : 'Shopping Cart')}
                {step === 'checkout' &&
                  (language === 'km' ? 'ព័ត៌មានដឹកជញ្ជូន' : 'Checkout Delivery')}
                {step === 'success' && (language === 'km' ? 'ជោគជ័យ' : 'Order Placed')}
              </h3>
              {step === 'cart' && (
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {cart.length}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content based on step */}
          {step === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">
                      {language === 'km' ? 'កន្ត្រកទំនិញទទេ' : 'Your cart is empty'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'km'
                        ? 'សូមជ្រើសរើសទំនិញដែលអ្នកពេញចិត្ត'
                        : 'Browse products and add items'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Multi-Store Grouped Items List (Feature 4) */}
                    <div className="space-y-3">
                      {Object.entries(cartGroupedByVendor).map(([vId, group]) => {
                        const vendor = group.vendor;
                        const vendorName = vendor
                          ? language === 'km'
                            ? vendor.nameKh
                            : vendor.nameEn
                          : language === 'km'
                          ? 'ហាងដៃគូផ្សារ២៤'
                          : 'Phsar24 Partner Shop';

                        return (
                          <div
                            key={vId}
                            className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-2.5 shadow-2xs"
                          >
                            {/* Store Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={
                                    vendor?.logo ||
                                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=60&auto=format&fit=crop&q=80'
                                  }
                                  alt={vendorName}
                                  className="w-6 h-6 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                                />
                                <div className="min-w-0 truncate">
                                  <span className="font-bold text-xs text-slate-800 dark:text-white truncate block">
                                    {vendorName}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2481cc] dark:bg-blue-950 dark:text-sky-300 border border-blue-100 dark:border-blue-900 shrink-0">
                                {group.items.length} {language === 'km' ? 'មុខ' : 'items'}
                              </span>
                            </div>

                            {/* Items belonging to this Store */}
                            <div className="space-y-2">
                              {group.items.map(({ item, originalIdx }) => (
                                <div
                                  key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${originalIdx}`}
                                  className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3"
                                >
                                  <img
                                    src={item.product.image}
                                    alt={item.product.nameKh}
                                    className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                                      {language === 'km'
                                        ? item.product.nameKh
                                        : item.product.nameEn}
                                    </h4>

                                    {/* Selected Variant Tags */}
                                    {(item.selectedColor || item.selectedSize) && (
                                      <div className="flex items-center gap-1 mt-0.5">
                                        {item.selectedColor && (
                                          <span className="text-[9px] bg-white dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                            {item.selectedColor}
                                          </span>
                                        )}
                                        {item.selectedSize && (
                                          <span className="text-[9px] bg-sky-50 dark:bg-sky-950/60 text-[#2481cc] px-1.5 py-0.2 rounded font-mono font-bold">
                                            {item.selectedSize}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    <div className="text-xs font-bold text-[#2481cc] mt-0.5 font-mono">
                                      {formatPrice(item.product.price)}
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateCartItemQuantity(
                                            originalIdx,
                                            item.quantity - 1
                                          )
                                        }
                                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                                      >
                                        <Minus className="w-2.5 h-2.5" />
                                      </button>
                                      <span className="text-xs font-mono font-bold w-4 text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateCartItemQuantity(
                                            originalIdx,
                                            item.quantity + 1
                                          )
                                        }
                                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                                      >
                                        <Plus className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeCartItem(originalIdx)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Store Subtotal Footer */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                              <span className="text-slate-500 text-[11px]">
                                {language === 'km'
                                  ? 'សរុបពីហាងនេះ៖'
                                  : 'Store Subtotal:'}
                              </span>
                              <span className="font-bold text-[#2481cc] font-mono">
                                {formatPrice(group.subtotal)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Promo Code Box */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'km' ? 'គូប៉ុងបញ្ចុះតម្លៃ' : 'Promo Code'}</span>
                        </span>
                        {appliedCoupon && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{appliedCoupon.code}</span>
                            <button
                              onClick={removeCoupon}
                              className="ml-1 text-slate-400 hover:text-rose-500"
                            >
                              ✕
                            </button>
                          </span>
                        )}
                      </div>

                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            placeholder={language === 'km' ? 'បញ្ចូលកូដ ឧ. KAKA2026' : 'Enter code e.g. KAKA2026'}
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-[#2481cc]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon()}
                            className="px-3 py-1.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-xs"
                          >
                            {language === 'km' ? 'ប្រើប្រាស់' : 'Apply'}
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-between">
                          <span>
                            {language === 'km'
                              ? appliedCoupon.descriptionKh
                              : appliedCoupon.descriptionEn}
                          </span>
                          <span className="font-mono font-bold">
                            -{formatPrice(discountAmount)}
                          </span>
                        </div>
                      )}

                      {/* Clickable Quick Coupon Tags */}
                      {!appliedCoupon && coupons.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {language === 'km' ? 'កូដពេញនិយម៖' : 'Available:'}
                          </span>
                          {coupons.filter((c) => c.active).slice(0, 3).map((cp) => (
                            <button
                              key={cp.id}
                              type="button"
                              onClick={() => handleApplyCoupon(cp.code)}
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:scale-105 transition-transform"
                            >
                              {cp.code}
                            </button>
                          ))}
                        </div>
                      )}

                      {couponNotice && (
                        <div
                          className={`text-[11px] p-2 rounded-xl flex items-center gap-1.5 ${
                            couponNotice.error
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/50'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-900/50'
                          }`}
                        >
                          <span>{couponNotice.msg}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Cart Footer Summary */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#17212b] space-y-2.5">
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>{language === 'km' ? 'តម្លៃទំនិញសរុប (Subtotal)' : 'Subtotal'}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatPrice(cartSubtotal)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>
                            {language === 'km' ? 'បញ្ចុះតម្លៃគូប៉ុង' : 'Coupon Discount'} (
                            {appliedCoupon?.code})
                          </span>
                        </span>
                        <span className="font-mono font-bold">
                          -{formatPrice(discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>{language === 'km' ? 'សេវាដឹកជញ្ជូន' : 'Delivery Fee'}</span>
                      <span className="font-semibold text-emerald-600 font-mono">
                        {language === 'km' ? 'ឥតគិតថ្លៃ (Free)' : 'FREE'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {language === 'km' ? 'ទឹកប្រាក់ត្រូវទូទាត់' : 'Total Amount'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ≈ {Math.round(finalCartTotal * EXCHANGE_RATE_KHR).toLocaleString()} ៛
                        </span>
                      </div>
                      <span className="text-lg font-black text-[#2481cc] font-mono">
                        {formatPrice(finalCartTotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <span>{language === 'km' ? 'បន្តទៅការទូទាត់' : 'Proceed to Checkout'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Step: Checkout Form */}
          {step === 'checkout' && (
            <form
              onSubmit={handleCheckoutSubmit}
              className="flex-1 flex flex-col justify-between overflow-y-auto"
            >
              <div className="p-4 space-y-3">
                {/* Store Dispatch Notice */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-[11px]">
                  <Store className="w-3.5 h-3.5 text-[#2481cc] shrink-0 mt-0.5" />
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {language === 'km' ? 'ចេញពីហាង៖' : 'Dispatched from:'}
                    </span>{' '}
                    <span>
                      {language === 'km'
                        ? primaryStoreLocation?.addressKh || storeInfo.addressKh
                        : primaryStoreLocation?.addressEn || storeInfo.addressEn}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះអ្នកទទួល *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. ហេង ពិសី"
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'លេខទូរស័ព្ទ *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'អាសយដ្ឋានដឹកជញ្ជូន *' : 'Delivery Address *'}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ រាជធានីភ្នំពេញ..."
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ចំណាំបន្ថែម (ស្រេចចិត្ត)' : 'Order Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ឧ. សូមខលមុនមកដល់ 10 នាទី"
                    className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'km' ? 'ជ្រើសរើសវិធីសាស្ត្រទូទាត់' : 'Payment Method'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khqr')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'khqr'
                          ? 'border-[#2481cc] bg-sky-50 dark:bg-sky-950/40 text-[#2481cc]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-rose-500" />
                      <span className="text-[10px] font-bold">Bakong KHQR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('aba')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'aba'
                          ? 'border-[#2481cc] bg-sky-50 dark:bg-sky-950/40 text-[#2481cc]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-cyan-600" />
                      <span className="text-[10px] font-bold">ABA Mobile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#2481cc] bg-sky-50 dark:bg-sky-950/40 text-[#2481cc]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span className="text-[10px] font-bold">COD (ពេលដល់)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#17212b] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>{language === 'km' ? 'ទឹកប្រាក់សរុប' : 'Total Amount'}</span>
                  <span className="font-bold text-[#2481cc] text-base font-mono">
                    {formatPrice(finalCartTotal)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    {language === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-md active:scale-98"
                  >
                    {language === 'km' ? 'បញ្ជាក់ការកុម្ម៉ង់' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step: Success Screen with E-Receipt & 1-Click Telegram Share */}
          {step === 'success' && placedOrder && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {language === 'km' ? 'ការកុម្ម៉ង់ទទួលបានជោគជ័យ!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Order No: #{placedOrder.orderNumber}
              </p>

              <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 w-full text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">អតិថិជន:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {placedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ទឹកប្រាក់សរុប:</span>
                  <span className="font-bold text-[#2481cc] font-mono">
                    {formatPrice(placedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">វិធីទូទាត់:</span>
                  <span className="uppercase font-semibold text-slate-700 dark:text-slate-200">
                    {placedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Telegram Direct Order Notification to Merchant(s) (Feature 1) */}
              <div className="mt-4 p-3.5 bg-blue-50/90 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 w-full text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2481cc] dark:text-sky-300">
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {language === 'km'
                      ? 'ផ្ញើដំណឹងកុម្ម៉ង់ទៅ Telegram ម្ចាស់ហាងភ្លាមៗ៖'
                      : 'Send Order Slip to Merchant Telegram:'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'km'
                    ? 'ចុចប៊ូតុងខាងក្រោមដើម្បីផ្ញើវិក្កយបត្រកុម្ម៉ង់ផ្ទាល់ទៅកាន់ Telegram ម្ចាស់ហាង'
                    : 'Tap below to notify the merchant immediately on Telegram:'}
                </p>

                <div className="space-y-1.5 pt-1">
                  {uniqueVendorsInOrder.map((vendor) => (
                    <a
                      key={vendor.id}
                      href={getTelegramOrderUrl(placedOrder, vendor)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 bg-[#2481cc] hover:bg-[#1d6fa5] text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-xs transition-transform active:scale-98"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Send className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {language === 'km'
                            ? `ផ្ញើទៅ Telegram ហាង (${vendor.nameKh})`
                            : `Send to ${vendor.nameEn}`}
                        </span>
                      </div>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Track Order, E-Receipt & Navigation */}
              <div className="mt-4 w-full space-y-2">
                {/* Feature 3: Track My Order Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setTrackingPhoneQuery(placedOrder.customerPhone || placedOrder.orderNumber);
                    setIsTrackingOpen(true);
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-all active:scale-98"
                >
                  <Truck className="w-4 h-4" />
                  <span>
                    {language === 'km'
                      ? '🛵 តាមដានការដឹកជញ្ជូនរហ័ស (Track Order)'
                      : 'Track Order Progress'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReceiptOpen(true)}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-sky-500 to-[#2481cc] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:brightness-105 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {language === 'km'
                      ? 'ទាញយកវិក្កយបត្រផ្លូវការ (E-Receipt)'
                      : 'View Official E-Receipt'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveTab('orders');
                  }}
                  className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {language === 'km' ? 'មើលបញ្ជីការកុម្ម៉ង់របស់ខ្ញុំ' : 'View My Orders'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveTab('chat');
                  }}
                  className="w-full py-2 text-xs text-slate-500 hover:text-[#2481cc] font-medium"
                >
                  {language === 'km' ? 'ឆាតសួរនាំក្រុមការងារ' : 'Chat with Support'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official E-Receipt Modal */}
      {isReceiptOpen && placedOrder && (
        <ReceiptModal
          order={placedOrder}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </>
  );
};
