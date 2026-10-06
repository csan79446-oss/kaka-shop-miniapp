import {
  AdminUser,
  AuditLog,
  CartItem,
  Category,
  ChatMessage,
  Coupon,
  Order,
  Product,
  ProductReview,
  StoreInfo,
  StoreLocation,
  StoreInfoItem,
  MedicalLicense,
  LicenseSecurityConfig,
  Vendor,
} from '../types';
import {
  CATEGORIES,
  INITIAL_ADMIN_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_STORE_INFO,
  INITIAL_STORE_LOCATIONS,
  INITIAL_STORE_INFOS,
  INITIAL_LICENSES,
  INITIAL_LICENSE_SECURITY_CONFIG,
  INITIAL_VENDORS,
} from '../data/mockData';

const STORAGE_KEYS = {
  VENDORS: 'kaka_marketplace_vendors_v1',
  PRODUCTS: 'kaka_shop_products_v1',
  CATEGORIES: 'kaka_shop_categories_v1',
  COUPONS: 'kaka_shop_coupons_v1',
  REVIEWS: 'kaka_shop_reviews_v1',
  ORDERS: 'kaka_shop_orders_v1',
  ADMIN_USERS: 'kaka_shop_admin_users_v1',
  AUDIT_LOGS: 'kaka_shop_audit_logs_v1',
  CART: 'kaka_shop_cart_v1',
  CHAT: 'kaka_shop_chat_messages_v1',
  AUTH: 'kaka_shop_current_admin_v1',
  LANG: 'kaka_shop_lang_v1',
  CURRENCY: 'kaka_shop_currency_v1',
  FRAME_MODE: 'kaka_shop_frame_mode_v1',
  STORE_INFO: 'kaka_shop_store_info_v1',
  STORE_LOCATIONS: 'kaka_shop_store_locations_v1',
  STORE_INFOS: 'kaka_shop_store_info_items_v1',
  LICENSES: 'kaka_shop_licenses_v1',
  LICENSE_SECURITY: 'kaka_shop_license_security_v1',
};

export const loadStoredStoreInfo = (): StoreInfo => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STORE_INFO);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        const merged = { ...INITIAL_STORE_INFO, ...parsed };
        if (merged.nameKh && merged.nameKh.includes('KAKA')) {
          merged.nameKh = INITIAL_STORE_INFO.nameKh;
          merged.nameEn = INITIAL_STORE_INFO.nameEn;
          merged.taglineKh = INITIAL_STORE_INFO.taglineKh;
          merged.taglineEn = INITIAL_STORE_INFO.taglineEn;
        }
        return merged;
      }
    }
  } catch (e) {
    console.error('Failed to load store info from storage', e);
  }
  return INITIAL_STORE_INFO;
};

export const saveStoredStoreInfo = (info: StoreInfo) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STORE_INFO, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save store info to storage', e);
  }
};

export const loadStoredVendors = (): Vendor[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VENDORS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((v) => {
          if (v.id === 'vendor-01' && v.nameKh && v.nameKh.includes('KAKA')) {
            return {
              ...v,
              nameKh: 'Phsar24 Official Gadgets (ផ្សារ២៤ ហ្គាដជេត)',
              nameEn: 'Phsar24 Official Gadgets & Tech',
              slug: 'phsar24-gadgets',
              ownerEmail: 'vibol@phsar24.app',
              telegramUsername: 'phsar24_admin',
              bankAccountName: 'PHSAR24 GADGETS CO., LTD',
            };
          }
          return v;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load vendors from storage', e);
  }
  return INITIAL_VENDORS;
};

export const saveStoredVendors = (vendors: Vendor[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  } catch (e) {
    console.error('Failed to save vendors to storage', e);
  }
};

export const loadStoredStoreLocations = (): StoreLocation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STORE_LOCATIONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((loc) => {
          if (loc.nameKh && loc.nameKh.includes('KAKA')) {
            return {
              ...loc,
              nameKh: loc.nameKh.replace(/KAKA(\s*SHOP)?/gi, 'Phsar24 (ផ្សារ២៤)'),
              nameEn: loc.nameEn.replace(/KAKA(\s*SHOP)?/gi, 'Phsar24'),
            };
          }
          return loc;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load store locations from storage', e);
  }
  return INITIAL_STORE_LOCATIONS;
};

export const saveStoredStoreLocations = (locations: StoreLocation[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STORE_LOCATIONS, JSON.stringify(locations));
  } catch (e) {
    console.error('Failed to save store locations to storage', e);
  }
};

