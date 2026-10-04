export type Language = 'km' | 'en';
export type Currency = 'USD' | 'KHR';

export interface Category {
  id: string;
  nameKh: string;
  nameEn: string;
  icon: string;
}

export interface Vendor {
  id: string;
  nameKh: string;
  nameEn: string;
  slug: string;
  logo: string;
  banner?: string;
  descriptionKh: string;
  descriptionEn: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  telegramUsername: string;
  telegramChatId?: string; // Telegram user/chat/group numeric ID for automated order alerts
  telegramBotToken?: string; // Optional custom bot token if vendor has dedicated bot
  addressKh: string;
  addressEn: string;
  city: string;
  category: string; // e.g. 'gadgets', 'health', 'fashion', 'general'
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  commissionRate?: number; // e.g. 5%
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bakongId?: string;
  khqrImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  vendorId?: string; // links product to its specific vendor/shop
  nameKh: string;
  nameEn: string;
  descriptionKh: string;
  descriptionEn: string;
  price: number; // in USD
  originalPrice?: number;
  category: string;
  image: string;
  video?: string; // Video URL (MP4, WebM, YouTube) or uploaded video DataURL
  videoThumbnail?: string;
  stock: number;
  badge?: 'new' | 'hot' | 'sale' | 'featured';
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  isTraditionalMedicine?: boolean;
  licenseNumber?: string;
  dosageKh?: string;
  dosageEn?: string;
  ingredientsKh?: string;
  ingredientsEn?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalLicense {
  id: string;
  titleKh: string;
  titleEn: string;
  licenseNumber: string;
  issuingAuthorityKh: string;
  issuingAuthorityEn: string;
  issueDate: string;
  expiryDate: string;
  documentType: 'moh_license' | 'gmp_cert' | 'traditional_permit' | 'organic_test';
  documentImage: string;
  verified: boolean;
  notesKh?: string;
  notesEn?: string;
}

export interface LicenseSecurityConfig {
  watermarkEnabled: boolean;
  watermarkText: string;
  antiScreenshotEnabled: boolean;
  blurOnFocusLossEnabled: boolean;
  allowZoom: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  commentKh: string;
  commentEn: string;
  date: string;
  verifiedPurchase: boolean;
  avatar?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number; // e.g. 15 for 15%, or 2.5 for $2.50
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageCount: number;
  maxUsage?: number;
  active: boolean;
  descriptionKh: string;
  descriptionEn: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentMethod = 'khqr' | 'aba' | 'cod' | 'telegram_pay';
export type PaymentStatus = 'unpaid' | 'paid' | 'verified';

export interface Order {
  id: string;
  orderNumber: string;
  vendorId?: string; // links order to specific vendor
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  telegramUsername?: string;
  telegramChatId?: string;
  items: CartItem[];
  subtotal?: number;
  discountAmount?: number;
  couponCode?: string;
  deliveryFee?: number;
  totalAmount: number; // in USD
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  receiptImage?: string;
  createdAt: string;
  updatedAt: string;
  createdVia: 'chat' | 'cart';
}

export type AdminRole = 'SUPER_ADMIN' | 'STORE_MANAGER' | 'SUPPORT_STAFF';

export type AdminPermission =
  | 'manage_products'
  | 'view_analytics'
  | 'manage_orders'
  | 'live_chat_support'
  | 'manage_staff'
  | 'view_audit_logs'
  | 'export_data';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: AdminRole;
  vendorId?: string; // if undefined/null, user is Platform Super Admin; if specified, user is tied to that vendor
  pin: string;
  avatar: string;
  active: boolean;
  lastLogin?: string;
}

export interface StoreLocation {
  id: string;
  nameKh: string;
  nameEn: string;
  addressKh: string;
  addressEn: string;
  city: string;
  phone: string;
  telegramUsername?: string;
  workingHoursKh: string;
  workingHoursEn: string;
  googleMapsUrl?: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface StoreInfoItem {
  id: string;
  titleKh: string;
  titleEn: string;
  contentKh: string;
  contentEn: string;
  category: 'delivery' | 'warranty' | 'policy' | 'notice' | 'contact';
  icon?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StoreInfo {
  nameKh: string;
  nameEn: string;
  taglineKh: string;
  taglineEn: string;
  addressKh: string;
  addressEn: string;
  city: string;
  phone1: string;
  phone2?: string;
  telegramUsername: string;
  telegramChannel?: string;
  facebookPage?: string;
  email: string;
  workingHoursKh: string;
  workingHoursEn: string;
  googleMapsUrl?: string;
}

export type AuditAction =
  | 'STORE_INFO_UPDATE'
  | 'VENDOR_CREATE'
  | 'VENDOR_UPDATE'
  | 'VENDOR_STATUS_CHANGE'
  | 'VENDOR_DELETE'
  | 'STORE_BRANCH_CREATE'
  | 'STORE_BRANCH_UPDATE'
  | 'STORE_BRANCH_DELETE'
  | 'STORE_INFO_ITEM_CREATE'
  | 'STORE_INFO_ITEM_UPDATE'
  | 'STORE_INFO_ITEM_DELETE'
  | 'PRODUCT_CREATE'
  | 'PRODUCT_UPDATE'
  | 'PRODUCT_DELETE'
  | 'CATEGORY_CREATE'
  | 'CATEGORY_UPDATE'
  | 'CATEGORY_DELETE'
  | 'COUPON_CREATE'
  | 'COUPON_UPDATE'
  | 'COUPON_DELETE'
  | 'DATA_EXPORT'
  | 'ORDER_STATUS_UPDATE'
  | 'ORDER_CANCEL'
  | 'STAFF_CREATE'
  | 'STAFF_UPDATE'
  | 'STAFF_DELETE'
  | 'ADMIN_LOGIN'
  | 'SYSTEM_SETTINGS';

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  role: AdminRole;
  action: AuditAction;
  targetType: 'product' | 'order' | 'staff' | 'auth' | 'category' | 'coupon' | 'export' | 'store-info' | 'vendor';
  targetId?: string;
  detailsKh: string;
  detailsEn: string;
  ip?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  productAttachment?: Product;
  orderAttachment?: Partial<Order>;
  actionType?: 'product_inquiry' | 'order_summary' | 'payment_qr' | 'order_confirmation' | 'custom_reply';
  status?: 'sent' | 'delivered' | 'read';
}
