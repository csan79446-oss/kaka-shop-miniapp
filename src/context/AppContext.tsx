import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  AdminRole,
  AdminUser,
  AuditAction,
  AuditLog,
  CartItem,
  Category,
  ChatMessage,
  Coupon,
  Currency,
  Language,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  ProductReview,
  StoreInfo,
  StoreLocation,
  StoreInfoItem,
  MedicalLicense,
  LicenseSecurityConfig,
  Vendor,
} from '../types';
import { EXCHANGE_RATE_KHR } from '../data/mockData';
import {
  loadStoredAdminAuth,
  loadStoredAdminUsers,
  loadStoredAuditLogs,
  loadStoredCart,
  loadStoredCategories,
  loadStoredChatMessages,
  loadStoredCoupons,
  loadStoredOrders,
  loadStoredProducts,
  loadStoredReviews,
  loadStoredStoreInfo,
  loadStoredStoreLocations,
  loadStoredStoreInfoItems,
  loadStoredLicenses,
  loadStoredLicenseSecurityConfig,
  loadStoredVendors,
  saveStoredAdminAuth,
  saveStoredAdminUsers,
  saveStoredAuditLogs,
  saveStoredCart,
  saveStoredCategories,
  saveStoredChatMessages,
  saveStoredCoupons,
  saveStoredOrders,
  saveStoredProducts,
  saveStoredReviews,
  saveStoredStoreInfo,
  saveStoredStoreLocations,
  saveStoredStoreInfoItems,
  saveStoredLicenses,
  saveStoredLicenseSecurityConfig,
  saveStoredVendors,
} from '../services/storage';
import { getTelegramWebApp, triggerHaptic } from '../services/telegram';
import {
  db,
  testFirestoreConnection,
  seedFirestoreIfEmpty,
  syncVendorToCloud,
  deleteVendorFromCloud,
  syncProductToCloud,
  deleteProductFromCloud,
  syncOrderToCloud,
  syncChatToCloud,
  COLLECTIONS,
} from '../services/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';

interface AppContextType {
  // App views
  activeTab: 'store' | 'chat' | 'cart' | 'admin' | 'orders';
  setActiveTab: (tab: 'store' | 'chat' | 'cart' | 'admin' | 'orders') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (amountInUsd: number) => string;
  isTelegramView: boolean;
  setIsTelegramView: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  productModalInitialMedia: 'image' | 'video';
  openProductModal: (product: Product, initialMedia?: 'image' | 'video') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingPhoneQuery: string;
  setTrackingPhoneQuery: (query: string) => void;

  // Vendors (Marketplace Multi-Vendor Platform)
  vendors: Vendor[];
  selectedVendorId: string;
  setSelectedVendorId: (id: string) => void;
  selectedAdminVendorId: string | null;
  setSelectedAdminVendorId: (id: string | null) => void;
  addVendor: (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => Vendor;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  toggleVendorStatus: (id: string) => void;
  toggleVendorVerification: (id: string) => void;
  getVendorById: (id?: string) => Vendor | undefined;

  // Dedicated Storefront Mode (Single-Store Focus Link)
  isDedicatedStoreMode: boolean;
  setIsDedicatedStoreMode: (mode: boolean) => void;
  dedicatedVendor: Vendor | null;
  enterDedicatedStore: (vendorIdOrSlug: string) => void;
  exitDedicatedStoreMode: () => void;
  productionDomain: string;
  setProductionDomain: (domain: string) => void;
  getStoreShareLinks: (vendor: Vendor) => { webUrl: string; telegramUrl: string };
  registerVendorSelf: (data: {
    nameKh: string;
    nameEn: string;
    slug: string;
    category: string;
    city: string;
    addressKh: string;
    ownerName: string;
    ownerPhone: string;
    telegramUsername: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    username: string;
    pin: string;
  }) => { success: boolean; messageKh?: string; messageEn?: string; vendor?: Vendor };

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories (Admin CRUD)
  categories: Category[];
  addCategory: (data: { nameKh: string; nameEn: string; icon?: string; id?: string }) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string, reassignToCategoryId?: string) => { success: boolean; messageKh?: string; messageEn?: string };

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartItemQuantity: (itemIndex: number, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  removeCartItem: (itemIndex: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  discountAmount: number;
  finalCartTotal: number;
  cartItemCount: number;

  // Coupons / Promo Codes
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; messageKh: string; messageEn: string; coupon?: Coupon };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Coupon;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Reviews & Ratings
  reviews: ProductReview[];
  addReview: (data: Omit<ProductReview, 'id' | 'date'>) => ProductReview;
  getProductReviews: (productId: string) => ProductReview[];
  getProductRating: (productId: string) => { rating: number; count: number };

  // E-Receipt & Exporting
  selectedOrderForReceipt: Order | null;
  setSelectedOrderForReceipt: (order: Order | null) => void;
  exportOrdersCsv: () => void;
  exportInventoryCsv: () => void;

  // Store Info (អាសយដ្ឋាន និងព័ត៌មានហាង)
  storeInfo: StoreInfo;
  updateStoreInfo: (updates: Partial<StoreInfo>) => void;

  // Store Branches & Addresses (បញ្ចូល កែប្រែ លុប អាសយដ្ឋាន/សាខាហាង)
  storeLocations: StoreLocation[];
  primaryStoreLocation: StoreLocation;
  addStoreLocation: (locationData: Omit<StoreLocation, 'id'>) => StoreLocation;
  updateStoreLocation: (id: string, updates: Partial<StoreLocation>) => void;
  deleteStoreLocation: (id: string) => void;
  setPrimaryStoreLocation: (id: string) => void;

  // Store Custom Information & Policies (បញ្ចូល កែប្រែ លុប ព័ត៌មានបន្ថែម & គោលការណ៍ហាង)
  storeInfoItems: StoreInfoItem[];
  addStoreInfoItem: (itemData: Omit<StoreInfoItem, 'id' | 'createdAt'>) => StoreInfoItem;
  updateStoreInfoItem: (id: string, updates: Partial<StoreInfoItem>) => void;
  deleteStoreInfoItem: (id: string) => void;

  // Medical Licenses & Security (បញ្ចូល កែប្រែ លុប អាជ្ញាប័ណ្ណ និងវិញ្ញាបនបត្រឱសថបុរាណ)
  licenses: MedicalLicense[];
  addLicense: (license: Omit<MedicalLicense, 'id'>) => MedicalLicense;
  updateLicense: (id: string, updates: Partial<MedicalLicense>) => void;
  deleteLicense: (id: string) => void;
  licenseSecurityConfig: LicenseSecurityConfig;
  updateLicenseSecurityConfig: (updates: Partial<LicenseSecurityConfig>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;

  // Admin & Security
  adminUsers: AdminUser[];
  currentAdmin: AdminUser | null;
  loginAdmin: (pinOrUsername: string, pin?: string) => boolean;
  logoutAdmin: () => void;
  addAdminUser: (userData: Omit<AdminUser, 'id'>) => AdminUser;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  hasPermission: (requiredRole: AdminRole) => boolean;
  canManageContent: boolean;
  isSuperAdmin: boolean;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: AuditAction, detailsKh: string, detailsEn: string, targetType: AuditLog['targetType'], targetId?: string) => void;
  clearAuditLogs: () => void;

  // Chat
  chatMessages: ChatMessage[];
  isChatTyping: boolean;
  sendChatMessage: (text: string, productAttachment?: Product) => void;
  sendProductInquiryToChat: (product: Product, inquiryType?: 'price' | 'order' | 'custom') => void;
  sendDirectChatOrder: (items: CartItem[], customer: { name: string; phone: string; address: string; notes?: string }) => Order;
  sendAgentReply: (text: string) => void;
  unreadChatCount: number;
  markChatAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<'store' | 'chat' | 'cart' | 'admin' | 'orders'>('store');
  const [language, setLanguage] = useState<Language>('km');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isTelegramView, setIsTelegramView] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [productModalInitialMedia, setProductModalInitialMedia] = useState<'image' | 'video'>('image');

  const setSelectedProduct = (prod: Product | null) => {
    if (!prod) {
      setProductModalInitialMedia('image');
    }
    setSelectedProductState(prod);
  };

