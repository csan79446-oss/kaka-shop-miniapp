import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Package,
  Check,
  X,
  AlertTriangle,
  FolderPlus,
  Layers,
  Sparkles,
  Smartphone,
  Shirt,
  ShoppingBag,
  Coffee,
  Laptop,
  Watch,
  Heart,
  Zap,
  Flame,
  Book,
  Glasses,
  Camera,
  Headphones,
  Gift,
  Box,
  Utensils,
  Music,
  Smile,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { RbacNoticeBanner } from './RbacNoticeBanner';

// Map of available icons for category customization
const ICON_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  Tag,
  Sparkles,
  Smartphone,
  Shirt,
  ShoppingBag,
  Coffee,
  Laptop,
  Watch,
  Heart,
  Zap,
  Flame,
  Book,
  Glasses,
  Camera,
  Headphones,
  Gift,
  Box,
  Utensils,
  Music,
  Smile,
};

const AVAILABLE_ICONS = Object.keys(ICON_COMPONENTS);

export const AdminCategoryManagement: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    language,
    currentAdmin,
    canManageContent,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<string>('');

  // Form states
  const [nameKh, setNameKh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slugId, setSlugId] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Tag');
  const [errorMsg, setErrorMsg] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setNameKh('');
    setNameEn('');
    setSlugId('');
    setSelectedIcon('Tag');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setNameKh(cat.nameKh);
    setNameEn(cat.nameEn);
    setSlugId(cat.id);
    setSelectedIcon(cat.icon || 'Tag');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlugId(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nameKh.trim() || !nameEn.trim()) {
      setErrorMsg(
        language === 'km'
          ? 'សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរ និងភាសាអង់គ្លេស'
          : 'Please enter both Khmer and English names'
      );
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        nameKh: nameKh.trim(),
        nameEn: nameEn.trim(),
        icon: selectedIcon,
      });
    } else {
      let finalSlug = slugId.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!finalSlug || finalSlug === 'all') {
        finalSlug = `cat-${Date.now().toString(36)}`;
      }

      if (categories.some((c) => c.id === finalSlug)) {
        setErrorMsg(
          language === 'km'
            ? 'កូដសម្គាល់ (ID) នេះមានរួចហើយ សូមជ្រើសរើសកូដផ្សេង'
            : 'Category ID already exists, please choose a different one'
        );
        return;
      }

      addCategory({
        id: finalSlug,
        nameKh: nameKh.trim(),
        nameEn: nameEn.trim(),
        icon: selectedIcon,
      });
    }

    setIsModalOpen(false);
  };

  const initiateDelete = (cat: Category) => {
    setDeletingCategory(cat);
    // Find default alternative category for reassigning
    const fallback = categories.find((c) => c.id !== cat.id && c.id !== 'all');
    setReassignTargetId(fallback?.id || 'all');
  };

  const confirmDelete = () => {
    if (!deletingCategory) return;
    const res = deleteCategory(deletingCategory.id, reassignTargetId);
    if (!res.success) {
      alert(language === 'km' ? res.messageKh : res.messageEn);
    }
    setDeletingCategory(null);
  };

  const renderIcon = (iconName?: string, className: string = 'w-4 h-4') => {
    const Component = (iconName && ICON_COMPONENTS[iconName]) || Tag;
    return <Component className={className} />;
  };

  const getProductCount = (categoryId: string) => {
    if (categoryId === 'all') return products.length;
    return products.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <RbacNoticeBanner moduleNameKh="ប្រភេទផលិតផល" moduleNameEn="product categories" />

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#17212b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-[#2481cc] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'km' ? 'គ្រប់គ្រងប្រភេទផលិតផល' : 'Category Management'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {categories.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'km'
                ? 'បន្ថែម កែប្រែ ឬលុបប្រភេទមុខទំនិញក្នុងហាងទំនិញ'
                : 'Create, update, and manage product categories for the storefront'}
            </p>
          </div>
        </div>

        {canManageContent ? (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md active:scale-98 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'km' ? 'បន្ថែមប្រភេទថ្មី' : 'Add New Category'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'km' ? 'សិទ្ធិមើលប៉ុណ្ណោះ' : 'View Only'}</span>
          </div>
        )}
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isSystem = cat.id === 'all';
          const count = getProductCount(cat.id);

          return (
            <div
              key={cat.id}
              className={`bg-white dark:bg-[#17212b] p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSystem
                  ? 'border-sky-200 dark:border-sky-900/50 bg-gradient-to-br from-white to-sky-50/40 dark:from-[#17212b] dark:to-sky-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#2481cc] flex items-center justify-center shrink-0 shadow-2xs">
                    {renderIcon(cat.icon, 'w-5 h-5')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isSystem ? (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                        <Lock className="w-3 h-3" />
                        <span>System</span>
                      </span>
                    ) : canManageContent ? (
                      <>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#2481cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="កែប្រែ / Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => initiateDelete(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="លុប / Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>View</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{cat.nameKh}</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {cat.nameEn}
                </p>

                <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <span>ID:</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    {cat.id}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {language === 'km'
                      ? `${count} មុខទំនិញ`
                      : `${count} items`}
                  </span>
                </span>

                <span className="text-[11px] font-semibold text-[#2481cc]">
                  {cat.icon || 'Tag'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#17212b] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-scale-up">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#2481cc]" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {editingCategory
                    ? language === 'km'
                      ? 'កែប្រែប្រភេទផលិតផល'
                      : 'Edit Category'
                    : language === 'km'
                    ? 'បន្ថែមប្រភេទផលិតផលថ្មី'
                    : 'Add New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name Khmer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះជាភាសាខ្មែរ *' : 'Name in Khmer *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameKh}
                  onChange={(e) => setNameKh(e.target.value)}
                  placeholder="ឧ. គ្រឿងសម្អាង & ថែរក្សាស្បែក"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              {/* Name English */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះជាភាសាអង់គ្លេស *' : 'Name in English *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  placeholder="e.g. Cosmetics & Skincare"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc]"
                />
              </div>

              {/* Slug ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'km' ? 'កូដសម្គាល់ (Slug / ID) *' : 'Slug / Category ID *'}
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingCategory)}
                  value={slugId}
                  onChange={(e) => setSlugId(e.target.value)}
                  placeholder="e.g. cosmetics"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#2481cc] font-mono disabled:opacity-60"
                />
                {editingCategory && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    {language === 'km'
                      ? 'កូដសម្គាល់មិនអាចកែប្រែបានទេ ដើម្បីរក្សាទំនាក់ទំនងទំនិញដែលមានស្រាប់'
                      : 'Category ID is immutable to preserve product associations'}
                  </p>
                )}
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'km' ? 'ជ្រើសរើសរូបតំណាង (Icon)' : 'Select Icon'}
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  {AVAILABLE_ICONS.map((iconKey) => {
                    const isPicked = selectedIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setSelectedIcon(iconKey)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                          isPicked
                            ? 'bg-[#2481cc] text-white shadow-xs scale-105'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                        title={iconKey}
                      >
                        {renderIcon(iconKey, 'w-4 h-4')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Pill */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                  {language === 'km' ? 'ការបង្ហាញជាក់ស្តែងក្នុងហាង' : 'Storefront Preview'}
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2481cc] text-white text-xs font-semibold shadow-xs">
                  {renderIcon(selectedIcon, 'w-3.5 h-3.5')}
                  <span>{nameKh || (language === 'km' ? 'ឈ្មោះប្រភេទ' : 'Category Name')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2481cc] hover:bg-[#1d6fae] text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  {editingCategory
                    ? language === 'km'
                      ? 'រក្សាទុកការកែប្រែ'
                      : 'Save Changes'
                    : language === 'km'
                    ? 'បង្កើតប្រភេទថ្មី'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#17212b] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xl animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-center text-sm sm:text-base text-slate-900 dark:text-white">
              {language === 'km'
                ? `តើអ្នកពិតជាចង់លុប "${deletingCategory.nameKh}"?`
                : `Delete category "${deletingCategory.nameEn}"?`}
            </h3>

            {getProductCount(deletingCategory.id) > 0 ? (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-2">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  {language === 'km'
                    ? `⚠️ មាន ${getProductCount(deletingCategory.id)} មុខទំនិញកំពុងស្ថិតក្នុងប្រភេទនេះ!`
                    : `⚠️ There are ${getProductCount(deletingCategory.id)} products under this category!`}
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'km'
                      ? 'ជ្រើសរើសប្រភេទដើម្បីផ្ទេរទំនិញទាំងនេះទៅ៖'
                      : 'Reassign these products to:'}
                  </label>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    {categories
                      .filter((c) => c.id !== deletingCategory.id && c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {language === 'km' ? c.nameKh : c.nameEn}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center mt-2">
                {language === 'km'
                  ? 'ប្រភេទនេះមិនមានទំនិញណាមួយភ្ជាប់ជាមួយឡើយ អ្នកអាចលុបបានដោយសុវត្ថិភាព។'
                  : 'No products are currently assigned to this category. Safe to delete.'}
              </p>
            )}

            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
              >
                {language === 'km' ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95"
              >
                {language === 'km' ? 'បញ្ជាក់ការលុប' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
