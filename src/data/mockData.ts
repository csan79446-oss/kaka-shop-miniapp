import {
  AdminUser,
  AuditLog,
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

export const EXCHANGE_RATE_KHR = 4100; // 1 USD = 4,100 KHR

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'vendor-01',
    nameKh: 'KAKA Gadgets (ផ្សារ២៤ ហ្គាដជេត)',
    nameEn: 'KAKA Official Gadgets & Tech',
    slug: 'kaka-gadgets',
    logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    descriptionKh: 'ហាងលក់នាឡិកាឆ្លាតវៃ កាសប៊្លូធូស និងឧបករណ៍អេឡិចត្រូនិកទំនើបគុណភាពខ្ពស់ ធានា ១ ឆ្នាំពេញ។',
    descriptionEn: 'Official high-tech gadgets, premium smartwatches and audio accessories with 1-year warranty.',
    ownerName: 'សុខ វិបុល (Sok Vibol)',
    ownerPhone: '+855 12 889 977',
    ownerEmail: 'vibol@phsar24.app',
    telegramUsername: 'kaka_gadgets_bot',
    addressKh: 'ផ្ទះលេខ #168E, ផ្លូវ 271, សង្កាត់បឹងទំពុន, ខណ្ឌមានជ័យ, រាជធានីភ្នំពេញ',
    addressEn: '#168E, Street 271, Sangkat Boeng Tumpun, Khan Meanchey, Phnom Penh',
    city: 'Phnom Penh',
    category: 'gadgets',
    rating: 4.9,
    reviewCount: 148,
    isVerified: true,
    status: 'active',
    commissionRate: 5,
    bankName: 'ABA Bank',
    bankAccountName: 'PHSAR24 GADGETS CO., LTD',
    bankAccountNumber: '000 123 456',
    bakongId: 'kaka_gadgets@aba',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'vendor-02',
    nameKh: 'អង្គរ ឱសថបូរាណ & សុខភាព (Angkor Herbal & Health)',
    nameEn: 'Angkor Herbal & Natural Remedies',
    slug: 'angkor-herbal',
    logo: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    descriptionKh: 'ឱសថបូរាណខ្មែរសុទ្ធ ១០០% ផ្សំពីរុក្ខជាតិធម្មជាតិ មានច្បាប់អនុញ្ញាតត្រឹមត្រូវពីក្រសួងសុខាភិបាល (MoH Certified)។',
    descriptionEn: '100% natural Cambodian herbal remedies and wellness extracts, fully certified by the Ministry of Health.',
    ownerName: 'ម៉ៅ សុភា (Mao Sorphea)',
    ownerPhone: '+855 12 345 678',
    ownerEmail: 'angkor.herbal@gmail.com',
    telegramUsername: 'angkor_herbal_kh',
    addressKh: 'ផ្ទះលេខ #88, ផ្លូវជាតិលេខ ៦, សង្កាត់ស្វាយដង្គំ, ក្រុងសៀមរាប',
    addressEn: '#88, National Road 6, Sangkat Svay Dangkum, Siem Reap',
    city: 'Siem Reap',
    category: 'health',
    rating: 4.95,
    reviewCount: 312,
    isVerified: true,
    status: 'active',
    commissionRate: 5,
    bankName: 'ABA Bank',
    bankAccountName: 'ANGKOR HERBAL HEALTHCARE',
    bankAccountNumber: '000 789 101',
    bakongId: 'angkor_herbal@aba',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-28T14:00:00Z',
  },
  {
    id: 'vendor-03',
    nameKh: 'សប្បាយ ម៉ូត & គ្រឿងតុបតែង (Sabay Modern Fashion)',
    nameEn: 'Sabay Modern Fashion & Living',
    slug: 'sabay-fashion',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=160&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    descriptionKh: 'កាបូប កែវការពារពន្លឺ សម្លៀកបំពាក់ និងសម្ភារៈតុបតែងស្អាតៗទាន់សម័យ ទាន់រដូវកាល។',
    descriptionEn: 'Trendy modern apparel, handcrafted bags, premium sunglasses and lifestyle accessories.',
    ownerName: 'ចាន់ ដាលីស (Chan Dalis)',
    ownerPhone: '+855 85 222 333',
    ownerEmail: 'dalis@sabayfashion.kh',
    telegramUsername: 'sabay_fashion_admin',
    addressKh: 'ផ្ទះលេខ #12, ផ្លូវ 51 (Pasteur), សង្កាត់បឹងកេងកង១, ខណ្ឌចំការមន, រាជធានីភ្នំពេញ',
    addressEn: '#12, Street 51, Sangkat Boeng Keng Kang 1, Khan Chamkarmon, Phnom Penh',
    city: 'Phnom Penh',
    category: 'fashion',
    rating: 4.85,
    reviewCount: 96,
    isVerified: true,
    status: 'active',
    commissionRate: 5,
    bankName: 'ACLEDA Bank',
    bankAccountName: 'CHAN DALIS (SABAY STORE)',
    bankAccountNumber: '012 345 678 999',
    bakongId: '085222333@aclb',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-29T16:00:00Z',
  },
];

export const INITIAL_STORE_INFO: StoreInfo = {
  nameKh: 'Phsar24 (ផ្សារ២៤)',
  nameEn: 'Phsar24 Marketplace',
  taglineKh: 'ផ្សារអនឡាញពហុហាងឈានមុខគេនៅកម្ពុជា ទិញលក់ទំនិញ ២៤ ម៉ោងតាម Telegram',
  taglineEn: 'Cambodia Leading 24/7 Multi-Vendor Telegram Marketplace',
  addressKh: 'ផ្ទះលេខ #168E, ផ្លូវ 271, សង្កាត់បឹងទំពុន, ខណ្ឌមានជ័យ, រាជធានីភ្នំពេញ (ជិតផ្សារដើមថ្កូវ)',
  addressEn: '#168E, Street 271, Sangkat Boeng Tumpun, Khan Meanchey, Phnom Penh, Cambodia',
  city: 'Phnom Penh, Cambodia',
  phone1: '+855 12 889 977',
  phone2: '+855 96 889 9777',
  telegramUsername: 'phsar24_admin',
  telegramChannel: 'phsar24_official',
  facebookPage: 'fb.com/phsar24.kh',
  email: 'support@phsar24.app',
  workingHoursKh: 'រៀងរាល់ថ្ងៃ ២៤ ម៉ោង / ៧ ថ្ងៃ (Open 24/7)',
  workingHoursEn: 'Everyday 24 Hours / 7 Days (Open 24/7)',
  googleMapsUrl: 'https://maps.google.com/?q=Phnom+Penh+Cambodia',
};

