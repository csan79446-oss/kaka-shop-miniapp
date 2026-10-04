/**
 * EMVCo KHQR Generator for Cambodia (Bakong / NBC Standard)
 * Generates standard dynamic KHQR compliant with National Bank of Cambodia
 * Scannable by ABA Mobile, ACLEDA, Bakong, Wing, Canadia, Sathapana, etc.
 */

function formatEmvTag(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

export function calculateCrc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface KhqrOptions {
  bakongId: string; // e.g. "thasmun@aba" or "012345678" or "kaka_shop@aba"
  merchantName: string; // e.g. "KAKA Gadgets" or "Phsar24"
  merchantCity?: string; // e.g. "Phnom Penh"
  amount: number; // e.g. 15.00
  currency?: 'USD' | 'KHR'; // default 'USD'
  billNumber?: string; // e.g. "ORD-1234"
  storeLabel?: string; // e.g. "Phsar24 Store"
  terminalLabel?: string; // e.g. "Online Cashier"
}

export function generateKhqrString(options: KhqrOptions): string {
  const {
    bakongId,
    merchantName,
    merchantCity = 'Phnom Penh',
    amount,
    currency = 'USD',
    billNumber = '0000',
    storeLabel = 'Phsar24',
    terminalLabel = 'Cashier',
  } = options;

  const currencyCode = currency === 'KHR' ? '116' : '840';
  const formattedAmount = currency === 'KHR' ? Math.round(amount).toString() : amount.toFixed(2);
  const cleanBakongId = bakongId && bakongId.trim() ? bakongId.trim() : 'kaka_gadgets@aba';
  const cleanMerchantName = (merchantName || 'Phsar24 Shop')
    .replace(/[^\x00-\x7F]/g, '') // EMVCo names are Latin/ASCII
    .trim() || 'Phsar24 Merchant';

  // Tag 29: Merchant Account Information
  // Subtag 00: Bakong Account ID
  const subtag00 = formatEmvTag('00', cleanBakongId);
  const tag29 = formatEmvTag('29', subtag00);

  // Tag 62: Additional Data Field Template
  const subtag62_01 = formatEmvTag('01', billNumber.slice(0, 25));
  const subtag62_03 = formatEmvTag('03', storeLabel.replace(/[^\x00-\x7F]/g, '').slice(0, 25) || 'Store');
  const subtag62_07 = formatEmvTag('07', terminalLabel.slice(0, 25));
  const tag62 = formatEmvTag('62', `${subtag62_01}${subtag62_03}${subtag62_07}`);

  let raw = '';
  raw += formatEmvTag('00', '01'); // Payload Format Indicator
  raw += formatEmvTag('01', '12'); // Dynamic QR Code
  raw += tag29;
  raw += formatEmvTag('52', '5999'); // Merchant Category Code
  raw += formatEmvTag('53', currencyCode); // Currency
  raw += formatEmvTag('54', formattedAmount); // Amount
  raw += formatEmvTag('58', 'KH'); // Country Code
  raw += formatEmvTag('59', cleanMerchantName.slice(0, 25)); // Merchant Name
  raw += formatEmvTag('60', merchantCity.slice(0, 15)); // Merchant City
  raw += tag62; // Additional Data
  raw += '6304'; // CRC Tag + Length prefix

  const crc = calculateCrc16(raw);
  return `${raw.slice(0, -4)}${formatEmvTag('63', crc)}`;
}

export function getKhqrQrImageUrl(khqrString: string, size = 320): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    khqrString
  )}&margin=12&format=svg`;
}
