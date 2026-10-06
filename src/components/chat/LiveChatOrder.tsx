import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  ShoppingBag,
  Check,
  CheckCheck,
  QrCode,
  Truck,
  HelpCircle,
  Package,
  Sparkles,
  Phone,
  Image as ImageIcon,
  X,
  CreditCard,
  User,
  MapPin,
  Store,
  ChevronLeft,
  ChevronRight,
  Tag,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { generateKhqrString, getKhqrQrImageUrl } from '../../utils/khqr';

export const LiveChatOrder: React.FC = () => {
  const {
    chatMessages,
    isChatTyping,
    sendChatMessage,
    sendDirectChatOrder,
    products,
    language,
    formatPrice,
    markChatAsRead,
    currency,
    storeInfo,
    primaryStoreLocation,
    storeLocations,
    vendors,
    selectedVendorId,
    dedicatedVendor,
  } = useApp();

  const currentChatVendor =
    selectedVendorId !== 'all'
      ? vendors.find((v) => v.id === selectedVendorId)
      : dedicatedVendor;

  const chatBrandName = currentChatVendor
    ? (language === 'km' ? currentChatVendor.nameKh : currentChatVendor.nameEn)
    : (language === 'km' ? 'Phsar24 (ផ្សារ២៤)' : 'Phsar24 Marketplace');

  const [inputText, setInputText] = useState('');
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showStoreAddressNotice, setShowStoreAddressNotice] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showReceiptUploadNotice, setShowReceiptUploadNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick Chips Swipe & Drag scrolling state
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingChipsRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedChipsRef = useRef(false);

  const checkChipsScrollability = () => {
    const el = chipsContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    checkChipsScrollability();
    window.addEventListener('resize', checkChipsScrollability);
    return () => window.removeEventListener('resize', checkChipsScrollability);
  }, [chatMessages]);

  // Support mouse wheel horizontal scrolling
  useEffect(() => {
    const el = chipsContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkChipsScrollability();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleChipsScrollLeft = () => {
    if (chipsContainerRef.current) {
      chipsContainerRef.current.scrollBy({ left: -190, behavior: 'smooth' });
      setTimeout(checkChipsScrollability, 300);
    }
  };

  const handleChipsScrollRight = () => {
    if (chipsContainerRef.current) {
      chipsContainerRef.current.scrollBy({ left: 190, behavior: 'smooth' });
      setTimeout(checkChipsScrollability, 300);
    }
  };

  const handleChipsMouseDown = (e: React.MouseEvent) => {
    if (!chipsContainerRef.current) return;
    isDraggingChipsRef.current = true;
    hasDraggedChipsRef.current = false;
    startXRef.current = e.pageX - chipsContainerRef.current.offsetLeft;
    scrollLeftRef.current = chipsContainerRef.current.scrollLeft;
  };

  const handleChipsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingChipsRef.current || !chipsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - chipsContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedChipsRef.current = true;
    }
    chipsContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkChipsScrollability();
  };

  const handleChipsMouseUp = () => {
    isDraggingChipsRef.current = false;
  };

  const onChipClick = (chipText: string) => {
    if (hasDraggedChipsRef.current) return;
    handleQuickChipClick(chipText);
  };

  useEffect(() => {
    markChatAsRead();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickChipClick = (chipText: string) => {
    sendChatMessage(chipText);
  };

  const openOrderFormForProduct = (product: Product) => {
    setSelectedProductForOrder(product);
    setQuantity(1);
    setShowOrderModal(true);
  };

  const submitDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForOrder) return;
    if (!customerName || !customerPhone || !customerAddress) {
      alert(
        language === 'km'
          ? 'សូមបំពេញឈ្មោះ លេខទូរស័ព្ទ និងអាសយដ្ឋានដឹកជញ្ជូន!'
          : 'Please fill name, phone, and delivery address!'
      );
      return;
    }

    sendDirectChatOrder(
      [{ product: selectedProductForOrder, quantity }],
      {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        notes,
      }
    );

    setShowOrderModal(false);
    setSelectedProductForOrder(null);
  };

  const latestAttachedProduct =
    [...chatMessages].reverse().find((m) => m.productAttachment)?.productAttachment || null;

  return (
    <div className="flex flex-col h-[calc(100dvh-150px)] sm:h-[650px] max-w-2xl mx-auto bg-slate-50 dark:bg-[#0f141c] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
      {/* Chat Top Banner */}
      <div className="bg-white dark:bg-[#17212b] p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2481cc] to-[#50a7ea] text-white font-bold flex items-center justify-center text-xs shadow-xs tracking-tighter">
              {currentChatVendor ? '🏪' : 'P24'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#17212b]"></div>
          </div>
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
              <span>{chatBrandName}</span>
              <span className="text-[10px] text-slate-400 font-normal">· {language === 'km' ? 'សេវាបំរើអតិថិជន' : 'Support'}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'km'
                ? 'ឆ្លើយតបរហ័ស & ទទួលការកុម្ម៉ង់ ២៤/៧'
                : 'Instant Support & Chat Orders 24/7'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Store Location & Info Button */}
          <button
            onClick={() => setShowStoreAddressNotice(!showStoreAddressNotice)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            title="អាសយដ្ឋានហាង / Store Address"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">
              {language === 'km' ? 'ទីតាំងហាង' : 'Location'}
            </span>
          </button>

          {/* Quick Product Attachment Trigger */}
          <button
            onClick={() => setShowProductPicker(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#2481cc] dark:text-sky-300 text-xs font-semibold hover:bg-sky-100 transition-colors border border-sky-200 dark:border-sky-800/60"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ជ្រើសទំនិញ' : 'Pick Item'}</span>
          </button>
        </div>
      </div>

      {/* Store Address Banner Notice Dropdown */}
      {showStoreAddressNotice && (
        <div className="bg-sky-50/95 dark:bg-slate-900 border-b border-sky-100 dark:border-slate-800 p-3 text-xs animate-fade-in z-10 shrink-0 max-h-56 overflow-y-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <Store className="w-4 h-4 text-[#2481cc] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {currentChatVendor
                      ? (language === 'km' ? currentChatVendor.nameKh : currentChatVendor.nameEn)
                      : (language === 'km' ? 'Phsar24 (ផ្សារ២៤) - ផ្សារអនឡាញកម្ពុជា' : 'Phsar24 Marketplace')}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {currentChatVendor
                      ? (language === 'km' ? currentChatVendor.addressKh : currentChatVendor.addressEn)
                      : (language === 'km'
                          ? (primaryStoreLocation?.addressKh || storeInfo.addressKh).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')
                          : (primaryStoreLocation?.addressEn || storeInfo.addressEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'))}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono">
                    <span>📞 {currentChatVendor?.ownerPhone || primaryStoreLocation?.phone || storeInfo.phone1}</span>
                    <span>📍 {currentChatVendor?.city || storeInfo.city}</span>
                  </div>
                </div>

                {!currentChatVendor && storeLocations.length > 1 && (
                  <div className="pt-2 border-t border-sky-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {language === 'km' ? 'សាខាផ្សេងទៀត (Other Branches):' : 'Other Branches:'}
                    </span>
                    {storeLocations
                      .filter((l) => l.id !== primaryStoreLocation?.id && l.isActive)
                      .map((loc) => (
                        <div key={loc.id} className="text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            • {language === 'km' ? loc.nameKh.replace(/KAKA(\s*SHOP)?/gi, 'Phsar24') : loc.nameEn.replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')}:
                          </span>{' '}
                          {(language === 'km' ? loc.addressKh : loc.addressEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')} (📞 {loc.phone})
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowStoreAddressNotice(false)}
              className="p-1 text-slate-400 hover:text-slate-600 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Dynamic Store Welcome Header inside chat */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white via-sky-50/50 to-blue-50/30 dark:from-[#17212b] dark:to-slate-900 border border-sky-100 dark:border-slate-800 shadow-2xs">
          <div className="flex items-start gap-3">
            {currentChatVendor?.logo ? (
              <img
                src={currentChatVendor.logo}
                alt={currentChatVendor.nameKh}
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-[#2481cc] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs tracking-tight">
                {currentChatVendor ? '🏪' : 'P24'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {currentChatVendor
                    ? (language === 'km' ? currentChatVendor.nameKh : currentChatVendor.nameEn)
                    : (language === 'km' ? 'Phsar24 (ផ្សារ២៤)' : 'Phsar24 Marketplace')}
                </span>
                {currentChatVendor?.isVerified && (
                  <span className="text-[10px] text-sky-600 bg-sky-100 dark:bg-sky-950/80 px-1.5 py-0.2 rounded-full font-medium flex items-center gap-0.5">
                    ✓ {language === 'km' ? 'ហាងផ្លូវការ' : 'Verified'}
                  </span>
                )}
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded-full font-medium">
                  {language === 'km' ? 'ឆ្លើយតបភ្លាមៗ ២៤/៧' : 'Bot Online 24/7'}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                {currentChatVendor
                  ? (language === 'km'
                      ? `សួស្តីបងចាស! នាងខ្ញុំជាជំនួយការឆ្លើយតប និងប្រឹក្សាទំនិញផ្ទាល់ប្រចាំហាង ${currentChatVendor.nameKh}។ បងអាចសាកសួរព័ត៌មានទំនិញ តម្លៃ ឬកុម្ម៉ង់ផ្ទាល់បានភ្លាមៗចាស! 🌟`
                      : `Hello! I am your direct store assistant for ${currentChatVendor.nameEn}. Feel free to ask about products, pricing, or order directly! 🌟`)
                  : (language === 'km'
                      ? 'សួស្តីបងចាស! នាងខ្ញុំសូមស្វាគមន៍មកកាន់ Phsar24 (ផ្សារ២៤) 🛍️ ផ្សារអនឡាញទំនិញគ្រប់ប្រភេទនៅកម្ពុជា! តើបងចង់ស្វែងរកទំនិញ ឬហាងលក់មួយណាដែរចាស?'
                      : 'Welcome to Phsar24 (ផ្សារ២៤) 🛍️ Cambodia’s Online Marketplace! How can I assist you today?')}
              </p>

              {/* Direct Store Contact Badges */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-sky-100/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                <span>📞 {currentChatVendor?.ownerPhone || primaryStoreLocation?.phone || storeInfo.phone1}</span>
                <span>•</span>
                <span>📍 {currentChatVendor?.city || storeInfo.city}</span>
                {currentChatVendor?.telegramUsername && (
                  <>
                    <span>•</span>
                    <a
                      href={`https://t.me/${currentChatVendor.telegramUsername.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2481cc] hover:underline font-mono"
                    >
                      @{currentChatVendor.telegramUsername.replace('@', '')}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {chatMessages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          const displayedText =
            msg.id === 'msg-01'
              ? (currentChatVendor
                  ? (language === 'km'
                      ? `សួស្តីបងចាស! នាងខ្ញុំសូមស្វាគមន៍មកកាន់ **${currentChatVendor.nameKh}** 🌟! តើបងមានចំណាប់អារម្មណ៍លើផលិតផលមួយណាដែរចាស? ប្អូនស្រីរីករាយនឹងជួយប្រឹក្សា ឆ្លើយសំណួរ និងរៀបចំកញ្ចប់ដឹកជូនបងដល់មុខផ្ទះភ្លាមៗចាស!`
                      : `Hello! Welcome to **${currentChatVendor.nameEn}** 🌟! How can I assist you with our store items today?`)
                  : (language === 'km'
                      ? 'សួស្តីបងចាស! នាងខ្ញុំសូមស្វាគមន៍មកកាន់ **Phsar24 (ផ្សារ២៤)** 🌟 ផ្សារអនឡាញទំនើបកម្ពុជា! តើបងចង់ស្វែងរកទំនិញ ឬហាងលក់មួយណាដែរចាស? ប្អូនស្រីរីករាយនឹងជួយប្រឹក្សា និងរៀបចំកញ្ចប់ដឹកជូនបងដល់មុខផ្ទះភ្លាមៗចាស!'
                      : 'Hello! Welcome to **Phsar24 (ផ្សារ២៤)** 🌟 Cambodia’s Modern Marketplace! How can I assist you today?'))
              : msg.text;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  isCustomer
                    ? 'bg-[#2481cc] text-white rounded-br-xs'
                    : 'bg-white dark:bg-[#17212b] text-slate-900 dark:text-white rounded-bl-xs border border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Product Attachment Card inside Chat */}
                {msg.productAttachment && (
                  <div
                    className={`mb-2.5 p-2 rounded-xl border flex items-center gap-2.5 overflow-hidden ${
                      isCustomer
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <img
                      src={msg.productAttachment.image}
                      alt={msg.productAttachment.nameKh}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase opacity-80 flex items-center gap-1">
                        <span>{language === 'km' ? 'ទំនិញពេញនិយម' : 'Featured Item'}</span>
                        {msg.productAttachment.stock <= 15 && (
                          <span className="text-amber-300 font-normal">
                            ({language === 'km' ? `សល់ ${msg.productAttachment.stock}` : `${msg.productAttachment.stock} left`})
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-xs truncate">
                        {language === 'km'
                          ? msg.productAttachment.nameKh
                          : msg.productAttachment.nameEn}
                      </h4>
                      <div className="font-bold text-xs mt-0.5 text-amber-300 dark:text-amber-400">
                        {formatPrice(msg.productAttachment.price)}
                      </div>
                    </div>

                    {!isCustomer && (
                      <button
                        onClick={() => openOrderFormForProduct(msg.productAttachment!)}
                        className="px-2.5 py-1.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-lg text-[11px] font-semibold shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span>⚡</span>
                        <span>{language === 'km' ? 'កុម្ម៉ង់ឥឡូវ' : 'Order Now'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Message Text */}
                <p className="whitespace-pre-line break-words">{displayedText}</p>

                {/* Order Attachment Summary Invoice */}
                {msg.orderAttachment && msg.actionType === 'payment_qr' && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#2481cc]" />
                        <span className="font-bold text-xs">Bakong KHQR Payment</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded font-semibold">
                        KHQR Official
                      </span>
                    </div>

                    {/* Official KHQR Code Image */}
                    <div className="my-2.5 p-3 bg-white rounded-2xl border-2 border-[#d61c28] flex flex-col items-center shadow-xs">
                      <div className="w-full bg-[#d61c28] text-white text-[10px] font-black py-0.5 text-center tracking-widest uppercase mb-1.5 rounded-md">
                        KHQR OFFICIAL
                      </div>

                      <img
                        src={getKhqrQrImageUrl(
                          generateKhqrString({
                            bakongId: 'kaka_gadgets@aba',
                            merchantName: 'Phsar24 Store',
                            amount: msg.orderAttachment.totalAmount || 0,
                            currency: 'USD',
                            billNumber: msg.orderAttachment.orderNumber || '0000',
                          }),
                          240
                        )}
                        alt="Bakong KHQR"
                        className="w-44 h-44 object-contain rounded-lg"
                      />

                      <div className="mt-2 text-center">
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {formatPrice(msg.orderAttachment.totalAmount || 0)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Ref: #{msg.orderAttachment.orderNumber}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReceiptUploadNotice(true)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {language === 'km'
                          ? 'ខ្ញុំបានទូទាត់ប្រាក់រួចរាល់'
                          : 'I have paid via KHQR'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Timestamp & Read Receipts */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isCustomer ? 'text-white/70' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isCustomer && <CheckCheck className="w-3 h-3 text-sky-200" />}
                </div>
              </div>
            </div>
          );
        })}
        {isChatTyping && (
          <div className="flex flex-col items-start animate-fade-in">
            <div className="bg-white dark:bg-[#17212b] rounded-2xl rounded-bl-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2481cc] animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#2481cc] animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#2481cc] animate-bounce"></span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'km' ? `${chatBrandName} កំពុងឆ្លើយតប...` : `${chatBrandName} is typing...`}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Chips - Swipeable & Draggable (អូសពីស្តាំទៅឆ្វេង ឬពីឆ្វេងទៅស្តាំ) */}
      <div className="relative border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#17212b]/90 backdrop-blur-md shrink-0 group">
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={handleChipsScrollLeft}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-[#1e2a38] border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
            aria-label="Scroll left"
            title={language === 'km' ? 'អូសទៅឆ្វេង' : 'Scroll left'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={handleChipsScrollRight}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white dark:bg-[#1e2a38] border border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
            aria-label="Scroll right"
            title={language === 'km' ? 'អូសទៅស្តាំ' : 'Scroll right'}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Left Fade Gradient */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#17212b] to-transparent pointer-events-none z-10" />
        )}

        {/* Right Fade Gradient */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#17212b] to-transparent pointer-events-none z-10" />
        )}

        {/* Chips Scrollable & Draggable Area */}
        <div
          ref={chipsContainerRef}
          onScroll={checkChipsScrollability}
          onMouseDown={handleChipsMouseDown}
          onMouseMove={handleChipsMouseMove}
          onMouseUp={handleChipsMouseUp}
          onMouseLeave={handleChipsMouseUp}
          className="px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {latestAttachedProduct && (
            <button
              onClick={() => {
                if (hasDraggedChipsRef.current) return;
                openOrderFormForProduct(latestAttachedProduct);
              }}
              className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] whitespace-nowrap hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1 font-semibold shadow-xs animate-pulse-subtle shrink-0"
            >
              <span>⚡</span>
              <span>
                {language === 'km'
                  ? `កុម្ម៉ង់ ${latestAttachedProduct.nameKh.split(' ')[0]} ឥឡូវ (${formatPrice(latestAttachedProduct.price)})`
                  : `Order ${latestAttachedProduct.nameEn.split(' ')[0]} Now (${formatPrice(latestAttachedProduct.price)})`}
              </span>
            </button>
          )}

          {/* Solution-Selling Test Chips */}
          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'ខ្ញុំឧស្សាហ៍ឈឺចង្កេះ និងសន្លាក់ដៃជើងខ្លាំងណាស់ តើហាងមានអ្វីជួយបានទេ?'
                  : 'I often suffer from severe back and joint pain. Do you have a solution?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
          >
            <span>🌿</span>
            <span>{language === 'km' ? 'ឈឺចង្កេះ & សន្លាក់?' : 'Back & Joint Relief?'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'ខ្ញុំធុញនិងអាវដែលពាក់ពីរបីដងបោកទៅយារក និងបែកព្រុយណាស់'
                  : 'I am tired of t-shirts that stretch and pill after washing. Any recommendation?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] whitespace-nowrap hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-indigo-200 dark:border-indigo-800 shadow-2xs"
          >
            <span>👕</span>
            <span>{language === 'km' ? 'អាវពាក់យារបែកព្រុយ?' : 'Durable Cotton Tee?'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'អរគុណប្អូនស្រី ចាំខ្ញុំគិតមើលសិនណា៎'
                  : 'Thank you sister, let me think about it first.'
              )
            }
            className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[11px] whitespace-nowrap hover:bg-sky-100 dark:hover:bg-sky-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-sky-200 dark:border-sky-800 shadow-2xs"
          >
            <span>⏳</span>
            <span>{language === 'km' ? 'ចាំគិតមើលសិន?' : 'Think it over?'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'ចង់សួរថា អាចបញ្ចុះបន្ថែមពីលើការបញ្ចុះតម្លៃ 15% ទៀតបានទេ'
                  : 'Can you discount extra on top of the 15% discount?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-[11px] whitespace-nowrap hover:bg-pink-100 dark:hover:bg-pink-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-pink-200 dark:border-pink-800 shadow-2xs"
          >
            <span>🎁</span>
            <span>{language === 'km' ? 'ចុះបន្ថែមពីលើ 15% បានទេ?' : 'Extra discount over 15%?'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'មួយទៀតខ្ញុំឃើញថា ហាងរបស់អ្នកលក់ថ្លៃជាងហាងផ្សេង'
                  : 'Why does your store sell at a higher price than other stores?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] whitespace-nowrap hover:bg-purple-100 dark:hover:bg-purple-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-purple-200 dark:border-purple-800 shadow-2xs"
          >
            <span>💎</span>
            <span>{language === 'km' ? 'ហាងលក់ថ្លៃជាងហាងផ្សេង?' : 'Price vs Competitors?'}</span>
          </button>

          {/* Test Top 5 Seller response for shoes */}
          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើមានស្បែកជើងដែរទេ?'
                  : 'Do you have shoes or sneakers in stock?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] whitespace-nowrap hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-amber-200 dark:border-amber-800 shadow-2xs"
          >
            <span>👟</span>
            <span>{language === 'km' ? 'តើមានស្បែកជើងដែរទេ?' : 'Do you have shoes?'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'សូមជួយណែនាំទំនិញ Top Bestseller លក់ដាច់បំផុត!'
                  : 'Recommend your Top Bestsellers!'
              )
            }
            className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] whitespace-nowrap hover:bg-rose-100 dark:hover:bg-rose-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-rose-200 dark:border-rose-800 shadow-2xs"
          >
            <Flame className="w-3 h-3 text-rose-500" />
            <span>{language === 'km' ? 'Bestseller លក់ដាច់' : 'Top Bestsellers'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើមានឱសថបុរាណ និងលិខិតអនុញ្ញាតសុខាភិបាលដែរទេ?'
                  : 'Do you have licensed traditional medicine?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition-all flex items-center gap-1 font-semibold shrink-0 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
          >
            <span>🌿</span>
            <span>{language === 'km' ? 'ឱសថបុរាណ & អាជ្ញាប័ណ្ណ' : 'Herbal & Permits'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើមានវិធីសាស្ត្រទូទាត់ប្រាក់អ្វីខ្លះ?'
                  : 'What payment methods do you accept?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <CreditCard className="w-3 h-3 text-emerald-500" />
            <span>{language === 'km' ? 'វិធីសាស្ត្របង់ប្រាក់' : 'Payment'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើមានសេវាដឹកជញ្ជូនរហ័សដល់ផ្ទះទេ?'
                  : 'Do you offer express door-to-door delivery?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Truck className="w-3 h-3 text-[#2481cc]" />
            <span>{language === 'km' ? 'សេវាដឹកជញ្ជូន' : 'Delivery'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើធ្វើដូចម្តេចដើម្បីទទួលបាន Free សេវាដឹកជញ្ជូន?'
                  : 'How to get Free express delivery?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{language === 'km' ? 'Free សេវាដឹក ($30+)' : 'Free Shipping'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើហាង KAKA Shop មានសាខានៅឯណាខ្លះ?'
                  : 'Where are your store locations and branches?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Store className="w-3 h-3 text-rose-500" />
            <span>{language === 'km' ? 'សាខាហាង & ទីតាំង' : 'Branches'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើបច្ចុប្បន្នមានកូដ Coupon បញ្ចុះតម្លៃពិសេសអ្វីខ្លះ?'
                  : 'What promo coupon codes are available?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Tag className="w-3 h-3 text-violet-500" />
            <span>{language === 'km' ? 'កូដបញ្ចុះតម្លៃ' : 'Coupons'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'តើទំនិញនៅ KAKA Shop មានការធានា និងគុណភាពយ៉ាងណាដែរ?'
                  : 'What is your warranty and return policy?'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Check className="w-3 h-3 text-indigo-500" />
            <span>{language === 'km' ? 'ការធានា & គុណភាព' : 'Warranty'}</span>
          </button>

          <button
            onClick={() =>
              onChipClick(
                language === 'km'
                  ? 'សូមជួយណែនាំទំនិញដែលកំពុងលក់ដាច់បំផុតប្រចាំហាង!'
                  : 'Please recommend the best selling items in store!'
              )
            }
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1 font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{language === 'km' ? 'ទំនិញលក់ដាច់បំផុត' : 'Best Sellers'}</span>
          </button>
        </div>
      </div>

      {/* Chat Composer Form - Prominent & Always Visible */}
      <div className="p-2 sm:p-2.5 bg-white dark:bg-[#17212b] border-t-2 border-slate-200 dark:border-slate-800 shrink-0 shadow-lg z-20">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setShowProductPicker(true)}
            className="p-2.5 text-slate-500 hover:text-[#2481cc] hover:bg-sky-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shrink-0"
            title="ភ្ជាប់ផលិតផល / Attach Product"
          >
            <Package className="w-5 h-5 text-[#2481cc]" />
          </button>

          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'km'
                  ? 'សរសេរសារ ឬសួរនាំបញ្ជាទិញនៅទីនេះ...'
                  : 'Type a message or inquire to order...'
              }
              className="w-full py-2.5 pl-3.5 pr-3 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-[#2481cc] focus:bg-white dark:focus:bg-slate-950 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="py-2.5 px-3.5 bg-[#2481cc] hover:bg-[#1d6fae] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 font-semibold text-xs sm:text-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'km' ? 'ផ្ញើ' : 'Send'}</span>
          </button>
        </form>
      </div>

      {/* Product Picker Drawer inside Chat */}
      {showProductPicker && (
        <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-[#17212b] rounded-t-3xl max-h-[80%] flex flex-col border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'km'
                    ? 'ជ្រើសរើសទំនិញដើម្បីសួរនាំ ឬកុម្ម៉ង់'
                    : 'Select Item to Inquire or Order'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {language === 'km'
                    ? 'ចុចលើទំនិញដើម្បីផ្ញើចូលក្នុងប្រអប់ជជែក'
                    : 'Tap on product to attach into conversation'}
                </p>
              </div>
              <button
                onClick={() => setShowProductPicker(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 max-h-[60vh]">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-[#2481cc] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.nameKh}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg shrink-0 border"
                    />
                    <div className="min-w-0">
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {language === 'km' ? p.nameKh : p.nameEn}
                      </h5>
                      <div className="text-xs font-bold text-[#2481cc] mt-0.5">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setShowProductPicker(false);
                        sendChatMessage(
                          language === 'km'
                            ? `ខ្ញុំចង់សួរនាំអំពី៖ ${p.nameKh}`
                            : `I would like to inquire about: ${p.nameEn}`,
                          p
                        );
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {language === 'km' ? 'សួរនាំ' : 'Inquire'}
                    </button>
                    <button
                      onClick={() => {
                        setShowProductPicker(false);
                        openOrderFormForProduct(p);
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-[#2481cc] text-white hover:bg-[#1d6fae]"
                    >
                      {language === 'km' ? 'កុម្ម៉ង់' : 'Order'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Direct Order Form Modal */}
      {showOrderModal && selectedProductForOrder && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-[#17212b] w-full max-w-md rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-800 animate-scale">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#2481cc]" />
                <span>
                  {language === 'km' ? 'បញ្ជាទិញផ្ទាល់តាមឆាត' : 'Live Chat Direct Order'}
                </span>
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected item summary */}
            <div className="my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <img
                src={selectedProductForOrder.image}
                alt={selectedProductForOrder.nameKh}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-xs truncate">
                  {language === 'km'
                    ? selectedProductForOrder.nameKh
                    : selectedProductForOrder.nameEn}
                </h5>
                <div className="text-xs font-bold text-[#2481cc]">
                  {formatPrice(selectedProductForOrder.price)}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-0.5 bg-white dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-5 h-5 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={submitDirectOrder} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះអ្នកទទួល *' : 'Recipient Name *'}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ឈ្មោះរបស់អ្នក (e.g. សុខ វិបុល)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'លេខទូរស័ព្ទ *' : 'Phone Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'អាសយដ្ឋានដឹកជញ្ជូន *' : 'Delivery Address *'}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ រាជធានីភ្នំពេញ ឬខេត្ត..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-2 bg-sky-50 dark:bg-sky-950/30 rounded-lg border border-sky-100 dark:border-sky-900/40 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">
                  {language === 'km' ? 'ទឹកប្រាក់សរុប៖' : 'Total Amount:'}
                </span>
                <span className="font-bold text-[#2481cc] text-sm">
                  {formatPrice(selectedProductForOrder.price * quantity)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white font-semibold rounded-xl text-xs shadow-md transition-all active:scale-98"
              >
                {language === 'km' ? 'បញ្ជាក់ការកុម្ម៉ង់តាមឆាត' : 'Confirm Order in Chat'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Receipt Success Notification */}
      {showReceiptUploadNotice && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17212b] rounded-2xl p-5 max-w-sm text-center shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'km'
                ? 'បានផ្ញើការបញ្ជាក់ទូទាត់ប្រាក់!'
                : 'Payment Confirmation Received!'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {language === 'km'
                ? 'ក្រុមការងារ KAKA Shop កំពុងផ្ទៀងផ្ទាត់ការទូទាត់ប្រាក់ KHQR និងរៀបចំផ្ញើទំនិញជូនបងយ៉ាងឆាប់រហ័ស។ អរគុណសម្រាប់ការគាំទ្រ!'
                : 'Our support team is verifying your KHQR payment slip and preparing your delivery. Thank you!'}
            </p>
            <button
              onClick={() => setShowReceiptUploadNotice(false)}
              className="mt-4 w-full py-2 bg-[#2481cc] text-white rounded-xl text-xs font-semibold"
            >
              {language === 'km' ? 'យល់ព្រម' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