export const INITIAL_STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'loc-1',
    nameKh: 'សាខាចម្បង - ផ្សារដើមថ្កូវ',
    nameEn: 'Main Branch - Doeum Thkov',
    addressKh: 'ផ្ទះលេខ #168E, ផ្លូវ 271, សង្កាត់បឹងទំពុន, ខណ្ឌមានជ័យ, រាជធានីភ្នំពេញ',
    addressEn: '#168E, St 271, Sangkat Boeng Tumpun, Khan Meanchey, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 12 889 977',
    telegramUsername: 'kakashop_admin',
    workingHoursKh: '៨:០០ ព្រឹក - ៩:០០ យប់ (ច័ន្ទ - អាទិត្យ)',
    workingHoursEn: '8:00 AM - 9:00 PM (Mon - Sun)',
    googleMapsUrl: 'https://maps.google.com/?q=Phnom+Penh+Cambodia',
    isPrimary: true,
    isActive: true,
  },
  {
    id: 'loc-2',
    nameKh: 'សាខាទី២ - ទួលគោក',
    nameEn: 'Branch 2 - Toul Kork',
    addressKh: 'ផ្ទះលេខ #45B, ផ្លូវ 315, សង្កាត់បឹងកក់២, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ',
    addressEn: '#45B, St 315, Sangkat Boeng Kak 2, Khan Toul Kork, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 96 889 9777',
    telegramUsername: 'kakashop_tk',
    workingHoursKh: '៨:៣០ ព្រឹក - ៨:៣០ យប់',
    workingHoursEn: '8:30 AM - 8:30 PM',
    googleMapsUrl: 'https://maps.google.com/?q=Toul+Kork+Phnom+Penh',
    isPrimary: false,
    isActive: true,
  },
];