export const loadStoredStoreInfoItems = (): StoreInfoItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STORE_INFOS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load store info items from storage', e);
  }
  return INITIAL_STORE_INFOS;
};

export const saveStoredStoreInfoItems = (items: StoreInfoItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STORE_INFOS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save store info items to storage', e);
  }
};

export const loadStoredCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load categories from storage', e);
  }
  return CATEGORIES;
};

export const saveStoredCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to storage', e);
  }
};

export const loadStoredCoupons = (): Coupon[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load coupons from storage', e);
  }
  return INITIAL_COUPONS;
};

export const saveStoredCoupons = (coupons: Coupon[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  } catch (e) {
    console.error('Failed to save coupons to storage', e);
  }
};

export const loadStoredReviews = (): ProductReview[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load reviews from storage', e);
  }
  return INITIAL_REVIEWS;
};

export const saveStoredReviews = (reviews: ProductReview[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews to storage', e);
  }
};

export const loadStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load products from storage', e);
  }
  return INITIAL_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
};

export const loadStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load orders from storage', e);
  }
  return INITIAL_ORDERS;
};

export const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
  }
};

export const loadStoredAdminUsers = (): AdminUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    if (data) {
      const users: AdminUser[] = JSON.parse(data);
      return users.map((u) => {
        if (u.id === 'admin-01' || u.role === 'SUPER_ADMIN') {
          return {
            ...u,
            name: 'SMUN Tha ស្មុន ថា',
            username: u.username === 'vibol.superadmin' ? 'smuntha.superadmin' : u.username || 'smuntha.superadmin',
          };
        }
        return u;
      });
    }
  } catch (e) {
    console.error('Failed to load admins from storage', e);
  }
  return INITIAL_ADMIN_USERS;
};

export const saveStoredAdminUsers = (users: AdminUser[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save admins to storage', e);
  }
};

export const loadStoredAuditLogs = (): AuditLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load audit logs from storage', e);
  }
  return INITIAL_AUDIT_LOGS;
};

export const saveStoredAuditLogs = (logs: AuditLog[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save audit logs to storage', e);
  }
};

export const loadStoredCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load cart from storage', e);
  }
  return [];
};

export const saveStoredCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to storage', e);
  }
};

export const loadStoredChatMessages = (): ChatMessage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load chat from storage', e);
  }
  return INITIAL_CHAT_MESSAGES;
};

export const saveStoredChatMessages = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat to storage', e);
  }
};

export const loadStoredAdminAuth = (): AdminUser | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (data) {
      const user: AdminUser = JSON.parse(data);
      if (user.id === 'admin-01' || user.role === 'SUPER_ADMIN') {
        return {
          ...user,
          name: 'SMUN Tha ស្មុន ថា',
          username: user.username === 'vibol.superadmin' ? 'smuntha.superadmin' : user.username || 'smuntha.superadmin',
        };
      }
      return user;
    }
  } catch (e) {
    console.error('Failed to load admin auth', e);
  }
  return null;
};

export const saveStoredAdminAuth = (user: AdminUser | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  } catch (e) {
    console.error('Failed to save admin auth', e);
  }
};

export const loadStoredLicenses = (): MedicalLicense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LICENSES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load licenses from storage', e);
  }
  return INITIAL_LICENSES;
};

export const saveStoredLicenses = (licenses: MedicalLicense[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(licenses));
  } catch (e) {
    console.error('Failed to save licenses to storage', e);
  }
};

export const loadStoredLicenseSecurityConfig = (): LicenseSecurityConfig => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LICENSE_SECURITY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...INITIAL_LICENSE_SECURITY_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load license security config', e);
  }
  return INITIAL_LICENSE_SECURITY_CONFIG;
};

export const saveStoredLicenseSecurityConfig = (config: LicenseSecurityConfig) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LICENSE_SECURITY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save license security config', e);
  }
};

