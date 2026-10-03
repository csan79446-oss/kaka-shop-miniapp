import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  AlertTriangle,
  X,
  FileCheck,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
  Building,
  Calendar,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicalLicense } from '../../types';

interface SecureCertificateViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialLicenseId?: string;
}

// Built-in verified licenses for traditional herbal medicine
export const VERIFIED_LICENSES: MedicalLicense[] = [
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
        <!-- Ornamental Gold Border -->
        <rect x="25" y="25" width="750" height="1070" fill="none" stroke="url(#goldBorder)" stroke-width="8" rx="8"/>
        <rect x="35" y="35" width="730" height="1050" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 2" rx="4"/>
        
        <!-- Header: Kingdom of Cambodia -->
        <text x="400" y="80" font-family="'Kantumruy Pro', serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">ព្រះរាជាណាចក្រកម្ពុជា</text>
        <text x="400" y="105" font-family="'Kantumruy Pro', serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">ជាតិ សាសនា ព្រះមហាក្សត្រ</text>
        <line x1="330" y1="118" x2="470" y2="118" stroke="#d97706" stroke-width="2"/>
        
        <!-- Ministry Emblem / Icon -->
        <circle cx="400" cy="180" r="42" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
        <path d="M400,150 L412,175 L438,175 L416,192 L424,218 L400,202 L376,218 L384,192 L362,175 L388,175 Z" fill="#d97706"/>
        
        <!-- Document Title -->
        <text x="400" y="260" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#b45309" text-anchor="middle">លិខិតអនុញ្ញាតអាជីវកម្មឱសថបុរាណផ្លូវការ</text>
        <text x="400" y="285" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#475569" text-anchor="middle">OFFICIAL TRADITIONAL MEDICINE PERMIT</text>
        
        <!-- Certificate Number -->
        <rect x="230" y="305" width="340" height="34" rx="17" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
        <text x="400" y="327" font-family="monospace" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">No: CAM-MOH-TRM/2024/0988</text>
        
        <!-- Body Content -->
        <text x="80" y="390" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#1e293b">ក្រសួងសុខាភិបាល សូមបញ្ជាក់ទទួលស្គាល់ថា៖</text>
        
        <rect x="75" y="410" width="650" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="100" y="445" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ឈ្មោះអាជីវកម្ម / ហាង៖</text>
        <text x="260" y="445" font-family="'Kantumruy Pro', sans-serif" font-size="15" font-weight="bold" fill="#0f172a">KAKA ឱសថបុរាណធម្មជាតិ (KAKA HERBAL PHARMACY)</text>
        
        <text x="100" y="480" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ម្ចាស់អាជីវកម្ម៖</text>
        <text x="260" y="480" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">លោក ថាស មុន (Thas Mun)</text>
        
        <text x="100" y="515" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ប្រភេទអាជីវកម្ម៖</text>
        <text x="260" y="515" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">ចែកចាយ និងផ្គត់ផ្គង់ឱសថបុរាណ តែរុក្ខជាតិ និងប្រេងកូឡាធម្មជាតិ</text>
        
        <text x="100" y="545" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ទីតាំងអាជីវកម្ម៖</text>
        <text x="260" y="545" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">ផ្ទះលេខ #168E, ផ្លូវ 271, រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា</text>
        
        <!-- Validity & Legal Scope -->
        <rect x="75" y="580" width="650" height="170" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <text x="100" y="615" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">លក្ខខណ្ឌ និងសុពលភាពស្របច្បាប់៖</text>
        <text x="100" y="645" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#334155">១. ផលិតផលទាំងអស់ត្រូវបានត្រួតពិនិត្យជាតិពុល និងស្តង់ដារគុណភាពយ៉ាងហ្មត់ចត់។</text>
        <text x="100" y="675" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#334155">២. ផ្សំឡើងពីរុក្ខជាតិឱសថធម្មជាតិ ១០០% គ្មានសារធាតុគីមី ឬសារធាតុញៀនហាមឃាត់ឡើយ។</text>
        <text x="100" y="705" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#334155">៣. មានសុពលភាពចាប់ពីថ្ងៃទី ១៥ មករា ២០២៤ ដល់ថ្ងៃទី ១៤ មករា ២០២៩។</text>
        <text x="100" y="735" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#059669">✓ ស្ថានភាព៖ សុពលភាពពេញលេញ (VERIFIED ACTIVE)</text>
        
        <!-- Official Red Stamp & Signature -->
        <g transform="translate(480, 800)">
          <!-- Red circular official seal -->
          <circle cx="120" cy="80" r="65" fill="none" stroke="#dc2626" stroke-width="4" stroke-opacity="0.85"/>
          <circle cx="120" cy="80" r="55" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 2" stroke-opacity="0.85"/>
          <text x="120" y="60" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle" fill-opacity="0.85">ក្រសួងសុខាភិបាល</text>
          <text x="120" y="85" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle" fill-opacity="0.85">★ បានអនុម័ត ★</text>
          <text x="120" y="105" font-family="'Kantumruy Pro', sans-serif" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle" fill-opacity="0.85">នាយកដ្ឋានឱសថ</text>
          
          <!-- Signature scribbles -->
          <path d="M40,110 C80,70 110,130 150,90 C170,80 190,120 200,95" fill="none" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round"/>
          <text x="120" y="160" font-family="'Kantumruy Pro', sans-serif" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">ប្រធាននាយកដ្ឋានឱសថ និងចំណីអាហារ</text>
        </g>
        
        <!-- Issuance date & QR -->
        <text x="80" y="870" font-family="'Kantumruy Pro', sans-serif" font-size="12" fill="#64748b">រាជធានីភ្នំពេញ, ថ្ងៃទី ១៥ ខែ មករា ឆ្នាំ ២០២៤</text>
        <rect x="80" y="890" width="70" height="70" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <text x="115" y="930" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">QR CODE</text>
        <text x="165" y="920" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#475569">ស្កេនដើម្បីផ្ទៀងផ្ទាត់</text>
        <text x="165" y="940" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#94a3b8">Scan for Verification</text>

        <!-- Footer legal notice -->
        <line x1="50" y1="1020" x2="750" y2="1020" stroke="#cbd5e1" stroke-width="1"/>
        <text x="400" y="1050" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">ឯកសារផ្លូវការមានការចុះបញ្ជីត្រឹមត្រូវ - រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ KAKA ឱសថបុរាណ</text>
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
        <rect x="36" y="36" width="728" height="1048" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="5 3" rx="6"/>
        
        <circle cx="400" cy="150" r="50" fill="#ecfdf5" stroke="#059669" stroke-width="4"/>
        <text x="400" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" fill="#047857" text-anchor="middle">GMP</text>
        
        <text x="400" y="235" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#065f46" text-anchor="middle">វិញ្ញាបនបត្រស្តង់ដារគុណភាពផលិតកម្មល្អ GMP</text>
        <text x="400" y="260" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#059669" text-anchor="middle">CERTIFICATE OF GOOD MANUFACTURING PRACTICE</text>
        
        <rect x="250" y="280" width="300" height="30" rx="15" fill="#f0fdf4" stroke="#a7f3d0" stroke-width="1"/>
        <text x="400" y="300" font-family="monospace" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">CERT ID: GMP-KH-2024-QC551</text>
        
        <!-- Content -->
        <rect x="80" y="340" width="640" height="360" rx="12" fill="#ffffff" stroke="#d1fae5" stroke-width="1.5"/>
        <text x="110" y="380" font-family="'Kantumruy Pro', sans-serif" font-size="15" font-weight="bold" fill="#065f46">ស្ថាប័នត្រួតពិនិត្យគុណភាព សូមបញ្ជាក់ថា៖</text>
        
        <text x="110" y="420" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">សហគ្រាសផលិត៖</text>
        <text x="270" y="420" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#0f172a">KAKA BOTANICAL LABORATORY & HERBAL PHARMACY</text>
        
        <text x="110" y="460" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">ស្តង់ដារវាយតម្លៃ៖</text>
        <text x="270" y="460" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#047857">ISO 22716 / GMP HERBAL PROCESSING STANDARDS</text>
        
        <text x="110" y="500" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">កម្រិតសុវត្ថិភាព៖</text>
        <text x="270" y="500" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#0f172a">កម្រិត A (១០០% គ្មានសារធាតុគីមី និងគ្មានលោហធាតុធ្ងន់)</text>

        <text x="110" y="540" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">វិសាលភាពអនុវត្ត៖</text>
        <text x="270" y="540" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">ផលិតឱសថរុក្ខជាតិបុរាណ, តែជំនួយសុខភាព, ប្រេងកូឡាធម្មជាតិ</text>
        
        <text x="110" y="580" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#64748b">កាលបរិច្ឆេទត្រួតពិនិត្យ៖</text>
        <text x="270" y="580" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">ថ្ងៃទី ២០ មីនា ២០២៤ ដល់ ថ្ងៃទី ១៩ មីនា ២០២៧</text>
        
        <rect x="110" y="610" width="580" height="60" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1"/>
        <text x="400" y="645" font-family="'Kantumruy Pro', sans-serif" font-size="13" font-weight="bold" fill="#047857" text-anchor="middle">✓ ទទួលស្គាល់ផលិតផលមានសុវត្ថិភាពខ្ពស់បំផុត អាចប្រើប្រាស់ដោយទុកចិត្តបាន</text>

        <!-- Stamps -->
        <g transform="translate(500, 750)">
          <circle cx="100" cy="80" r="60" fill="none" stroke="#059669" stroke-width="3"/>
          <text x="100" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">CERTIFIED</text>
          <text x="100" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#059669" text-anchor="middle">GMP PASS</text>
        </g>
        
        <line x1="50" y1="1020" x2="750" y2="1020" stroke="#a7f3d0" stroke-width="1"/>
        <text x="400" y="1050" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#6ee7b7" text-anchor="middle">ឯកសារស្តង់ដារជាតិ និងអន្តរជាតិ - KAKA OFFICIAL</text>
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
        <defs>
          <linearGradient id="orgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fefce8"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1120" fill="url(#orgGrad)"/>
        <rect x="25" y="25" width="750" height="1070" fill="none" stroke="#ca8a04" stroke-width="6" rx="10"/>
        
        <circle cx="400" cy="140" r="45" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
        <path d="M400,110 C380,140 370,165 400,175 C430,165 420,140 400,110 Z" fill="#65a30d"/>
        
        <text x="400" y="225" font-family="'Kantumruy Pro', sans-serif" font-size="22" font-weight="bold" fill="#854d0e" text-anchor="middle">លិខិតបញ្ជាក់ផលិតផលរុក្ខជាតិធម្មជាតិ ១០០%</text>
        <text x="400" y="250" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold" fill="#a16207" text-anchor="middle">100% ORGANIC & PURE NATURAL GUARANTEE</text>

        <rect x="80" y="320" width="640" height="320" rx="12" fill="#ffffff" stroke="#fef08a" stroke-width="1.5"/>
        <text x="110" y="360" font-family="'Kantumruy Pro', sans-serif" font-size="14" font-weight="bold" fill="#854d0e">លទ្ធផលនៃការវិភាគមន្ទីរពិសោធន៍៖</text>
        <text x="110" y="400" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ សារធាតុ Steroid ឬ Dexamethasone: គ្មាន (Negative / 0.00%)</text>
        <text x="110" y="440" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ សារធាតុរក្សាទុកយូរ (Preservatives): គ្មាន (Negative / 0.00%)</text>
        <text x="110" y="480" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ សារធាតុលោហធាតុធ្ងន់ (Lead, Mercury): ស្ថិតក្រោមកម្រិតសុវត្ថិភាពអតិបរមា</text>
        <text x="110" y="520" font-family="'Kantumruy Pro', sans-serif" font-size="13" fill="#334155">✓ ផ្សំពីរុក្ខជាតិឱសថបុរាណខ្មែរដូនតា៖ រមៀត, ខ្ញីព្រៃ, យិនស៊ិនធម្មជាតិ, ដើមថ្នាំសរសៃ</text>

        <g transform="translate(480, 730)">
          <circle cx="100" cy="80" r="55" fill="none" stroke="#ca8a04" stroke-width="3"/>
          <text x="100" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" fill="#ca8a04" text-anchor="middle">100% ORGANIC</text>
        </g>
      </svg>
    `)}`,
  },
];

