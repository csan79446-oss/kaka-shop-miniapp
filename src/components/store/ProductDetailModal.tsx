import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Check,
  Star,
  User,
  BadgeCheck,
  Send,
  MessageCircle,
  FileCheck,
  Lock,
  Leaf,
  Award,
  Video,
  Play,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Store,
  MapPin,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecureCertificateViewer } from '../certificates/SecureCertificateViewer';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    productModalInitialMedia,
    language,
    formatPrice,
    addToCart,
    sendProductInquiryToChat,
    getProductReviews,
    getProductRating,
    addReview,
    getVendorById,
    setSelectedVendorId,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Reviews & Write review
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Media (Image vs Video)
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    try {
      // YouTube standard, youtu.be, shorts, and embed
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&playsinline=1`;
      }
      // Vimeo
      const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
      if (vimeoMatch && vimeoMatch[3]) {
        return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&muted=1&loop=1`;
      }
    } catch {
      // fallback
    }
    return null;
  };

  // Initialize variants when selectedProduct opens
  React.useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.colors && selectedProduct.colors.length > 0) {
        setSelectedColor(selectedProduct.colors[0]);
      } else {
        setSelectedColor('');
      }
      if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
        setSelectedSize(selectedProduct.sizes[0]);
      } else {
        setSelectedSize('');
      }
      setQuantity(1);
      setShowReviewForm(false);
      setActiveTab('details');
      setMediaMode(selectedProduct.video && productModalInitialMedia === 'video' ? 'video' : 'image');
      setIsVideoMuted(true);
    }
  }, [selectedProduct, productModalInitialMedia]);

  if (!selectedProduct) return null;

  const productReviews = getProductReviews(selectedProduct.id);
  const ratingInfo = getProductRating(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleChatOrder = () => {
    setSelectedProduct(null);
    sendProductInquiryToChat(
      {
        ...selectedProduct,
        descriptionKh: `${selectedProduct.descriptionKh}${
          selectedColor ? ` | ពណ៌៖ ${selectedColor}` : ''
        }${selectedSize ? ` | ទំហំ៖ ${selectedSize}` : ''}`,
      },
      'order'
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      productId: selectedProduct.id,
      authorName: reviewerName.trim(),
      rating: reviewerRating,
      commentKh: reviewComment.trim(),
      commentEn: reviewComment.trim(),
      verifiedPurchase: true,
      avatar: '🛍️',
    });

    setReviewerName('');
    setReviewComment('');
    setReviewerRating(5);
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#17212b] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 transition-all flex flex-col">
        {/* Grab bar on mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5"></div>

        {/* Header with Close */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-[#17212b]/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'details'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {language === 'km' ? 'ព័ត៌មានទំនិញ' : 'Details'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'reviews'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>
                {language === 'km' ? 'ការវាយតម្លៃ' : 'Reviews'} (
                {productReviews.length})
              </span>
            </button>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: Product Details */}
        {activeTab === 'details' && (
          <div className="p-5 space-y-4">
            {/* Media Area (Photo & Video Switcher) */}
            <div className="space-y-2">
              {/* Media Switcher Tab Pills if product has video */}
              {selectedProduct.video && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setMediaMode('image')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        mediaMode === 'image'
                          ? 'bg-white dark:bg-[#17212b] text-[#2481cc] shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{language === 'km' ? 'រូបភាព' : 'Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaMode('video')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        mediaMode === 'video'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{language === 'km' ? 'វីដេអូបង្ហាញ' : 'Video Showcase'}</span>
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                    </button>
                  </div>

                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-rose-500" />
                    <span>{language === 'km' ? 'មានវីដេអូពិត' : 'Live Demo'}</span>
                  </span>
                </div>
              )}

              {/* Media Display Viewport */}
              <div className="relative aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner group">
                {mediaMode === 'video' && selectedProduct.video ? (
                  // Video Mode
                  getEmbedVideoUrl(selectedProduct.video) ? (
                    <iframe
                      src={getEmbedVideoUrl(selectedProduct.video)!}
                      title={selectedProduct.nameKh}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video
                        ref={videoRef}
                        key={selectedProduct.video}
                        src={selectedProduct.video}
                        autoPlay
                        loop
                        muted={isVideoMuted}
                        playsInline
                        controls
                        className="w-full h-full object-contain"
                      />
                      {/* Mute/Unmute Overlay control */}
                      <button
                        type="button"
                        onClick={() => setIsVideoMuted(!isVideoMuted)}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-xs text-white shadow-md active:scale-90 transition-all z-10"
                        title={isVideoMuted ? 'បើកសម្លេង / Unmute' : 'បិទសម្លេង / Mute'}
                      >
                        {isVideoMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>

                      {/* Video indicator badge */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-1 pointer-events-none shadow-sm z-10">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>VIDEO</span>
                      </div>
                    </div>
                  )
                ) : (
                  // Image Mode
                  <>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.nameKh}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.badge && (
                      <span className="absolute top-3 left-3 bg-[#2481cc] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase shadow-xs">
                        {selectedProduct.badge}
                      </span>
                    )}

                    {/* Floating Watch Video Pill if product has video */}
                    {selectedProduct.video && (
                      <button
                        type="button"
                        onClick={() => setMediaMode('video')}
                        className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg active:scale-95 transition-all border border-white/20 group-hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{language === 'km' ? 'ទស្សនាវីដេអូ' : 'Watch Video'}</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Mini Media Gallery Thumbnails Row */}
              {selectedProduct.video && (
                <div className="flex items-center gap-2 pt-1">
                  {/* Photo Thumbnail Button */}
                  <button
                    type="button"
                    onClick={() => setMediaMode('image')}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all group ${
                      mediaMode === 'image'
                        ? 'border-[#2481cc] ring-2 ring-[#2481cc]/25 scale-102 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={selectedProduct.image}
                      alt="Photo thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center font-medium py-0.5">
                      {language === 'km' ? 'រូបភាព' : 'Photo'}
                    </span>
                  </button>

                  {/* Video Thumbnail Button */}
                  <button
                    type="button"
                    onClick={() => setMediaMode('video')}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 bg-slate-950 transition-all group ${
                      mediaMode === 'video'
                        ? 'border-rose-500 ring-2 ring-rose-500/25 scale-102 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={selectedProduct.image}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover filter brightness-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                        <Play className="w-2.5 h-2.5 fill-white translate-x-0.2" />
                      </div>
                    </div>
                    <span className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-[9px] text-white text-center font-bold py-0.5">
                      {language === 'km' ? 'វីដេអូ' : 'Video'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Title & Rating Summary */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/40">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs font-mono">{ratingInfo.rating}</span>
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-slate-500 hover:text-[#2481cc] underline decoration-dotted"
                >
                  {language === 'km'
                    ? `${productReviews.length} ការវាយតម្លៃពិត`
                    : `${productReviews.length} verified reviews`}
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {language === 'km' ? selectedProduct.nameKh : selectedProduct.nameEn}
              </h2>

              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-black text-[#2481cc] dark:text-[#50a7ea]">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                  {language === 'km'
                    ? `មានក្នុងស្តុក ${selectedProduct.stock}`
                    : `${selectedProduct.stock} In Stock`}
                </span>
              </div>
            </div>

            {/* Color Variant Selector */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'km' ? 'ជ្រើសរើសពណ៌' : 'Select Color'}
                  </span>
                  <span className="text-xs font-semibold text-[#2481cc]">
                    {selectedColor || 'None'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((c) => {
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#2481cc] text-white border-[#2481cc] shadow-xs scale-102'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Variant Selector */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'km' ? 'ជ្រើសរើសទំហំ / ចំណុះ' : 'Select Size'}
                  </span>
                  <span className="text-xs font-semibold text-[#2481cc] font-mono">
                    {selectedSize || 'None'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-[#2481cc] text-white border-[#2481cc] shadow-xs scale-102 font-mono'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 font-mono'
                        }`}
                      >
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'km' ? 'ការពិពណ៌នា' : 'Description'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'km'
                  ? selectedProduct.descriptionKh
                  : selectedProduct.descriptionEn}
              </p>
            </div>

            {/* Traditional Medicine Certification & Safe Preview Banner */}
            {(selectedProduct.isTraditionalMedicine || selectedProduct.category === 'herbal') && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'km' ? 'ឱសថបុរាណមានអាជ្ញាប័ណ្ណត្រឹមត្រូវ' : 'Verified Traditional Herbal Medicine'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                    {selectedProduct.licenseNumber || 'CAM-MOH/2024'}
                  </span>
                </div>

                {selectedProduct.ingredientsKh && (
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-800 dark:text-emerald-300">
                      {language === 'km' ? '🌱 សមាសធាតុផ្សំធម្មជាតិ៖ ' : 'Natural Ingredients: '}
                    </strong>
                    <span>{language === 'km' ? selectedProduct.ingredientsKh : selectedProduct.ingredientsEn}</span>
                  </div>
                )}

                {selectedProduct.dosageKh && (
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-800 dark:text-emerald-300">
                      {language === 'km' ? '🥄 របៀបប្រើប្រាស់៖ ' : 'Dosage & Usage: '}
                    </strong>
                    <span>{language === 'km' ? selectedProduct.dosageKh : selectedProduct.dosageEn}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <Award className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'ស្តង់ដារក្រសួងសុខាភិបាល & GMP' : 'MoH & GMP Certified'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{language === 'km' ? 'ពិនិត្យលិខិតអនុញ្ញាតផ្លូវការ' : 'View Official Permit'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Vendor / Seller Profile Card */}
            {(() => {
              const vendor = selectedProduct.vendorId ? getVendorById(selectedProduct.vendorId) : null;
              if (!vendor) return null;

              return (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={vendor.logo}
                        alt={vendor.nameKh}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {language === 'km' ? vendor.nameKh : vendor.nameEn}
                          </span>
                          {vendor.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>{vendor.rating}</span>
                          </div>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{vendor.city}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVendorId(vendor.id);
                        setSelectedProduct(null);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2481cc]/10 hover:bg-[#2481cc] text-[#2481cc] hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-all shrink-0 active:scale-95"
                    >
                      <Store className="w-3 h-3" />
                      <span>{language === 'km' ? 'ចូលហាង' : 'Store'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {language === 'km' ? vendor.descriptionKh : vendor.descriptionEn}
                  </p>
                </div>
              );
            })()}

            {/* Value props */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#2481cc] mb-1" />
                <span>{language === 'km' ? 'ដឹកជញ្ជូនរហ័ស' : 'Fast Delivery'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1" />
                <span>{language === 'km' ? 'គុណភាព 100%' : '100% Genuine'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-amber-500 mb-1" />
                <span>{language === 'km' ? 'ធានាប្តូរវិញ 7 ថ្ងៃ' : '7 Days Return'}</span>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'km' ? 'ចំនួនទិញ' : 'Quantity'}
              </span>
              <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 bg-white dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedProduct.stock, quantity + 1))
                  }
                  className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews & Ratings */}
        {activeTab === 'reviews' && (
          <div className="p-5 space-y-4">
            {/* Rating Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                  <span>{ratingInfo.rating}</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`w-4 h-4 ${
                          st <= Math.round(ratingInfo.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {language === 'km'
                    ? `ផ្អែកលើការវាយតម្លៃពិត ${productReviews.length} នាក់`
                    : `Based on ${productReviews.length} genuine customer reviews`}
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                {showReviewForm
                  ? language === 'km'
                    ? 'បិទ'
                    : 'Close'
                  : language === 'km'
                  ? 'សរសេរមតិ'
                  : 'Write Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {language === 'km'
                    ? 'ចែករំលែកបទពិសោធន៍របស់អ្នក'
                    : 'Share your shopping experience'}
                </div>

                {/* Rating picker */}
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    {language === 'km' ? 'ពិន្ទុផ្កាយ' : 'Star Rating'}
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewerRating(s)}
                        className="p-1 hover:scale-115 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= reviewerRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder={
                      language === 'km' ? 'ឈ្មោះរបស់អ្នក *' : 'Your Name *'
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={
                      language === 'km'
                        ? 'សរសេរការយល់ឃើញរបស់អ្នកអំពីផលិតផលនេះ...'
                        : 'Write your thoughts on this product...'
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs rounded-lg"
                  >
                    {language === 'km' ? 'បោះបង់' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#2481cc] text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    {language === 'km' ? 'ផ្ញើការវាយតម្លៃ' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <span>
                    {language === 'km'
                      ? 'មិនទាន់មានការវាយតម្លៃនៅឡើយទេ។ សូមក្លាយជាអ្នកដំបូង!'
                      : 'No reviews yet. Be the first to leave a review!'}
                  </span>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{rev.avatar || '👤'}</span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.authorName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded font-medium">
                            <BadgeCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {language === 'km' ? rev.commentKh : rev.commentEn}
                    </p>

                    <div className="text-[10px] text-slate-400">
                      {new Date(rev.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action Buttons Sticky Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#17212b] sticky bottom-0 grid grid-cols-2 gap-2.5">
          {/* Direct Live Chat Order Button */}
          <button
            onClick={handleChatOrder}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {language === 'km' ? 'ឆាតបញ្ជាទិញផ្ទាល់' : 'Chat to Order'}
            </span>
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              added
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-[#2481cc] hover:bg-[#1d6fae] text-white shadow-md active:scale-98'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>{language === 'km' ? 'បានបន្ថែម!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{language === 'km' ? 'ដាក់ក្នុងកន្ត្រក' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Protected Certificate Viewer */}
      <SecureCertificateViewer
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />
    </div>
  );
};
