export const DEFAULT_LOW_STOCK_THRESHOLD = 2;
export const DEFAULT_EXPIRING_WINDOW_DAYS = 15;
export const MAX_ITEM_PHOTO_BYTES = 2 * 1024 * 1024;

export const USER_STORAGE_KEY = 'casasyncUser';
export const ITEMS_STORAGE_KEY = 'casasyncItems';
export const CATEGORIES_STORAGE_KEY = 'casasyncCategories';
<<<<<<< HEAD
export const SALES_STORAGE_KEY = 'emyStoreSales';
export const STORE_SETTINGS_KEY = 'emyStoreSettings';

export const DEFAULT_CATEGORIES = [
  { name: 'Groceries', icon: '🧺', variantClass: 'grocery' },
  { name: 'Snacks & Drinks', icon: '🥫', variantClass: 'school' },
  { name: 'Personal Care', icon: '🧴', variantClass: 'skin' },
  { name: 'Household', icon: '🧹', variantClass: 'toiletry' },
=======

export const DEFAULT_CATEGORIES = [
  { name: 'Groceries', icon: '🧺', variantClass: 'grocery' },
  { name: 'School Supplies', icon: '✏️', variantClass: 'school' },
  { name: 'Skincare', icon: '🧴', variantClass: 'skin' },
  { name: 'Toiletries', icon: '🧼', variantClass: 'toiletry' },
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
];

export const CATEGORY_ICONS = [
  { value: '📦', label: '📦 Package' },
  { value: '🧺', label: '🧺 Basket' },
  { value: '🛒', label: '🛒 Cart' },
  { value: '🍎', label: '🍎 Food' },
  { value: '🥫', label: '🥫 Canned goods' },
  { value: '🧴', label: '🧴 Bottle' },
  { value: '🧼', label: '🧼 Soap' },
  { value: '🧹', label: '🧹 Cleaning' },
  { value: '🪴', label: '🪴 Plant' },
  { value: '🐾', label: '🐾 Pet' },
  { value: '👕', label: '👕 Clothing' },
  { value: '✏️', label: '✏️ Supplies' },
  { value: '🧰', label: '🧰 Tools' },
  { value: '💊', label: '💊 Medicine' },
  { value: '🎁', label: '🎁 Other' },
];

export function getDaysUntilExpiration(dateValue) {
<<<<<<< HEAD
  if (!dateValue) return 36500;
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
  const [year, month, day] = dateValue.split('-').map(Number);
  const expiration = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((expiration - today) / 86400000);
}

export function getItemAlertStatus(item) {
  const lowStockThreshold = Number.isInteger(item.lowStockThreshold)
    ? item.lowStockThreshold
    : DEFAULT_LOW_STOCK_THRESHOLD;
  const expiringDays = Number.isInteger(item.expiringDays)
    ? item.expiringDays
    : DEFAULT_EXPIRING_WINDOW_DAYS;
  const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);

  return {
    isLowStock: item.quantity <= lowStockThreshold,
    isExpiring: daysUntilExpiration <= expiringDays,
    daysUntilExpiration,
  };
}

export function hasItemAlert(item) {
  const { isLowStock, isExpiring } = getItemAlertStatus(item);
  return isLowStock || isExpiring;
}

export function formatExpiration(dateValue) {
<<<<<<< HEAD
  if (!dateValue) return 'No expiry';
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
  return new Date(`${dateValue}T12:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}