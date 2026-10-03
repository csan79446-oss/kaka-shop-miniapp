import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RbacNoticeBannerProps {
  moduleNameKh?: string;
  moduleNameEn?: string;
}

export const RbacNoticeBanner: React.FC<RbacNoticeBannerProps> = ({
  moduleNameKh = 'ទិន្នន័យ',
  moduleNameEn = 'data',
}) => {
  const { currentAdmin, language } = useApp();

  if (!currentAdmin || currentAdmin.role !== 'SUPPORT_STAFF') {
    return null;
  }

  return (
    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start sm:items-center gap-3 text-amber-800 dark:text-amber-200 shadow-2xs animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
        <Lock className="w-4 h-4" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-bold flex items-center gap-1.5">
          <span>{language === 'km' ? 'របៀបមើលតែប៉ុណ្ណោះ (View-Only Mode)' : 'View-Only Access Mode'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-200/70 dark:bg-amber-900 text-[10px] font-mono">
            SUPPORT_STAFF
          </span>
        </p>
        <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
          {language === 'km'
            ? `គណនីរបស់អ្នកមានសិទ្ធិត្រឹមតែមើល ${moduleNameKh}។ ការបន្ថែម លុប ឬកែប្រែ ត្រូវបានអនុញ្ញាតចាប់ពី Store Manager ឡើងទៅប៉ុណ្ណោះ។`
            : `Your account has view-only permissions for ${moduleNameEn}. Creating, editing, or deleting is strictly restricted to Store Manager and above.`}
        </p>
      </div>
    </div>
  );
};
