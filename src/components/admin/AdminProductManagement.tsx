import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  Upload,
  FileSpreadsheet,
  Lock,
  Video,
  Film,
  Play,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCT_IMAGE_PRESETS } from '../../data/mockData';
import { Product } from '../../types';
import { RbacNoticeBanner } from './RbacNoticeBanner';

export const AdminProductManagement: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    language,
    formatPrice,
    exportInventoryCsv,
    canManageContent,
    vendors,
    selectedAdminVendorId,
    getVendorById,
    currentAdmin,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [productVendorId, setProductVendorId] = useState('vendor-01');

  // Form states
  const [nameKh, setNameKh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionKh, setDescriptionKh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('gadgets');
  const [stock, setStock] = useState('20');
  const [badge, setBadge] = useState<Product['badge']>('new');
  const [colorsInput, setColorsInput] = useState('');
  const [sizesInput, setSizesInput] = useState('');
  const [image, setImage] = useState(PRODUCT_IMAGE_PRESETS.smartwatch);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState('');
  const [videoInputMode, setVideoInputMode] = useState<'url' | 'upload'>('url');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoError, setVideoError] = useState('');

  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    try {
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&playsinline=1`;
      }
      const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      if (vimeoMatch && vimeoMatch[3]) {
        return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
      }
    } catch {
      // fallback
    }
    return null;
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductVendorId(
      selectedAdminVendorId && selectedAdminVendorId !== 'all'
        ? selectedAdminVendorId
        : vendors[0]?.id || 'vendor-01'
    );
    setNameKh('');
    setNameEn('');
    setDescriptionKh('');
    setDescriptionEn('');
    setPrice('');
    setOriginalPrice('');
    setCategory('gadgets');
    setStock('20');
    setBadge('new');
    setColorsInput('ខ្មៅ (Black), ស (White)');
    setSizesInput('S, M, L, XL');
    setImage(PRODUCT_IMAGE_PRESETS.smartwatch);
    setCustomImageUrl('');
    setVideoUrl('');
    setUploadedVideo('');
    setVideoInputMode('url');
    setVideoFileName('');
    setVideoError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductVendorId(p.vendorId || vendors[0]?.id || 'vendor-01');
    setNameKh(p.nameKh);
    setNameEn(p.nameEn);
    setDescriptionKh(p.descriptionKh);
    setDescriptionEn(p.descriptionEn);
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setCategory(p.category);
    setStock(p.stock.toString());
    setBadge(p.badge);
    setColorsInput((p.colors || []).join(', '));
    setSizesInput((p.sizes || []).join(', '));
    setImage(p.image);
    setCustomImageUrl(p.image.startsWith('http') ? p.image : '');
    if (p.video) {
      if (p.video.startsWith('data:video')) {
        setUploadedVideo(p.video);
        setVideoUrl('');
        setVideoInputMode('upload');
        setVideoFileName('uploaded-video.mp4');
      } else {
        setVideoUrl(p.video);
        setUploadedVideo('');
        setVideoInputMode('url');
        setVideoFileName('');
      }
    } else {
      setVideoUrl('');
      setUploadedVideo('');
      setVideoInputMode('url');
      setVideoFileName('');
    }
    setVideoError('');
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 50MB check
      if (file.size > 50 * 1024 * 1024) {
        setVideoError(
          language === 'km'
            ? 'ទំហំវីដេអូធំជាង 50MB! សូមជ្រើសរើសវីដេអូខ្លីជាងនេះ ឬប្រើ Video URL'
            : 'Video file exceeds 50MB limit! Please choose a smaller file or use Video URL'
        );
        return;
      }
      setVideoError('');
      setVideoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedVideo(reader.result);
          setVideoUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = customImageUrl.trim() ? customImageUrl.trim() : image;
    const finalVideo = uploadedVideo.trim() || videoUrl.trim() || undefined;

    const payload = {
      vendorId: currentAdmin?.vendorId || productVendorId,
      nameKh: nameKh.trim(),
      nameEn: nameEn.trim() || nameKh.trim(),
      descriptionKh: descriptionKh.trim(),
      descriptionEn: descriptionEn.trim() || descriptionKh.trim(),
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      stock: parseInt(stock, 10) || 0,
      badge: badge || undefined,
      colors: colorsInput
        ? colorsInput
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : undefined,
      sizes: sizesInput
        ? sizesInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      image: finalImage,
      video: finalVideo,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.nameKh.toLowerCase().includes(search.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase());
    const adminVendorId = currentAdmin?.vendorId || selectedAdminVendorId;
    const matchVendor = !adminVendorId || adminVendorId === 'all' || p.vendorId === adminVendorId;
    return matchCat && matchSearch && matchVendor;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <RbacNoticeBanner moduleNameKh="ផលិតផលក្នុងស្តុក" moduleNameEn="products and inventory" />

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2481cc]" />
            <span>
              {language === 'km' ? 'គ្រប់គ្រងផលិតផលក្នុងស្តុក' : 'Product Inventory Management'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'km'
              ? 'បន្ថែម កែសម្រួលព័ត៌មាន តម្លៃ ជម្រើសពណ៌/ទំហំ និងទាញយករបាយការណ៍ស្តុក'
              : 'Add, edit details, prices, color/size variants, and export inventory reports'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Inventory CSV */}
          <button
            onClick={exportInventoryCsv}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs active:scale-98 transition-all shrink-0"
            title="ទាញយកទិន្នន័យស្តុកផលិតផលជា File Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{language === 'km' ? 'ទាញយកស្តុក Excel' : 'Export Inventory'}</span>
          </button>

          {canManageContent ? (
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'km' ? 'បន្ថែមផលិតផលថ្មី' : 'Add New Product'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'km' ? 'សិទ្ធិមើលប៉ុណ្ណោះ' : 'View Only'}</span>
            </div>
          )}
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
                ? 'ស្វែងរកផលិតផលតាមឈ្មោះ...'
                : 'Search products by name...'
            }
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {language === 'km' ? c.nameKh : c.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Product List Table / Cards */}
      <div className="bg-white dark:bg-[#17212b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{language === 'km' ? 'ផលិតផល' : 'Product'}</th>
                <th className="py-3 px-3">{language === 'km' ? 'ប្រភេទ' : 'Category'}</th>
                <th className="py-3 px-3">{language === 'km' ? 'តម្លៃ' : 'Price'}</th>
                <th className="py-3 px-3">{language === 'km' ? 'ស្តុក' : 'Stock'}</th>
                <th className="py-3 px-3">{language === 'km' ? 'ផ្លាក' : 'Badge'}</th>
                <th className="py-3 px-4 text-right">{language === 'km' ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={product.image}
                          alt={product.nameKh}
                          className="w-11 h-11 object-cover rounded-lg border shrink-0 bg-slate-100 dark:bg-slate-800"
                        />
                        {product.video && (
                          <span
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs"
                            title={language === 'km' ? 'មានភ្ជាប់វីដេអូបង្ហាញ' : 'Has video showcase'}
                          >
                            <Video className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {product.nameKh}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {product.nameEn}
                        </div>
                        {product.vendorId && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-medium text-[#2481cc] bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded-md mt-0.5">
                            <Store className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[150px]">
                              {getVendorById(product.vendorId)?.nameKh || product.vendorId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 capitalize">
                    {product.category}
                  </td>

                  <td className="py-3 px-3 font-bold font-mono text-[#2481cc]">
                    {formatPrice(product.price)}
                    {product.originalPrice && (
                      <span className="block text-[10px] text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {canManageContent ? (
                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              stock: Math.max(0, product.stock - 1),
                            })
                          }
                          className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            product.stock <= 5
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {product.stock}
                        </span>
                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              stock: product.stock + 1,
                            })
                          }
                          className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] font-mono ${
                          product.stock <= 5
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {product.stock}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {product.badge ? (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {canManageContent ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#2481cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="កែសម្រួល / Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="លុប / Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono flex items-center justify-end gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{language === 'km' ? 'សិទ្ធិមើល' : 'View Only'}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#17212b] w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#2481cc]" />
                <span>
                  {editingProduct
                    ? language === 'km'
                      ? 'កែសម្រួលព័ត៌មានផលិតផល'
                      : 'Edit Product Details'
                    : language === 'km'
                    ? 'បន្ថែមផលិតផលថ្មី'
                    : 'Add New Product'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះផលិតផលជាភាសាខ្មែរ *' : 'Name in Khmer *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameKh}
                    onChange={(e) => setNameKh(e.target.value)}
                    placeholder="e.g. នាឡិកាឆ្លាតវៃ KAKA Pro"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ឈ្មោះជាភាសាអង់គ្លេស' : 'Name in English'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. KAKA Pro Smartwatch"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'តម្លៃលក់ ($) *' : 'Price ($) *'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35.00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'តម្លៃដើមមុនបញ្ចុះ ($)' : 'Original Price ($)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="45.00"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ចំនួនក្នុងស្តុក *' : 'Stock Quantity *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc] font-mono"
                  />
                </div>
              </div>

              {/* Store Vendor Assignment (if Platform Super Admin) */}
              {!currentAdmin?.vendorId && (
                <div className="p-3 bg-sky-50/70 dark:bg-sky-950/40 rounded-xl border border-sky-200/80 dark:border-sky-900/50">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#2481cc]" />
                    <span>{language === 'km' ? 'ហាងលក់ទំនិញ (Store Vendor) *' : 'Assigned Store Vendor *'}</span>
                  </label>
                  <select
                    value={productVendorId}
                    onChange={(e) => setProductVendorId(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#2481cc] focus:outline-none focus:border-[#2481cc]"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.isVerified ? '✓ ' : ''}{v.nameKh} ({v.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ប្រភេទផលិតផល *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {language === 'km' ? c.nameKh : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ផ្លាកសំគាល់ (Badge)' : 'Badge'}
                  </label>
                  <select
                    value={badge || ''}
                    onChange={(e) =>
                      setBadge((e.target.value as Product['badge']) || undefined)
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  >
                    <option value="">{language === 'km' ? 'គ្មានផ្លាក' : 'None'}</option>
                    <option value="hot">🔥 Hot (ពេញនិយម)</option>
                    <option value="sale">🏷️ Sale (បញ្ចុះតម្លៃ)</option>
                    <option value="new">✨ New (ទំនិញថ្មី)</option>
                    <option value="featured">⭐ Featured (ពិសេស)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ពិពណ៌នាផលិតផល *' : 'Description *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={descriptionKh}
                  onChange={(e) => setDescriptionKh(e.target.value)}
                  placeholder="បញ្ជាក់ពីលក្ខណៈពិសេស អត្ថប្រយោជន៍ គុណភាព..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              {/* Variants: Colors & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ជម្រើសពណ៌ (ញែកដោយសញ្ញាក្បៀស ,)' : 'Color Options (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="ឧ. ខ្មៅ, ស, ខៀវ"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    e.g. ខ្មៅ (Black), ស (White), ខៀវ (Navy)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km' ? 'ជម្រើសទំហំ/ចំណុះ (ញែកដោយ ,)' : 'Size Options (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="ឧ. S, M, L, XL ឬ 42mm, 46mm"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc] font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    e.g. S, M, L, XL or 350ml, 500ml
                  </span>
                </div>
              </div>

              {/* Image Selection Presets & Custom URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'km' ? 'រូបភាពផលិតផល (ជ្រើសរើស ឬបញ្ចូល URL)' : 'Product Image (Presets or URL)'}
                </label>

                {/* Preset picker */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {Object.entries(PRODUCT_IMAGE_PRESETS).map(([key, svgData]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        setImage(svgData);
                        setCustomImageUrl('');
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        image === svgData && !customImageUrl
                          ? 'border-[#2481cc] ring-2 ring-[#2481cc]/30'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={svgData} alt={key} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Custom URL or file upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://... (Image URL)"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                  />

                  <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ផ្ទុកឡើងរូបភាព' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Product Video Showcase (Upload or Link) */}
              <div className="p-3.5 bg-gradient-to-br from-sky-50/60 to-indigo-50/40 dark:from-slate-900 dark:to-sky-950/20 rounded-2xl border border-sky-200/80 dark:border-sky-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#2481cc]/10 dark:bg-sky-950 text-[#2481cc] flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        {language === 'km' ? '🎥 វីដេអូបង្ហាញផលិតផល (Product Video Clip)' : '🎥 Product Video Showcase'}
                      </label>
                      <p className="text-[10px] text-slate-500">
                        {language === 'km' ? 'អាចបញ្ចូលតាម Link (MP4/WebM/YouTube) ឬផ្ទុកឡើង File វីដេអូ' : 'Provide direct MP4 URL or upload a short demo video file'}
                      </p>
                    </div>
                  </div>

                  {/* Mode switcher */}
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 dark:bg-slate-800 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('url')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        videoInputMode === 'url'
                          ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {language === 'km' ? 'Link វីដេអូ' : 'Video URL'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoInputMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        videoInputMode === 'upload'
                          ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {language === 'km' ? 'ផ្ទុកឡើង File' : 'Upload File'}
                    </button>
                  </div>
                </div>

                {videoError && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{videoError}</span>
                  </div>
                )}

                {/* URL mode */}
                {videoInputMode === 'url' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          setUploadedVideo('');
                          setVideoFileName('');
                        }}
                        placeholder="https://... (mp4, webm, youtu.be, or Google Storage URL)"
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#2481cc] font-mono"
                      />
                      {(videoUrl || uploadedVideo) && (
                        <button
                          type="button"
                          onClick={() => {
                            setVideoUrl('');
                            setUploadedVideo('');
                            setVideoFileName('');
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 text-xs shrink-0 flex items-center gap-1"
                          title="លុបវីដេអូ"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{language === 'km' ? 'លុប' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    {/* Fast Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="text-slate-400 font-medium">
                        {language === 'km' ? 'គំរូវីដេអូសាកល្បង៖' : 'Demo video presets:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                          setUploadedVideo('');
                          setVideoFileName('');
                        }}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2481cc] text-slate-700 dark:text-slate-300"
                      >
                        ⚡ Smartwatch Clip (MP4)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4');
                          setUploadedVideo('');
                          setVideoFileName('');
                        }}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2481cc] text-slate-700 dark:text-slate-300"
                      >
                        🎧 Audio Demo (MP4)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4');
                          setUploadedVideo('');
                          setVideoFileName('');
                        }}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2481cc] text-slate-700 dark:text-slate-300"
                      >
                        🌿 Herbal Demo (MP4)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                          setUploadedVideo('');
                          setVideoFileName('');
                        }}
                        className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:border-rose-400 text-rose-700 dark:text-rose-300 font-medium"
                      >
                        ▶️ YouTube Demo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* File upload mode */
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-sky-300 dark:border-sky-800 rounded-2xl cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all text-center">
                      <div className="w-10 h-10 rounded-xl bg-[#2481cc]/10 text-[#2481cc] flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {videoFileName
                            ? `✓ បានជ្រើសរើស៖ ${videoFileName}`
                            : language === 'km'
                            ? 'ចុចដើម្បីជ្រើសរើស File វីដេអូ (MP4 / WebM / QuickTime)'
                            : 'Click to select video file (MP4, WebM, MOV)'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {language === 'km' ? 'ទំហំល្អបំផុតក្រោម 25MB - 50MB' : 'Max size 50MB, recommended under 25MB'}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        onChange={handleVideoFileUpload}
                        className="hidden"
                      />
                    </label>

                    {uploadedVideo && (
                      <div className="flex items-center justify-between text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200">
                        <span className="flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'km' ? 'បានផ្ទុកវីដេអូរួចរាល់' : 'Video uploaded ready!'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedVideo('');
                            setVideoFileName('');
                          }}
                          className="text-rose-600 hover:text-rose-700 text-xs font-semibold"
                        >
                          {language === 'km' ? 'លុបចេញ' : 'Remove'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Video Player Preview in Admin */}
                {(uploadedVideo || videoUrl) && (
                  <div className="pt-2 border-t border-sky-200/60 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3 text-[#2481cc]" />
                        <span>{language === 'km' ? 'ផ្ទាំងមើលវីដេអូផ្ទាល់ (Live Preview)' : 'Live Video Preview'}</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono">Ready to publish</span>
                    </div>
                    <div className="relative aspect-16/9 w-full max-h-52 bg-black rounded-xl overflow-hidden shadow-inner">
                      {getEmbedVideoUrl(uploadedVideo || videoUrl) ? (
                        <iframe
                          src={getEmbedVideoUrl(uploadedVideo || videoUrl)!}
                          title="Live Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          key={uploadedVideo || videoUrl}
                          src={uploadedVideo || videoUrl}
                          controls
                          muted
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  {editingProduct
                    ? language === 'km'
                      ? 'រក្សាទុកការកែប្រែ'
                      : 'Save Changes'
                    : language === 'km'
                    ? 'បង្កើតផលិតផល'
                    : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17212b] rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              {language === 'km' ? 'បញ្ជាក់ការលុបផលិតផល' : 'Confirm Delete Product'}
            </h4>
            <p className="text-xs text-slate-500 mt-2">
              {language === 'km'
                ? 'តើអ្នកប្រាកដជាចង់លុបផលិតផលនេះចេញពីបញ្ជីហាងដែរឬទេ? សកម្មភាពនេះនឹងត្រូវបានកត់ត្រាក្នុង Audit Log។'
                : 'Are you sure you want to delete this product? This action will be recorded in the audit trail.'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => setDeletingProductId(null)}
                className="py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                {language === 'km' ? 'ទេ, ត្រឡប់' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                {language === 'km' ? 'យល់ព្រមលុប' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
