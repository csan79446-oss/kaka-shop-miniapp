import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Share2,
  CheckCircle,
  QrCode,
  Truck,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles,
  Tag,
  Copy,
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  ZoomIn,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { EXCHANGE_RATE_KHR } from '../../data/mockData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { language, formatPrice, storeInfo, primaryStoreLocation } = useApp();
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [viewMode, setViewMode] = useState<'receipt' | 'preview'>('receipt');
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleString(
    language === 'km' ? 'km-KH' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const subtotal =
    order.subtotal ||
    order.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);

  const discount = order.discountAmount || 0;
  const khrAmount = Math.round(order.totalAmount * EXCHANGE_RATE_KHR);

  // Helper to convert any oklch(...) colors in cloned document to safe hex/rgba
  const sanitizeClonedDocColors = (clonedDoc: Document) => {
    // 1. Remove or sanitize any style tags containing oklch
    const styleTags = clonedDoc.querySelectorAll('style');
    styleTags.forEach((styleTag) => {
      if (styleTag.textContent && styleTag.textContent.includes('oklch')) {
        styleTag.textContent = styleTag.textContent.replace(
          /oklch\([^)]+\)/g,
          '#1e293b'
        );
      }
    });

    // 2. Iterate all elements inside cloned document
    const allElements = clonedDoc.querySelectorAll<HTMLElement>('*');
    allElements.forEach((el) => {
      const inlineStyle = el.getAttribute('style') || '';
      if (inlineStyle.includes('oklch')) {
        el.setAttribute(
          'style',
          inlineStyle.replace(/oklch\([^)]+\)/g, '#1e293b')
        );
      }
      // Ensure Khmer font glyphs are never clipped by setting generous line height and visible overflow
      el.style.overflow = 'visible';
      if (
        el.tagName === 'SPAN' ||
        el.tagName === 'DIV' ||
        el.tagName === 'P' ||
        el.tagName === 'H2' ||
        el.tagName === 'H3'
      ) {
        el.style.lineHeight = '1.75';
        el.style.letterSpacing = '0px';
      }
    });
  };

  // Generate high quality PDF & enable Preview
  const handleGeneratePdf = async (autoDownload: boolean = false) => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Capture the element using html2canvas with scale 2.5
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          sanitizeClonedDocColors(clonedDoc);
        },
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfPreviewUrl(blobUrl);

      if (autoDownload) {
        pdf.save(`KAKA_Invoice_${order.orderNumber}.pdf`);
      } else {
        setViewMode('preview');
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Download directly as crisp high-resolution PNG image
  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, // Ultra crisp 300 DPI
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          sanitizeClonedDocColors(clonedDoc);
        },
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `KAKA_Invoice_${order.orderNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download image:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadSavedPdf = () => {
    if (!pdfBlob) {
      handleGeneratePdf(true);
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `KAKA_Invoice_${order.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Telegram 1-Click Share
  const handleTelegramShare = () => {
    const itemsList = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.nameKh} ${
            it.selectedColor ? `[${it.selectedColor}]` : ''
          } ${it.selectedSize ? `[${it.selectedSize}]` : ''} x${it.quantity} = $${(
            it.product.price * it.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    const storeName = primaryStoreLocation?.nameKh || storeInfo.nameKh;
    const storeAddr = primaryStoreLocation?.addressKh || storeInfo.addressKh;
    const storePhone = primaryStoreLocation?.phone || storeInfo.phone1;

    const messageText = `🧾 *វិក្កយបត្រផ្លូវការ / OFFICIAL INVOICE*
🏪 *${storeName}*
📍 អាសយដ្ឋានហាង: ${storeAddr}
📞 ទូរស័ព្ទហាង: ${storePhone}
🆔 លេខកុម្ម៉ង់: \`#${order.orderNumber}\`
📅 កាលបរិច្ឆេទ: ${orderDate}
👤 អតិថិជន: ${order.customerName}
📞 លេខទូរស័ព្ទ: ${order.customerPhone}
📍 អាសយដ្ឋាន: ${order.customerAddress}

🛍️ *បញ្ជីទំនិញ:*
${itemsList}

💰 តម្លៃដើម: $${subtotal.toFixed(2)}
${discount > 0 ? `🎁 បញ្ចុះតម្លៃ (${order.couponCode || 'PROMO'}): -$${discount.toFixed(2)}\n` : ''}🚚 ដឹកជញ្ជូន: ឥតគិតថ្លៃ (Free Delivery)
💵 *សរុបទឹកប្រាក់:* *$${order.totalAmount.toFixed(2)}* (${khrAmount.toLocaleString()} ៛)
💳 វិធីទូទាត់: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === 'paid' ? '✅ បង់រួចរាល់' : '⏳ ទូទាត់ពេលដល់'})
🚚 ស្ថានភាព: ${order.status.toUpperCase()}

🙏 សូមអរគុណសម្រាប់ការគាំទ្រ KAKA Shop!`;

    if (navigator.share) {
      navigator
        .share({
          title: `KAKA Shop Invoice #${order.orderNumber}`,
          text: messageText,
        })
        .catch(() => {
          openTelegramWebShare(messageText);
        });
    } else {
      openTelegramWebShare(messageText);
    }
  };

  const openTelegramWebShare = (text: string) => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      window.location.origin
    )}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, '_blank');
  };

  const handleCopySummary = () => {
    const text = `KAKA Shop Invoice #${order.orderNumber} | Customer: ${order.customerName} | Phone: ${order.customerPhone} | Total: $${order.totalAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white dark:bg-[#17212b] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-scale-up print:shadow-none print:border-none print:max-w-none print:w-full flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#2481cc]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-800 dark:text-white">
              {viewMode === 'preview'
                ? language === 'km'
                  ? 'មើលគំរូ PDF (PDF Preview)'
                  : 'PDF Preview'
                : language === 'km'
                ? 'វិក្កយបត្រអេឡិចត្រូនិក'
                : 'Official E-Receipt'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Between Receipt & PDF Preview */}
            {pdfPreviewUrl && (
              <button
                onClick={() =>
                  setViewMode(viewMode === 'receipt' ? 'preview' : 'receipt')
                }
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors flex items-center gap-1"
              >
                {viewMode === 'receipt' ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#2481cc]" />
                    <span>{language === 'km' ? 'មើល PDF' : 'View PDF'}</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-[#2481cc]" />
                    <span>{language === 'km' ? 'វិក្កយបត្រ' : 'Receipt'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode: Interactive PDF Preview Frame */}
        {viewMode === 'preview' && pdfPreviewUrl ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950/80 flex flex-col items-center">
            <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800 mb-3">
              <iframe
                src={pdfPreviewUrl}
                title="PDF Preview"
                className="w-full h-[60vh] rounded-2xl border-none"
              />
            </div>
            <p className="text-xs text-slate-500 text-center flex items-center gap-1.5 font-medium">
              <ZoomIn className="w-3.5 h-3.5 text-[#2481cc]" />
              <span>
                {language === 'km'
                  ? 'ឯកសារ PDF ត្រូវបានរៀបចំរួចរាល់។ អ្នកអាច Save ឬទាញយកឥឡូវនេះ!'
                  : 'PDF is ready for review. Click Save as PDF to download.'}
              </span>
            </p>
          </div>
        ) : (
          /* View Mode: Printable Receipt Body (Pure standard HEX colors, completely avoiding oklch) */
          <div className="flex-1 overflow-y-auto">
            <div
              ref={receiptRef}
              className="p-6 sm:p-7 space-y-5 print:p-8"
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontFamily:
                  "'Kantumruy Pro', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
              }}
            >
              {/* Receipt Header Banner */}
              <div
                className="text-center pb-4 space-y-1"
                style={{ borderBottom: '2px dashed #e2e8f0' }}
              >
                <div
                  className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase"
                  style={{ backgroundColor: '#f0f9ff', color: '#2481cc' }}
                >
                  <span>KAKA SHOP MINIAPP</span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{ color: '#0f172a' }}
                >
                  {language === 'km' ? 'វិក្កយបត្រផ្លូវការ' : 'OFFICIAL RECEIPT'}
                </h2>
                <p className="text-xs font-semibold" style={{ color: '#0f172a' }}>
                  {language === 'km'
                    ? primaryStoreLocation?.nameKh || storeInfo.nameKh
                    : primaryStoreLocation?.nameEn || storeInfo.nameEn}
                </p>
                <p className="text-[11px] font-medium max-w-sm mx-auto leading-tight" style={{ color: '#64748b' }}>
                  📍 {language === 'km'
                    ? primaryStoreLocation?.addressKh || storeInfo.addressKh
                    : primaryStoreLocation?.addressEn || storeInfo.addressEn}
                </p>
                <p className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>
                  📞 {primaryStoreLocation?.phone || storeInfo.phone1} · Telegram: @{storeInfo.telegramUsername}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono">
                  <span style={{ color: '#94a3b8' }}>INVOICE:</span>
                  <span
                    className="font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#f1f5f9', color: '#0f172a' }}
                  >
                    #{order.orderNumber}
                  </span>
                </div>
              </div>

              {/* Customer & Order Metadata */}
              <div
                className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-2xl"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div className="space-y-1">
                  <span
                    className="text-[10px] uppercase font-bold block"
                    style={{ color: '#94a3b8' }}
                  >
                    {language === 'km' ? 'ព័ត៌មានអតិថិជន' : 'Customer Info'}
                  </span>
                  <div className="font-bold" style={{ color: '#0f172a' }}>
                    {order.customerName}
                  </div>
                  <div
                    className="flex items-center gap-1 font-mono"
                    style={{ color: '#334155' }}
                  >
                    <Phone className="w-3 h-3 shrink-0" style={{ color: '#2481cc' }} />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div
                    className="text-[11px] flex items-start gap-1 leading-snug"
                    style={{ color: '#64748b' }}
                  >
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: '#e11d48' }} />
                    <span>{order.customerAddress}</span>
                  </div>
                </div>

                <div
                  className="space-y-1 pl-3"
                  style={{ borderLeft: '1px solid #e2e8f0' }}
                >
                  <span
                    className="text-[10px] uppercase font-bold block"
                    style={{ color: '#94a3b8' }}
                  >
                    {language === 'km' ? 'ព័ត៌មានកុម្ម៉ង់' : 'Order Details'}
                  </span>
                  <div
                    className="flex items-center gap-1 text-[11px]"
                    style={{ color: '#334155' }}
                  >
                    <Calendar className="w-3 h-3 shrink-0" style={{ color: '#94a3b8' }} />
                    <span>{orderDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 shrink-0" style={{ color: '#0891b2' }} />
                    <span
                      className="font-semibold uppercase text-[11px]"
                      style={{ color: '#1e293b' }}
                    >
                      {order.paymentMethod}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase"
                      style={{
                        backgroundColor:
                          order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                        color:
                          order.paymentStatus === 'paid' ? '#166534' : '#92400e',
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    <Truck className="w-3 h-3 shrink-0" style={{ color: '#9333ea' }} />
                    <span
                      className="text-[11px] font-semibold uppercase"
                      style={{ color: '#7e22ce' }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div>
                <div
                  className="text-[11px] font-bold uppercase tracking-wider mb-2 flex justify-between"
                  style={{ color: '#94a3b8' }}
                >
                  <span>{language === 'km' ? 'មុខទំនិញ' : 'Purchased Items'}</span>
                  <span>{language === 'km' ? 'តម្លៃ' : 'Amount'}</span>
                </div>

                <div
                  className="divide-y"
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  {order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-center justify-between text-xs gap-3"
                      style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={it.product.image}
                          alt={it.product.nameKh}
                          crossOrigin="anonymous"
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                          style={{ border: '1px solid #e2e8f0' }}
                        />
                        <div className="min-w-0 flex-1">
                          <div
                            className="font-semibold text-xs"
                            style={{
                              color: '#0f172a',
                              lineHeight: '1.7',
                              wordBreak: 'break-word',
                            }}
                          >
                            {language === 'km' ? it.product.nameKh : it.product.nameEn}
                          </div>

                          {/* Variant Badges (Color / Size) */}
                          {(it.selectedColor || it.selectedSize) && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {it.selectedColor && (
                                <span
                                  className="text-[10px] px-1.5 py-0.2 rounded font-medium"
                                  style={{
                                    backgroundColor: '#f1f5f9',
                                    color: '#334155',
                                  }}
                                >
                                  {it.selectedColor}
                                </span>
                              )}
                              {it.selectedSize && (
                                <span
                                  className="text-[10px] px-1.5 py-0.2 rounded font-bold font-mono"
                                  style={{
                                    backgroundColor: '#f0f9ff',
                                    color: '#2481cc',
                                  }}
                                >
                                  {it.selectedSize}
                                </span>
                              )}
                            </div>
                          )}

                          <div
                            className="text-[11px] font-mono mt-0.5"
                            style={{ color: '#64748b' }}
                          >
                            {it.quantity} × {formatPrice(it.product.price)}
                          </div>
                        </div>
                      </div>

                      <span
                        className="font-bold font-mono text-xs shrink-0"
                        style={{ color: '#0f172a' }}
                      >
                        {formatPrice(it.product.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div
                className="space-y-1.5 text-xs pt-1"
                style={{ color: '#334155' }}
              >
                <div className="flex justify-between">
                  <span>
                    {language === 'km' ? 'តម្លៃទំនិញសរុប (Subtotal)' : 'Subtotal'}
                  </span>
                  <span className="font-mono font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div
                    className="flex justify-between font-medium"
                    style={{ color: '#16a34a' }}
                  >
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>
                        {language === 'km' ? 'បញ្ចុះតម្លៃគូប៉ុង' : 'Coupon Discount'} (
                        {order.couponCode || 'PROMO'})
                      </span>
                    </span>
                    <span className="font-mono font-bold">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{language === 'km' ? 'សេវាដឹកជញ្ជូន' : 'Shipping Fee'}</span>
                  <span
                    className="font-semibold font-mono"
                    style={{ color: '#16a34a' }}
                  >
                    {language === 'km' ? 'ឥតគិតថ្លៃ (Free)' : 'FREE'}
                  </span>
                </div>

                <div
                  className="pt-2 flex items-center justify-between"
                  style={{ borderTop: '2px dashed #e2e8f0' }}
                >
                  <div>
                    <span
                      className="text-xs font-bold block"
                      style={{ color: '#0f172a' }}
                    >
                      {language === 'km' ? 'ទឹកប្រាក់សរុប (Grand Total)' : 'Grand Total'}
                    </span>
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: '#64748b' }}
                    >
                      ≈ {khrAmount.toLocaleString()} ៛ (Rate: 4,100)
                    </span>
                  </div>
                  <span
                    className="text-xl font-black font-mono"
                    style={{ color: '#2481cc' }}
                  >
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Authenticity QR & Stamp */}
              <div
                className="p-3 rounded-2xl flex items-center justify-between gap-3"
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-11 h-11 rounded-xl p-1 shadow-2xs flex items-center justify-center"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      color: '#1e293b',
                    }}
                  >
                    <QrCode className="w-9 h-9" />
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold flex items-center gap-1"
                      style={{ color: '#1e293b' }}
                    >
                      <CheckCircle
                        className="w-3.5 h-3.5"
                        style={{ color: '#22c55e' }}
                      />
                      <span>
                        {language === 'km'
                          ? 'ផ្ទៀងផ្ទាត់ផ្លូវការ'
                          : 'Verified Genuine Order'}
                      </span>
                    </div>
                    <div
                      className="text-[10px] font-mono"
                      style={{ color: '#94a3b8' }}
                    >
                      Scan to verify authentic order
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase rotate-[-6deg]"
                    style={{
                      border: '2px solid #22c55e',
                      color: '#16a34a',
                    }}
                  >
                    PAID & APPROVED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Sticky Footer (Hidden during print) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-2 print:hidden shrink-0">
          {/* Preview & Download PDF Button */}
          {viewMode === 'preview' ? (
            <button
              onClick={handleDownloadSavedPdf}
              className="w-full sm:flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>
                {language === 'km' ? 'ទាញយកឯកសារ PDF' : 'Save as PDF File'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleGeneratePdf(false)}
              disabled={isGeneratingPdf}
              className="w-full sm:flex-1 py-2.5 px-3 bg-gradient-to-r from-sky-500 to-[#2481cc] hover:from-sky-600 hover:to-[#1d6fae] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {language === 'km' ? 'កំពុងបង្កើត PDF...' : 'Generating PDF...'}
                  </span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>
                    {language === 'km'
                      ? 'Preview & Save PDF'
                      : 'Preview & Save PDF'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Save HD PNG Image Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            title="ទាញយកជារូបភាពច្បាស់ (PNG)"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'km' ? 'រូបភាពច្បាស់ (PNG)' : 'HD Image (PNG)'}</span>
          </button>

          {/* Direct Print Button */}
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#2481cc]" />
            <span>{language === 'km' ? 'បោះពុម្ព' : 'Print'}</span>
          </button>

          {/* Telegram 1-Click Share */}
          <button
            onClick={handleTelegramShare}
            className="w-full sm:w-auto py-2.5 px-3 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Telegram</span>
          </button>

          {/* Copy summary */}
          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-slate-700 bg-white dark:bg-slate-800 transition-colors"
            title="ចម្លងព័ត៌មាន / Copy"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