export const INITIAL_STORE_INFOS: StoreInfoItem[] = [
  {
    id: 'info-1',
    titleKh: 'សេវាដឹកជញ្ជូនរហ័សទូទាំងប្រទេស',
    titleEn: 'Nationwide Express Delivery',
    contentKh: 'ដឹកជញ្ជូនឥតគិតថ្លៃក្នុងរាជធានីភ្នំពេញ (រយៈពេល ១-២ ម៉ោង) និងផ្ញើតាមបណ្តាខេត្តរយៈពេល ១-២ ថ្ងៃ តាមរយៈក្រុមហ៊ុនដឹកជញ្ជូនដៃគូផ្លូវការ។',
    contentEn: 'Free delivery in Phnom Penh within 1-2 hours, and 1-2 days to provinces via our certified delivery partners.',
    category: 'delivery',
    icon: 'Truck',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'info-2',
    titleKh: 'ការធានាគុណភាពផលិតផលសុទ្ធ ១០០%',
    titleEn: '100% Genuine Quality Guarantee',
    contentKh: 'រាល់ផលិតផលទាំងអស់ដែលទិញពី KAKA Shop មានការធានាត្រឹមត្រូវរយៈពេលពី ៦ ខែ ដល់ ១ ឆ្នាំ ទៅលើបញ្ហាបច្ចេកទេស។',
    contentEn: 'All products purchased from KAKA Shop come with a certified warranty from 6 months to 1 year.',
    category: 'warranty',
    icon: 'ShieldCheck',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'info-3',
    titleKh: 'គោលការណ៍ប្តូរ និងសងប្រាក់វិញ',
    titleEn: 'Return & Exchange Policy',
    contentKh: 'អតិថិជនអាចស្នើសុំប្តូរទំនិញថ្មី ឬប្តូរទំហំ/ពណ៌បានក្នុងរយៈពេល ៣ ថ្ងៃបន្ទាប់ពីទទួលទំនិញ (ទំនិញត្រូវរក្សាប្រអប់ និងស្ថានភាពដើម)។',
    contentEn: 'Customers can request an exchange or replacement within 3 days of receiving items with original packaging intact.',
    category: 'policy',
    icon: 'RotateCcw',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const CATEGORIES: Category[] = [
  { id: 'all', nameKh: 'ទាំងអស់', nameEn: 'All Items', icon: 'Sparkles' },
  { id: 'herbal', nameKh: '🌿 ឱសថបុរាណ & សុខភាព', nameEn: 'Traditional Medicine', icon: 'Leaf' },
  { id: 'gadgets', nameKh: 'គ្រឿងអេឡិចត្រូនិក', nameEn: 'Gadgets & Tech', icon: 'Smartphone' },
  { id: 'fashion', nameKh: 'ម៉ូដ & សម្លៀកបំពាក់', nameEn: 'Fashion', icon: 'Shirt' },
  { id: 'lifestyle', nameKh: 'កាបូប & គ្រឿងតុបតែង', nameEn: 'Lifestyle & Bags', icon: 'ShoppingBag' },
  { id: 'beverage', nameKh: 'ភេសជ្ជៈ & កាហ្វេ', nameEn: 'Coffee & Drinks', icon: 'Coffee' },
];

// High-fidelity self-contained SVG Data URIs for Zero-Broken-Image guarantee
export const PRODUCT_IMAGE_PRESETS: Record<string, string> = {
  smartwatch: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="50%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="url(#bg)"/>
      <circle cx="300" cy="225" r="160" fill="url(#glow)"/>
      <!-- Watch Strap Top -->
      <path d="M250,50 L350,50 L345,150 L255,150 Z" fill="#334155" rx="10"/>
      <!-- Watch Strap Bottom -->
      <path d="M255,300 L345,300 L350,400 L250,400 Z" fill="#334155" rx="10"/>
      <!-- Watch Body -->
      <rect x="220" y="130" width="160" height="190" rx="36" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <!-- Watch Screen -->
      <rect x="232" y="142" width="136" height="166" rx="28" fill="url(#screen)"/>
      <!-- Screen UI Content -->
      <text x="300" y="200" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">10:45</text>
      <text x="300" y="230" fill="#bae6fd" font-family="sans-serif" font-size="14" text-anchor="middle">MON, 28 SEP</text>
      <circle cx="300" cy="265" r="16" fill="none" stroke="#ffffff" stroke-width="3"/>
      <path d="M295,265 L299,269 L306,261" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <!-- Watch crown -->
      <rect x="380" y="185" width="8" height="32" rx="3" fill="#94a3b8"/>
    </svg>
  `)}`,
  earbuds: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <radialGradient id="case" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="70%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="url(#bg2)"/>
      <!-- Charging Case Open -->
      <ellipse cx="300" cy="270" rx="140" ry="85" fill="url(#case)" stroke="#475569" stroke-width="3"/>
      <ellipse cx="300" cy="250" rx="115" ry="60" fill="#020617"/>
      <!-- Left Pod -->
      <g transform="translate(250, 170) rotate(-15)">
        <ellipse cx="0" cy="0" rx="26" ry="32" fill="#38bdf8"/>
        <rect x="-8" y="10" width="16" height="55" rx="8" fill="#e2e8f0"/>
        <circle cx="0" cy="-6" r="6" fill="#0369a1"/>
      </g>
      <!-- Right Pod -->
      <g transform="translate(350, 170) rotate(15)">
        <ellipse cx="0" cy="0" rx="26" ry="32" fill="#38bdf8"/>
        <rect x="-8" y="10" width="16" height="55" rx="8" fill="#e2e8f0"/>
        <circle cx="0" cy="-6" r="6" fill="#0369a1"/>
      </g>
      <!-- LED Indicator -->
      <circle cx="300" cy="305" r="5" fill="#22c55e"/>
    </svg>
  `)}`,
  bag: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="bagBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d1e17"/>
          <stop offset="100%" stop-color="#140f0c"/>
        </linearGradient>
        <linearGradient id="leather" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="60%" stop-color="#78350f"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#bagBg)"/>
      <!-- Strap -->
      <path d="M220,160 C220,70 380,70 380,160" fill="none" stroke="#92400e" stroke-width="12" stroke-linecap="round"/>
      <!-- Bag Body -->
      <rect x="180" y="160" width="240" height="190" rx="30" fill="url(#leather)" stroke="#d97706" stroke-width="3"/>
      <!-- Bag Flap -->
      <path d="M180,160 L420,160 L400,260 L200,260 Z" fill="#92400e" stroke="#b45309" stroke-width="2"/>
      <!-- Golden Clasp -->
      <rect x="285" y="245" width="30" height="30" rx="6" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="300" cy="260" r="4" fill="#78350f"/>
      <line x1="200" y1="200" x2="400" y2="200" stroke="#78350f" stroke-dasharray="6,4" stroke-width="2"/>
    </svg>
  `)}`,
  coffee: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1c1917"/>
          <stop offset="100%" stop-color="#292524"/>
        </linearGradient>
        <linearGradient id="drink" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="35%" stop-color="#d97706"/>
          <stop offset="70%" stop-color="#78350f"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#cbg)"/>
      <!-- Cup Body -->
      <path d="M220,140 L380,140 L350,360 L250,360 Z" fill="url(#drink)" stroke="#e7e5e4" stroke-width="4" rx="10"/>
      <!-- Ice cubes inside -->
      <rect x="260" y="190" width="35" height="35" rx="6" fill="#ffffff" fill-opacity="0.35"/>
      <rect x="305" y="210" width="35" height="35" rx="6" fill="#ffffff" fill-opacity="0.35"/>
      <!-- Straw -->
      <line x1="330" y1="90" x2="280" y2="340" stroke="#10b981" stroke-width="10" stroke-linecap="round"/>
      <!-- Cup Lid -->
      <ellipse cx="300" cy="140" rx="82" ry="16" fill="#f5f5f4" stroke="#d6d3d1" stroke-width="3"/>
      <!-- Droplets/Cold -->
      <circle cx="240" cy="250" r="3" fill="#ffffff" fill-opacity="0.6"/>
      <circle cx="340" cy="290" r="4" fill="#ffffff" fill-opacity="0.6"/>
    </svg>
  `)}`,
  hoodie: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <rect width="600" height="450" fill="#18181b"/>
      <!-- Hoodie Graphic -->
      <path d="M240,110 Q300,140 360,110 L440,180 L400,240 L370,210 L370,370 L230,370 L230,210 L200,240 L160,180 Z" fill="#27272a" stroke="#52525b" stroke-width="3"/>
      <!-- Hood Drawstrings -->
      <path d="M280,135 Q285,210 275,230" fill="none" stroke="#e4e4e7" stroke-width="4" stroke-linecap="round"/>
      <path d="M320,135 Q315,210 325,230" fill="none" stroke="#e4e4e7" stroke-width="4" stroke-linecap="round"/>
      <!-- Logo print on chest -->
      <text x="300" y="260" fill="#38bdf8" font-family="sans-serif" font-size="22" font-weight="900" text-anchor="middle">KAKA 26</text>
    </svg>
  `)}`,
  powerbank: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <rect width="600" height="450" fill="#0f172a"/>
      <rect x="220" y="120" width="160" height="230" rx="20" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="300" cy="180" r="28" fill="#0369a1" fill-opacity="0.3"/>
      <path d="M296,165 L292,180 L308,180 L302,197" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Digital Display -->
      <rect x="260" y="240" width="80" height="30" rx="6" fill="#020617"/>
      <text x="300" y="262" fill="#34d399" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">100%</text>
    </svg>
  `)}`,
  herbal_tonic: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="herbBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="100%" stop-color="#022c22"/>
        </linearGradient>
        <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#78350f"/>
          <stop offset="50%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#herbBg)"/>
      <!-- Glow -->
      <circle cx="300" cy="225" r="140" fill="#10b981" fill-opacity="0.15"/>
      <!-- Bottle neck & cap -->
      <rect x="270" y="80" width="60" height="35" rx="8" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>
      <rect x="280" y="115" width="40" height="45" fill="#78350f"/>
      <!-- Bottle Body -->
      <rect x="220" y="160" width="160" height="220" rx="28" fill="url(#glass)" stroke="#d97706" stroke-width="3"/>
      <!-- Label -->
      <rect x="235" y="195" width="130" height="150" rx="12" fill="#fffbeb" stroke="#b45309" stroke-width="2"/>
      <circle cx="300" cy="235" r="22" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
      <!-- Leaf icon in label -->
      <path d="M300,218 C285,232 288,252 300,252 C312,252 315,232 300,218 Z" fill="#059669"/>
      <text x="300" y="278" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">ឱសថបុរាណ</text>
      <text x="300" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#047857" text-anchor="middle">100% NATURAL</text>
      <text x="300" y="325" font-family="monospace" font-size="9" fill="#92400e" text-anchor="middle">CAM-MOH/2024</text>
    </svg>
  `)}`,
  herbal_tea: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
      <defs>
        <linearGradient id="teaBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#14532d"/>
          <stop offset="100%" stop-color="#052e16"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#teaBg)"/>
      <circle cx="300" cy="225" r="140" fill="#22c55e" fill-opacity="0.15"/>
      <!-- Tea Box -->
      <rect x="210" y="110" width="180" height="250" rx="16" fill="#fefce8" stroke="#16a34a" stroke-width="4"/>
      <rect x="225" y="125" width="150" height="220" rx="10" fill="#ffffff" stroke="#bbf7d0" stroke-width="1.5"/>
      <!-- Leaves -->
      <circle cx="300" cy="180" r="30" fill="#dcfce7"/>
      <path d="M300,160 C280,180 280,200 300,200 C320,200 320,180 300,160 Z" fill="#15803d"/>
      <text x="300" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="15" font-weight="bold" fill="#14532d" text-anchor="middle">តែឱសថរុក្ខជាតិ</text>
      <text x="300" y="258" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#16a34a" text-anchor="middle">ជំនួយថ្លើម និងបន្សាបជាតិពុល</text>
      <rect x="245" y="280" width="110" height="24" rx="12" fill="#dcfce7"/>
      <text x="300" y="296" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#15803d" text-anchor="middle">GMP CERTIFIED</text>
    </svg>
  `)}`
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-herb-001',
    vendorId: 'vendor-02',
    nameKh: 'ថ្នាំកម្លាំងសរសៃ និងសន្លាក់បុរាណខ្មែរ (ឱសថបុរាណមានអាជ្ញាប័ណ្ណ)',
    nameEn: 'Khmer Traditional Joint & Muscle Tonic (Licensed Herbal Medicine)',
    descriptionKh: 'ផ្សំពីរុក្ខជាតិឱសថធម្មជាតិសុទ្ធ ១០០% ជួយបំបាត់ការចុកចាប់សន្លាក់ ដៃជើងស្ពឹកស្រពន់ ឈឺចង្កេះខ្នង និងជំនួយសរសៃឈាមរត់ស្រួល។ ទទួលស្គាល់ដោយក្រសួងសុខាភិបាល។',
    descriptionEn: '100% natural herbal tonic for joint and muscle relief, circulation boost, and vitality. Certified by Ministry of Health.',
    price: 18.00,
    originalPrice: 24.00,
    category: 'herbal',
    image: PRODUCT_IMAGE_PRESETS.herbal_tonic,
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    stock: 45,
    badge: 'hot',
    colors: ['ដបកែវបុរាណ 500ml', 'ឈុត ២ ដប (Pro Pack)'],
    sizes: ['500ml (ប្រើបាន ១ ខែ)'],
    rating: 5.0,
    reviewCount: 64,
    isTraditionalMedicine: true,
    licenseNumber: 'CAM-MOH-TRM/2024/0988',
    dosageKh: 'ញ៉ាំមួយថ្ងៃ ២ ដង (ព្រឹក ១ ស្លាបព្រាបាយ និងល្ងាច ១ ស្លាបព្រាបាយ ក្រោយបាយ)',
    dosageEn: 'Take 1 tablespoon twice daily after meals.',
    ingredientsKh: 'រមៀតលឿង, ខ្ញីព្រៃ, យិនស៊ិនធម្មជាតិ, ដើមថ្នាំសរសៃ, ទឹកឃ្មុំព្រៃសុទ្ធ ១០០%',
    ingredientsEn: 'Wild Turmeric, Wild Ginger, Mountain Ginseng, Natural Herbal Roots, Pure Wild Honey.',
    createdAt: '2026-09-20T08:00:00Z',
    updatedAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'prod-herb-002',
    vendorId: 'vendor-02',
    nameKh: 'តែឱសថបុរាណធម្មជាតិ ជំនួយថ្លើម និងបន្សាបជាតិពុល (Detox Tea)',
    nameEn: 'Natural Herbal Detox Tea for Liver & Vitality',
    descriptionKh: 'តែរុក្ខជាតិធម្មជាតិ ជួយបន្សាបជាតិពុល សម្រួលដំណេក លាងសម្អាតថ្លើម និងកាត់បន្ថយជាតិខ្លាញ់ក្នុងឈាម។ ស្តង់ដារ GMP អនាម័យខ្ពស់។',
    descriptionEn: 'Pure herbal detox tea bags, promotes restful sleep, liver health, and cholesterol balance. GMP certified hygiene.',
    price: 12.50,
    originalPrice: 16.00,
    category: 'herbal',
    image: PRODUCT_IMAGE_PRESETS.herbal_tea,
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    stock: 60,
    badge: 'featured',
    colors: ['ប្រអប់ ២០ កញ្ចប់តែ', 'ប្រអប់ធំ ៤០ កញ្ចប់'],
    sizes: ['20 Tea Bags (ប្រអប់)'],
    rating: 4.9,
    reviewCount: 42,
    isTraditionalMedicine: true,
    licenseNumber: 'GMP-KH-2024-QC551',
    dosageKh: 'ឆុងជាមួយទឹកក្តៅពុះ មួយថ្ងៃ ១ ទៅ ២ កញ្ចប់ ពិសារជំនួសទឹកតែធម្មតា',
    dosageEn: 'Steep in boiling water for 5 minutes. Enjoy 1-2 cups daily.',
    ingredientsKh: 'ស្លឹកតែព្រៃ, ផ្កាឈូករ័ត្នបុរាណ, ផ្កាចាហួយ, ស្មៅផ្អែមធម្មជាតិ',
    ingredientsEn: 'Wild Herbal Leaves, Natural Lotus Petals, Stevia Leaf.',
    createdAt: '2026-09-21T09:00:00Z',
    updatedAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'prod-001',
    vendorId: 'vendor-01',
    nameKh: 'នាឡិកាឆ្លាតវៃ KAKA Smartwatch Pro X',
    nameEn: 'KAKA Smartwatch Pro X',
    descriptionKh: 'អេក្រង់ AMOLED 1.95" ភ្លឺច្បាស់ អាចវាស់ចង្វាក់បេះដូង អុកស៊ីសែនក្នុងឈាម និងការពារទឹកកម្រិត 5ATM។ ថាមពលថ្មប្រើបានរហូតដល់ 14 ថ្ងៃ។',
    descriptionEn: 'Vibrant 1.95" AMOLED display, continuous heart rate and SpO2 monitoring, 5ATM waterproof, and up to 14 days battery life.',
    price: 49.00,
    originalPrice: 65.00,
    category: 'gadgets',
    image: PRODUCT_IMAGE_PRESETS.smartwatch,
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    stock: 24,
    badge: 'hot',
    colors: ['ខ្មៅ (Midnight Black)', 'ប្រាក់ (Silver Titanium)', 'ខៀវចាស់ (Ocean Blue)'],
    sizes: ['42mm', '46mm'],
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-25T14:30:00Z',
  },
  {
    id: 'prod-002',
    vendorId: 'vendor-01',
    nameKh: 'កាសឥតខ្សែ KAKA Pods ANC Studio',
    nameEn: 'KAKA Wireless Pods ANC Studio',
    descriptionKh: 'បំពាក់បច្ចេកវិទ្យាកាត់បន្ថយសម្លេងរំខាន (Active Noise Cancellation) សំឡេងបាសធ្ងន់ច្បាស់ល្អ ភ្ជាប់ប៊្លូធូស 5.4 លឿនរហ័ស។',
    descriptionEn: 'Premium Active Noise Cancellation, high fidelity studio bass, low latency Bluetooth 5.4, and comfortable ergonomic fit.',
    price: 35.00,
    originalPrice: 45.00,
    category: 'gadgets',
    image: PRODUCT_IMAGE_PRESETS.earbuds,
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    stock: 18,
    badge: 'sale',
    colors: ['ស (Pure White)', 'ខ្មៅ (Matte Black)', 'ខៀវផ្ទៃមេឃ (Sky Cyan)'],
    sizes: ['Standard'],
    rating: 4.8,
    reviewCount: 26,
    createdAt: '2026-09-21T11:20:00Z',
    updatedAt: '2026-09-26T09:15:00Z',
  },
  {
    id: 'prod-003',
    vendorId: 'vendor-03',
    nameKh: 'កាបូបស្បែកស្ពាយចំហៀង KAKA Leather Sling',
    nameEn: 'KAKA Minimal Leather Sling Bag',
    descriptionKh: 'កាបូបស្បែកពិតប្រណិត មិនជ្រាបទឹក មានប្រឡោះដាក់ទូរស័ព្ទ កាបូបលុយ និង iPad Mini យ៉ាងមានរបៀប។ ម៉ូដទាន់សម័យបំផុត។',
    descriptionEn: 'Genuine vintage leather sling bag, waterproof lining, structured compartments for phone, wallet, and iPad Mini.',
    price: 28.50,
    originalPrice: 38.00,
    category: 'lifestyle',
    image: PRODUCT_IMAGE_PRESETS.bag,
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    stock: 12,
    badge: 'featured',
    colors: ['ត្នោតចាស់ (Vintage Brown)', 'ខ្មៅបុរាណ (Classic Black)', 'កាហ្វេ (Espresso)'],
    sizes: ['Compact', 'Medium'],
    rating: 5.0,
    reviewCount: 19,
    createdAt: '2026-09-22T08:45:00Z',
    updatedAt: '2026-09-27T16:00:00Z',
  },
  {
    id: 'prod-004',
    vendorId: 'vendor-03',
    nameKh: 'អាវយឺត KAKA Heavyweight Streetwear Hoodie',
    nameEn: 'KAKA Heavyweight Oversized Hoodie',
    descriptionKh: 'សាច់ក្រណាត់កប្បាស 100% Cotton 380gsm ទន់ស្រួលស្លៀក មិនយារ មិនចេញពណ៌ រចនាបែប Oversized បែបយុវវ័យសម័យថ្មី។',
    descriptionEn: '100% combed cotton 380gsm heavyweight fleece, anti-shrink pre-washed, relaxed modern streetwear silhouette.',
    price: 26.00,
    originalPrice: 32.00,
    category: 'fashion',
    image: PRODUCT_IMAGE_PRESETS.hoodie,
    stock: 35,
    badge: 'new',
    colors: ['ខ្មៅ (Pitch Black)', 'សាច់ក្រណាត់ (Heather Grey)', 'បៃតងព្រៃ (Forest Green)', 'ស្វាយ (Lavender)'],
    sizes: ['M (50-65kg)', 'L (65-75kg)', 'XL (75-88kg)', 'XXL (>88kg)'],
    rating: 4.9,
    reviewCount: 44,
    createdAt: '2026-09-24T12:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z',
  },
  {
    id: 'prod-005',
    vendorId: 'vendor-01',
    nameKh: 'កាហ្វេ KAKA Artisan Salted Caramel Latte (ដប)',
    nameEn: 'KAKA Artisan Salted Caramel Latte (Cold Bottle)',
    descriptionKh: 'កាហ្វេប្រណិតស្រស់ គ្រាប់អារ៉ាប៊ីកា 100% ឆុងជាមួយទឹកដោះគោស្រស់ និងខារ៉ាមែលរសជាតិប្រៃផ្អែមឈ្ងុយឆ្ងាញ់ត្រជាក់ស្រួល។',
    descriptionEn: 'Single origin 100% Arabica cold brew blended with fresh dairy and artisan salted caramel syrup. Ready to drink.',
    price: 3.50,
    originalPrice: 4.50,
    category: 'beverage',
    image: PRODUCT_IMAGE_PRESETS.coffee,
    stock: 50,
    badge: 'hot',
    colors: ['ស្ករធម្មជាតិ (Original Sweet)', 'ផ្អែមតិច 50% (Less Sweet)', 'គ្មានជាតិស្ករ 0% (No Sugar)'],
    sizes: ['350ml', '500ml'],
    rating: 4.7,
    reviewCount: 52,
    createdAt: '2026-09-25T07:30:00Z',
    updatedAt: '2026-09-28T08:00:00Z',
  },
  {
    id: 'prod-006',
    vendorId: 'vendor-01',
    nameKh: 'ដុំសាកថ្ម KAKA 20000mAh 65W Fast Charge',
    nameEn: 'KAKA 20000mAh 65W PD PowerBank',
    descriptionKh: 'កម្លាំងសាកល្បឿនលឿន 65W PD សាកបានទាំង Laptop, iPad និងស្មាតហ្វូន មានអេក្រង់ឌីជីថលបង្ហាញភាគរយថ្ម។',
    descriptionEn: 'Ultra-fast 65W Power Delivery powerbank with digital percentage display, dual Type-C and USB ports.',
    price: 32.00,
    originalPrice: 40.00,
    category: 'gadgets',
    image: PRODUCT_IMAGE_PRESETS.powerbank,
    stock: 19,
    colors: ['ខ្មៅគ្រើម (Textured Black)', 'ប្រផេះអវកាស (Space Grey)'],
    sizes: ['20000mAh'],
    rating: 4.9,
    reviewCount: 31,
    createdAt: '2026-09-26T15:10:00Z',
    updatedAt: '2026-09-26T15:10:00Z',
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-01',
    name: 'SMUN Tha ស្មុន ថា',
    username: 'smuntha.superadmin',
    role: 'SUPER_ADMIN',
    // Platform Super Admin / Marketplace Owner: no vendorId (controls all vendors)
    pin: '1234',
    avatar: '👑',
    active: true,
    lastLogin: '2026-10-06T00:00:00Z'
  },
  {
    id: 'admin-02',
    name: 'ចាន់ ស្រីមុំ (Chan Sreymom)',
    username: 'sreymom.manager',
    role: 'STORE_MANAGER',
    vendorId: 'vendor-01',
    pin: '2345',
    avatar: '👩‍💼',
    active: true,
    lastLogin: '2026-09-28T20:15:00Z'
  },
  {
    id: 'admin-03',
    name: 'គឹម ហេង (Kim Heng)',
    username: 'heng.support',
    role: 'SUPPORT_STAFF',
    vendorId: 'vendor-01',
    pin: '3456',
    avatar: '👨‍💻',
    active: true,
    lastLogin: '2026-09-28T21:30:00Z'
  },
  {
    id: 'admin-04',
    name: 'ម៉ៅ សុភា (Mao Sorphea)',
    username: 'angkor.manager',
    role: 'STORE_MANAGER',
    vendorId: 'vendor-02',
    pin: '8888',
    avatar: '👩‍⚕️',
    active: true,
    lastLogin: '2026-09-28T21:00:00Z'
  },
  {
    id: 'admin-05',
    name: 'ចាន់ ដាលីស (Chan Dalis)',
    username: 'sabay.manager',
    role: 'STORE_MANAGER',
    vendorId: 'vendor-03',
    pin: '9999',
    avatar: '👗',
    active: true,
    lastLogin: '2026-09-28T22:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'KAKA-2609-001',
    vendorId: 'vendor-02',
    customerName: 'វ៉ាន់នី បញ្ញា (Vanny Panha)',
    customerPhone: '098 765 432',
    customerAddress: 'ផ្ទះលេខ 42 ផ្លូវ 271 សង្កាត់បឹងទំពុន ខណ្ឌមានជ័យ រាជធានីភ្នំពេញ',
    telegramUsername: '@panha_kh',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[4], quantity: 2 }
    ],
    totalAmount: 56.00,
    currency: 'USD',
    paymentMethod: 'khqr',
    paymentStatus: 'paid',
    status: 'delivering',
    notes: 'សូមខលមុនមកដល់ 15 នាទី',
    createdAt: '2026-09-28T19:30:00Z',
    updatedAt: '2026-09-28T20:10:00Z',
    createdVia: 'chat'
  },
  {
    id: 'ord-102',
    orderNumber: 'KAKA-2609-002',
    vendorId: 'vendor-01',
    customerName: 'លីណា ដាលីស (Lina Dalis)',
    customerPhone: '012 345 678',
    customerAddress: 'ខុនដូ The Bridge បន្ទប់ 1804 សង្កាត់ទន្លេបាសាក់ រាជធានីភ្នំពេញ',
    telegramUsername: '@dalis_lina',
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    totalAmount: 35.00,
    currency: 'USD',
    paymentMethod: 'aba',
    paymentStatus: 'verified',
    status: 'completed',
    createdAt: '2026-09-28T18:15:00Z',
    updatedAt: '2026-09-28T19:00:00Z',
    createdVia: 'chat'
  },
  {
    id: 'ord-103',
    orderNumber: 'KAKA-2609-003',
    vendorId: 'vendor-03',
    customerName: 'ម៉ៅ វុទ្ធី (Mao Vutthy)',
    customerPhone: '085 222 333',
    customerAddress: 'បុរីពិភពថ្មី ចំការដូង ផ្ទះលេខ 15 ផ្លូវ 03 រាជធានីភ្នំពេញ',
    telegramUsername: '@vutthy_mao',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1 },
      { product: INITIAL_PRODUCTS[3], quantity: 1 }
    ],
    totalAmount: 54.50,
    currency: 'USD',
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'pending',
    notes: 'ទូទាត់ប្រាក់ពេលទំនិញមកដល់',
    createdAt: '2026-09-28T22:10:00Z',
    updatedAt: '2026-09-28T22:10:00Z',
    createdVia: 'cart'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-28T22:45:10Z',
    adminId: 'admin-01',
    adminName: 'SMUN Tha ស្មុន ថា',
    role: 'SUPER_ADMIN',
    action: 'ADMIN_LOGIN',
    targetType: 'auth',
    detailsKh: 'បានចូលប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រងជោគជ័យ',
    detailsEn: 'Successfully logged into admin dashboard',
    ip: '192.168.1.10'
  },
  {
    id: 'log-002',
    timestamp: '2026-09-28T22:15:30Z',
    adminId: 'admin-02',
    adminName: 'ចាន់ ស្រីមុំ (Chan Sreymom)',
    role: 'STORE_MANAGER',
    action: 'PRODUCT_UPDATE',
    targetType: 'product',
    targetId: 'prod-001',
    detailsKh: 'បានកែសម្រួលតម្លៃបញ្ចុះ និងស្តុកផលិតផល KAKA Smartwatch Pro X',
    detailsEn: 'Updated discount price and stock for KAKA Smartwatch Pro X',
    ip: '192.168.1.15'
  },
  {
    id: 'log-003',
    timestamp: '2026-09-28T20:10:05Z',
    adminId: 'admin-03',
    adminName: 'គឹម ហេង (Kim Heng)',
    role: 'SUPPORT_STAFF',
    action: 'ORDER_STATUS_UPDATE',
    targetType: 'order',
    targetId: 'ord-101',
    detailsKh: 'បានប្តូរស្ថានភាពការកុម្ម៉ង់ KAKA-2609-001 ទៅជា "កំពុងដឹកជញ្ជូន"',
    detailsEn: 'Updated order status for KAKA-2609-001 to "Delivering"',
    ip: '192.168.1.22'
  },
  {
    id: 'log-004',
    timestamp: '2026-09-27T16:00:00Z',
    adminId: 'admin-01',
    adminName: 'SMUN Tha ស្មុន ថា',
    role: 'SUPER_ADMIN',
    action: 'PRODUCT_CREATE',
    targetType: 'product',
    targetId: 'prod-003',
    detailsKh: 'បានបន្ថែមផលិតផលថ្មី: កាបូបស្បែកស្ពាយចំហៀង KAKA Leather Sling',
    detailsEn: 'Created new product: KAKA Minimal Leather Sling Bag',
    ip: '192.168.1.10'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'bot',
    text: 'សួស្តីបងចាស! នាងខ្ញុំសូមស្វាគមន៍មកកាន់ Phsar24 (ផ្សារ២៤) 🌟 ផ្សារអនឡាញទំនើបកម្ពុជា! តើបងមានចំណាប់អារម្មណ៍លើផលិតផលមួយណា ឬចង់ឱ្យប្អូនស្រីជួយប្រឹក្សាលើមុខទំនិញណាដែរចាស? ប្អូនស្រីរីករាយនឹងជួយឆ្លើយសំណួរ និងរៀបចំកញ្ចប់ដឹកជូនបងដល់មុខផ្ទះភ្លាមៗចាស!',
    timestamp: '2026-09-28T22:00:00Z',
    status: 'read'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-01',
    code: 'KAKA2026',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 20,
    maxDiscount: 10,
    expiryDate: '2026-12-31',
    usageCount: 42,
    maxUsage: 500,
    active: true,
    descriptionKh: 'បញ្ចុះតម្លៃ 15% សម្រាប់ការកុម្ម៉ង់ចាប់ពី $20 ឡើង',
    descriptionEn: '15% OFF for orders over $20 (Max $10)',
  },
  {
    id: 'cp-02',
    code: 'FREESHIP',
    discountType: 'free_shipping',
    discountValue: 1.5,
    minOrderAmount: 15,
    expiryDate: '2026-12-31',
    usageCount: 88,
    active: true,
    descriptionKh: 'ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំងរាជធានីភ្នំពេញ',
    descriptionEn: 'Free standard delivery in Phnom Penh',
  },
  {
    id: 'cp-03',
    code: 'WELCOME',
    discountType: 'fixed',
    discountValue: 2.0,
    minOrderAmount: 10,
    expiryDate: '2026-12-31',
    usageCount: 19,
    maxUsage: 200,
    active: true,
    descriptionKh: 'កាដូស្វាគមន៍អតិថិជនថ្មី បញ្ចុះតម្លៃ $2.00 ភ្លាមៗ',
    descriptionEn: '$2.00 OFF welcome coupon for new shoppers',
  },
  {
    id: 'cp-04',
    code: 'VIP5',
    discountType: 'percentage',
    discountValue: 5,
    minOrderAmount: 0,
    expiryDate: '2026-12-31',
    usageCount: 15,
    active: true,
    descriptionKh: 'បញ្ចុះតម្លៃ 5% គ្មានដែនកំណត់',
    descriptionEn: '5% OFF any order for VIP members',
  },
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    authorName: 'ចាន់ថា សុខា (Chantha Sokha)',
    rating: 5,
    commentKh: 'នាឡិកានេះស្អាតណាស់ អេក្រង់ច្បាស់ល្អ ថ្មកាន់បានជិតពីរសប្តាហ៍មែន។ សេវាដឹកលឿន ១ ម៉ោងដល់!',
    commentEn: 'Amazing smartwatch! The AMOLED screen is super sharp and the battery really lasts 2 weeks. Delivered within 1 hour.',
    date: '2026-09-27T14:20:00Z',
    verifiedPurchase: true,
    avatar: '👨‍💼',
  },
  {
    id: 'rev-02',
    productId: 'prod-001',
    authorName: 'រតនា ម៉ាលី (Rathana Maly)',
    rating: 5,
    commentKh: 'ពណ៌ប្រាក់មើលទៅថ្លៃថ្នូរខ្លាំង វាស់បេះដូង និងជំហានដើរបានសុក្រិតល្អណាស់។ ពេញចិត្ត ១០០%!',
    commentEn: 'Silver Titanium looks ultra premium! Heart rate and steps tracking are very accurate. 100% satisfied!',
    date: '2026-09-26T10:15:00Z',
    verifiedPurchase: true,
    avatar: '👩‍💼',
  },
  {
    id: 'rev-03',
    productId: 'prod-002',
    authorName: 'ហេង ពិសិដ្ឋ (Heng Piseth)',
    rating: 5,
    commentKh: 'កាស ANC ស្ងាត់ល្អ បាសបុកណែនត្រចៀក សាកថ្មលឿន។ តម្លៃសមរម្យធៀបនឹងគុណភាព។',
    commentEn: 'Noise cancellation works wonderfully and the bass is punchy. Excellent value for money.',
    date: '2026-09-25T16:40:00Z',
    verifiedPurchase: true,
    avatar: '👨‍💻',
  },
  {
    id: 'rev-04',
    productId: 'prod-003',
    authorName: 'សុផល វីរៈ (Sophal Virak)',
    rating: 5,
    commentKh: 'ស្បែកទន់ល្អ រ៉ូតស្អាត ដាក់ iPad Mini ចូលសមល្មម ស្ពាយដើរលេងមើលទៅឡូយខ្លាំង។',
    commentEn: 'Supple leather, smooth zippers, fits my iPad Mini perfectly. Stylish for daily carry.',
    date: '2026-09-26T18:30:00Z',
    verifiedPurchase: true,
    avatar: '🧑',
  },
  {
    id: 'rev-05',
    productId: 'prod-004',
    authorName: 'លីដា សុជាតា (Lyda Socheata)',
    rating: 5,
    commentKh: 'អាវ Hoodie សាច់ក្រណាត់ក្រាស់ 380gsm ទន់ មិនក្តៅស្អុះ ស្លៀក oversize ស្អាតខ្លាំង!',
    commentEn: 'Heavyweight cotton fabric feels so cozy and high quality. The oversize fit is spot on.',
    date: '2026-09-27T09:10:00Z',
    verifiedPurchase: true,
    avatar: '👩',
  },
  {
    id: 'rev-06',
    productId: 'prod-005',
    authorName: 'បុប្ផា ធីតា (Bopha Thida)',
    rating: 5,
    commentKh: 'កាហ្វេ Salted Caramel Latte ឈ្ងុយឆ្ងាញ់ខ្លាំង ផ្អែមប្រៃសមល្មម ដាក់ទឹកកកផឹកត្រជាក់ស្រួល។',
    commentEn: 'Delicious coffee! Perfect blend of salted caramel and rich espresso. Will reorder daily.',
    date: '2026-09-28T08:30:00Z',
    verifiedPurchase: true,
    avatar: '☕',
  },
];

