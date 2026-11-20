import { useMemo, useState } from 'react';
import './App.css';
import {
  CATEGORIES_STORAGE_KEY,
  DEFAULT_CATEGORIES,
  getItemAlertStatus,
  hasItemAlert,
  ITEMS_STORAGE_KEY,
  USER_STORAGE_KEY,
} from './constants/inventory';
import AuthScreen from './components/AuthScreen';
import InventoryAlerts from './components/InventoryAlerts';
import Topbar from './components/Topbar';
import CategoryModal from './components/CategoryModal';
import ItemModal from './components/ItemModal';
import ItemView from './components/ItemView';

function CategoryStatusStickers({ hasExpiringItems, hasLowStockItems }) {
  if (!hasExpiringItems && !hasLowStockItems) return null;

  return (
    <span className="category-statuses">
      {hasExpiringItems && (
        <img
          className="category-status-sticker"
          src="/assets/icons/expiring.png"
          alt="Expiring items"
        />
      )}
      {hasLowStockItems && (
        <img
          className="category-status-sticker"
          src="/assets/icons/low_stocks.png"
          alt="Low-stock items"
        />
      )}
    </span>
  );
}

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function loadCustomCategories() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY) || '[]');
    if (Array.isArray(parsed)) return parsed;
    throw new Error('Invalid categories format');
  } catch {
    alert('Saved categories could not be loaded. Check your browser storage.');
    return [];
  }
}

function loadItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ITEMS_STORAGE_KEY) || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    alert('Saved items have an invalid format and could not be loaded.');
    return {};
  } catch {
    alert('Saved items could not be read. Please check your browser storage.');
    return {};
  }
}

