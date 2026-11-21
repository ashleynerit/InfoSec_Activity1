import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  DEFAULT_CATEGORIES,
  getItemAlertStatus,
  hasItemAlert,
} from './constants/inventory';
import AuthScreen from './components/AuthScreen';
import InventoryAlerts from './components/InventoryAlerts';
import Topbar from './components/Topbar';
import CategoryModal from './components/CategoryModal';
import ItemModal from './components/ItemModal';
import ItemView from './components/ItemView';
import { DashboardView, ReportsView, SalesView } from './components/StoreViews';
import { authApi, storeApi } from './services/api';

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

export default function App() {
  const [screen, setScreen] = useState('login'); // 'signup' | 'login' | 'main'
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [customCategories, setCustomCategories] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [sales, setSales] = useState([]);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const { user: authenticatedUser } = await authApi.me();
        if (!active) return;
        setUser(authenticatedUser);

        const store = await storeApi.get();
        if (!active) return;
        setCustomCategories(store.customCategories || []);
        setItemsByCategory(store.itemsByCategory || {});
        setSales(store.sales || []);
        setScreen('main');
      } catch {
        if (active) setScreen('login');
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const saveStore = (nextCustomCategories, nextItemsByCategory, nextSales) => {
    return storeApi.save({
      customCategories: nextCustomCategories,
      itemsByCategory: nextItemsByCategory,
      sales: nextSales,
    });
  };

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

  const flatItems = useMemo(
    () =>
      allCategories.flatMap((category) =>
        (itemsByCategory[category.name] || []).map((item) => ({
          ...item,
          categoryName: category.name,
        }))
      ),
    [allCategories, itemsByCategory]
  );

  const handleSignupSuccess = async (newUser) => {
    try {
      const { user: authenticatedUser } = await authApi.signup(
        newUser.name,
        newUser.email,
        newUser.password
      );
      setUser(authenticatedUser);
      setScreen('main');
      return '';
    } catch (error) {
      return error.message;
    }
  };

  const handleLoginSuccess = async (email, password) => {
    try {
      const { user: authenticatedUser } = await authApi.login(email, password);
      setUser(authenticatedUser);
      const store = await storeApi.get();
      setCustomCategories(store.customCategories || []);
      setItemsByCategory(store.itemsByCategory || {});
      setSales(store.sales || []);
      setScreen('main');
      return '';
    } catch (error) {
      return error.message;
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Log out of Emy's Store?")) {
      try {
        await authApi.logout();
      } finally {
        setUser(null);
        setCustomCategories([]);
        setItemsByCategory({});
        setSales([]);
        setScreen('login');
      }
    }
  };

  const handleGoToInventory = () => {
    setActivePage('inventory');
    setSelectedCategory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToDashboard = () => {
    setActivePage('dashboard');
    setSelectedCategory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToSales = () => {
    setActivePage('sales');
    setSelectedCategory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToReports = () => {
    setActivePage('reports');
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
    setCustomCategories(next);
    saveStore(next, itemsByCategory, sales).catch((error) => {
      alert(error.message);
    });
    return true;
  };

  const persistItems = (nextItems) => {
    setItemsByCategory(nextItems);
    saveStore(customCategories, nextItems, sales).catch((error) => {
      alert(error.message);
      return false;
    });
    return true;
  };

  const handleCheckout = (cartRows, cash, total) => {
    const nextItems = { ...itemsByCategory };
    const saleItems = [];

    for (const row of cartRows) {
      const categoryName = row.item.categoryName;
      const currentList = nextItems[categoryName] || [];
      const itemIndex = currentList.findIndex((item) => item.id === row.item.id);
      if (itemIndex === -1) return false;

      const updatedList = [...currentList];
      updatedList[itemIndex] = {
        ...updatedList[itemIndex],
        quantity: updatedList[itemIndex].quantity - row.quantity,
      };
      nextItems[categoryName] = updatedList;
      saleItems.push({
        ...row.item,
        quantity: row.quantity,
      });
    }

    const sale = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      items: saleItems,
      total,
      cash,
      change: cash - total,
    };
    const nextSales = [...sales, sale];

    if (!persistItems(nextItems)) return false;
    setSales(nextSales);
    saveStore(customCategories, nextItems, nextSales).catch((error) => {
      alert(error.message);
      return false;
    });
    return true;
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

  const handleChangeQuantity = (itemId, categoryName, amount) => {
    const currentList = itemsByCategory[categoryName] || [];
    const nextList = currentList.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity + amount) }
        : item
    );

    persistItems({
      ...itemsByCategory,
      [categoryName]: nextList,
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
    activePage === 'dashboard'
      ? 'DASHBOARD'
      : activePage === 'sales'
      ? 'POINT OF SALE'
      : activePage === 'reports'
      ? 'REPORTS'
      : activePage === 'inventory'
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
        onGoToDashboard={handleGoToDashboard}
        onGoToInventory={handleGoToInventory}
        onGoToCategories={handleGoToCategories}
        onGoToSales={handleGoToSales}
        onGoToReports={handleGoToReports}
        onLogout={handleLogout}
      />

      {activePage === 'dashboard' ? (
        <main className="main-content page-transition">
          <DashboardView items={flatItems} sales={sales} />
        </main>
      ) : activePage === 'sales' ? (
        <main className="main-content page-transition">
          <SalesView items={flatItems} sales={sales} onCheckout={handleCheckout} />
        </main>
      ) : activePage === 'reports' ? (
        <main className="main-content page-transition">
          <ReportsView items={flatItems} sales={sales} />
        </main>
      ) : activePage === 'inventory' ? (
        <main key="inventory" className="main-content page-transition" id="inventoryHome">
          <div className="greeting">
            <h2>{firstName ? `Hello, ${firstName}!` : 'Hello!'}</h2>
            <p>
              Track stock levels, low-stock alerts, product prices, and supplier information.
            </p>
          </div>
          <InventoryAlerts
            items={inventoryAlertItems}
            onOpenCategory={handleOpenCategory}
            onChangeQuantity={handleChangeQuantity}
          />
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
              onChangeQuantity={handleChangeQuantity}
            />
          )}
        </main>
      )}

      <CategoryModal
        key={categoryModalOpen ? 'category-open' : 'category-closed'}
        isOpen={categoryModalOpen}
        existingNames={allCategories.map((c) => c.name.toLowerCase())}
        onClose={() => setCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <ItemModal
        key={`${itemModalOpen ? 'open' : 'closed'}-${editingItem?.id || 'new'}`}
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