  const openProductModal = (product: Product, initialMedia: 'image' | 'video' = 'image') => {
    setProductModalInitialMedia(initialMedia);
    setSelectedProductState(product);
  };
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingPhoneQuery, setTrackingPhoneQuery] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Entities state
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(loadStoredStoreInfo);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>(loadStoredStoreLocations);
  const [storeInfoItems, setStoreInfoItems] = useState<StoreInfoItem[]>(loadStoredStoreInfoItems);
  const [products, setProducts] = useState<Product[]>(loadStoredProducts);
  const [categories, setCategories] = useState<Category[]>(loadStoredCategories);
  const [coupons, setCoupons] = useState<Coupon[]>(loadStoredCoupons);
  const [reviews, setReviews] = useState<ProductReview[]>(loadStoredReviews);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [cart, setCart] = useState<CartItem[]>(loadStoredCart);
  const [orders, setOrders] = useState<Order[]>(loadStoredOrders);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(loadStoredAdminUsers);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(loadStoredAdminAuth);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(loadStoredAuditLogs);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadStoredChatMessages);
  const [licenses, setLicenses] = useState<MedicalLicense[]>(loadStoredLicenses);
  const [licenseSecurityConfig, setLicenseSecurityConfig] = useState<LicenseSecurityConfig>(loadStoredLicenseSecurityConfig);
  const [vendors, setVendors] = useState<Vendor[]>(loadStoredVendors);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('all');
  const [selectedAdminVendorId, setSelectedAdminVendorId] = useState<string | null>(null);

  // Guards against cached snapshot race conditions on deletion
  const deletedVendorIdsRef = useRef<Set<string>>(new Set());
  const deletedProductIdsRef = useRef<Set<string>>(new Set());

  // Dedicated Storefront mode state (Parsed from URL query '?store=...' or Telegram 'startapp=store_...')
  const [dedicatedVendorSlug, setDedicatedVendorSlug] = useState<string | null>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlStore = searchParams.get('store') || searchParams.get('vendor');
      if (urlStore) return urlStore;

      // Telegram WebApp initDataUnsafe start_param
      const tg = (window as any).Telegram?.WebApp;
      const startParam = tg?.initDataUnsafe?.start_param;
      if (startParam) {
        if (startParam.startsWith('store_')) {
          return startParam.replace('store_', '');
        }
        return startParam;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isDedicatedStoreMode, setIsDedicatedStoreMode] = useState<boolean>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('store') || searchParams.has('vendor')) return true;
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.initDataUnsafe?.start_param?.startsWith('store_')) return true;
      return false;
    } catch {
      return false;
    }
  });

  // RBAC Privileges: Store Manager and Super Admin can Add, Edit, Delete content
  const canManageContent = currentAdmin?.role === 'SUPER_ADMIN' || currentAdmin?.role === 'STORE_MANAGER';
  const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN';

  const checkManagerPermission = (actionKh: string, actionEn: string): boolean => {
    if (currentAdmin && currentAdmin.role === 'SUPPORT_STAFF') {
      triggerHaptic('error');
      alert(
        language === 'km'
          ? `🔒 សិទ្ធិមិនគ្រប់គ្រាន់!\n\nគណនីរបស់អ្នកមានតួនាទីជា Support Staff (សិទ្ធិមើលតែប៉ុណ្ណោះ)។\nការ${actionKh} ត្រូវបានអនុញ្ញាតចាប់ពី Store Manager ឡើងទៅប៉ុណ្ណោះ។`
          : `🔒 Permission Denied!\n\nYour account role is Support Staff (View-Only).\n${actionEn} is restricted to Store Manager and above.`
      );
      return false;
    }
    return true;
  };

  // Initialize Telegram WebApp if present
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  // Real-time Cloud Sync with Firebase Firestore (Multi-device live sync)
  useEffect(() => {
    // 1. Validate connection and seed cloud database if empty
    testFirestoreConnection().then((connected) => {
      if (connected) {
        seedFirestoreIfEmpty();
      }
    });

    // 2. Real-time listener for Marketplace Vendors (bounded with limit to preserve free tier quota)
    const vendorsQuery = query(
      collection(db, COLLECTIONS.VENDORS),
      limit(250)
    );
    const unsubVendors = onSnapshot(
      vendorsQuery,
      (snapshot) => {
        const cloudVendors = snapshot.docs
          .map((d) => d.data() as Vendor)
          .filter((v) => !deletedVendorIdsRef.current.has(v.id));
        if (cloudVendors.length > 0 || snapshot.empty) {
          setVendors(cloudVendors);
        }
      },
      (error) => {
        console.warn('Firebase vendors listener offline fallback:', error);
      }
    );

    // 3. Real-time listener for Products (bounded with limit to preserve free tier quota)
    const productsQuery = query(
      collection(db, COLLECTIONS.PRODUCTS),
      limit(300)
    );
    const unsubProducts = onSnapshot(
      productsQuery,
      (snapshot) => {
        const cloudProducts = snapshot.docs
          .map((d) => d.data() as Product)
          .filter(
            (p) =>
              !deletedProductIdsRef.current.has(p.id) &&
              !deletedVendorIdsRef.current.has(p.vendorId || '')
          );
        if (cloudProducts.length > 0 || snapshot.empty) {
          setProducts(cloudProducts);
        }
      },
      (error) => {
        console.warn('Firebase products listener offline fallback:', error);
      }
    );

    // 4. Real-time listener for Orders (Live orders appear immediately on all devices, bounded to last 100)
    const ordersQuery = query(
      collection(db, COLLECTIONS.ORDERS),
      limit(100)
    );
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudOrders = snapshot.docs.map((d) => d.data() as Order);
          cloudOrders.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(cloudOrders);
        }
      },
      (error) => {
        console.warn('Firebase orders listener offline fallback:', error);
      }
    );

    // 5. Real-time listener for Live Chat Messages (bounded to latest 50 messages)
    const chatQuery = query(
      collection(db, COLLECTIONS.CHAT_MESSAGES),
      limit(50)
    );
    const unsubChat = onSnapshot(
      chatQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudChat = snapshot.docs.map((d) => d.data() as ChatMessage);
          cloudChat.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setChatMessages(cloudChat);
        }
      },
      (error) => {
        console.warn('Firebase chat listener offline fallback:', error);
      }
    );

    return () => {
      unsubVendors();
      unsubProducts();
      unsubOrders();
      unsubChat();
    };
  }, []);

  // Save changes to storage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveStoredCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    saveStoredReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStoredAdminUsers(adminUsers);
  }, [adminUsers]);

  useEffect(() => {
    saveStoredAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  useEffect(() => {
    saveStoredChatMessages(chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    saveStoredAdminAuth(currentAdmin);
  }, [currentAdmin]);

  useEffect(() => {
    saveStoredStoreInfo(storeInfo);
  }, [storeInfo]);

  useEffect(() => {
    saveStoredStoreLocations(storeLocations);
  }, [storeLocations]);

  useEffect(() => {
    saveStoredStoreInfoItems(storeInfoItems);
  }, [storeInfoItems]);

  useEffect(() => {
    saveStoredLicenses(licenses);
  }, [licenses]);

  useEffect(() => {
    saveStoredLicenseSecurityConfig(licenseSecurityConfig);
  }, [licenseSecurityConfig]);

  useEffect(() => {
    saveStoredVendors(vendors);
  }, [vendors]);

  const getVendorById = (id?: string) => {
    if (!id) return undefined;
    return vendors.find((v) => v.id === id);
  };

  // Auto-activate dedicated vendor when slug matches
  useEffect(() => {
    if (dedicatedVendorSlug && vendors.length > 0) {
      const cleanSlug = dedicatedVendorSlug.toLowerCase().trim();
      const matched = vendors.find(
        (v) =>
          v.id.toLowerCase() === cleanSlug ||
          v.slug.toLowerCase() === cleanSlug ||
          ((cleanSlug.includes('kaka') || cleanSlug.includes('gadget')) &&
            (v.slug.includes('gadget') || v.slug.includes('kaka'))) ||
          (cleanSlug.includes('phsar24-gadgets') &&
            (v.slug.includes('gadget') || v.slug.includes('kaka'))) ||
          (cleanSlug.includes('herbal') && v.slug.includes('herbal')) ||
          (cleanSlug.includes('fashion') && v.slug.includes('fashion'))
      );
      if (matched) {
        setSelectedVendorId(matched.id);
        setIsDedicatedStoreMode(true);
      }
    }
  }, [dedicatedVendorSlug, vendors]);

  const dedicatedVendor =
    isDedicatedStoreMode && selectedVendorId !== 'all'
      ? vendors.find((v) => v.id === selectedVendorId) || null
      : null;

  const enterDedicatedStore = (vendorIdOrSlug: string) => {
    const clean = vendorIdOrSlug.toLowerCase().trim();
    const matched = vendors.find(
      (v) =>
        v.id.toLowerCase() === clean ||
        v.slug.toLowerCase() === clean ||
        ((clean.includes('kaka') || clean.includes('gadget')) &&
          (v.slug.includes('gadget') || v.slug.includes('kaka')))
    );
    if (matched) {
      setSelectedVendorId(matched.id);
      setIsDedicatedStoreMode(true);
      setDedicatedVendorSlug(matched.slug);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('store', matched.slug);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore
      }
    }
  };

  const exitDedicatedStoreMode = () => {
    setIsDedicatedStoreMode(false);
    setSelectedVendorId('all');
    setDedicatedVendorSlug(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('store');
      url.searchParams.delete('vendor');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  // Production Domain configuration (Defaults to Vercel production URL)
  const [productionDomain, setProductionDomainState] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('phsar24_production_domain');
        if (stored) return stored;
        // If current window is accessed on Vercel or custom domain, dynamically use it!
        if (
          window.location.origin.includes('vercel.app') ||
          (!window.location.origin.includes('run.app') &&
            !window.location.origin.includes('localhost') &&
            !window.location.origin.includes('google'))
        ) {
          return window.location.origin;
        }
      }
      return 'https://phsar24.vercel.app';
    } catch {
      return 'https://phsar24.vercel.app';
    }
  });

  const setProductionDomain = (newDomain: string) => {
    let clean = newDomain.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    clean = clean.replace(/\/+$/, '');
    setProductionDomainState(clean);
    try {
      localStorage.setItem('phsar24_production_domain', clean);
    } catch {
      // ignore
    }
  };

  const getStoreShareLinks = (vendor: Vendor) => {
    let origin = productionDomain;
    if (typeof window !== 'undefined') {
      // If currently running directly on Vercel or production domain, use window.location.origin
      if (
        window.location.origin.includes('vercel.app') ||
        (!window.location.origin.includes('run.app') &&
          !window.location.origin.includes('localhost') &&
          !window.location.origin.includes('google'))
      ) {
        origin = window.location.origin;
      }
    }
    const webUrl = `${origin}?store=${vendor.slug}`;
    const botUser = (vendor.telegramUsername || 'kaka_gadgets_bot').replace('@', '');
    const telegramUrl = `https://t.me/${botUser}/app?startapp=store_${vendor.slug}`;
    return { webUrl, telegramUrl };
  };

  const registerVendorSelf = (data: {
    nameKh: string;
    nameEn: string;
    slug: string;
    category: string;
    city: string;
    addressKh: string;
    ownerName: string;
    ownerPhone: string;
    telegramUsername: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    username: string;
    pin: string;
  }) => {
    // Check if username is already taken
    const usernameTaken = adminUsers.some(
      (u) => u.username.toLowerCase() === data.username.toLowerCase()
    );
    if (usernameTaken) {
      triggerHaptic('error');
      return {
        success: false,
        messageKh: `ឈ្មោះគណនី "${data.username}" ត្រូវបានប្រើប្រាស់រួចហើយ! សូមជ្រើសរើសឈ្មោះផ្សេង។`,
        messageEn: `Username "${data.username}" is already taken! Please choose another.`,
      };
    }

    // Ensure slug is unique
    let cleanSlug = (data.slug || data.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    if (vendors.some((v) => v.slug === cleanSlug)) {
      cleanSlug = `${cleanSlug}-${Date.now().toString(36).slice(-3)}`;
    }

    const now = new Date().toISOString();
    const newVendorId = `vendor-${Date.now().toString(36)}`;
    const newVendor: Vendor = {
      id: newVendorId,
      nameKh: data.nameKh,
      nameEn: data.nameEn,
      slug: cleanSlug,
      category: data.category,
      logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=160&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
      descriptionKh: `ហាងលក់ទំនិញ ${data.nameKh} នៅ${data.city}`,
      descriptionEn: `${data.nameEn} Store in ${data.city}`,
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      ownerEmail: '',
      telegramUsername: data.telegramUsername,
      addressKh: data.addressKh,
      addressEn: data.addressKh,
      city: data.city,
      commissionRate: 5,
      bankName: data.bankName,
      bankAccountName: data.bankAccountName,
      bankAccountNumber: data.bankAccountNumber,
      rating: 5.0,
      reviewCount: 0,
      isVerified: false,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const newAdminUser: AdminUser = {
      id: `admin-${Date.now().toString(36)}`,
      name: data.ownerName,
      username: data.username,
      role: 'STORE_MANAGER',
      vendorId: newVendorId,
      pin: data.pin,
      avatar: '🏪',
      active: true,
      lastLogin: now,
    };

    setVendors((prev) => [newVendor, ...prev]);
    setAdminUsers((prev) => [...prev, newAdminUser]);
    setCurrentAdmin(newAdminUser);
    syncVendorToCloud(newVendor);

    logAuditAction(
      'VENDOR_CREATE',
      `ម្ចាស់ហាង "${data.ownerName}" បានចុះឈ្មោះបើកហាងថ្មីដោយខ្លួនឯង៖ "${newVendor.nameKh}" (${newVendor.nameEn})`,
      `Merchant "${data.ownerName}" self-registered store: "${newVendor.nameEn}"`,
      'vendor',
      newVendor.id
    );

    triggerHaptic('success');
    return { success: true, vendor: newVendor };
  };

  const addVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor => {
    if (!checkManagerPermission('បន្ថែមហាងថ្មី', 'Adding new vendor')) return null as any;
    const now = new Date().toISOString();
    const newVendor: Vendor = {
      ...vendorData,
      id: `vendor-${Date.now().toString(36)}`,
      createdAt: now,
      updatedAt: now,
    };

    setVendors((prev) => [newVendor, ...prev]);
    syncVendorToCloud(newVendor);

    logAuditAction(
      'VENDOR_CREATE',
      `បានបង្កើតហាងលក់ថ្មី៖ "${newVendor.nameKh}" (${newVendor.nameEn})`,
      `Created new vendor store: "${newVendor.nameEn}"`,
      'vendor',
      newVendor.id
    );

    triggerHaptic('success');
    return newVendor;
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    if (!checkManagerPermission('កែប្រែព័ត៌មានហាង', 'Updating vendor')) return;
    const old = vendors.find((v) => v.id === id);
    if (!old) return;

    const now = new Date().toISOString();
    const updated = { ...old, ...updates, updatedAt: now };
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? updated : v))
    );
    syncVendorToCloud(updated);

    logAuditAction(
      'VENDOR_UPDATE',
      `បានកែប្រែព័ត៌មានហាង៖ "${updates.nameKh || old.nameKh}"`,
      `Updated vendor details: "${updates.nameEn || old.nameEn}"`,
      'vendor',
      id
    );

    triggerHaptic('medium');
  };

  const toggleVendorStatus = (id: string) => {
    if (!checkManagerPermission('ប្តូរស្ថានភាពហាង', 'Toggling vendor status')) return;
    const v = vendors.find((item) => item.id === id);
    if (!v) return;

    const nextStatus: Vendor['status'] = v.status === 'active' ? 'suspended' : 'active';
    setVendors((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item
      )
    );

    logAuditAction(
      'VENDOR_STATUS_CHANGE',
      `បានប្តូរស្ថានភាពហាង "${v.nameKh}" ទៅជា: ${nextStatus}`,
      `Changed vendor status of "${v.nameEn}" to: ${nextStatus}`,
      'vendor',
      id
    );

    triggerHaptic('medium');
  };

  const toggleVendorVerification = (id: string) => {
    if (!checkManagerPermission('ផ្ទៀងផ្ទាត់ផ្លាកសញ្ញាហាង', 'Toggling vendor verification')) return;
    const v = vendors.find((item) => item.id === id);
    if (!v) return;

    const nextVerified = !v.isVerified;
    setVendors((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVerified: nextVerified, updatedAt: new Date().toISOString() } : item
      )
    );

    logAuditAction(
      'VENDOR_UPDATE',
      `បាន${nextVerified ? 'ផ្តល់ផ្លាក' : 'ដកផ្លាក'}ផ្ទៀងផ្ទាត់ (Verified) ដល់ហាង "${v.nameKh}"`,
      `${nextVerified ? 'Granted' : 'Revoked'} verified badge for "${v.nameEn}"`,
      'vendor',
      id
    );

    triggerHaptic('medium');
  };

  const deleteVendor = (id: string) => {
    if (!checkManagerPermission('លុបហាងលក់', 'Deleting vendor')) return;
    const v = vendors.find((item) => item.id === id);
    if (!v) return;

    deletedVendorIdsRef.current.add(id);

    // 1. Immediately delete from Firestore Cloud
    deleteVendorFromCloud(id);

    // 2. Also delete all products assigned to this vendor from Firestore Cloud
    const vendorProds = products.filter((p) => p.vendorId === id);
    vendorProds.forEach((p) => {
      deletedProductIdsRef.current.add(p.id);
      deleteProductFromCloud(p.id);
    });

    // 3. Immediately update local state & localStorage
    const updatedVendors = vendors.filter((item) => item.id !== id);
    setVendors(updatedVendors);
    saveStoredVendors(updatedVendors);

    const updatedProducts = products.filter((p) => p.vendorId !== id);
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    logAuditAction(
      'VENDOR_DELETE',
      `បានលុបហាង "${v.nameKh}" ចេញពីប្រព័ន្ធផ្សាររួម`,
      `Deleted vendor "${v.nameEn}" from marketplace`,
      'vendor',
      id
    );

    triggerHaptic('heavy');
  };

  const primaryStoreLocation: StoreLocation =
    storeLocations.find((l) => l.isPrimary && l.isActive) ||
    storeLocations.find((l) => l.isPrimary) ||
    storeLocations[0] || {
      id: 'default',
      nameKh: storeInfo.nameKh,
      nameEn: storeInfo.nameEn,
      addressKh: storeInfo.addressKh,
      addressEn: storeInfo.addressEn,
      city: storeInfo.city,
      phone: storeInfo.phone1,
      telegramUsername: storeInfo.telegramUsername,
      workingHoursKh: storeInfo.workingHoursKh,
      workingHoursEn: storeInfo.workingHoursEn,
      googleMapsUrl: storeInfo.googleMapsUrl,
      isPrimary: true,
      isActive: true,
    };

  const updateStoreInfo = (updates: Partial<StoreInfo>) => {
    if (!checkManagerPermission('កែសម្រួលព័ត៌មានហាង', 'Updating store info')) return;
    setStoreInfo((prev) => {
      const updated = { ...prev, ...updates };
      logAuditAction(
        'STORE_INFO_UPDATE',
        'បានកែសម្រួលព័ត៌មានទូទៅរបស់ហាង',
        'Updated store general profile',
        'store-info',
        'store-profile'
      );
      return updated;
    });
  };

  // Add Branch / Location (បញ្ចូល)
  const addStoreLocation = (locationData: Omit<StoreLocation, 'id'>): StoreLocation => {
    if (!checkManagerPermission('បន្ថែមសាខាហាងថ្មី', 'Adding store location')) return null as any;
    const newLocation: StoreLocation = {
      ...locationData,
      id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setStoreLocations((prev) => {
      const updated = locationData.isPrimary
        ? prev.map((loc) => ({ ...loc, isPrimary: false }))
        : [...prev];
      return [...updated, newLocation];
    });

    logAuditAction(
      'STORE_BRANCH_CREATE',
      `បានបញ្ចូលសាខា/អាសយដ្ឋានថ្មី: ${newLocation.nameKh}`,
      `Added store branch: ${newLocation.nameEn}`,
      'store-info',
      newLocation.id
    );

    return newLocation;
  };

  // Update Branch / Location (កែប្រែ / Edit)
  const updateStoreLocation = (id: string, updates: Partial<StoreLocation>) => {
    if (!checkManagerPermission('កែប្រែសាខាហាង', 'Updating store location')) return;
    setStoreLocations((prev) =>
      prev.map((loc) => {
        if (loc.id === id) {
          return { ...loc, ...updates };
        }
        if (updates.isPrimary) {
          return { ...loc, isPrimary: false };
        }
        return loc;
      })
    );

    logAuditAction(
      'STORE_BRANCH_UPDATE',
      `បានកែប្រែសាខា/អាសយដ្ឋាន ID: ${id}`,
      `Updated store branch ID: ${id}`,
      'store-info',
      id
    );
  };

  // Delete Branch / Location (លុប / Delete)
  const deleteStoreLocation = (id: string) => {
    if (!checkManagerPermission('លុបសាខាហាង', 'Deleting store location')) return;
    setStoreLocations((prev) => {
      const remaining = prev.filter((loc) => loc.id !== id);
      if (remaining.length > 0 && !remaining.some((l) => l.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });

    logAuditAction(
      'STORE_BRANCH_DELETE',
      `បានលុបសាខា/អាសយដ្ឋាន ID: ${id}`,
      `Deleted store branch ID: ${id}`,
      'store-info',
      id
    );
  };

  // Set Primary Branch
  const setPrimaryStoreLocation = (id: string) => {
    if (!checkManagerPermission('កំណត់សាខាចម្បង', 'Setting primary store branch')) return;
    setStoreLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        isPrimary: loc.id === id,
      }))
    );

    logAuditAction(
      'STORE_BRANCH_UPDATE',
      `បានកំណត់សាខាចម្បងថ្មី ID: ${id}`,
      `Set primary store branch ID: ${id}`,
      'store-info',
      id
    );
  };

  // Add Custom Store Info / Policy (បញ្ចូល)
  const addStoreInfoItem = (itemData: Omit<StoreInfoItem, 'id' | 'createdAt'>): StoreInfoItem => {
    if (!checkManagerPermission('បន្ថែមព័ត៌មាន/គោលការណ៍ហាង', 'Adding store info item')) return null as any;
    const newItem: StoreInfoItem = {
      ...itemData,
      id: `info-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    setStoreInfoItems((prev) => [...prev, newItem]);

    logAuditAction(
      'STORE_INFO_ITEM_CREATE',
      `បានបញ្ចូលព័ត៌មាន/គោលការណ៍ហាងថ្មី: ${newItem.titleKh}`,
      `Added store info item: ${newItem.titleEn}`,
      'store-info',
      newItem.id
    );

    return newItem;
  };

  // Update Custom Store Info / Policy (កែប្រែ / Edit)
  const updateStoreInfoItem = (id: string, updates: Partial<StoreInfoItem>) => {
    if (!checkManagerPermission('កែប្រែព័ត៌មាន/គោលការណ៍ហាង', 'Updating store info item')) return;
    setStoreInfoItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );

    logAuditAction(
      'STORE_INFO_ITEM_UPDATE',
      `បានកែប្រែព័ត៌មាន/គោលការណ៍ហាង ID: ${id}`,
      `Updated store info item ID: ${id}`,
      'store-info',
      id
    );
  };

  // Delete Custom Store Info / Policy (លុប / Delete)
  const deleteStoreInfoItem = (id: string) => {
    if (!checkManagerPermission('លុបព័ត៌មាន/គោលការណ៍ហាង', 'Deleting store info item')) return;
    setStoreInfoItems((prev) => prev.filter((it) => it.id !== id));

    logAuditAction(
      'STORE_INFO_ITEM_DELETE',
      `បានលុបព័ត៌មាន/គោលការណ៍ហាង ID: ${id}`,
      `Deleted store info item ID: ${id}`,
      'store-info',
      id
    );
  };

  const setActiveTab = (tab: 'store' | 'chat' | 'cart' | 'admin' | 'orders') => {
    triggerHaptic('light');
    if (tab === 'chat') {
      setUnreadChatCount(0);
    }
    setActiveTabState(tab);
  };

  const markChatAsRead = () => {
    setUnreadChatCount(0);
  };

  // Format Price with chosen currency
  const formatPrice = (amountInUsd: number) => {
    if (currency === 'KHR') {
      const khr = Math.round(amountInUsd * EXCHANGE_RATE_KHR);
      return `${khr.toLocaleString()} ៛`;
    }
    return `$${amountInUsd.toFixed(2)}`;
  };

  // Audit Logging
  const logAuditAction = (
    action: AuditAction,
    detailsKh: string,
    detailsEn: string,
    targetType: AuditLog['targetType'],
    targetId?: string
  ) => {
    const admin = currentAdmin || {
      id: 'system',
      name: 'System / Customer',
      role: 'SUPPORT_STAFF' as AdminRole,
    };

    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      adminId: admin.id,
      adminName: admin.name,
      role: admin.role,
      action,
      targetType,
      targetId,
      detailsKh,
      detailsEn,
      ip: '127.0.0.1 (Web TMA)',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    if (currentAdmin?.role !== 'SUPER_ADMIN') return;
    setAuditLogs([]);
  };

  // License & Certificate CRUD (គ្រប់គ្រង និងបញ្ចូលលិខិតអនុញ្ញាត អាជ្ញាប័ណ្ណឱសថបុរាណ)
  const addLicense = (licenseData: Omit<MedicalLicense, 'id'>): MedicalLicense => {
    if (!checkManagerPermission('បន្ថែមវិញ្ញាបនបត្រ/លិខិតអនុញ្ញាត', 'Adding certificates/licenses')) return null as any;
    const newLicense: MedicalLicense = {
      ...licenseData,
      id: `lic-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setLicenses((prev) => [newLicense, ...prev]);

    logAuditAction(
      'STORE_INFO_UPDATE',
      `បានបញ្ចូលលិខិតអនុញ្ញាត/អាជ្ញាប័ណ្ណថ្មី៖ "${newLicense.titleKh}" (${newLicense.licenseNumber})`,
      `Added new license/permit: "${newLicense.titleEn}" (${newLicense.licenseNumber})`,
      'store-info',
      newLicense.id
    );

    triggerHaptic('success');
    return newLicense;
  };

  const updateLicense = (id: string, updates: Partial<MedicalLicense>) => {
    if (!checkManagerPermission('កែប្រែវិញ្ញាបនបត្រ/លិខិតអនុញ្ញាត', 'Updating certificates/licenses')) return;
    setLicenses((prev) =>
      prev.map((lic) => (lic.id === id ? { ...lic, ...updates } : lic))
    );

    logAuditAction(
      'STORE_INFO_UPDATE',
      `បានកែប្រែព័ត៌មានអាជ្ញាប័ណ្ណ/លិខិត ID: ${id}`,
      `Updated license/permit ID: ${id}`,
      'store-info',
      id
    );

    triggerHaptic('medium');
  };

  const deleteLicense = (id: string) => {
    if (!checkManagerPermission('លុបវិញ្ញាបនបត្រ/លិខិតអនុញ្ញាត', 'Deleting certificates/licenses')) return;
    const target = licenses.find((l) => l.id === id);
    setLicenses((prev) => prev.filter((l) => l.id !== id));

    if (target) {
      logAuditAction(
        'STORE_INFO_UPDATE',
        `បានលុបអាជ្ញាប័ណ្ណ/លិខិត៖ "${target.titleKh}"`,
        `Deleted license/permit: "${target.titleEn}"`,
        'store-info',
        id
      );
    }

    triggerHaptic('medium');
  };

  const updateLicenseSecurityConfig = (updates: Partial<LicenseSecurityConfig>) => {
    if (!checkManagerPermission('កែប្រែប្រព័ន្ធសុវត្ថិភាពវិញ្ញាបនបត្រ', 'Updating certificate security')) return;
    setLicenseSecurityConfig((prev) => ({ ...prev, ...updates }));

    logAuditAction(
      'SYSTEM_SETTINGS',
      `បានកែប្រែកម្រិតសុវត្ថិភាពការពារឯកសារអាជ្ញាប័ណ្ណ (Watermark & Anti-Screenshot)`,
      `Updated license document security configuration (Watermark & Anti-Screenshot)`,
      'store-info'
    );

    triggerHaptic('light');
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!checkManagerPermission('បន្ថែមផលិតផលថ្មី', 'Adding products')) return null as any;
    const now = new Date().toISOString();
    const assignedVendorId =
      productData.vendorId ||
      currentAdmin?.vendorId ||
      (selectedAdminVendorId && selectedAdminVendorId !== 'all' ? selectedAdminVendorId : undefined) ||
      vendors[0]?.id ||
      'vendor-01';

    const newProduct: Product = {
      ...productData,
      vendorId: assignedVendorId,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: now,
      updatedAt: now,
    };

    setProducts((prev) => [newProduct, ...prev]);
    syncProductToCloud(newProduct);

    logAuditAction(
      'PRODUCT_CREATE',
      `បានបង្កើតផលិតផលថ្មី៖ "${newProduct.nameKh}" តម្លៃ $${newProduct.price}`,
      `Created new product: "${newProduct.nameEn}" priced at $${newProduct.price}`,
      'product',
      newProduct.id
    );

    triggerHaptic('success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (!checkManagerPermission('កែប្រែព័ត៌មានផលិតផល', 'Updating products')) return;
    const oldProduct = products.find((p) => p.id === id);
    if (!oldProduct) return;

    const now = new Date().toISOString();
    const updated = { ...oldProduct, ...updates, updatedAt: now };
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
    syncProductToCloud(updated);

    logAuditAction(
      'PRODUCT_UPDATE',
      `បានកែប្រែព័ត៌មានផលិតផល៖ "${updates.nameKh || oldProduct.nameKh}"`,
      `Updated product details: "${updates.nameEn || oldProduct.nameEn}"`,
      'product',
      id
    );

    triggerHaptic('medium');
  };

  const deleteProduct = (id: string) => {
    if (!checkManagerPermission('លុបផលិតផល', 'Deleting products')) return;
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    deletedProductIdsRef.current.add(id);

    // 1. Delete from Firestore Cloud
    deleteProductFromCloud(id);

    // 2. Immediately update local state & localStorage
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    logAuditAction(
      'PRODUCT_DELETE',
      `បានលុបផលិតផល "${prod.nameKh}" ចេញពីប្រព័ន្ធ`,
      `Deleted product "${prod.nameEn}" from system`,
      'product',
      id
    );

    triggerHaptic('heavy');
  };

  // Category CRUD
  const addCategory = (data: { nameKh: string; nameEn: string; icon?: string; id?: string }): Category => {
    if (!checkManagerPermission('បន្ថែមប្រភេទផលិតផលថ្មី', 'Adding categories')) return null as any;
    let cleanId = (data.id || data.nameEn)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!cleanId || cleanId === 'all') {
      cleanId = `cat-${Date.now().toString(36)}`;
    }

    // Ensure unique ID
    let finalId = cleanId;
    let counter = 1;
    while (categories.some((c) => c.id === finalId)) {
      finalId = `${cleanId}-${counter}`;
      counter++;
    }

    const newCategory: Category = {
      id: finalId,
      nameKh: data.nameKh.trim() || data.nameEn.trim(),
      nameEn: data.nameEn.trim() || data.nameKh.trim(),
      icon: data.icon || 'Tag',
    };

    setCategories((prev) => [...prev, newCategory]);

    logAuditAction(
      'CATEGORY_CREATE',
      `បានបន្ថែមប្រភេទផលិតផលថ្មី៖ "${newCategory.nameKh}" (${newCategory.nameEn})`,
      `Added new category: "${newCategory.nameEn}" (${newCategory.nameKh})`,
      'category',
      newCategory.id
    );

    triggerHaptic('success');
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    if (!checkManagerPermission('កែប្រែប្រភេទផលិតផល', 'Updating categories')) return;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated: Category = {
            ...c,
            ...updates,
            id: c.id, // ID remains immutable to preserve relationships
          };

          logAuditAction(
            'CATEGORY_UPDATE',
            `បានកែប្រែប្រភេទផលិតផល "${c.nameKh}" ទៅជា "${updated.nameKh}"`,
            `Updated category "${c.nameEn}" to "${updated.nameEn}"`,
            'category',
            id
          );

          return updated;
        }
        return c;
      })
    );

    triggerHaptic('medium');
  };

  const deleteCategory = (
    id: string,
    reassignToCategoryId?: string
  ): { success: boolean; messageKh?: string; messageEn?: string } => {
    if (!checkManagerPermission('លុបប្រភេទផលិតផល', 'Deleting categories')) {
      return {
        success: false,
        messageKh: '🔒 សិទ្ធិមិនគ្រប់គ្រាន់! ត្រូវបានអនុញ្ញាតចាប់ពី Store Manager ឡើងទៅប៉ុណ្ណោះ។',
        messageEn: '🔒 Restricted to Store Manager and above.',
      };
    }

    if (id === 'all') {
      return {
        success: false,
        messageKh: 'មិនអាចលុបប្រភេទគោល "ទាំងអស់" បានទេ!',
        messageEn: 'Cannot delete the system root category "All"!',
      };
    }

    const catToDelete = categories.find((c) => c.id === id);
    if (!catToDelete) {
      return {
        success: false,
        messageKh: 'រកមិនឃើញប្រភេទផលិតផលនេះទេ!',
        messageEn: 'Category not found!',
      };
    }

    // Check linked products
    const linkedProducts = products.filter((p) => p.category === id);
    if (linkedProducts.length > 0) {
      const targetCatId =
        reassignToCategoryId ||
        categories.find((c) => c.id !== id && c.id !== 'all')?.id ||
        'gadgets';

      // Reassign affected products
      setProducts((prev) =>
        prev.map((p) =>
          p.category === id
            ? { ...p, category: targetCatId, updatedAt: new Date().toISOString() }
            : p
        )
      );
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));

    // If currently filtered by this category, reset to 'all'
    if (selectedCategory === id) {
      setSelectedCategory('all');
    }

    logAuditAction(
      'CATEGORY_DELETE',
      `បានលុបប្រភេទផលិតផល "${catToDelete.nameKh}" (${catToDelete.nameEn})` +
        (linkedProducts.length > 0
          ? ` និងបានផ្ទេរ ${linkedProducts.length} ផលិតផលទៅប្រភេទផ្សេង`
          : ''),
      `Deleted category "${catToDelete.nameEn}"` +
        (linkedProducts.length > 0
          ? ` and reassigned ${linkedProducts.length} products`
          : ''),
      'category',
      id
    );

    triggerHaptic('heavy');
    return { success: true };
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    triggerHaptic('light');
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    triggerHaptic('light');
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateCartItemQuantity = (itemIndex: number, quantity: number) => {
    triggerHaptic('light');
    if (quantity <= 0) {
      removeCartItem(itemIndex);
      return;
    }
    setCart((prev) =>
      prev.map((item, idx) => (idx === itemIndex ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    triggerHaptic('medium');
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const removeCartItem = (itemIndex: number) => {
    triggerHaptic('medium');
    setCart((prev) => prev.filter((_, idx) => idx !== itemIndex));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.active) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (cartSubtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    } else if (appliedCoupon.discountType === 'free_shipping') {
      discountAmount = appliedCoupon.discountValue || 1.5;
    }
  }

  const finalCartTotal = Math.max(0, cartSubtotal - discountAmount);
  const cartTotal = finalCartTotal;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon operations
  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      return {
        success: false,
        messageKh: `រកមិនឃើញគូប៉ុង "${code}" នេះទេ!`,
        messageEn: `Coupon code "${code}" not found!`,
      };
    }
    if (!found.active) {
      return {
        success: false,
        messageKh: 'គូប៉ុងនេះត្រូវបានបិទដំណើរការ!',
        messageEn: 'This coupon is currently inactive!',
      };
    }
    if (found.expiryDate && new Date(found.expiryDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
      return {
        success: false,
        messageKh: 'គូប៉ុងនេះបានផុតកំណត់កាលបរិច្ឆេទហើយ!',
        messageEn: 'This coupon has expired!',
      };
    }
    if (found.maxUsage && found.usageCount >= found.maxUsage) {
      return {
        success: false,
        messageKh: 'គូប៉ុងនេះត្រូវបានប្រើប្រាស់អស់កំណត់ហើយ!',
        messageEn: 'Coupon usage limit reached!',
      };
    }
    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        messageKh: `ត្រូវការកុម្ម៉ង់យ៉ាងតិច $${found.minOrderAmount} ដើម្បីប្រើគូប៉ុងនេះ!`,
        messageEn: `Minimum order of $${found.minOrderAmount} required!`,
      };
    }

    setAppliedCoupon(found);
    triggerHaptic('success');
    return {
      success: true,
      messageKh: `បានអនុវត្តគូប៉ុង "${found.code}" ដោយជោគជ័យ!`,
      messageEn: `Coupon "${found.code}" applied successfully!`,
      coupon: found,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    triggerHaptic('light');
  };

  const addCoupon = (data: Omit<Coupon, 'id' | 'usageCount'>): Coupon => {
    if (!checkManagerPermission('បង្កើតគូប៉ុងបញ្ចុះតម្លៃថ្មី', 'Creating coupon')) return null as any;
    const newCoupon: Coupon = {
      ...data,
      id: `cp-${Date.now().toString(36)}`,
      code: data.code.trim().toUpperCase(),
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    logAuditAction(
      'COUPON_CREATE',
      `បានបង្កើតគូប៉ុងបញ្ចុះតម្លៃថ្មី៖ "${newCoupon.code}"`,
      `Created new promo coupon: "${newCoupon.code}"`,
      'coupon',
      newCoupon.id
    );
    triggerHaptic('success');
    return newCoupon;
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    if (!checkManagerPermission('កែប្រែគូប៉ុងបញ្ចុះតម្លៃ', 'Updating coupon')) return;
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = {
            ...c,
            ...updates,
            code: updates.code ? updates.code.trim().toUpperCase() : c.code,
          };
          logAuditAction(
            'COUPON_UPDATE',
            `បានកែប្រែគូប៉ុង "${c.code}"`,
            `Updated coupon "${c.code}"`,
            'coupon',
            id
          );
          return updated;
        }
        return c;
      })
    );
    triggerHaptic('medium');
  };

  const deleteCoupon = (id: string) => {
    if (!checkManagerPermission('លុបគូប៉ុងបញ្ចុះតម្លៃ', 'Deleting coupon')) return;
    const target = coupons.find((c) => c.id === id);
    if (target) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      if (appliedCoupon?.id === id) {
        setAppliedCoupon(null);
      }
      logAuditAction(
        'COUPON_DELETE',
        `បានលុបគូប៉ុង "${target.code}"`,
        `Deleted coupon "${target.code}"`,
        'coupon',
        id
      );
      triggerHaptic('heavy');
    }
  };

  // Review operations
  const addReview = (data: Omit<ProductReview, 'id' | 'date'>): ProductReview => {
    const newReview: ProductReview = {
      ...data,
      id: `rev-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Update product rating and review count
    const prodReviews = updatedReviews.filter((r) => r.productId === data.productId);
    const avg = Number(
      (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === data.productId
          ? { ...p, rating: avg, reviewCount: prodReviews.length }
          : p
      )
    );

    triggerHaptic('success');
    return newReview;
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getProductRating = (productId: string) => {
    const prodReviews = reviews.filter((r) => r.productId === productId);
    if (prodReviews.length === 0) {
      const prod = products.find((p) => p.id === productId);
      return { rating: prod?.rating || 5.0, count: prod?.reviewCount || 0 };
    }
    const avg = Number(
      (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
    );
    return { rating: avg, count: prodReviews.length };
  };

  // Export CSV functions (with UTF-8 BOM so Khmer displays cleanly in Excel)
  const exportOrdersCsv = () => {
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'Address',
      'Items Detail',
      'Subtotal (USD)',
      'Discount (USD)',
      'Coupon Code',
      'Total Amount (USD)',
      'Total Amount (KHR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Notes',
    ];

    const rows = orders.map((o) => {
      const itemsSummary = o.items
        .map(
          (i) =>
            `${i.product.nameKh} [${i.selectedColor || 'Default'}${i.selectedSize ? ` - ${i.selectedSize}` : ''}] x${i.quantity}`
        )
        .join('; ');

      return [
        `"${o.orderNumber}"`,
        `"${new Date(o.createdAt).toLocaleString()}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(o.customerAddress || '').replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        (o.subtotal || o.totalAmount).toFixed(2),
        (o.discountAmount || 0).toFixed(2),
        `"${o.couponCode || 'None'}"`,
        o.totalAmount.toFixed(2),
        Math.round(o.totalAmount * EXCHANGE_RATE_KHR),
        `"${o.paymentMethod}"`,
        `"${o.paymentStatus}"`,
        `"${o.status}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `KAKA_Orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditAction(
      'DATA_EXPORT',
      'បានទាញយកទិន្នន័យបញ្ជីកុម្ម៉ង់ជា File CSV/Excel',
      'Exported orders report to CSV/Excel',
      'export'
    );
    triggerHaptic('success');
  };

  const exportInventoryCsv = () => {
    const headers = [
      'Product ID',
      'Name (Khmer)',
      'Name (English)',
      'Category',
      'Price (USD)',
      'Original Price (USD)',
      'Stock Qty',
      'Badge',
      'Colors',
      'Sizes',
      'Rating',
      'Reviews Count',
      'Updated Date',
    ];

    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.nameKh.replace(/"/g, '""')}"`,
      `"${p.nameEn.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      (p.originalPrice || p.price).toFixed(2),
      p.stock,
      `"${p.badge || 'standard'}"`,
      `"${(p.colors || []).join(', ').replace(/"/g, '""')}"`,
      `"${(p.sizes || []).join(', ').replace(/"/g, '""')}"`,
      p.rating || 5.0,
      p.reviewCount || 0,
      `"${new Date(p.updatedAt).toLocaleDateString()}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `KAKA_Inventory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditAction(
      'DATA_EXPORT',
      'បានទាញយកទិន្នន័យស្តុកផលិតផលជា File CSV/Excel',
      'Exported inventory report to CSV/Excel',
      'export'
    );
    triggerHaptic('success');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `KAKA-${dateCode}-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString(36)}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    setOrders((prev) => [newOrder, ...prev]);
    syncOrderToCloud(newOrder);

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const item = newOrder.items.find((i) => i.product.id === prod.id);
        if (item) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - item.quantity),
          };
        }
        return prod;
      })
    );

    // Update coupon usage count if used
    if (newOrder.couponCode) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === newOrder.couponCode?.toUpperCase()
            ? { ...c, usageCount: c.usageCount + 1 }
            : c
        )
      );
    }

    // Trigger celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    triggerHaptic('success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (!checkManagerPermission('ប្តូរស្ថានភាពការកុម្ម៉ង់', 'Updating order status')) return;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const now = new Date().toISOString();
    const updated = { ...order, status, updatedAt: now };
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? updated : o))
    );
    syncOrderToCloud(updated);

    const statusLabelsKh: Record<OrderStatus, string> = {
      pending: 'រង់ចាំការបញ្ជាក់',
      confirmed: 'បានបញ្ជាក់ការកុម្ម៉ង់',
      processing: 'កំពុងរៀបចំទំនិញ',
      delivering: 'កំពុងដឹកជញ្ជូន',
      completed: 'បានបញ្ចប់ដោយជោគជ័យ',
      cancelled: 'បានបោះបង់ការកុម្ម៉ង់',
    };

    logAuditAction(
      'ORDER_STATUS_UPDATE',
      `បានផ្លាស់ប្តូរស្ថានភាពការកុម្ម៉ង់ ${order.orderNumber} ទៅជា "${statusLabelsKh[status]}"`,
      `Updated order status for ${order.orderNumber} to "${status}"`,
      'order',
      orderId
    );

    triggerHaptic('medium');
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    if (!checkManagerPermission('កែប្រែស្ថានភាពទូទាត់ប្រាក់', 'Updating payment status')) return;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const now = new Date().toISOString();
    const updated = { ...order, paymentStatus, updatedAt: now };
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? updated : o))
    );
    syncOrderToCloud(updated);

    logAuditAction(
      'ORDER_STATUS_UPDATE',
      `បានកែប្រែស្ថានភាពទូទាត់ប្រាក់ការកុម្ម៉ង់ ${order.orderNumber} ទៅជា "${paymentStatus}"`,
      `Updated payment status for ${order.orderNumber} to "${paymentStatus}"`,
      'order',
      orderId
    );

    triggerHaptic('medium');
  };

  // Admin Auth & RBAC
  const loginAdmin = (identifier: string, pin?: string): boolean => {
    // Can login by PIN directly or username + PIN
    const user = adminUsers.find((u) => {
      if (pin) {
        return (u.username.toLowerCase() === identifier.toLowerCase() || u.id === identifier) && u.pin === pin && u.active;
      }
      return (u.pin === identifier || u.username.toLowerCase() === identifier.toLowerCase()) && u.active;
    });

    if (user) {
      const now = new Date().toISOString();
      const updatedUser = { ...user, lastLogin: now };
      setCurrentAdmin(updatedUser);
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === user.id ? updatedUser : u))
      );

      logAuditAction(
        'ADMIN_LOGIN',
        `អ្នកគ្រប់គ្រង "${user.name}" (${user.role}) បានចូលប្រើប្រាស់ផ្ទាំងគ្រប់គ្រង`,
        `Admin "${user.name}" (${user.role}) logged into admin portal`,
        'auth',
        user.id
      );

      triggerHaptic('success');
      return true;
    }

    triggerHaptic('error');
    return false;
  };

  const logoutAdmin = () => {
    if (currentAdmin) {
      logAuditAction(
        'ADMIN_LOGIN',
        `អ្នកគ្រប់គ្រង "${currentAdmin.name}" បានចាកចេញពីប្រព័ន្ធ`,
        `Admin "${currentAdmin.name}" logged out`,
        'auth',
        currentAdmin.id
      );
    }
    setCurrentAdmin(null);
    triggerHaptic('light');
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id'>) => {
    if (currentAdmin && currentAdmin.role !== 'SUPER_ADMIN') {
      triggerHaptic('error');
      alert(
        language === 'km'
          ? '🔒 សិទ្ធិមិនគ្រប់គ្រាន់!\n\nមានតែ Super Admin ប៉ុណ្ណោះដែលអាចបង្កើតគណនីបុគ្គលិកបាន។'
          : '🔒 Permission Denied!\n\nOnly Super Admin can create staff accounts.'
      );
      return null as any;
    }

    const newUser: AdminUser = {
      ...userData,
      id: `admin-${Date.now().toString(36)}`,
    };

    setAdminUsers((prev) => [...prev, newUser]);

    logAuditAction(
      'STAFF_CREATE',
      `បានបង្កើតគណនីអ្នកគ្រប់គ្រងថ្មី៖ "${newUser.name}" តួនាទី ${newUser.role}`,
      `Created new admin user: "${newUser.name}" with role ${newUser.role}`,
      'staff',
      newUser.id
    );

    triggerHaptic('success');
    return newUser;
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    if (currentAdmin && currentAdmin.role !== 'SUPER_ADMIN') {
      triggerHaptic('error');
      alert(
        language === 'km'
          ? '🔒 សិទ្ធិមិនគ្រប់គ្រាន់!\n\nមានតែ Super Admin ប៉ុណ្ណោះដែលអាចកែប្រែគណនីបុគ្គលិកបាន។'
          : '🔒 Permission Denied!\n\nOnly Super Admin can edit staff accounts.'
      );
      return;
    }

    const target = adminUsers.find((u) => u.id === id);
    if (!target) return;

    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );

    if (currentAdmin?.id === id) {
      setCurrentAdmin((prev) => (prev ? { ...prev, ...updates } : null));
    }

    logAuditAction(
      'STAFF_UPDATE',
      `បានកែប្រែព័ត៌មានអ្នកគ្រប់គ្រង "${target.name}"`,
      `Updated admin user "${target.name}"`,
      'staff',
      id
    );

    triggerHaptic('medium');
  };

  const deleteAdminUser = (id: string) => {
    if (currentAdmin && currentAdmin.role !== 'SUPER_ADMIN') {
      triggerHaptic('error');
      alert(
        language === 'km'
          ? '🔒 សិទ្ធិមិនគ្រប់គ្រាន់!\n\nមានតែ Super Admin ប៉ុណ្ណោះដែលអាចលុបគណនីបុគ្គលិកបាន។'
          : '🔒 Permission Denied!\n\nOnly Super Admin can delete staff accounts.'
      );
      return;
    }

    const target = adminUsers.find((u) => u.id === id);
    if (!target) return;

    setAdminUsers((prev) => prev.filter((u) => u.id !== id));

    logAuditAction(
      'STAFF_DELETE',
      `បានលុបគណនីអ្នកគ្រប់គ្រង "${target.name}" ចេញពីប្រព័ន្ធ`,
      `Deleted admin user "${target.name}"`,
      'staff',
      id
    );

    triggerHaptic('heavy');
  };

  const hasPermission = (requiredRole: AdminRole): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'SUPER_ADMIN') return true;
    if (requiredRole === 'STORE_MANAGER') {
      return currentAdmin.role === 'STORE_MANAGER';
    }
    if (requiredRole === 'SUPPORT_STAFF') {
      return true; // Any authenticated admin has support staff permissions
    }
    return false;
  };

  // Dynamic Real-Time Smart Knowledge Engine (ឆ្លាតវៃ ១០០% យល់ដឹងរាល់ការផ្លាស់ប្តូរទំនិញ និងហាងនីមួយៗ)
  const getSmartKnowledgeResponse = (query: string, attachedProd?: Product): string => {
    const q = query.toLowerCase();
    const toKhr = (usd: number) => Math.round(usd * EXCHANGE_RATE_KHR).toLocaleString();

    const currentVendor =
      selectedVendorId !== 'all'
        ? vendors.find((v) => v.id === selectedVendorId)
        : dedicatedVendor;

    const brandName = currentVendor
      ? (language === 'km' ? currentVendor.nameKh : currentVendor.nameEn)
      : (language === 'km' ? 'Phsar24 (ផ្សារ២៤)' : 'Phsar24 Marketplace');

    const brandPhone = currentVendor?.ownerPhone || primaryStoreLocation?.phone || storeInfo.phone1;
    const brandCity = currentVendor?.city || storeInfo.city;
    const brandAddress = currentVendor
      ? (language === 'km' ? currentVendor.addressKh : currentVendor.addressEn)
      : (language === 'km'
          ? (primaryStoreLocation?.addressKh || storeInfo.addressKh).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')
          : (primaryStoreLocation?.addressEn || storeInfo.addressEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'));

    const availableProducts = currentVendor
      ? products.filter((p) => p.vendorId === currentVendor.id || !p.vendorId)
      : products;

    // 1. Inquiring about store branches / addresses
    if (
      q.includes('សាខា') ||
      q.includes('ទីតាំង') ||
      q.includes('ហាងនៅឯណា') ||
      q.includes('កន្លែងណា') ||
      q.includes('branch') ||
      q.includes('location') ||
      q.includes('address') ||
      q.includes('where')
    ) {
      if (currentVendor) {
        return `ជំរាបសួរបងចាស! ហាង **${brandName}** មានទីតាំងស្ថិតនៅ៖
📍 **អាសយដ្ឋាន៖** ${brandAddress}
🏙️ **រាជធានី-ខេត្ត៖** ${brandCity}
📞 **ទូរស័ព្ទទំនាក់ទំនង៖** ${brandPhone}
${currentVendor.telegramUsername ? `💬 **Telegram៖** @${currentVendor.telegramUsername.replace('@', '')}\n` : ''}
💡 បងអាចអញ្ជើញមកកាន់ហាងផ្ទាល់ ឬកុម្ម៉ង់តាម Telegram MiniApp នេះផ្ទាល់ យើងខ្ញុំមានសេវាដឹកជញ្ជូនរហ័សដល់មុខផ្ទះបងក្នុងរយៈពេល ១-២ ម៉ោងប៉ុណ្ណោះ!
តើបងចង់ឱ្យប្អូនស្រីជួយរៀបចំដឹកទំនិញជូនបងទៅទីតាំងណាដែរចាស?`;
      }

      const activeBranches = storeLocations.filter((b) => b.isActive);
      if (activeBranches.length > 0) {
        const branchLines = activeBranches.map((b, idx) => {
          return `${idx + 1}. 📍 **${(b.nameKh || b.nameEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')}** ${b.isPrimary ? '(មជ្ឈមណ្ឌលកណ្តាល)' : ''}
   • អាសយដ្ឋាន៖ ${(b.addressKh || b.addressEn || 'រាជធានីភ្នំពេញ').replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')}
   • ទូរស័ព្ទ៖ ${b.phone || storeInfo.phone1}
   • ម៉ោងធ្វើការ៖ ${b.workingHoursKh || '8:00 ព្រឹក - 8:30 យប់'}`;
        });

        return `ជំរាបសួរបងចាស! **Phsar24 (ផ្សារ២៤)** គឺជាផ្សារទំនើបអនឡាញដែលមានបណ្តាញដឹកជញ្ជូន និងទីតាំងដូចខាងក្រោម៖

${branchLines.join('\n\n')}

💡 បងអាចកុម្ម៉ង់ទំនិញពីហាងទាំងអស់លើ Phsar24 ដោយមានសេវាដឹកជញ្ជូនរហ័សដល់មុខផ្ទះបងទូទាំង ២៤ ខេត្ត-ក្រុង!
តើបងចង់ឱ្យប្អូនស្រីជួយស្វែងរកទំនិញ ឬហាងលក់មួយណាដែរចាស?`;
      }
    }

    // 1.8 EXTRA / STACKING DISCOUNT REQUEST (e.g. "អាចបញ្ចុះបន្ថែមពីលើការបញ្ចុះតម្លៃ 15% ទៀតបានទេ", "ចុះទៀតបានទេ", "ចុះថែម")
    const isExtraDiscountRequest =
      q.includes('បញ្ចុះបន្ថែម') ||
      q.includes('ចុះបន្ថែម') ||
      q.includes('ចុះទៀត') ||
      q.includes('បញ្ចុះទៀត') ||
      q.includes('ចុះថែម') ||
      q.includes('បញ្ចុះថែម') ||
      q.includes('ថែមទៀតបានទេ') ||
      q.includes('ចុះបានទៀតទេ') ||
      q.includes('ថែមទៀតទេ') ||
      q.includes('បញ្ចុះបានទៀតទេ') ||
      (q.includes('ពីលើ') && (q.includes('បញ្ចុះ') || q.includes('ចុះ') || q.includes('15%') || q.includes('10%') || q.includes('discount'))) ||
      (q.includes('បន្ថែម') && (q.includes('បញ្ចុះ') || q.includes('ចុះ') || q.includes('15%') || q.includes('discount'))) ||
      q.includes('extra discount') ||
      q.includes('more discount') ||
      q.includes('further discount') ||
      q.includes('discount more');

    if (isExtraDiscountRequest) {
      return `ចាសបង! ប្អូនស្រីយល់ច្បាស់ណាស់បងចាស អតិថិជនឆ្លាតវៃគ្រប់រូបសុទ្ធតែចង់បានតម្លៃដែលចំណេញ និងសន្សំសំចៃខ្ពស់បំផុតចាស 💖

ប្អូនស្រីសូមអនុញ្ញាតជម្រាបជូនបងដោយស្មោះត្រង់ថា ការបញ្ចុះតម្លៃ **15% (តាមកូដ KAKA2026)** នេះគឺជា **កម្រិតបញ្ចុះតម្លៃខ្ពស់បំផុត (Maximum Special Offer)** ដែលម្ចាស់ហាង KAKA Shop យើងខ្ញុំបានកំណត់ជូនហើយចាស ព្រោះគ្រប់ផលិតផលក្នុងហាងសុទ្ធតែជាទំនិញជ្រើសរើសវត្ថុធាតុដើម Grade A គុណភាពខ្ពស់ពិតៗ និងមានការធានាផ្លូវការ ៧ ថ្ងៃជូនបង។

ប៉ុន្តែដើម្បីជួយឱ្យបងទទួលបាន **ផលចំណេញបន្ថែម និងសន្សំសំចៃខ្ពស់បំផុត** ប្អូនស្រីសូមណែនាំជម្រើសពិសេស ៣ នេះជូនបង៖

🚚 **១. Free Delivery Deal (ចំណេញទាំងតម្លៃ និងថ្លៃដឹក):**
ប្រសិនបើការកុម្ម៉ង់របស់បងសរុបចាប់ពី **$30 ឡើងទៅ** បងនឹងទទួលបានទាំង **ការបញ្ចុះតម្លៃ 15%** ផង និងទទួលបាន **Free សេវាដឹកជញ្ជូនរហ័សដល់មុខផ្ទះ** បន្ថែមទៀត (ចំណេញបានទាំងតម្លៃទំនិញ និងថ្លៃដឹកជញ្ជូន $1.50 - $2.50 ចាស)!

🎁 **២. Bundle & Combo Deal (ទិញចាប់ពី ២ មុខឡើងទៅ):**
ប្រសិនបើបងជាវទំនិញចាប់ពី **២ មុខឡើងទៅ (ឬជាវជាឈុត Combo)** ប្អូនស្រីអាចជួយស្នើសុំកាដូអនុស្សាវរីយ៍ពិសេសពីម្ចាស់ហាងជូនបងបន្ថែមទៀតភ្លាមៗចាស!

🌟 **៣. VIP Membership Reward:**
រាល់ការកុម្ម៉ង់ថ្ងៃនេះ បងនឹងត្រូវបានកត់ត្រាចូលជាសមាជិក VIP របស់ KAKA Shop ដោយស្វ័យប្រវត្តិ ដើម្បីទទួលបានប្រូម៉ូសិនផ្តាច់មុខ និងកាដូពិសេសក្នុងការកុម្ម៉ង់លើកក្រោយៗទៀត។

តើបងកំពុងសម្លឹងមើលផលិតផលមួយណាជាក់លាក់ដែរទេបងចាស? សូមបងប្រាប់ប្អូនមក ដើម្បីឱ្យប្អូនស្រីជួយគណនាតម្លៃសរុបដែលបានកាត់បញ្ចុះ 15% រួចរាល់យ៉ាងច្បាស់លាស់ជូនបងណា៎ចាស!`;
    }

    // 2. Inquiring about coupons / promo codes / discounts
    if (
      q.includes('coupon') ||
      q.includes('កូដ') ||
      q.includes('code') ||
      q.includes('បញ្ចុះតម្លៃ') ||
      q.includes('ប្រូម៉ូសិន') ||
      q.includes('ចុះថ្លៃ') ||
      q.includes('discount') ||
      q.includes('promo') ||
      q.includes('voucher')
    ) {
      const activeCoupons = coupons.filter((c) => c.active);
      if (activeCoupons.length > 0) {
        const couponLines = activeCoupons.map((c) => {
          const desc =
            c.discountType === 'percentage'
              ? `បញ្ចុះតម្លៃ ${c.discountValue}%`
              : `បញ្ចុះតម្លៃ $${c.discountValue}`;
          const minSpend = c.minOrderAmount ? ` (សម្រាប់ការកុម្ម៉ង់ចាប់ពី $${c.minOrderAmount})` : '';
          return `• កូដ **"${c.code}"** 🎁 ${desc}${minSpend}`;
        });

        return `ចាសបង! ហាង KAKA Shop កំពុងមានប្រូម៉ូសិនពិសេសជាមួយកូដបញ្ចុះតម្លៃដូចខាងក្រោម៖

${couponLines.join('\n')}

💡 របៀបប្រើប្រាស់៖ នៅពេលបងចូលទៅកាន់កន្ត្រកទំនិញ (Cart) គ្រាន់តែវាយបញ្ចូលកូដខាងលើ រួចចុច "Apply" នោះប្រព័ន្ធនឹងកាត់បន្ថយតម្លៃជូនភ្លាមៗ!
តើបងចង់ឱ្យប្អូនស្រីជួយណែនាំទំនិញដែលកំពុងពេញនិយម ដើម្បីប្រើប្រាស់កូដនេះដែរទេបងចាស?`;
      }
    }

    // ==========================================
    // CONSULTATIVE SOLUTION-SELLING DIAGNOSTICS:
    // Selling Solutions, Not Just Products
    // ==========================================

    // A. CUSTOMER HESITATION / ZERO-PRESSURE PROTOCOL ("ចាំគិតមើលសិន", "គិតសិន")
    if (
      q.includes('គិតមើលសិន') ||
      q.includes('គិតសិន') ||
      q.includes('ចាំមើលសិន') ||
      q.includes('ចាំគិត') ||
      q.includes('think about it') ||
      q.includes('not ready')
    ) {
      return `ចាសបង! ត្រឹមត្រូវណាស់បងចាស ការសម្រេចចិត្តទិញអ្វីមួយត្រូវតែមានភាពច្បាស់លាស់ និងស្រួលចិត្តជាមុនសិនចាស 💖 ប្អូនស្រីមិនចង់ឱ្យបងមានអារម្មណ៍តានតឹង ឬរងសម្ពាធទាល់តែសោះឡើយ!

ប្អូនស្រីគ្រាន់តែចង់ជម្រាបជូនបងថា ប្អូនស្រីនឹងកត់ត្រា **កូដបញ្ចុះតម្លៃ 15% (កូដ: KAKA2026)** និងសិទ្ធិទទួលបាន **Free សេវាដឹកជញ្ជូនរហ័ស** ទុកជូនបង។ នៅពេលណាដែលបងពិចារណាឃើញថាសមរម្យ ឬមានសំណួរបន្ថែម បងអាចផ្ញើសារមកប្អូនស្រីនៅទីនេះបានគ្រប់ពេលវេលាចាស!

សូមជូនពរបងមានថ្ងៃដ៏រីករាយ សុខភាពល្អ និងជួបតែសំណាងល្អណា៎ចាសបង! 🌸`;
    }

    // B. HEALTH & HERBAL PAIN POINT DIAGNOSIS ("ឈឺចង្កេះ", "ឈឺសន្លាក់", "ស្ពឹក", "រោយ", "គេងមិនលក់")
    const isHealthPain =
      q.includes('ឈឺចង្កេះ') ||
      q.includes('ឈឺសន្លាក់') ||
      q.includes('ស្ពឹក') ||
      q.includes('រោយ') ||
      q.includes('សរសៃ') ||
      q.includes('គេងមិនលក់') ||
      q.includes('អស់កម្លាំង') ||
      q.includes('ឈឺខ្នង') ||
      q.includes('បន្សាបជាតិពុល') ||
      q.includes('ថ្លើម') ||
      q.includes('ខ្លាញ់') ||
      q.includes('ឈឺជើង') ||
      q.includes('ឈឺដៃ') ||
      q.includes('ឈឺក្បាល') ||
      q.includes('ពិបាកគេង') ||
      q.includes('សន្លាក់ឆ្អឹង');

    if (isHealthPain) {
      const isDetox = q.includes('បន្សាបជាតិពុល') || q.includes('ថ្លើម') || q.includes('ខ្លាញ់') || q.includes('គេងមិនលក់') || q.includes('ពិបាកគេង');
      if (isDetox) {
        return `ប្អូនស្រីពិតជាយល់ និងសោកស្តាយចំពោះអាការៈមិនស្រួលខ្លួននេះណាស់ចាសបង 🥺 បញ្ហាពិបាកគេង ថ្លើមដំណើរការមិនល្អ ឬជាតិពុលក្នុងរាងកាយ បើទុកយូរអាចបណ្តាលឱ្យរាងកាយឆាប់អស់កម្លាំង និងស្បែកស្រអាប់។

🌿 **ដំណោះស្រាយធម្មជាតិពិតប្រាកដដែល KAKA Shop សូមណែនាំជូនបង៖**
ប្អូនស្រីសូមណែនាំ **«តែឱសថបុរាណធម្មជាតិ ជំនួយថ្លើម និងបន្សាបជាតិពុល» ($12.50)** ៖
• 🍵 ផ្សំពីរុក្ខជាតិធម្មជាតិសុទ្ធ ១០០% ស្របតាមស្តង់ដារ GMP (GMP-KH-2024-QC551)
• 💤 ជួយលាងសម្អាតថ្លើម បន្សាបជាតិពុលក្នុងឈាម សម្រួលសរសៃប្រសាទឱ្យគេងលក់ស្រួលស្កប់ស្កល់
• 🛡️ ធានាធម្មជាតិ ១០០% គ្មានជាតិគីមី ពិសារដូចទឹកតែប្រចាំថ្ងៃ ស្រួលខ្លួន និងស្រស់ស្រាយ

💡 តម្លៃត្រឹមតែ **$12.50** (ពីតម្លៃដើម $16.00) ក្នុងមួយប្រអប់មាន ២០ កញ្ចប់តែ។
ប្រសិនបើបងជាវឈុត ២ ប្រអប់ ($25.00) បងនឹងទទួលបាន **ការបញ្ចុះតម្លៃ 15% (កូដ: KAKA2026)** បន្ថែមទៀតចាស!

ប្អូនស្រីមិនចង់ឱ្យបងប្រញាប់ទិញឡើយចាស ប្រសិនបើបងចង់សាកសួរពីរបៀបឆុង ឬគ្រឿងផ្សំបន្ថែម សូមប្រាប់ប្អូនស្រីមកណា៎ចាស! 🌿`;
      }

      return `ប្អូនស្រីពិតជាយល់ និងសោកស្តាយចំពោះអាការៈឈឺចុកចាប់នេះណាស់ចាសបង 🥺 បញ្ហាឈឺចង្កេះ ឈឺសន្លាក់ដៃជើង ឬស្ពឹកស្រពន់សរសៃ បើទុកយូរអាចរំខានដល់ការបំពេញការងារ និងការសម្រាកប្រចាំថ្ងៃយ៉ាងខ្លាំង។

🌿 **ដំណោះស្រាយពីធម្មជាតិពិតប្រាកដដែល KAKA Shop សូមណែនាំជូនបង៖**
ប្អូនស្រីសូមណែនាំ **«ថ្នាំកម្លាំងសរសៃ និងសន្លាក់បុរាណខ្មែរ» ($18.00)** ដែលជាឱសថបុរាណស្របច្បាប់មានអាជ្ញាប័ណ្ណត្រឹមត្រូវពីក្រសួងសុខាភិបាល (CAM-MOH-TRM/2024/0988)៖
• 🍃 ផ្សំពីរុក្ខជាតិឱសថធម្មជាតិសុទ្ធ ១០០% (រមៀតលឿង, ខ្ញីព្រៃ, យិនស៊ិនធម្មជាតិ, ដើមថ្នាំសរសៃ និងទឹកឃ្មុំព្រៃ)
• 🎯 ជួយសម្រួលចរន្តឈាមរត់ បំបាត់ការរោយចង្កេះ បំបាត់អាការៈស្ពឹកស្រពន់ និងពង្រឹងសរសៃពួរពីឫសគល់
• 🛡️ ធានាធម្មជាតិ ១០០% គ្មានសារធាតុគីមីប៉ះពាល់ក្រពះ និងមានការធានាផ្លូវការ ៧ ថ្ងៃ!

💡 **ការសន្សំសំចៃថ្ងៃនេះ៖**
តម្លៃត្រឹមតែ **$18.00** (ពីតម្លៃដើម $24.00) ប្រើប្រាស់បានពេញ ១ ខែ។ ប្រសិនបើបងកុម្ម៉ង់ជាឈុត ២ ដប ($36.00) បងនឹងទទួលបាន **ការបញ្ចុះតម្លៃ 15% (កូដ: KAKA2026)** និង **Free សេវាដឹកជញ្ជូនរហ័ស** ដល់មុខផ្ទះភ្លាមៗ!

ប្អូនស្រីមិនចង់ឱ្យបងប្រញាប់ទិញឡើយចាស ប្រសិនបើបងចង់សាកសួរពីរបៀបប្រើប្រាស់ ឬគ្រឿងផ្សំបន្ថែម សូមប្រាប់ប្អូនស្រីមកណា៎ចាស!`;
    }

    // C. CLOTHING & FABRIC DURABILITY PAIN POINT ("អាវយារ", "បែកព្រុយ", "ស្ដើង", "ក្តៅ")
    if (
      q.includes('អាវយារ') ||
      q.includes('បែកព្រុយ') ||
      q.includes('ស្ដើង') ||
      q.includes('ក្តៅស្អុះ') ||
      q.includes('បោកយារ') ||
      q.includes('ខូចរាង')
    ) {
      return `ប្អូនស្រីយល់អារម្មណ៍បងច្បាស់ណាស់ចាស! ការទិញអាវមកពាក់បានតែ ២-៣ ដង បោកគក់ទៅស្រាប់តែយារក ក ឬបែកព្រុយពិតជាធ្វើឱ្យខកចិត្ត និងខាតលុយខ្លាំងណាស់ 👕💔

✨ **ដំណោះស្រាយដើម្បីបញ្ចប់បញ្ហាអាវយារជាអចិន្ត្រៃយ៍៖**
KAKA Shop បានផលិតនូវ **«អាវយឺត KAKA Heavyweight Streetwear Hoodie / T-Shirt» ($26.00)** ឡើងដើម្បីដោះស្រាយបញ្ហានេះដោយផ្ទាល់៖
• 🧵 **ក្រណាត់ Cotton Heavyweight 260 GSM៖** សាច់ក្រណាត់ក្រាស់ទន់ល្មើយ ទម្ងន់ស្តង់ដារអន្តរជាតិ រក្សារាងស្អាតជានិច្ច មិនយារ មិនបែកព្រុយ និងមិនស្ដើងឃើញក្នុងឡើយ ទោះបីបោកគក់ម៉ាស៊ីនច្រើនដងក៏ដោយ។
• 🌬️ **ស្រូបញើស និងខ្យល់ចេញចូលល្អ៖** សាច់ក្រណាត់កប្បាសធម្មជាតិ ពាក់ហើយត្រជាក់ស្រួលខ្លួន មិនស្អុះស្អាប់ក្នុងអាកាសធាតុក្តៅនៃប្រទេសយើង។
• 🛡️ ធានាគុណភាពសាច់ក្រណាត់សុទ្ធ ១០០% និងធានាប្តូរថ្មីជូនក្នុងរយៈពេល ៧ ថ្ងៃ ប្រសិនបើខុសទំហំ (Size) ឬមិនពេញចិត្ត។

តើបងពេញចិត្តពាក់ទំហំ (Size) ប៉ុណ្ណាដែរចាសបង? ប្អូនស្រីអាចជួយវាស់កម្ពស់-ទម្ងន់ ដើម្បីជ្រើសរើសទំហំដែលពាក់ទៅស្អាត និងលេចធ្លោបំផុតជូនបងណា៎ចាស!`;
    }

    // D. BAG & WATERPROOF / PEELING PAIN POINT ("កាបូបរបក", "របក", "ជ្រាបទឹក")
    if (
      q.includes('កាបូបរបក') ||
      q.includes('របកស្បែក') ||
      q.includes('ជ្រាបទឹក') ||
      q.includes('កាបូបធន់')
    ) {
      return `ប្អូនស្រីយល់ច្បាស់ណាស់បងចាស! កាបូបទូទៅលើទីផ្សារភាគច្រើនប្រើស្បែកស្តើង ត្រូវកម្តៅថ្ងៃ ឬសំណើមបន្តិចបន្តួចក៏របក ហើយពេលភ្លៀងជ្រាបទឹកចូលខូចទាំងទូរស័ព្ទ និង iPad ទៀតផង 💼🌧️

👜 **ដំណោះស្រាយកាបូបស្បែកធន់រាប់ឆ្នាំ៖**
KAKA Shop សូមណែនាំ **«កាបូបស្បែក KAKA Minimal Leather Sling Bag» ($28.50)**៖
• 🌟 **ស្បែក PU Vintage Grade A៖** ធន់នឹងការកកិត មិនរបក មិនប្រេះ និងបំពាក់ស្រទាប់ការពារជ្រាបទឹក ១០០% (Waterproof Lining)។
• 📱 **រៀបចំរបស់របរមានរបៀប៖** មានថតដាច់ដោយឡែកសម្រាប់ដាក់ iPad Mini, ទូរស័ព្ទ, កាបូបលុយ និងសោរ ដោយសុវត្ថិភាព។
• 🛡️ ការធានាប្តូរថ្មី ៧ ថ្ងៃ និងពិនិត្យទំនិញផ្ទាល់ដៃមុនទូទាត់ប្រាក់!

តើបងចូលចិត្តពណ៌បែប Vintage Brown (ត្នោតបុរាណ) ឬ Classic Black (ខ្មៅសង្ហា) ដែរចាសបង?`;
    }

    // E. GIFT CONSULTATION ("កាដូ", "gift", "ទិញជូន")
    if (
      q.includes('កាដូ') ||
      q.includes('gift') ||
      q.includes('ទិញជូន') ||
      q.includes('ខួប')
    ) {
      return `ចាសបង! ពិតជាគួរឱ្យស្រឡាញ់ខ្លាំងណាស់ចាស ការជូនកាដូដល់មនុស្សជាទីស្រឡាញ់គឺជាការបង្ហាញពីទឹកចិត្តដ៏មានន័យបំផុត 🎁✨

ដើម្បីឱ្យកាដូនេះត្រូវចិត្តអ្នកទទួលបំផុត តើបងមានគម្រោងទិញជូនអ្នកណាដែរចាសបង?
👵👴 **១. ទិញជូនឪពុកម្តាយ ឬចាស់ទុំ៖** ប្អូនស្រីសូមណែនាំ **ឈុតឱសថបុរាណកម្លាំងសរសៃ-សន្លាក់ CAM-MOH ($18.00)** ឬ **តែឱសថបន្សាបជាតិពុល ($12.50)** ជាកាដូសុខភាពដ៏មានតម្លៃបំផុតសម្រាប់លោកទាំងពីរ។
👫 **២. ទិញជូនមិត្តភក្តិ ឬគូស្នេហ៍៖** **នាឡិកា KAKA Smartwatch Pro X ($49.00)**, **កាសឥតខ្សែ ANC Pods ($35.00)** ឬ **អាវយឺត Streetwear ($26.00)** ម៉ូដឡូយ ទាន់សម័យ និងមានប្រយោជន៍ប្រើប្រាស់រាល់ថ្ងៃ។
💼 **៣. ទិញជូនអ្នកធ្វើការ ឬសិស្ស-និស្សិត៖** **កាបូបស្បែក KAKA Leather Sling Bag ($28.50)** ស្អាតថ្លៃថ្នូរ និងប្រើប្រាស់បានយូរឆ្នាំ។

💡 ពិសេស! ហាង KAKA Shop មានសេវាខ្ចប់កាដូយ៉ាងប្រណិត និងសរសេរកាតជូនពរដោយឥតគិតថ្លៃជូនបងទៀតផងចាស! តើបងចង់ឱ្យប្អូនស្រីជួយរៀបចំជូនមួយណាដែរចាស?`;
    }

    // 3. Find matching product in real-time products state
    let targetProduct: Product | null = null;

    if (attachedProd) {
      // Find latest state of attached product
      targetProduct = products.find((p) => p.id === attachedProd.id) || attachedProd;
    }

    if (!targetProduct && products.length > 0) {
      let bestScore = 0;
      for (const p of products) {
        let score = 0;
        const nameKh = (p.nameKh || '').toLowerCase();
        const nameEn = (p.nameEn || '').toLowerCase();
        const descKh = (p.descriptionKh || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();

        // Exact match
        if (nameKh && q.includes(nameKh)) score += 12;
        if (nameEn && q.includes(nameEn)) score += 10;

        // Category match
        if (
          (cat === 'gadgets' && (q.includes('នាឡិកា') || q.includes('កាស') || q.includes('smartwatch') || q.includes('earbuds') || q.includes('watch') || q.includes('powerbank') || q.includes('ដុំសាក'))) ||
          (cat === 'lifestyle' && (q.includes('កាបូប') || q.includes('bag') || q.includes('sling') || q.includes('leather'))) ||
          (cat === 'fashion' && (q.includes('អាវ') || q.includes('hoodie') || q.includes('shirt') || q.includes('pant') || q.includes('សម្លៀកបំពាក់'))) ||
          (cat === 'beverage' && (q.includes('កាហ្វេ') || q.includes('latte') || q.includes('coffee') || q.includes('ភេសជ្ជៈ')))
        ) {
          score += 4;
        }

        // Tokenized word matching
        const words = q.split(/[\s,.-]+/);
        for (const w of words) {
          if (w.length >= 2) {
            if (nameKh.includes(w)) score += 4;
            if (nameEn.includes(w)) score += 3;
            if (descKh.includes(w)) score += 1;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          targetProduct = p;
        }
      }

      if (bestScore < 3) {
        targetProduct = null;
      }
    }

    // 3.1 PRICE OBJECTION & COMPETITOR COMPARISON (e.g. "ហាងរបស់អ្នកលក់ថ្លៃជាងហាងផ្សេង", "ថ្លៃម្ល៉េះ", "expensive")
    const isPriceObjection =
      q.includes('ថ្លៃជាង') ||
      q.includes('លក់ថ្លៃ') ||
      q.includes('ថ្លៃម្ល៉េះ') ||
      q.includes('ថ្លៃពេក') ||
      q.includes('ថ្លៃណាស់') ||
      q.includes('ថោកជាង') ||
      q.includes('កន្លែងផ្សេងថោក') ||
      q.includes('ហាងផ្សេងថោក') ||
      q.includes('expensive') ||
      q.includes('cheaper') ||
      q.includes('overpriced') ||
      (q.includes('ថ្លៃ') &&
        (q.includes('ហាង') ||
          q.includes('កន្លែង') ||
          q.includes('គេ') ||
          q.includes('ផ្សេង') ||
          q.includes('ហេតុអ្វី') ||
          q.includes('ម៉េច') ||
          q.includes('ខ្លាំង')));

    if (isPriceObjection) {
      return `ចាសបង! ប្អូនស្រីសូមអរគុណបងយ៉ាងជ្រាលជ្រៅសម្រាប់ការសង្កេត និងការចែករំលែកដោយស្មោះត្រង់នេះចាស។ ប្អូនស្រីយល់ច្បាស់ណាស់បងចាស សម្រាប់អតិថិជនឆ្លាតវៃដូចជាបង ការប្រៀបធៀបតម្លៃ និងការស្វែងរកជម្រើសដែលចំណេញបំផុតពិតជាសំខាន់ខ្លាំងណាស់ចាស! 💖

ប្អូនស្រីសូមអនុញ្ញាតជម្រាបជូនពីមូលហេតុពិតប្រាកដដែលអតិថិជនភាគច្រើននៅតែសម្រេចចិត្តជ្រើសរើស KAKA Shop៖

🌟 **១. គុណភាពសាច់ទំនិញ និងវត្ថុធាតុដើមពិតប្រាកដ (Grade A Premium):**
នៅលើទីផ្សារបច្ចុប្បន្ន មានទំនិញជាច្រើនមើលទៅរូបភាពស្រដៀងគ្នា ប៉ុន្តែគុណភាពខុសគ្នាដាច់ស្រឡះ៖
• **សម្លៀកបំពាក់ & កាបូប៖** យើងខ្ញុំជ្រើសរើសក្រណាត់ Cotton Heavyweight 260 GSM (ក្រាស់ទន់ មិនយារ មិនបែកព្រុយ) និងស្បែក Premium ធន់មិនរបក ប្រើបានរាប់ឆ្នាំ មិនមែនជាប្រភេទសាច់ស្ដើងរហែកលឿនលើទីផ្សារឡើយ។
• **ឱសថបុរាណ & ផលិតផលសុខភាព៖** ផលិតផលមានលិខិតអនុញ្ញាតត្រឹមត្រូវពីក្រសួងសុខាភិបាលកម្ពុជា (CAM-MOH Permit) និងស្តង់ដារ GMP ធម្មជាតិ ១០០% មានសុវត្ថិភាពខ្ពស់ មិនប៉ះពាល់សុខភាព។

🛡️ **២. ការធានាទំនុកចិត្ត ១០០% និងប្តូរថ្មីជូនក្នុងរយៈពេល ៧ ថ្ងៃ៖**
កន្លែងខ្លះលក់ថោកជាងបន្តិច ប៉ុន្តែគ្មានការធានា ឬមិនទទួលខុសត្រូវក្រោយពេលលក់។ នៅ KAKA Shop ប្រសិនបើបងពិនិត្យឃើញមានបញ្ហាបច្ចេកទេស ឬមិនដូចការពិពណ៌នា យើងខ្ញុំប្តូរថ្មីជូនភ្លាមៗដោយគ្មានលក្ខខណ្ឌ!

🚚 **៣. សេវាដឹកជញ្ជូនរហ័ស & ពិនិត្យទំនិញមុនទូទាត់ប្រាក់៖**
បងអាចបើកមើល និងផ្ទៀងផ្ទាត់គុណភាពទំនិញដល់ដៃជាក់ស្តែងមុនពេលទូទាត់ប្រាក់បានចាស។

🎁 **អត្ថប្រយោជន៍ VIP ពិសេសសម្រាប់បងថ្ងៃនេះ៖**
ដើម្បីឱ្យបងអស់កង្វល់ និងមានទំនុកចិត្តសាកល្បងនូវគុណភាពពិតប្រាកដ ប្អូនស្រីសូមជូន **កូដបញ្ចុះតម្លៃ VIP 10% (កូដ: KAKA10)** បន្ថែមទៀត និង **Free សេវាដឹកជញ្ជូនរហ័ស** ជូនបងសម្រាប់ការកុម្ម៉ង់ថ្ងៃនេះចាស!

តើបងកំពុងចាប់អារម្មណ៍មុខទំនិញមួយណាដែរចាសបង? ប្អូនស្រីរីករាយនឹងជួយគណនាតម្លៃពិសេសបំផុតជូនបងណា៎ចាស!`;
    }

    // 3.5 WORLD TOP 5 MASTER SELLER & CLOSER PROTOCOL:
    // When a customer inquires about a product NOT currently in the store (e.g. "តើមានស្បែកជើងដែរទេ?", "មានខោទេ?")
    const isAskingUnstockedProduct =
      !targetProduct &&
      !isPriceObjection &&
      (q.includes('ស្បែកជើង') ||
        q.includes('shoe') ||
        q.includes('sneaker') ||
        q.includes('boot') ||
        q.includes('ប៉ាតា') ||
        q.includes('ខោ') ||
        q.includes('pant') ||
        q.includes('jean') ||
        q.includes('មួក') ||
        q.includes('hat') ||
        q.includes('cap') ||
        q.includes('ខ្សែក្រវាត់') ||
        q.includes('belt') ||
        q.includes('វ៉ែនតា') ||
        q.includes('glasses') ||
        q.includes('ទឹកអប់') ||
        q.includes('perfume') ||
        q.includes('គ្រឿងសម្អាង') ||
        q.includes('ម្សៅ') ||
        q.includes('ក្រែម') ||
        q.includes('កាបូបលុយ') ||
        q.includes('wallet') ||
        q.includes('ទូរស័ព្ទ') ||
        q.includes('phone') ||
        q.includes('ថ្នាំពេទ្យ') ||
        (q.includes('មាន') &&
          (q.includes('អត់') || q.includes('ទេ') || q.includes('លក់')) &&
          !q.includes('ប្រូម៉ូសិន') &&
          !q.includes('បញ្ចុះតម្លៃ') &&
          !q.includes('ថ្លៃ')));

    if (!targetProduct && isAskingUnstockedProduct) {
      let requestedItem = 'មុខទំនិញដែលបងបានសួររក';
      let pivotPitch = '';

      if (
        q.includes('ស្បែកជើង') ||
        q.includes('shoe') ||
        q.includes('sneaker') ||
        q.includes('boot') ||
        q.includes('ប៉ាតា')
      ) {
        requestedItem = 'ស្បែកជើង (Shoes & Sneakers)';
        pivotPitch = `ប៉ុន្តែបើសិនជាបងកំពុងស្វែងរកស្ទីល Cool & Trendy សម្រាប់ពាក់ត្រូវគ្នាជាមួយស្បែកជើងស្អាតៗ ប្អូនស្រីសូមណែនាំ **អាវយឺត KAKA Heavyweight Streetwear ($26.00)** និង **កាបូបស្បែក KAKA Leather Bag ($28.50)** ដែលជា Top 1 Bestseller កំពុងពេញនិយមខ្លាំង ព្រោះអតិថិជនភាគច្រើនទិញផ្គុំជាមួយស្បែកជើង ពាក់ទៅឡូយ សង្ហា និងលេចធ្លោខ្លាំងមែនទែនចាស! ✨`;
      } else if (q.includes('ខោ') || q.includes('pant') || q.includes('jean')) {
        requestedItem = 'ខោ / ខោខូវប៊យ (Pants & Jeans)';
        pivotPitch = `ប៉ុន្តែបើសិនជាបងចង់បានអាវយឺតសាច់ក្រាស់ទន់ល្មើយ សម្រាប់ពាក់ត្រូវគ្នាជាមួយខោ ប្អូនស្រីសូមណែនាំ **អាវយឺត KAKA Heavyweight Streetwear ($26.00)** ដែលអតិថិជនពេញនិយមទិញពាក់ជាគូជាមួយខោស្អាតខ្លាំងណាស់ចាស! ✨`;
      } else if (
        q.includes('ថ្នាំ') ||
        q.includes('ឱសថ') ||
        q.includes('សុខភាព') ||
        q.includes('herb')
      ) {
        requestedItem = 'ឱសថបុរាណ និងផលិតផលសុខភាព';
        pivotPitch = `ហាង KAKA Shop យើងខ្ញុំមាន **ថ្នាំកម្លាំងសរសៃ និងសន្លាក់បុរាណ ($18.00)** និង **តែឱសថបន្សាបជាតិពុល ($12.50)** ផ្សំពីរុក្ខជាតិធម្មជាតិ ១០០% មានលិខិតអនុញ្ញាតត្រឹមត្រូវពីក្រសួងសុខាភិបាល (CAM-MOH) ជំនួយសុខភាពយ៉ាងមានប្រសិទ្ធភាពចាស! 🌿`;
      } else if (
        q.includes('មួក') ||
        q.includes('ខ្សែក្រវាត់') ||
        q.includes('វ៉ែនតា') ||
        q.includes('កាបូប')
      ) {
        requestedItem = 'គ្រឿងតុបតែងម៉ូដ';
        pivotPitch = `ប្អូនស្រីសូមណែនាំ **កាបូបស្បែក KAKA Leather Sling Bag ($28.50)** និង **Smartwatch Ultra Pro ($49.00)** ដែលជាគ្រឿងបន្ថែមសម្រស់លំដាប់ Premium លក់ដាច់បំផុតប្រចាំហាងចាស! 🌟`;
      } else {
        requestedItem = 'មុខទំនិញដែលបងកំពុងស្វែងរក';
        pivotPitch = `បច្ចុប្បន្នហាង KAKA Shop យើងខ្ញុំមានកំពូលទំនិញ Hot Items ពេញនិយមដូចជា **កាបូបស្បែក KAKA Leather Bag ($28.50)**, **អាវយឺត Streetwear ($26.00)**, និង **ឱសថបុរាណធម្មជាតិ** ដែលទទួលបានការកោតសរសើរច្រើនបំផុតពីអតិថិជនចាស! 🌟`;
      }

      return `ចាសបង! ចំពោះ **${requestedItem}** ម៉ូដស្អាតៗ បច្ចុប្បន្នហាង KAKA Shop យើងខ្ញុំកំពុងសម្រិតសម្រាំងជ្រើសរើសម៉ូដ Trending ថ្មីៗ ដើម្បីរៀបចំចូលស្តុកក្នុងពេលឆាប់ៗនេះចាស!

${pivotPitch}

🎁 **អត្ថប្រយោជន៍ VIP ពិសេសសម្រាប់បងថ្ងៃនេះ៖**
ដើម្បីជាការអរគុណដែលបងបានសួររក និងគាំទ្រហាង KAKA Shop ប្អូនស្រីសូមជូន **កូដបញ្ចុះតម្លៃ VIP 10% (កូដ: KAKA10)** និង **Free សេវាដឹកជញ្ជូនរហ័សដល់មុខផ្ទះ** ភ្លាមៗសម្រាប់ការកុម្ម៉ង់ទំនិញក្នុងហាងថ្ងៃនេះចាស!

📝 **សេវា Pre-Order & ស្វែងរកម៉ូដជូនបង (Special Sourcing):**
ប្រសិនបើបងមានរូបភាពម៉ូដ ${requestedItem} ឬទំហំ (Size) ជាក់លាក់ដែលបងស្រឡាញ់ បងអាចផ្ញើរូបភាពមកប្អូនស្រីនៅទីនេះបានចាស! ក្រុមការងារយើងខ្ញុំអាចជួយកត់ត្រាក្នុងបញ្ជី Pre-Order ឬជួយស្វែងរក និងជូនដំណឹងដល់បងភ្លាមៗនៅពេលទំនិញមកដល់ស្តុកចាស!

តើបងចង់ឱ្យប្អូនស្រីជួយណែនាំទំនិញ Bestseller ក្នុងហាង ឬជួយកត់ត្រាការកុម្ម៉ង់ជូនបងដែរទេបងចាស?`;
    }

    // Dynamic sales pitch using REAL-TIME state
    if (targetProduct) {
      const priceUsd = targetProduct.price.toFixed(2);
      const priceKhr = toKhr(targetProduct.price);
      const origPrice = targetProduct.originalPrice ? targetProduct.originalPrice.toFixed(2) : null;
      const discountText =
        origPrice && Number(origPrice) > targetProduct.price
          ? ` (បញ្ចុះពីតម្លៃដើម $${origPrice})`
          : '';

      let stockStatus = '';
      if (targetProduct.stock <= 0) {
        stockStatus = `\n⚠️ **ចំណាំ៖** មុខទំនិញនេះកំពុងដាច់ស្តុកបណ្តោះអាសន្ន (Out of Stock)! ប្អូនស្រីសូមកត់លេខទូរស័ព្ទបងទុក ដើម្បីជូនដំណឹងពេលទំនិញចូលស្តុកវិញភ្លាមៗចាស។`;
      } else if (targetProduct.stock <= 5) {
        stockStatus = `\n🔥 **ប្រញាប់ឡើងបង!** សល់ត្រឹមតែ **${targetProduct.stock} គ្រឿងចុងក្រោយក្នុងស្តុក** ប៉ុណ្ណោះចាស!`;
      } else {
        stockStatus = `\n✨ មានក្នុងស្តុកស្រាប់ចំនួន **${targetProduct.stock} គ្រឿង** ធានាថ្មីសុទ្ធ ១០០% ចាស!`;
      }

      const variants: string[] = [];
      if (targetProduct.colors && targetProduct.colors.length > 0) {
        variants.push(`• 🎨 ជម្រើសពណ៌៖ ${targetProduct.colors.join(', ')}`);
      }
      if (targetProduct.sizes && targetProduct.sizes.length > 0) {
        variants.push(`• 📏 ជម្រើសទំហំ (Size)៖ ${targetProduct.sizes.join(', ')}`);
      }

      const desc = targetProduct.descriptionKh || targetProduct.descriptionEn || '';

      return `ជម្រើសដ៏ល្អឥតខ្ចោះ និងទាន់សម័យបំផុតបងចាស! 🌟

ផលិតផល **"${targetProduct.nameKh}"** (${targetProduct.nameEn}) គឺជាជម្រើសពេញនិយមខ្លាំងប្រចាំហាង KAKA Shop យើងខ្ញុំ៖
• 💰 តម្លៃពិសេសបច្ចុប្បន្ន៖ **$${priceUsd}** (~${priceKhr}៛)${discountText}
${variants.length > 0 ? variants.join('\n') + '\n' : ''}• 🛡️ ធានាផលិតផលសុទ្ធ ១០០% និងប្តូរថ្មីជូនក្នុងរយៈពេល ៧ ថ្ងៃ!${stockStatus}
${desc ? `\n📝 **លក្ខណៈពិសេស៖** ${desc}\n` : ''}
💡 **ប្រូម៉ូសិនពិសេស៖** រាល់ការកុម្ម៉ង់ចាប់ពី **$30 ឡើងទៅ** បងនឹងទទួលបាន **Free សេវាដឹកជញ្ជូនរហ័ស** ដល់មុខផ្ទះភ្លាមៗ!

👉 បងអាចចុចប៊ូតុង **"កុម្ម៉ង់ឥឡូវ"** នៅលើកាតទំនិញខាងលើ ឬគ្រាន់តែផ្ញើ **លេខទូរស័ព្ទ និងទីតាំង** មកប្អូននៅទីនេះ ដើម្បីឱ្យប្អូនរៀបចំកញ្ចប់ដឹកជូនបងភ្លាមៗចាស!`;
    }

    // 4. Payment Methods Intent
    if (
      q.includes('ទូទាត់') ||
      q.includes('បង់ប្រាក់') ||
      q.includes('payment') ||
      q.includes('pay') ||
      q.includes('khqr') ||
      q.includes('aba') ||
      q.includes('លុយ')
    ) {
      return `ជំរាបសួរបងចាស! ហាង KAKA Shop យើងខ្ញុំមានវិធីសាស្ត្រទូទាត់ប្រាក់យ៉ាងងាយស្រួល និងសុវត្ថិភាព ៣ ជម្រើស៖

១. 💳 **Bakong KHQR** (ពេញនិយមបំផុត)៖ អាចស្កេនទូទាត់បានភ្លាមៗពីគ្រប់ធនាគារក្នុងប្រទេសកម្ពុជា (ABA Mobile, ACLEDA, Canadia, Wing, etc.) ទាំងប្រាក់ដុល្លារ ($) និងប្រាក់រៀល (៛) ដោយឥតគិតថ្លៃសេវា។
២. 🏦 **ABA Mobile Pay**៖ ផ្ទេរប្រាក់រហ័សតាមគណនី ABA។
៣. 💵 **Cash on Delivery (COD)**៖ ទូទាត់ប្រាក់សុទ្ធផ្ទាល់ពេលអ្នកដឹកជញ្ជូនយកទំនិញទៅដល់មុខផ្ទះរបស់បង។

តើបងពេញចិត្តទូទាត់តាមជម្រើសមួយណាដែរចាស? ប្អូនស្រីត្រៀមរៀបចំកាតទូទាត់ប្រាក់ជូនបងភ្លាមៗចាស!`;
    }

    // 5. Delivery Service Intent
    if (
      q.includes('ដឹក') ||
      q.includes('សេវាដឹក') ||
      q.includes('delivery') ||
      q.includes('ship') ||
      q.includes('ថ្លៃដឹក') ||
      q.includes('ខេត្ត')
    ) {
      return `ចាសបង! ហាង **${brandName}** មានសេវាដឹកជញ្ជូនរហ័សទូទាំង ២៤ ខេត្ត-ក្រុង៖

🚚 **ក្នុងរាជធានីភ្នំពេញ៖**
• រយៈពេល៖ ១ ទៅ ២ ម៉ោង (Express Delivery ដល់ដៃ)
• តម្លៃសេវា៖ ត្រឹមតែ $1.50 (**Free ដឹកជញ្ជូន** សម្រាប់ការកុម្ម៉ង់ចាប់ពី $30 ឡើងទៅ!)

📦 **បណ្តាខេត្តទាំង ២៤៖**
• រយៈពេល៖ ១ ទៅ ២ ថ្ងៃ តាមរយៈ J&T Express, វីរៈ ប៊ុនថាំ (VET), ឬ កាពីតូល
• តម្លៃសេវា៖ ចាប់ពី $2.00 - $2.50

បងអាចផ្ញើលេខទូរស័ព្ទ និងទីតាំងមកកាន់ខ្ញុំឥឡូវនេះ ដើម្បីឱ្យប្អូនស្រីរៀបចំខ្ចប់ទំនិញដឹកជូនបងភ្លាមៗចាស!`;
    }

    // 6. Warranty & Quality Intent
    if (
      q.includes('ធានា') ||
      q.includes('warranty') ||
      q.includes('គុណភាព') ||
      q.includes('ប្តូរ') ||
      q.includes('ខូច')
    ) {
      return `បងទុកចិត្តបាន ១០០% ចាស! ហាង **${brandName}** ផ្តល់ទំនុកចិត្តខ្ពស់បំផុតជូនអតិថិជន៖
✨ ទំនិញសុទ្ធ ១០០% នាំចូលផ្ទាល់ មានការត្រួតពិនិត្យគុណភាពយ៉ាងម៉ត់ចត់
🛡️ ធានាប្តូរទំនិញថ្មីជូនវិញក្នុងរយៈពេល ៧ ថ្ងៃ ប្រសិនបើមានបញ្ហាបច្ចេកទេសពីរោងចក្រ
🔍 អាចពិនិត្យផ្ទៀងផ្ទាត់មើលទំនិញផ្ទាល់មុននឹងទូទាត់ប្រាក់បាន!

តើបងចង់ឱ្យប្អូនស្រីជួយរៀបចំការកុម្ម៉ង់ទំនិញមួយណាជូនបងដែរចាស?`;
    }

    // 7. General Inventory / What products are available ("មានលក់អ្វីខ្លះ", "ទំនិញ")
    if (
      q.includes('មានអ្វីខ្លះ') ||
      q.includes('លក់អ្វី') ||
      q.includes('ទំនិញ') ||
      q.includes('catalog') ||
      q.includes('product') ||
      q.includes('items') ||
      q.includes('ម៉ឺនុយ')
    ) {
      const listSummary = availableProducts.slice(0, 5).map((p) => {
        const pUsd = p.price.toFixed(2);
        const pKhr = toKhr(p.price);
        const badge = p.stock <= 0 ? ' [ដាច់ស្តុក]' : ` [សល់ ${p.stock}]`;
        return `• **${p.nameKh}** (${p.nameEn}) ៖ $${pUsd} (~${pKhr}៛)${badge}`;
      });

      return `ជំរាបសួរបងចាស! ហាង **${brandName}** បច្ចុប្បន្នមានទំនិញគុណភាពខ្ពស់ជាច្រើនមុខដូចជា៖

${listSummary.length > 0 ? listSummary.join('\n') : '• មានទំនិញជាច្រើនមុខកំពុងរៀបចំជូនបងចាស'}

💡 បងអាចចុចមើលទំនិញទាំងអស់នៅផ្ទាំង **"ទំនិញ" (Store)** ឬប្រាប់ប្អូនពីប្រភេទដែលបងចង់បាន ដើម្បីឱ្យប្អូនស្រីណែនាំលម្អិតជូនបងភ្លាមៗចាស!`;
    }

    // 8. Consultative Solution-Oriented Greetings
    if (
      q.includes('សួស្តី') ||
      q.includes('ជំរាបសួរ') ||
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey')
    ) {
      return `ជំរាបសួរបងចាស! នាងខ្ញុំជាជំនួយការប្រឹក្សាផ្ទាល់ប្រចាំហាង **${brandName}** សូមស្វាគមន៍បងយ៉ាងកក់ក្តៅបំផុតចាស 🌟

គោលបំណងរបស់ប្អូនស្រីនៅទីនេះ មិនមែនគ្រាន់តែមកលក់ទំនិញឡើយ គឺដើម្បីជួយស្ដាប់ ស្វែងយល់ពីតម្រូវការ និងជួយរក **ដំណោះស្រាយពិតប្រាកដដែលស័ក្តិសមបំផុត** ជូនបង ដោយគ្មានការបង្ខិតបង្ខំទិញឡើយចាស 💖

តើថ្ងៃនេះបងកំពុងស្វែងរកដំណោះស្រាយ ឬចាប់អារម្មណ៍ទំនិញផ្នែកណាដែរចាសបង?
${currentVendor ? `• 🏪 **ហាង៖** ${brandName}\n• 📍 **ទីតាំង៖** ${brandAddress}\n• 📞 **ទូរស័ព្ទ៖** ${brandPhone}` : `• 🛍️ **ផ្សារទំនើប Phsar24៖** ស្វែងរកទំនិញគ្រប់ប្រភេទ ឱសថបុរាណ ម៉ូដសម្លៀកបំពាក់ និងឧបករណ៍បច្ចេកវិទ្យា`}

សូមបងប្រាប់ពីបញ្ហា ឬតម្រូវការរបស់បងមកកាន់ប្អូនស្រីណា៎ចាស ប្អូនត្រៀមខ្លួនជួយប្រឹក្សាជូនបងដោយក្តីរីករាយបំផុត!`;
    }

    // 9. Recommendations / Top Picks ("លក់ដាច់", "ណែនាំ")
    if (q.includes('លក់ដាច់') || q.includes('ណែនាំ') || q.includes('recommend') || q.includes('best seller')) {
      const topPicks = availableProducts.slice(0, 3).map((p) => {
        return `🔥 **${p.nameKh}** ៖ $${p.price.toFixed(2)} (~${toKhr(p.price)}៛)`;
      });

      return `ចាសបង! ហាង **${brandName}** សូមណែនាំដំណោះស្រាយកំពូលទំនិញ Hot Items ដែលអតិថិជនពេញនិយម និងមាន Feedback ល្អបំផុត៖

${topPicks.length > 0 ? topPicks.join('\n') : '• ឱសថបុរាណធម្មជាតិ, អាវយឺត Streetwear, កាបូបស្បែក Sling Bag'}

💡 គ្រប់ទំនិញទាំងអស់សុទ្ធតែមានការធានាគុណភាពផ្លូវការ ៧ ថ្ងៃ និងពិនិត្យទំនិញជាក់ស្តែងមុនទូទាត់ប្រាក់!
តើបងចង់ឱ្យប្អូនស្រីជួយណែនាំលម្អិតលើដំណោះស្រាយមួយណាដែរចាសបង?`;
    }

    // Default consultative customer care reply
    return `ចាសបង! នាងខ្ញុំជាជំនួយការប្រឹក្សាផ្ទាល់ប្រចាំហាង **${brandName}** សូមស្វាគមន៍បងដោយក្តីរីករាយចាស 🌸
តើបងកំពុងជួបប្រទះបញ្ហាអ្វី ឬចង់ឱ្យប្អូនស្រីជួយប្រឹក្សាស្វែងរកដំណោះស្រាយលើមុខទំនិញណាដែរចាសបង? ប្អូនស្រីរីករាយនឹងជួយបងជានិច្ចដោយគ្មានការបង្ខិតបង្ខំឡើយចាស!`;
  };

  // Live Chat Direct Order Engine
  const sendChatMessage = async (text: string, productAttachment?: Product) => {
    triggerHaptic('light');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toISOString(),
      productAttachment,
      status: 'delivered',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    syncChatToCloud(userMsg);
    setIsChatTyping(true);

    let replyText = '';
    let actionType: ChatMessage['actionType'] = undefined;
    let matchedProduct: Product | undefined = productAttachment;

    const currentChatVendor =
      selectedVendorId !== 'all'
        ? vendors.find((v) => v.id === selectedVendorId)
        : dedicatedVendor;

    const activeChatStoreName = currentChatVendor
      ? (language === 'km' ? currentChatVendor.nameKh : currentChatVendor.nameEn)
      : (language === 'km' ? 'Phsar24 (ផ្សារ២៤)' : 'Phsar24 Marketplace');

    const activeChatStorePhone =
      currentChatVendor?.ownerPhone || primaryStoreLocation?.phone || storeInfo.phone1;

    const activeChatStoreAddress = currentChatVendor
      ? (language === 'km' ? currentChatVendor.addressKh : currentChatVendor.addressEn)
      : (language === 'km'
          ? (primaryStoreLocation?.addressKh || storeInfo.addressKh).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24')
          : (primaryStoreLocation?.addressEn || storeInfo.addressEn).replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'));

    const activeChatProducts = currentChatVendor
      ? products.filter((p) => p.vendorId === currentChatVendor.id || !p.vendorId)
      : products;

    // Call server AI endpoint with 100% full live store context
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-6),
          attachedProduct: productAttachment,
          products: activeChatProducts.map((p) => ({
            id: p.id,
            nameKh: p.nameKh,
            nameEn: p.nameEn,
            price: p.price,
            originalPrice: p.originalPrice,
            stock: p.stock,
            category: p.category,
            badge: p.badge,
            colors: p.colors,
            sizes: p.sizes,
            descriptionKh: p.descriptionKh,
            descriptionEn: p.descriptionEn,
          })),
          storeLocations: storeLocations.filter((b) => b.isActive).map((b) => ({
            nameKh: (b.nameKh || '').replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'),
            nameEn: (b.nameEn || '').replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'),
            addressKh: (b.addressKh || '').replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'),
            addressEn: (b.addressEn || '').replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'),
            phone: b.phone,
            isPrimary: b.isPrimary,
            workingHoursKh: b.workingHoursKh,
          })),
          storeInfo: {
            nameKh: activeChatStoreName,
            nameEn: activeChatStoreName,
            phone: activeChatStorePhone,
            city: currentChatVendor?.city || storeInfo.city,
            addressKh: activeChatStoreAddress,
            addressEn: activeChatStoreAddress,
            vendorId: currentChatVendor?.id,
            slug: currentChatVendor?.slug,
          },
          coupons: coupons.filter((c) => c.active).map((c) => ({
            code: c.code,
            discountType: c.discountType,
            discountValue: c.discountValue,
            minOrderAmount: c.minOrderAmount,
          })),
          categories: categories.map((c) => ({
            id: c.id,
            nameKh: c.nameKh,
            nameEn: c.nameEn,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          replyText = data.reply;
        }
      }
    } catch {
      // Local fallback used below
    }

    if (!replyText) {
      replyText = getSmartKnowledgeResponse(text, productAttachment);
    }

    const lower = text.toLowerCase();
    if (productAttachment) {
      actionType = 'product_inquiry';
    } else {
      // Dynamic product card matcher based on live products
      let foundProduct: Product | undefined = undefined;
      let highestMatch = 0;

      for (const p of products) {
        let m = 0;
        const nameKh = p.nameKh.toLowerCase();
        const nameEn = p.nameEn.toLowerCase();
        const cat = p.category.toLowerCase();

        if (nameKh && lower.includes(nameKh)) m += 10;
        if (nameEn && lower.includes(nameEn)) m += 8;

        if (
          (cat === 'gadgets' && (lower.includes('នាឡិកា') || lower.includes('កាស') || lower.includes('watch') || lower.includes('earbuds') || lower.includes('smartwatch'))) ||
          (cat === 'lifestyle' && (lower.includes('កាបូប') || lower.includes('bag') || lower.includes('sling'))) ||
          (cat === 'fashion' && (lower.includes('អាវ') || lower.includes('hoodie') || lower.includes('shirt'))) ||
          (cat === 'beverage' && (lower.includes('កាហ្វេ') || lower.includes('latte')))
        ) {
          m += 4;
        }

        const words = lower.split(/[\s,.-]+/);
        for (const w of words) {
          if (w.length >= 2) {
            if (nameKh.includes(w)) m += 3;
            if (nameEn.includes(w)) m += 2;
          }
        }

        if (m > highestMatch) {
          highestMatch = m;
          foundProduct = p;
        }
      }

      if (foundProduct && highestMatch >= 4) {
        matchedProduct = foundProduct;
        actionType = 'product_inquiry';
      } else if (
        lower.includes('ស្បែកជើង') ||
        lower.includes('shoe') ||
        lower.includes('sneaker') ||
        lower.includes('boot') ||
        lower.includes('ប៉ាតា') ||
        lower.includes('ខោ') ||
        lower.includes('pant') ||
        lower.includes('jean')
      ) {
        // World Top 5 Seller: attach complementary bestseller (Streetwear T-Shirt or Leather Bag)
        const comp =
          products.find((p) => p.category === 'fashion') ||
          products.find((p) => p.category === 'lifestyle') ||
          products[0];
        matchedProduct = comp;
        actionType = 'product_inquiry';
      } else if (
        lower.includes('ថ្នាំ') ||
        lower.includes('ឱសថ') ||
        lower.includes('herb')
      ) {
        // World Top 5 Seller: attach complementary herbal medicine bestseller
        const herbComp =
          products.find((p) => p.category === 'traditional_medicine') ||
          products[0];
        matchedProduct = herbComp;
        actionType = 'product_inquiry';
      } else if (
        lower.includes('ទូទាត់') ||
        lower.includes('បង់ប្រាក់') ||
        lower.includes('khqr') ||
        lower.includes('qr')
      ) {
        actionType = 'payment_qr';
      }
    }

    setTimeout(() => {
      setIsChatTyping(false);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toISOString(),
        productAttachment: matchedProduct,
        actionType,
        status: 'read',
      };

      setChatMessages((prev) => [...prev, botReply]);
      syncChatToCloud(botReply);
      setUnreadChatCount((c) => (activeTab === 'chat' ? 0 : c + 1));
      triggerHaptic('medium');
    }, 450);
  };

  const sendProductInquiryToChat = (product: Product, inquiryType: 'price' | 'order' | 'custom' = 'order') => {
    setActiveTab('chat');
    let messageText = '';
    if (inquiryType === 'order') {
      messageText = `ជំរាបសួរ! ខ្ញុំចង់បញ្ជាទិញផលិតផលនេះ៖ ${product.nameKh}`;
    } else {
      messageText = `សួស្តី! តើផលិតផល ${product.nameKh} នេះនៅមានក្នុងស្តុកទេ?`;
    }
    sendChatMessage(messageText, product);
  };

  const sendDirectChatOrder = (
    items: CartItem[],
    customer: { name: string; phone: string; address: string; notes?: string }
  ): Order => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder = createOrder({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      telegramUsername: '@telegram_user',
      items,
      totalAmount,
      currency,
      paymentMethod: 'khqr',
      paymentStatus: 'unpaid',
      status: 'pending',
      notes: customer.notes || 'បញ្ជាទិញតាមរយៈ Live Chat',
      createdVia: 'chat',
    });

    // Post to chat
    const orderChatMsg: ChatMessage = {
      id: `chat-ord-${Date.now()}`,
      sender: 'customer',
      text: `📦 ខ្ញុំបានបញ្ជាក់ការបញ្ជាទិញតាមឆាត:\n• លេខកុម្ម៉ង់: ${newOrder.orderNumber}\n• អ្នកទទួល: ${customer.name} (${customer.phone})\n• ទីតាំង: ${customer.address}\n• សរុបទឹកប្រាក់: ${formatPrice(totalAmount)}`,
      timestamp: new Date().toISOString(),
      orderAttachment: newOrder,
      actionType: 'order_summary',
      status: 'delivered',
    };

    setChatMessages((prev) => [...prev, orderChatMsg]);

    // Send confirmation and QR payment card
    setTimeout(() => {
      const confirmReply: ChatMessage = {
        id: `bot-conf-${Date.now()}`,
        sender: 'agent',
        text: `🎉 អរគុណច្រើនបង ${customer.name}! ការបញ្ជាទិញលេខ #${newOrder.orderNumber} ត្រូវបានទទួលជោគជ័យ។ ក្រុមការងារយើងខ្ញុំកំពុងរៀបចំ និងផ្ទៀងផ្ទាត់ការទូទាត់ប្រាក់ Bakong KHQR ជូនបង!`,
        timestamp: new Date().toISOString(),
        orderAttachment: newOrder,
        actionType: 'payment_qr',
        status: 'read',
      };
      setChatMessages((prev) => [...prev, confirmReply]);
      triggerHaptic('success');
    }, 800);

    return newOrder;
  };

  const sendAgentReply = (text: string) => {
    const agentMsg: ChatMessage = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toISOString(),
      status: 'read',
    };
    setChatMessages((prev) => [...prev, agentMsg]);
    syncChatToCloud(agentMsg);
    triggerHaptic('light');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        isTelegramView,
        setIsTelegramView,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        productModalInitialMedia,
        openProductModal,
        isCartOpen,
        setIsCartOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingPhoneQuery,
        setTrackingPhoneQuery,
        vendors,
        selectedVendorId,
        setSelectedVendorId,
        selectedAdminVendorId,
        setSelectedAdminVendorId,
        addVendor,
        updateVendor,
        deleteVendor,
        toggleVendorStatus,
        toggleVendorVerification,
        getVendorById,
        isDedicatedStoreMode,
        setIsDedicatedStoreMode,
        dedicatedVendor,
        enterDedicatedStore,
        exitDedicatedStoreMode,
        productionDomain,
        setProductionDomain,
        getStoreShareLinks,
        registerVendorSelf,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        updateCartItemQuantity,
        removeFromCart,
        removeCartItem,
        clearCart,
        cartTotal,
        cartSubtotal,
        discountAmount,
        finalCartTotal,
        cartItemCount,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        reviews,
        addReview,
        getProductReviews,
        getProductRating,
        selectedOrderForReceipt,
        setSelectedOrderForReceipt,
        exportOrdersCsv,
        exportInventoryCsv,
        storeInfo,
        updateStoreInfo,
        storeLocations,
        primaryStoreLocation,
        addStoreLocation,
        updateStoreLocation,
        deleteStoreLocation,
        setPrimaryStoreLocation,
        storeInfoItems,
        addStoreInfoItem,
        updateStoreInfoItem,
        deleteStoreInfoItem,
        licenses,
        addLicense,
        updateLicense,
        deleteLicense,
        licenseSecurityConfig,
        updateLicenseSecurityConfig,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        adminUsers,
        currentAdmin,
        loginAdmin,
        logoutAdmin,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        hasPermission,
        canManageContent,
        isSuperAdmin,
        auditLogs,
        logAuditAction,
        clearAuditLogs,
        chatMessages,
        isChatTyping,
        sendChatMessage,
        sendProductInquiryToChat,
        sendDirectChatOrder,
        sendAgentReply,
        unreadChatCount,
        markChatAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