export default function App() {
  const [screen, setScreen] = useState('signup'); // 'signup' | 'login' | 'main'
  const [user, setUser] = useState(loadUser);
  const [activePage, setActivePage] = useState('inventory'); // 'inventory' | 'categories'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [customCategories, setCustomCategories] = useState(loadCustomCategories);
  const [itemsByCategory, setItemsByCategory] = useState(loadItems);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const allCategories = useMemo(
    () => [
      ...DEFAULT_CATEGORIES,
      ...customCategories.map((cat) => ({ ...cat, isCustom: true })),
    ],
    [customCategories]
  );

  const categoriesWithAlerts = useMemo(
    () =>
      allCategories.map((category) => {
        const alerts = (itemsByCategory[category.name] || []).reduce(
          (status, item) => {
            const itemStatus = getItemAlertStatus(item);
            return {
              hasExpiringItems: status.hasExpiringItems || itemStatus.isExpiring,
              hasLowStockItems: status.hasLowStockItems || itemStatus.isLowStock,
            };
          },
          { hasExpiringItems: false, hasLowStockItems: false }
        );
        return { ...category, ...alerts };
      }),
    [allCategories, itemsByCategory]
  );

  const filteredAllCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categoriesWithAlerts;
    return categoriesWithAlerts.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [categoriesWithAlerts, searchQuery]);

  const priorityCategories = useMemo(
    () => categoriesWithAlerts.filter((category) =>
      category.hasExpiringItems || category.hasLowStockItems
    ),
    [categoriesWithAlerts]
  );

  const inventoryAlertItems = useMemo(
    () =>
      allCategories
        .flatMap((category) =>
          (itemsByCategory[category.name] || [])
            .filter(hasItemAlert)
            .map((item) => ({ ...item, categoryName: category.name }))
        )
        .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate)),
    [allCategories, itemsByCategory]
  );

  const handleSignupSuccess = (newUser) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setScreen('login');
    alert('Account created successfully! You can now log in.');
  };

  const handleLoginSuccess = (email, password) => {
    const storedUser = loadUser();
    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
      return 'Incorrect email or password.';
    }
    setUser(storedUser);
    setScreen('main');
    return '';
  };

  const handleLogout = () => {
    if (window.confirm('Log out of CasaSync?')) {
      setScreen('login');
    }
  };

  const handleGoToInventory = () => {
    setActivePage('inventory');
    setSelectedCategory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCategories = () => {
    setActivePage('categories');
    setSelectedCategory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategory = (categoryName) => {
    setActivePage('categories');
    setSelectedCategory(categoryName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = (category) => {
    const next = [...customCategories, category];
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(next));
      setCustomCategories(next);
      return true;
    } catch {
      alert('Your category could not be saved. Check your browser storage and try again.');
      return false;
    }
  };

  const persistItems = (nextItems) => {
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(nextItems));
      setItemsByCategory(nextItems);
      return true;
    } catch {
      alert('Your item changes could not be saved. Check your browser storage and try again.');
      return false;
    }
  };

  const handleSaveItem = (itemData) => {
    const currentList = itemsByCategory[selectedCategory] || [];
    let updatedList;

    if (editingItem) {
      const idx = currentList.findIndex((entry) => entry.id === editingItem.id);
      if (idx === -1) {
        alert('That item could not be found.');
        return true;
      }
      updatedList = [...currentList];
      updatedList[idx] = itemData;
    } else {
      updatedList = [...currentList, itemData];
    }

    return persistItems({
      ...itemsByCategory,
      [selectedCategory]: updatedList,
    });
  };

  const handleRemoveItem = (itemId) => {
    const currentList = itemsByCategory[selectedCategory] || [];
    persistItems({
      ...itemsByCategory,
      [selectedCategory]: currentList.filter((item) => item.id !== itemId),
    });
  };

  if (screen === 'signup' || screen === 'login') {
    return (
      <AuthScreen
        mode={screen}
        onSwitchMode={setScreen}
        onSignupSuccess={handleSignupSuccess}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const pageTitle =
    activePage === 'inventory'
      ? 'INVENTORY'
      : selectedCategory
      ? selectedCategory.toUpperCase()
      : 'CATEGORIES';

  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <section className="screen active" id="main">
      <Topbar
        pageTitle={pageTitle}
        activePage={activePage}
        showSearch={!selectedCategory}
        showBackButton={Boolean(selectedCategory)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={handleGoToCategories}
        onGoToInventory={handleGoToInventory}
        onGoToCategories={handleGoToCategories}
        onLogout={handleLogout}
      />

      {activePage === 'inventory' ? (
        <main key="inventory" className="main-content page-transition" id="inventoryHome">
          <div className="greeting">
            <h2>{firstName ? `Hello, ${firstName}!` : 'Hello!'}</h2>
            <p>
              This is your household inventory where you can monitor all your necessities in one
              place.
            </p>
          </div>
          <InventoryAlerts items={inventoryAlertItems} onOpenCategory={handleOpenCategory} />
        </main>
      ) : (
        <main
          key={selectedCategory || 'category-overview'}
          className="main-content category-page page-transition"
          id="categoriesPage"
        >
          {!selectedCategory ? (
            <section id="categoryOverview">
              <h2 className="section-title">Top priorities</h2>
              <div className="category-grid priority-grid">
                {priorityCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`category ${cat.isCustom ? 'custom-category' : cat.variantClass}`}
                    style={
                      cat.isCustom ? { '--custom-category-color': cat.color } : undefined
                    }
                    onClick={() => handleOpenCategory(cat.name)}
                  >
                    <CategoryStatusStickers
                      hasExpiringItems={cat.hasExpiringItems}
                      hasLowStockItems={cat.hasLowStockItems}
                    />
                    <span>{cat.name.toUpperCase()}</span>
                    <span className="cat-icon">{cat.icon}</span>
                  </button>
                ))}
              </div>
              {priorityCategories.length === 0 && (
                <p className="empty-priorities">
                  No items currently have expiring or low-stock alerts.
                </p>
              )}

              <h2 className="section-title">All categories</h2>
              <div className="category-grid all-grid">
                {filteredAllCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`category ${cat.isCustom ? 'custom-category' : cat.variantClass}`}
                    style={
                      cat.isCustom ? { '--custom-category-color': cat.color } : undefined
                    }
                    onClick={() => handleOpenCategory(cat.name)}
                  >
                    <CategoryStatusStickers
                      hasExpiringItems={cat.hasExpiringItems}
                      hasLowStockItems={cat.hasLowStockItems}
                    />
                    <span>{cat.name.toUpperCase()}</span>
                    <span className="cat-icon">{cat.icon}</span>
                  </button>
                ))}
              </div>

              <button
                className="add-category"
                type="button"
                onClick={() => setCategoryModalOpen(true)}
              >
                ADD CATEGORY
              </button>
            </section>
          ) : (
            <ItemView
              categoryName={selectedCategory}
              items={itemsByCategory[selectedCategory] || []}
              onOpenAddItem={() => {
                setEditingItem(null);
                setItemModalOpen(true);
              }}
              onEditItem={(item) => {
                setEditingItem(item);
                setItemModalOpen(true);
              }}
              onRemoveItem={handleRemoveItem}
            />
          )}
        </main>
      )}

      <CategoryModal
        isOpen={categoryModalOpen}
        existingNames={allCategories.map((c) => c.name.toLowerCase())}
        onClose={() => setCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <ItemModal
        isOpen={itemModalOpen}
        editingItem={editingItem}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        onSaveItem={handleSaveItem}
      />
    </section>
  );
}