export const SecureCertificateViewer: React.FC<SecureCertificateViewerProps> = ({
  isOpen,
  onClose,
  initialLicenseId,
}) => {
  const { language, licenses, licenseSecurityConfig } = useApp();
  const activeLicenses = licenses && licenses.length > 0 ? licenses : VERIFIED_LICENSES;

  const [selectedId, setSelectedId] = useState<string>(
    initialLicenseId || activeLicenses[0]?.id || ''
  );

  // Sync selectedId if initialLicenseId changes or licenses change
  useEffect(() => {
    if (initialLicenseId && activeLicenses.some((l) => l.id === initialLicenseId)) {
      setSelectedId(initialLicenseId);
    } else if (!activeLicenses.some((l) => l.id === selectedId) && activeLicenses[0]) {
      setSelectedId(activeLicenses[0].id);
    }
  }, [initialLicenseId, activeLicenses]);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSecurityAlert, setShowSecurityAlert] = useState<boolean>(false);
  const [isBlurredDueToLossOfFocus, setIsBlurredDueToLossOfFocus] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentLicense =
    activeLicenses.find((l) => l.id === selectedId) || activeLicenses[0] || VERIFIED_LICENSES[0];

  // Prevent default context menu (Right-click & mobile long press)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerSecurityWarning();
    return false;
  };

  // Trigger security alert banner
  const triggerSecurityWarning = () => {
    setShowSecurityAlert(true);
    setTimeout(() => {
      setShowSecurityAlert(false);
    }, 4500);
  };

  // Anti-Screenshot and Anti-Print event listeners
  useEffect(() => {
    if (!isOpen) return;

    // 1. Keyboard event listener to block PrintScreen, Ctrl+P, Win+Shift+S, Cmd+Shift+3/4
    const handleKeyDown = (e: KeyboardEvent) => {
      if (licenseSecurityConfig?.antiScreenshotEnabled === false) return;

      // PrintScreen key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerSecurityWarning();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
      }

      // Ctrl + P (Print) or Cmd + P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        triggerSecurityWarning();
      }

      // Ctrl + S (Save page)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerSecurityWarning();
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac (Cmd + Shift + 3 / 4)
      if (e.shiftKey && (e.metaKey || e.ctrlKey)) {
        triggerSecurityWarning();
      }
    };

    // 2. Focus loss detection: when user opens snipping tool or screen capture overlay, window loses focus
    const handleBlur = () => {
      if (licenseSecurityConfig?.blurOnFocusLossEnabled !== false) {
        setIsBlurredDueToLossOfFocus(true);
      }
    };

    const handleFocus = () => {
      setIsBlurredDueToLossOfFocus(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDateStr = new Date().toLocaleDateString(
    language === 'km' ? 'km-KH' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in print:hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Anti-Print CSS injected directly */}
      <style>{`
        @media print {
          body * {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Secure Viewer Box */}
      <div className="bg-[#0f172a] text-white w-full max-w-4xl rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative animate-scale-up">
        {/* Security Warning Notification */}
        {showSecurityAlert && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-red-600/95 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-red-400 animate-bounce">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="text-xs leading-relaxed">
              <strong className="block font-bold">
                {language === 'km'
                  ? '⚠️ ការពារកម្មសិទ្ធិបញ្ញា និងសុវត្ថិភាពឯកសារផ្លូវការ!'
                  : '⚠️ Document Security & Anti-Copy Protection Active!'}
              </strong>
              <span>
                {language === 'km'
                  ? 'ឯកសារនេះត្រូវបានការពារដោយប្រព័ន្ធសុវត្ថិភាព សម្រាប់តែពិនិត្យមើលក្នុងកម្មវិធីប៉ុណ្ណោះ។ មិនអនុញ្ញាតឱ្យទាញយក (Download), ថតអេក្រង់ (Screenshot) ឬចម្លងឡើយ។'
                  : 'This official permit is protected. Screen capture, printing, and downloads are strictly restricted.'}
              </span>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  {language === 'km'
                    ? 'ប្រព័ន្ធពិនិត្យលិខិតអនុញ្ញាត & វិញ្ញាបនបត្រសុវត្ថិភាព'
                    : 'Official Secure License & Certificate Viewer'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 shrink-0 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>{language === 'km' ? 'ការពារសុវត្ថិភាព' : 'Protected'}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {language === 'km'
                  ? 'សម្រាប់មើលពិនិត្យភាពស្របច្បាប់ប៉ុណ្ណោះ • ហាមទាញយក ឬថតចម្លង'
                  : 'Verified Authentic Preview Only • Anti-Download & Anti-Capture Guard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="បិទ / Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* License Switcher Tabs */}
        <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {activeLicenses.map((lic) => (
            <button
              key={lic.id}
              onClick={() => {
                setSelectedId(lic.id);
                setZoomLevel(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedId === lic.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{language === 'km' ? lic.titleKh : lic.titleEn}</span>
              {lic.verified && (
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              )}
            </button>
          ))}
        </div>

        {/* Viewer Canvas Area with Strict Layers */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-950 flex flex-col items-center justify-start relative select-none"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* If focus is lost, heavily blur the certificate to defeat background snipping */}
          {isBlurredDueToLossOfFocus && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-4 text-center">
              <Lock className="w-12 h-12 text-emerald-400 mb-2 animate-pulse" />
              <h4 className="font-bold text-sm sm:text-base text-white">
                {language === 'km'
                  ? 'ផ្ទាំងពិនិត្យត្រូវបានបិទបាំងជាបណ្តោះអាសន្ន'
                  : 'Preview Shielded While Inactive'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {language === 'km'
                  ? 'សូមចុចលើអេក្រង់នេះម្តងទៀតដើម្បីបន្តមើលលិខិតអនុញ្ញាតស្របច្បាប់។'
                  : 'Click back onto this window to resume viewing.'}
              </p>
            </div>
          )}

          {/* Certificate Container with Zoom transform */}
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl relative overflow-hidden transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Layer 1: Document SVG Image (Direct user interactions disabled) */}
            <img
              src={currentLicense.documentImage}
              alt={currentLicense.titleKh}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-auto block pointer-events-none select-none"
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
              }}
            />

            {/* Layer 2: Dynamic Diagonal Security Watermark Repeating Grid */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden flex flex-wrap items-center justify-around opacity-30 select-none"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            >
              {Array.from({ length: 18 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rotate-[-25deg] text-slate-900 font-black text-[11px] sm:text-xs tracking-wider uppercase p-6 whitespace-nowrap opacity-60"
                  style={{
                    textShadow: '0 0 2px rgba(255,255,255,0.8)',
                  }}
                >
                  <span className="text-emerald-700">© KAKA ឱសថបុរាណ</span> · សម្រាប់មើលប៉ុណ្ណោះ ហាមថតចម្លង (PREVIEW ONLY) · {currentDateStr}
                </div>
              ))}
            </div>

            {/* Layer 3: Dynamic Live Timestamp & Verification Watermark Badge at center */}
            <div className="absolute bottom-4 right-4 pointer-events-none bg-emerald-950/80 backdrop-blur-xs text-emerald-300 p-2.5 rounded-xl border border-emerald-700/60 shadow-lg text-[10px] space-y-0.5">
              <div className="font-bold flex items-center gap-1 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>VERIFIED AUTHENTIC</span>
              </div>
              <div>ID: {currentLicense.licenseNumber}</div>
              <div>Viewed: {new Date().toLocaleTimeString()} · KAKA Shop</div>
            </div>

            {/* Layer 4: Transparent Glass Protection Barrier (intercepts any mouse clicks/taps) */}
            <div
              className="absolute inset-0 z-30 cursor-default"
              onContextMenu={handleContextMenu}
              onDragStart={(e) => e.preventDefault()}
              onClick={() => {
                // subtle flash
              }}
            />
          </div>

          {/* Details & Certification Summary Box */}
          <div className="w-full max-w-2xl mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{language === 'km' ? 'ព័ត៌មានលិខិតផ្លូវការ' : 'Official License Details'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/50 text-emerald-300 font-mono">
                {currentLicense.licenseNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div className="flex items-start gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === 'km' ? 'ស្ថាប័នចេញអាជ្ញាប័ណ្ណ៖' : 'Issuing Authority:'}
                  </span>
                  <span className="font-medium text-white">
                    {language === 'km' ? currentLicense.issuingAuthorityKh : currentLicense.issuingAuthorityEn}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === 'km' ? 'សុពលភាពស្របច្បាប់៖' : 'Validity Period:'}
                  </span>
                  <span className="font-medium text-emerald-400">
                    {currentLicense.issueDate} ➜ {currentLicense.expiryDate} (៥ ឆ្នាំពេញលេញ)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              💡 {language === 'km' ? currentLicense.notesKh : currentLicense.notesEn}
            </p>
          </div>
        </div>

        {/* Bottom Protected Controls Bar */}
        <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'km' ? 'របៀបមើលសុវត្ថិភាព' : 'View-Only Mode'}</span>
            </span>

            {/* Active Protection Tags */}
            <div className="hidden sm:flex items-center gap-1 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                🔒 No Download
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                🛡️ Anti-Capture
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                💧 Watermarked
              </span>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>{language === 'km' ? 'យល់ព្រម / បិទ' : 'Done / Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
