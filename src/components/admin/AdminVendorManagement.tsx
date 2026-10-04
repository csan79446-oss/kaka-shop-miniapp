import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Send,
  MapPin,
  CreditCard,
  Percent,
  Star,
  Package,
  ShoppingBag,
  ExternalLink,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Power,
  X,
  Check,
  BadgeCheck,
  Share2,
  Key,
  User,
  Eye,
  EyeOff,
  Dices,
  Copy,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';
import { RbacNoticeBanner } from './RbacNoticeBanner';
import { StoreShareModal } from './StoreShareModal';

interface AdminVendorManagementProps {
  onInspectVendor?: (vendorId: string) => void;
}

export const AdminVendorManagement: React.FC<AdminVendorManagementProps> = ({ onInspectVendor }) => {
  const {
    vendors,
    addVendor,
    updateVendor,
    deleteVendor,
    toggleVendorStatus,
    toggleVendorVerification,
    products,
    orders,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    getStoreShareLinks,
    language,
    formatPrice,
    canManageContent,
    setSelectedAdminVendorId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [shareVendorModal, setShareVendorModal] = useState<Vendor | null>(null);

  // Store Manager Account Credentials State
  const [createAccount, setCreateAccount] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentialsModal, setCreatedCredentialsModal] = useState<{
    vendorName: string;
    username: string;
    password: string;
    storeUrl: string;
    telegramUrl: string;
  } | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Form Fields
  const [nameKh, setNameKh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('gadgets');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [descriptionKh, setDescriptionKh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [addressKh, setAddressKh] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [city, setCity] = useState('Phnom Penh');
  const [commissionRate, setCommissionRate] = useState('5');
  const [bankName, setBankName] = useState('ABA Bank');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bakongId, setBakongId] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const autoGenerateUsername = (currentSlug: string, currentNameEn: string) => {
    const raw = (currentSlug || currentNameEn)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    return raw ? `${raw}_admin` : 'store_admin';
  };

  const resetForm = () => {
    setEditingVendor(null);
    setNameKh('');
    setNameEn('');
    setSlug('');
    setCategory('gadgets');
    setLogo('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=160&auto=format&fit=crop&q=80');
    setBanner('https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80');
    setDescriptionKh('');
    setDescriptionEn('');
    setOwnerName('');
    setOwnerPhone('');
    setOwnerEmail('');
    setTelegramUsername('');
    setAddressKh('');
    setAddressEn('');
    setCity('Phnom Penh');
    setCommissionRate('5');
    setBankName('ABA Bank');
    setBankAccountName('');
    setBankAccountNumber('');
    setIsVerified(true);
    setCreateAccount(true);
    setAdminUsername('');
    setAdminPassword(generateRandomPin());
    setShowPassword(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setNameKh(vendor.nameKh);
    setNameEn(vendor.nameEn);
    setSlug(vendor.slug);
    setCategory(vendor.category);
    setLogo(vendor.logo);
    setBanner(vendor.banner || '');
    setDescriptionKh(vendor.descriptionKh);
    setDescriptionEn(vendor.descriptionEn);
    setOwnerName(vendor.ownerName);
    setOwnerPhone(vendor.ownerPhone);
    setOwnerEmail(vendor.ownerEmail || '');
    setTelegramUsername(vendor.telegramUsername);
    setAddressKh(vendor.addressKh);
    setAddressEn(vendor.addressEn);
    setCity(vendor.city);
    setCommissionRate(String(vendor.commissionRate || 5));
    setBankName(vendor.bankName);
    setBankAccountName(vendor.bankAccountName);
    setBankAccountNumber(vendor.bankAccountNumber);
    setBakongId(vendor.bakongId || '');
    setIsVerified(vendor.isVerified);

    // Look up linked admin user
    const linkedUser = adminUsers.find((u) => u.vendorId === vendor.id);
    if (linkedUser) {
      setCreateAccount(true);
      setAdminUsername(linkedUser.username);
      setAdminPassword(linkedUser.pin);
    } else {
      setCreateAccount(false);
      setAdminUsername(autoGenerateUsername(vendor.slug, vendor.nameEn));
      setAdminPassword(generateRandomPin());
    }
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKh.trim() || !nameEn.trim()) return;

    const vendorPayload = {
      nameKh: nameKh.trim(),
      nameEn: nameEn.trim(),
      slug: (slug.trim() || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, ''),
      category,
      logo: logo.trim() || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=160&auto=format&fit=crop&q=80',
      banner: banner.trim(),
      descriptionKh: descriptionKh.trim(),
      descriptionEn: descriptionEn.trim(),
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim(),
      ownerEmail: ownerEmail.trim(),
      telegramUsername: telegramUsername.trim().replace(/^@/, ''),
      addressKh: addressKh.trim(),
      addressEn: addressEn.trim(),
      city: city.trim(),
      commissionRate: parseFloat(commissionRate) || 5,
      bankName: bankName.trim(),
      bankAccountName: bankAccountName.trim().toUpperCase(),
      bankAccountNumber: bankAccountNumber.trim(),
      bakongId: bakongId.trim(),
      isVerified,
      rating: editingVendor ? editingVendor.rating : 5.0,
      reviewCount: editingVendor ? editingVendor.reviewCount : 0,
      status: (editingVendor ? editingVendor.status : 'active') as Vendor['status'],
    };

    let targetVendorId = editingVendor?.id;
    let savedVendor: Vendor;

    if (editingVendor) {
      updateVendor(editingVendor.id, vendorPayload);
      savedVendor = { ...editingVendor, ...vendorPayload };
    } else {
      savedVendor = addVendor(vendorPayload);
      targetVendorId = savedVendor?.id;
    }

    // Handle Admin Account Creation or Update
    if (createAccount && adminUsername.trim() && adminPassword.trim() && targetVendorId) {
      const existingUser = adminUsers.find((u) => u.vendorId === targetVendorId);
      const cleanUsername = adminUsername.trim().toLowerCase();
      const cleanPassword = adminPassword.trim();
      const cleanName = ownerName.trim() || nameKh.trim();

      if (existingUser) {
        updateAdminUser(existingUser.id, {
          name: cleanName,
          username: cleanUsername,
          pin: cleanPassword,
          role: 'STORE_MANAGER',
          vendorId: targetVendorId,
        });
      } else {
        addAdminUser({
          name: cleanName,
          username: cleanUsername,
          role: 'STORE_MANAGER',
          vendorId: targetVendorId,
          pin: cleanPassword,
          avatar: '🏪',
          active: true,
        });
      }

      if (savedVendor) {
        const links = getStoreShareLinks(savedVendor);
        setCreatedCredentialsModal({
          vendorName: savedVendor.nameKh,
          username: cleanUsername,
          password: cleanPassword,
          storeUrl: links.webUrl,
          telegramUrl: links.telegramUrl,
        });
      }
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Stats calculation
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === 'active').length;
  const totalMarketplaceGmv = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalProducts = products.length;

  // Filtered vendors
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.ownerPhone.includes(searchQuery) ||
      vendor.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleInspect = (vendorId: string) => {
    setSelectedAdminVendorId(vendorId);
    if (onInspectVendor) {
      onInspectVendor(vendorId);
    }
  };

  return (
    <div className="space-y-6">
      <RbacNoticeBanner />

      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2481cc]/10 text-[#2481cc] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'km'
                ? 'គ្រប់គ្រងហាងលក់ទាំងអស់ (Multi-Vendor Marketplace)'
                : 'Marketplace Vendors Management'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'ត្រួតពិនិត្យ គ្រប់គ្រងសិទ្ធិ អនុម័ត និងតាមដានរបាយការណ៍ហាងនីមួយៗនៅលើ KAKA Marketplace'
              : 'Inspect, manage, verify, and monitor all merchant stores across KAKA Marketplace.'}
          </p>
        </div>

        {canManageContent && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'km' ? 'ចុះឈ្មោះហាងថ្មី' : 'Register New Vendor'}</span>
          </button>
        )}
      </div>

      {/* Marketplace KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#17212b] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{language === 'km' ? 'ហាងសរុប' : 'Total Stores'}</span>
            <Store className="w-4 h-4 text-[#2481cc]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {totalVendors}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {activeVendors} {language === 'km' ? 'កំពុងដំណើរការ' : 'active'}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#17212b] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{language === 'km' ? 'ទំនិញសរុបក្នុងផ្សារ' : 'Total Products'}</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {totalProducts}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">SKUs</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#17212b] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{language === 'km' ? 'ការកុម្ម៉ង់សរុប' : 'Total Orders'}</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {orders.length}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">orders</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#17212b] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{language === 'km' ? 'ចំណូលផ្សារសរុប (GMV)' : 'Platform GMV'}</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-[#2481cc] font-mono">
              {formatPrice(totalMarketplaceGmv)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'km'
                ? 'ស្វែងរកតាមឈ្មោះហាង ម្ចាស់ហាង លេខទូរស័ព្ទ ឬ Telegram...'
                : 'Search by store name, owner, phone, or Telegram...'
            }
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2481cc]"
        >
          <option value="all">{language === 'km' ? 'គ្រប់ស្ថានភាព (All Status)' : 'All Status'}</option>
          <option value="active">{language === 'km' ? '✓ កំពុងដំណើរការ (Active)' : 'Active'}</option>
          <option value="suspended">{language === 'km' ? '⏸️ ផ្អាកបណ្តោះអាសន្ន (Suspended)' : 'Suspended'}</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2481cc]"
        >
          <option value="all">{language === 'km' ? 'គ្រប់ប្រភេទ (All Categories)' : 'All Categories'}</option>
          <option value="gadgets">Gadgets & Tech</option>
          <option value="health">Health & Medicine</option>
          <option value="fashion">Fashion & Lifestyle</option>
          <option value="general">General Marketplace</option>
        </select>
      </div>

      {/* Vendors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
          const vendorOrders = orders.filter((o) => o.vendorId === vendor.id);
          const vendorRevenue = vendorOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

          return (
            <div
              key={vendor.id}
              className={`bg-white dark:bg-[#17212b] rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                vendor.status === 'active'
                  ? 'border-slate-200 dark:border-slate-800 hover:border-[#2481cc]/50 shadow-xs'
                  : 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20'
              }`}
            >
              <div>
                {/* Header Banner */}
                <div className="relative h-24 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={vendor.banner || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80'}
                    alt={vendor.nameKh}
                    className="w-full h-full object-cover filter brightness-75"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    {vendor.isVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <BadgeCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vendor.status === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {vendor.status === 'active' ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </div>
                </div>

                {/* Logo & Info */}
                <div className="p-4 pt-0 relative">
                  <div className="flex items-end justify-between -mt-8 mb-2.5">
                    <img
                      src={vendor.logo}
                      alt={vendor.nameKh}
                      className="w-16 h-16 rounded-2xl object-cover border-3 border-white dark:border-[#17212b] shadow-md bg-white shrink-0"
                    />
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-lg text-amber-600 text-xs font-bold font-mono">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({vendor.reviewCount})</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {vendor.nameKh}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{vendor.nameEn}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {vendor.descriptionKh}
                    </p>
                  </div>

                  {/* Merchant Contact Info */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'km' ? 'ម្ចាស់ហាង៖' : 'Owner:'}
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">{vendor.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{vendor.ownerPhone}</span>
                      <span className="text-slate-300">•</span>
                      <Send className="w-3 h-3 text-[#2481cc]" />
                      <span className="text-[#2481cc] font-medium">@{vendor.telegramUsername}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{vendor.addressKh}</span>
                    </div>
                  </div>

                  {/* Bank & Payment Information */}
                  <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-[#2481cc]" />
                        <span>{vendor.bankName}</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {vendor.bankAccountNumber}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {vendor.bankAccountName}
                    </div>
                  </div>

                  {/* Store Mini KPIs */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">{language === 'km' ? 'ទំនិញ' : 'Items'}</span>
                      <span className="font-bold text-xs font-mono text-[#2481cc]">{vendorProducts.length}</span>
                    </div>
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">{language === 'km' ? 'កុម្ម៉ង់' : 'Orders'}</span>
                      <span className="font-bold text-xs font-mono text-purple-600">{vendorOrders.length}</span>
                    </div>
                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">{language === 'km' ? 'ចំណូល' : 'Sales'}</span>
                      <span className="font-bold text-xs font-mono text-emerald-600">{formatPrice(vendorRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                {/* Inspect Button & Share Link */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleInspect(vendor.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#2481cc] hover:bg-[#1d6fae] text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                    title={language === 'km' ? 'ត្រួតពិនិត្យទំនិញ និង Order របស់ហាងនេះ' : 'Inspect Store'}
                  >
                    <Search className="w-3 h-3" />
                    <span>{language === 'km' ? 'ត្រួតពិនិត្យ' : 'Inspect'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareVendorModal(vendor)}
                    className="px-2 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#2481cc] dark:text-sky-300 text-xs font-semibold flex items-center gap-1 border border-blue-200 dark:border-blue-800 transition-all shadow-2xs"
                    title={language === 'km' ? 'យក Link ហាង & QR សម្រាប់ផ្ញើឱ្យអតិថិជន' : 'Store Link & QR'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'km' ? 'Link ហាង' : 'Link'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {canManageContent && (
                    <>
                      {/* Toggle Verification Badge */}
                      <button
                        type="button"
                        onClick={() => toggleVendorVerification(vendor.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          vendor.isVerified
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200'
                        }`}
                        title={vendor.isVerified ? 'ដកផ្លាក Verified' : 'ផ្តល់ផ្លាក Verified'}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Active / Suspend */}
                      <button
                        type="button"
                        onClick={() => toggleVendorStatus(vendor.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          vendor.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-rose-50 hover:text-rose-600'
                            : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                        title={vendor.status === 'active' ? 'ផ្អាកដំណើរការ (Suspend)' : 'បើកដំណើរការ (Activate)'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(vendor)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2481cc]"
                        title="កែប្រែព័ត៌មានហាង"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteVendor(vendor.id)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50"
                        title="លុបហាង"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVendors.length === 0 && (
        <div className="p-8 text-center bg-white dark:bg-[#17212b] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <Store className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            {language === 'km' ? 'រកមិនឃើញហាងលក់ដែលត្រូវនឹងការស្វែងរកឡើយ' : 'No vendor stores found.'}
          </p>
        </div>
      )}

      {/* Modal: Add or Edit Vendor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#17212b] rounded-2xl max-w-xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2481cc]/10 text-[#2481cc] flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingVendor
                    ? language === 'km'
                      ? 'កែប្រែព័ត៌មានហាង'
                      : 'Edit Vendor Store'
                    : language === 'km'
                    ? 'ចុះឈ្មោះហាងលក់ថ្មី (New Vendor)'
                    : 'Register New Vendor'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Store Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'ឈ្មោះហាង (ភាសាខ្មែរ) *' : 'Store Name (Khmer) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameKh}
                    onChange={(e) => setNameKh(e.target.value)}
                    placeholder="ឧ. អង្គរ ឱសថបូរាណ & សុខភាព"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'ឈ្មោះហាង (English) *' : 'Store Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNameEn(val);
                      if (!editingVendor && (!adminUsername || adminUsername.endsWith('_admin'))) {
                        setAdminUsername(autoGenerateUsername(slug, val));
                      }
                    }}
                    placeholder="e.g. Angkor Herbal & Health"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              {/* Category & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'ប្រភេទហាង (Category)' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  >
                    <option value="gadgets">Gadgets & Tech</option>
                    <option value="health">Health & Medicine</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="beverage">Beverage & Food</option>
                    <option value="lifestyle">Lifestyle & Home</option>
                    <option value="general">General Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'Store Slug (URL Identifier)' : 'Store Slug'}
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSlug(val);
                      if (!editingVendor && (!adminUsername || adminUsername.endsWith('_admin'))) {
                        setAdminUsername(autoGenerateUsername(val, nameEn));
                      }
                    }}
                    placeholder="e.g. angkor-herbal"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              {/* Logo & Banner URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'Logo ហាង (URL)' : 'Store Logo (URL)'}
                  </label>
                  <input
                    type="url"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'រូបភាព Banner ហាង (URL)' : 'Store Banner (URL)'}
                  </label>
                  <input
                    type="url"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {language === 'km' ? 'ការពិពណ៌នាពីហាង (ភាសាខ្មែរ)' : 'Store Description (Khmer)'}
                </label>
                <textarea
                  rows={2}
                  value={descriptionKh}
                  onChange={(e) => setDescriptionKh(e.target.value)}
                  placeholder="ព័ត៌មានសង្ខេបអំពីទំនិញ និងសេវាកម្មរបស់ហាង..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              {/* Owner Information */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                  {language === 'km' ? 'ព័ត៌មានទំនាក់ទំនងម្ចាស់ហាង' : 'Store Owner Contacts'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      {language === 'km' ? 'ឈ្មោះម្ចាស់ហាង *' : 'Owner Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. ម៉ៅ សុភា"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      {language === 'km' ? 'លេខទូរស័ព្ទ *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+855 ..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      {language === 'km' ? 'Telegram Username *' : 'Telegram Username *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="e.g. angkor_admin"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Address & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'អាសយដ្ឋានហាង *' : 'Store Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={addressKh}
                    onChange={(e) => setAddressKh(e.target.value)}
                    placeholder="ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {language === 'km' ? 'រាជធានី/ខេត្ត' : 'City / Province'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Phnom Penh / Siem Reap..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Bank & Payment Information (Dedicated KHQR) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  {language === 'km' ? 'គណនីធនាគារទទួលប្រាក់ (Dedicated Store Bank / KHQR)' : 'Dedicated Bank Account'}
                </span>
                <p className="text-[10px] text-slate-400 mb-2">
                  {language === 'km'
                    ? 'អតិថិជនទិញទំនិញពីហាងនេះ នឹងទូទាត់ប្រាក់ចូលគណនីនេះផ្ទាល់'
                    : 'Customer payments for this store will go directly to this bank account.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">ធនាគារ (Bank Name)</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="ABA Bank">ABA Bank</option>
                      <option value="ACLEDA Bank">ACLEDA Bank</option>
                      <option value="Wing Bank">Wing Bank</option>
                      <option value="Canadia Bank">Canadia Bank</option>
                      <option value="Sathapana Bank">Sathapana Bank</option>
                      <option value="Bakong KHQR">Bakong KHQR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">ឈ្មោះគណនី (Account Name)</label>
                    <input
                      type="text"
                      required
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="e.g. ANGKOR HERBAL STORE"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">លេខគណនី (Account Number)</label>
                    <input
                      type="text"
                      required
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="000 123 456"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[#e1251b]">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Bakong ID / KHQR (សម្រាប់បង្កើត Dynamic QR Code ទទួលលុយផ្ទាល់)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">ឧ. kaka_gadgets@aba ឬ 012345678@aclb</span>
                    </label>
                    <input
                      type="text"
                      value={bakongId}
                      onChange={(e) => setBakongId(e.target.value)}
                      placeholder="e.g. kaka_gadgets@aba, 012345678@aclb"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs focus:border-[#e1251b] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Store Manager Login Credentials (គណនីចូលគ្រប់គ្រងហាង) */}
              <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-sky-50/60 to-blue-50/80 dark:from-indigo-950/40 dark:via-sky-950/30 dark:to-blue-950/40 rounded-2xl border border-indigo-200/90 dark:border-indigo-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <span>{language === 'km' ? 'គណនីចូលគ្រប់គ្រងហាង (Store Manager Account)' : 'Store Manager Credentials'}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                          Store Manager
                        </span>
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {language === 'km'
                          ? 'កំណត់ Username & Password សម្រាប់ម្ចាស់ហាង Login ចូលគ្រប់គ្រងទំនិញ និង Order'
                          : 'Set login credentials for the store owner to access their private portal'}
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md"
                    />
                    <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200">
                      {language === 'km' ? 'បង្កើតគណនី' : 'Enable'}
                    </span>
                  </label>
                </div>

                {createAccount && (
                  <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Username */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <User className="w-3 h-3 text-indigo-600" />
                            <span>{language === 'km' ? 'ឈ្មោះគណនី (Username) *' : 'Username *'}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setAdminUsername(autoGenerateUsername(slug, nameEn))}
                            className="text-[10px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold"
                          >
                            ⚡ {language === 'km' ? 'បង្កើតស្វ័យប្រវត្តិ' : 'Auto Fill'}
                          </button>
                        </div>
                        <input
                          type="text"
                          required={createAccount}
                          value={adminUsername}
                          onChange={(e) =>
                            setAdminUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))
                          }
                          placeholder="e.g. angkor_admin"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/80 rounded-xl font-mono text-xs text-indigo-950 dark:text-indigo-200 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      {/* Password / PIN */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-indigo-600" />
                            <span>{language === 'km' ? 'លេខកូដសម្ងាត់ / PIN *' : 'Password / PIN *'}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setAdminPassword(generateRandomPin())}
                            className="text-[10px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-0.5"
                          >
                            <Dices className="w-2.5 h-2.5" />
                            <span>{language === 'km' ? 'ចៃដន្យ' : 'Random'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required={createAccount}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="e.g. 8888 ឬ password"
                            className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/80 rounded-xl font-mono text-xs text-indigo-950 dark:text-indigo-200 focus:outline-none focus:border-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-indigo-100/70 dark:bg-indigo-950/70 rounded-xl text-[10px] text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>
                        {language === 'km'
                          ? '💡 ពេលបង្កើតហាងរួច ប្រព័ន្ធនឹងផ្តល់កាតព័ត៌មាន (Credentials) សម្រាប់បង Copy ផ្ញើឱ្យម្ចាស់ហាងតាម Telegram ដោយស្វ័យប្រវត្តិ!'
                          : 'After creation, a ready-to-copy card will appear with login details to share with the merchant.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Commission Rate & Verified */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-4 h-4 text-[#2481cc] rounded-md"
                  />
                  <label htmlFor="verifiedCheck" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {language === 'km' ? 'ផ្តល់ផ្លាកសញ្ញាបញ្ជាក់ផ្លូវការ (Verified Official Store)' : 'Verified Store Badge'}
                  </label>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Commission (%):</span>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingVendor
                    ? language === 'km'
                      ? 'រក្សាទុកការកែប្រែ'
                      : 'Save Changes'
                    : language === 'km'
                    ? 'បង្កើតហាងថ្មី'
                    : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store Share Link & QR Modal */}
      {shareVendorModal && (
        <StoreShareModal
          vendor={shareVendorModal}
          isOpen={!!shareVendorModal}
          onClose={() => setShareVendorModal(null)}
        />
      )}

      {/* Credentials Created Success Modal */}
      {createdCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#17212b] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                🎉
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'km' ? 'ហាង & គណនីគ្រប់គ្រងត្រូវបានបង្កើតជោគជ័យ!' : 'Store & Manager Account Created!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'km'
                  ? `គណនីចូលគ្រប់គ្រងហាង «${createdCredentialsModal.vendorName}» ត្រូវបានរៀបចំរួចរាល់`
                  : `Manager credentials ready for ${createdCredentialsModal.vendorName}`}
              </p>
            </div>

            {/* Credential Details Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-sans">ហាង៖</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">
                  {createdCredentialsModal.vendorName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">Username៖</span>
                <span className="font-bold text-[#2481cc] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-900">
                  {createdCredentialsModal.username}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">Password / PIN៖</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  {createdCredentialsModal.password}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-sans">សិទ្ធិ (Role)៖</span>
                <span className="font-sans text-[11px] font-semibold text-purple-600 dark:text-purple-300">
                  Store Manager (ហាងផ្ទាល់ខ្លួន)
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const shareText = `🏪 ព័ត៌មានគណនីគ្រប់គ្រងហាង៖ ${createdCredentialsModal.vendorName}
🌐 Link ហាងសម្រាប់អតិថិជន៖ ${createdCredentialsModal.storeUrl}
👤 ឈ្មោះគណនី (Username)៖ ${createdCredentialsModal.username}
🔑 លេខកូដសម្ងាត់ (PIN/Password)៖ ${createdCredentialsModal.password}

📱 របៀបចូលគ្រប់គ្រង៖
១. បើក Telegram MiniApp ឬ Link ខាងលើ
២. ចុចលើផ្ទាំង "Admin"
៣. វាយបញ្ចូល Username និង Password ខាងលើ ដើម្បីគ្រប់គ្រងទំនិញ និង Order របស់ហាងបង!`;

                  navigator.clipboard.writeText(shareText);
                  setCopiedCredentials(true);
                  setTimeout(() => setCopiedCredentials(false), 2500);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  copiedCredentials
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2481cc] hover:bg-[#1d6fae] text-white'
                }`}
              >
                {copiedCredentials ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'km' ? 'បានចម្លងរួចរាល់! ✓' : 'Copied to Clipboard!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{language === 'km' ? 'ចម្លងព័ត៌មានផ្ញើឱ្យម្ចាស់ហាង (Copy for Telegram)' : 'Copy Credentials for Merchant'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCreatedCredentialsModal(null)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-center"
              >
                {language === 'km' ? 'បិទផ្ទាំងនេះ (Done)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