export const INITIAL_LICENSE_SECURITY_CONFIG: LicenseSecurityConfig = {
  watermarkEnabled: true,
  watermarkText: '© KAKA ឱសថបុរាណ • សម្រាប់មើលប៉ុណ្ណោះ ហាមថតចម្លង (PREVIEW ONLY)',
  antiScreenshotEnabled: true,
  blurOnFocusLossEnabled: true,
  allowZoom: true,
};

export const INITIAL_LICENSES: MedicalLicense[] = [
  {
    id: 'lic-moh-01',
    titleKh: 'លិខិតអនុញ្ញាតអាជីវកម្មផលិត និងចែកចាយឱសថបុរាណ',
    titleEn: 'Official License for Traditional Medicine Manufacturing & Distribution',
    licenseNumber: 'CAM-MOH-TRM/2024/0988',
    issuingAuthorityKh: 'ក្រសួងសុខាភិបាល នៃព្រះរាជាណាចក្រកម្ពុជា (នាយកដ្ឋានឱសថ និងចំណីអាហារ)',
    issuingAuthorityEn: 'Ministry of Health of Cambodia (Department of Drugs & Food)',
    issueDate: '2024-01-15',
    expiryDate: '2029-01-14',
    documentType: 'moh_license',
    verified: true,
    notesKh: 'ទទួលបានការអនុញ្ញាតស្របច្បាប់ពេញលេញក្នុងការលក់ និងចែកចាយឱសថបុរាណធម្មជាតិទូទាំងព្រះរាជាណាចក្រកម្ពុជា។',
    notesEn: 'Fully certified and authorized for public distribution across Cambodia.',
    documentImage: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="100%" height="100%">
        <defs>
          <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fffdf7"/>
            <stop offset="100%" stop-color="#fdfbf0"/>
          </linearGradient>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d97706"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1120" fill="url(#paper)"/>
        <rect x="25" y="25" width="750" height="1070" fill="none" stroke="url(#goldBorder)" stroke-width="8" rx="8"/>
        <rect x="35" y="35" width="730" height="1050" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 2" rx="4"/>
        <text x="400" y="80" font-family="'Kantumruy Pro', serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">ព្រះរាជាណាចក្រកម្ពុជា</text>
        <text x="400" y="105" font-family="'Kantumruy Pro', serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">ជាតិ សាសនា ព្រះមហាក្សត្រ</text>
        <line x1="330" y1="118" x2="470" y2="118" stroke="#d97706" stroke-width="2"/>
        <circle cx="400" cy="180" r="42" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
        <path d="M400,150 L412,175 L438,175 L416,192 L424,218 L400,202 L376,218 L384,192 L362,175 L388,175 Z" fill="#d97706"/>
        <text x="400" y="260" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#b45309" text-anchor="middle">លិខិតអនុញ្ញាតអាជីវកម្មឱសថបុរាណផ្លូវការ</text>
        <text x="400" y="285" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">OFFICIAL TRADITIONAL MEDICINE PERMIT</text>
        <rect x="230" y="305" width="340" height="34" rx="17" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        <text x="400" y="327" font-family="monospace" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">No: CAM-MOH-TRM/2024/0988</text>
        <rect x="75" y="410" width="650" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="100" y="445" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ឈ្មោះអាជីវកម្ម / ហាង៖</text>
        <text x="260" y="445" font-family="'Kantumruy Pro', sans-serif" font-size="15" font-weight="bold" fill="#0f172a">KAKA ឱសថបុរាណធម្មជាតិ (KAKA HERBAL PHARMACY)</text>
        <text x="100" y="480" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ម្ចាស់អាជីវកម្ម៖</text>
        <text x="260" y="480" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">លោក ថាស មុន (Thas Mun)</text>
        <text x="100" y="515" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ប្រភេទអាជីវកម្ម៖</text>
        <text x="260" y="515" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">ចែកចាយ និងផ្គត់ផ្គង់ឱសថបុរាណ តែរុក្ខជាតិ និងប្រេងកូឡាធម្មជាតិ</text>
        <rect x="75" y="580" width="650" height="170" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <text x="100" y="615" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">លក្ខខណ្ឌ និងសុពលភាពស្របច្បាប់៖</text>
        <text x="100" y="645" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#334155">១. ផលិតផលទាំងអស់ត្រូវបានត្រួតពិនិត្យជាតិពុល និងស្តង់ដារគុណភាពយ៉ាងហ្មត់ចត់។</text>
        <text x="100" y="675" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#334155">២. ផ្សំឡើងពីរុក្ខជាតិឱសថធម្មជាតិ ១០០% គ្មានសារធាតុគីមី ឬសារធាតុញៀនហាមឃាត់ឡើយ។</text>
        <text x="100" y="705" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#334155">៣. មានសុពលភាពចាប់ពីថ្ងៃទី ១៥ មករា ២០២៤ ដល់ថ្ងៃទី ១៤ មករា ២០២៩។</text>
        <text x="100" y="735" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#059669">✓ ស្ថានភាព៖ សុពលភាពពេញលេញ (VERIFIED ACTIVE)</text>
        <g transform="translate(480, 800)">
          <circle cx="120" cy="80" r="65" fill="none" stroke="#dc2626" stroke-width="4" stroke-opacity="0.85"/>
          <circle cx="120" cy="80" r="55" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.85"/>
          <text x="120" y="60" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle" fill-opacity="0.85">ក្រសួងសុខាភិបាល</text>
          <text x="120" y="85" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle" fill-opacity="0.85">★ បានអនុម័ត ★</text>
          <path d="M40,110 C80,70 110,130 150,90 C170,80 190,120 200,95" fill="none" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'lic-gmp-02',
    titleKh: 'វិញ្ញាបនបត្រស្តង់ដារផលិតកម្មល្អ GMP & សុវត្ថិភាពគុណភាព',
    titleEn: 'Good Manufacturing Practice (GMP) & Quality Safety Certification',
    licenseNumber: 'GMP-KH-2024-QC551',
    issuingAuthorityKh: 'វិទ្យាស្ថានស្តង់ដារកម្ពុជា (ISC) & នាយកដ្ឋានត្រួតពិនិត្យគុណភាព',
    issuingAuthorityEn: 'Institute of Standards of Cambodia (ISC)',
    issueDate: '2024-03-20',
    expiryDate: '2027-03-19',
    documentType: 'gmp_cert',
    verified: true,
    notesKh: 'បញ្ជាក់អំពីខ្សែសង្វាក់ផលិតកម្មស្អាត សុវត្ថិភាព អនាម័យខ្ពស់ ស្របតាមស្តង់ដារ GMP អន្តរជាតិ។',
    notesEn: 'Compliant with International Good Manufacturing Practice standards.',
    documentImage: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="100%" height="100%">
        <defs>
          <linearGradient id="gmpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f0fdf4"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
          <linearGradient id="emeraldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#059669"/>
            <stop offset="50%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1120" fill="url(#gmpGrad)"/>
        <rect x="25" y="25" width="750" height="1070" fill="none" stroke="url(#emeraldBorder)" stroke-width="7" rx="10"/>
        <circle cx="400" cy="150" r="50" fill="#ecfdf5" stroke="#059669" stroke-width="4"/>
        <text x="400" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" fill="#047857" text-anchor="middle">GMP</text>
        <text x="400" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#065f46" text-anchor="middle">វិញ្ញាបនបត្រស្តង់ដារគុណភាពផលិតកម្មល្អ GMP</text>
        <rect x="250" y="280" width="300" height="30" rx="15" fill="#f0fdf4" stroke="#a7f3d0" stroke-width="1"/>
        <text x="400" y="300" font-family="monospace" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">CERT ID: GMP-KH-2024-QC551</text>
        <rect x="80" y="340" width="640" height="360" rx="12" fill="#ffffff" stroke="#d1fae5" stroke-width="1.5"/>
        <text x="110" y="380" font-family="'Kantumruy Pro', sans-serif" font-size="15" font-weight="bold" fill="#065f46">ស្ថាប័នត្រួតពិនិត្យគុណភាព សូមបញ្ជាក់ថា៖</text>
        <text x="110" y="420" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">សហគ្រាសផលិត៖</text>
        <text x="270" y="420" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">KAKA BOTANICAL LABORATORY & HERBAL PHARMACY</text>
        <text x="110" y="500" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">កម្រិតសុវត្ថិភាព៖</text>
        <text x="270" y="500" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#0f172a">កម្រិត A (១០០% គ្មានសារធាតុគីមី និងគ្មានលោហធាតុធ្ងន់)</text>
      </svg>
    `)}`,
  },
  {
    id: 'lic-organic-03',
    titleKh: 'លិខិតបញ្ជាក់ផលិតផលរុក្ខជាតិធម្មជាតិ ១០០% គ្មានសារធាតុគីមី',
    titleEn: '100% Organic & Chemical-Free Herbal Authenticity Certificate',
    licenseNumber: 'ORG-KH-2024-8891',
    issuingAuthorityKh: 'មជ្ឈមណ្ឌលស្រាវជ្រាវ និងវិភាគឱសថធម្មជាតិកម្ពុជា',
    issuingAuthorityEn: 'Cambodia Herbal & Natural Health Research Center',
    issueDate: '2024-02-10',
    expiryDate: '2028-02-09',
    documentType: 'organic_test',
    verified: true,
    notesKh: 'ផលិតចេញពីរុក្ខជាតិព្រៃធម្មជាតិសុទ្ធ ១០០% គ្មានលាយថ្នាំពេទ្យទំនើប គ្មានសារធាតុញៀន ឬសារធាតុរក្សាទុកយូរ។',
    notesEn: 'Pure wild harvested natural herbs, completely chemical & additive free.',
    documentImage: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="100%" height="100%">
        <rect width="800" height="1120" fill="#fefce8"/>
        <rect x="25" y="25" width="750" height="1070" fill="none" stroke="#ca8a04" stroke-width="6" rx="10"/>
        <circle cx="400" cy="140" r="45" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <text x="400" y="225" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#854d0e" text-anchor="middle">លិខិតបញ្ជាក់ផលិតផលរុក្ខជាតិធម្មជាតិ ១០០%</text>
        <rect x="80" y="320" width="640" height="320" rx="12" fill="#ffffff" stroke="#fef08a" stroke-width="1.5"/>
        <text x="110" y="360" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#854d0e">លទ្ធផលនៃការវិភាគមន្ទីរពិសោធន៍៖</text>
        <text x="110" y="400" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ សារធាតុ Steroid: គ្មាន (Negative / 0.00%)</text>
        <text x="110" y="440" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ សារធាតុរក្សាទុកយូរ (Preservatives): គ្មាន (Negative / 0.00%)</text>
        <text x="110" y="480" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ ផ្សំពីរុក្ខជាតិឱសថបុរាណខ្មែរដូនតា៖ រមៀត, ខ្ញីព្រៃ, យិនស៊ិនធម្មជាតិ</text>
      </svg>
    `)}`,
  },
];

