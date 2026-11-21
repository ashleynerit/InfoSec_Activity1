import { useState } from 'react';

const peso = (value) => `₱${Number(value || 0).toFixed(2)}`;

export function DashboardView({ items, sales }) {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const todaySales = sales.filter((sale) => sale.createdAt?.slice(0, 10) === today);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const inventoryValue = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.costPrice || 0),
    0
  );
  const lowStock = items.filter((item) => item.quantity <= (item.lowStockThreshold ?? 2));

  return (
    <section className="store-dashboard">
      <div className="dashboard-cards">
        <article><span>Today's Sales</span><strong>{peso(todayRevenue)}</strong></article>
        <article><span>Transactions</span><strong>{todaySales.length}</strong></article>
        <article><span>Inventory Value</span><strong>{peso(inventoryValue)}</strong></article>
        <article><span>Low Stock Items</span><strong>{lowStock.length}</strong></article>
      </div>

      <div className="dashboard-columns">
        <section>
          <h2 className="section-title">Low stock</h2>
          {lowStock.length ? lowStock.map((item) => (
            <div className="store-list-row" key={item.id}>
              <span>{item.name}</span><strong>{item.quantity} left</strong>
            </div>
          )) : <p className="empty-alert-items">No low-stock items.</p>}
        </section>
        <section>
          <h2 className="section-title">Recent sales</h2>
          {[...sales].reverse().slice(0, 8).map((sale) => (
            <div className="store-list-row" key={sale.id}>
              <span>Sale #{sale.id.slice(-6).toUpper()} · {sale.items.length} item(s)</span>
              <strong>{peso(sale.total)}</strong>
            </div>
          ))}
          {sales.length === 0 && <p className="empty-alert-items">No sales recorded yet.</p>}
        </section>
      </div>
    </section>
  );
}

export function SalesView({ items, onCheckout, sales }) {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState({});
  const [cash, setCash] = useState('');

  const availableItems = items.filter((item) =>
    item.quantity > 0 && item.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const cartRows = Object.entries(cart).map(([id, quantity]) => {
    const item = items.find((entry) => entry.id === id);
    return item ? { item, quantity } : null;
  }).filter(Boolean);
  const total = cartRows.reduce(
    (sum, row) => sum + row.quantity * Number(row.item.sellingPrice || 0),
    0
  );

  const setCartQuantity = (item, quantity) => {
    const next = Math.max(0, Math.min(item.quantity, Number(quantity) || 0));
    setCart((current) => {
      const copy = { ...current };
      if (next === 0) delete copy[item.id];
      else copy[item.id] = next;
      return copy;
    });
  };

  const checkout = () => {
    if (!cartRows.length) return alert('Add at least one item to the sale.');
    const parsedCash = Number(cash);
    if (!Number.isFinite(parsedCash) || parsedCash < total) {
      return alert('Cash received must cover the sale total.');
    }
    if (onCheckout(cartRows, parsedCash, total)) {
      setCart({});
      setCash('');
    }
  };

  return (
    <section className="pos-layout">
      <div className="pos-products">
        <label className="pos-search">
          <span>Search products</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Item name" />
        </label>
        <div className="pos-grid">
          {availableItems.map((item) => (
            <button
              type="button"
              className="pos-product"
              key={item.id}
              onClick={() => setCartQuantity(item, (cart[item.id] || 0) + 1)}
            >
              <strong>{item.name}</strong>
              <span>{peso(item.sellingPrice)}</span>
              <small>{item.quantity} in stock</small>
            </button>
          ))}
        </div>
      </div>

      <aside className="pos-cart">
        <h2>Current sale</h2>
        {cartRows.length === 0 ? (
          <p className="empty-alert-items">Select products to begin.</p>
        ) : cartRows.map(({ item, quantity }) => (
          <div className="cart-row" key={item.id}>
            <span>{item.name}</span>
            <input
              type="number"
              min="1"
              max={item.quantity}
              value={quantity}
              onChange={(e) => setCartQuantity(item, e.target.value)}
              aria-label={`Quantity for ${item.name}`}
            />
            <strong>{peso(quantity * Number(item.sellingPrice || 0))}</strong>
          </div>
        ))}
        <div className="cart-total"><span>Total</span><strong>{peso(total)}</strong></div>
        <label className="cash-field">
          Cash received
          <input type="number" min="0" step="0.01" value={cash} onChange={(e) => setCash(e.target.value)} />
        </label>
        <div className="change-row">Change: <strong>{peso(Math.max(0, Number(cash || 0) - total))}</strong></div>
        <button type="button" className="checkout-button" onClick={checkout}>Complete sale</button>
        <small className="sales-count">{sales.length} total transaction(s)</small>
      </aside>
    </section>
  );
}

export function ReportsView({ items, sales }) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCost = sales.reduce(
    (sum, sale) => sum + sale.items.reduce(
      (saleSum, row) => saleSum + Number(row.costPrice || 0) * row.quantity,
      0
    ),
    0
  );
  const profit = totalRevenue - totalCost;

  const exportCsv = () => {
    const headers = ['Receipt', 'Date', 'Items', 'Total', 'Cash', 'Change'];
    const rows = sales.map((sale) => [
      sale.id,
      sale.createdAt,
      sale.items.reduce((sum, row) => sum + row.quantity, 0),
      sale.total.toFixed(2),
      sale.cash.toFixed(2),
      sale.change.toFixed(2),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emy-store-sales.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="reports-view">
      <div className="dashboard-cards">
        <article><span>Total Revenue</span><strong>{peso(totalRevenue)}</strong></article>
        <article><span>Estimated Profit</span><strong>{peso(profit)}</strong></article>
        <article><span>Transactions</span><strong>{sales.length}</strong></article>
        <article><span>Products</span><strong>{items.length}</strong></article>
      </div>
      <div className="report-actions">
        <button type="button" onClick={exportCsv}>Export sales CSV</button>
      </div>
      <h2 className="section-title">Sales history</h2>
      <div className="sales-table-wrap">
        <table className="sales-table">
          <thead><tr><th>Receipt</th><th>Date</th><th>Items</th><th>Total</th><th>Cash</th><th>Change</th></tr></thead>
          <tbody>
            {[...sales].reverse().map((sale) => (
              <tr key={sale.id}>
                <td>#{sale.id.slice(-6).toUpperCase()}</td>
                <td>{new Date(sale.createdAt).toLocaleString()}</td>
                <td>{sale.items.reduce((sum, row) => sum + row.quantity, 0)}</td>
                <td>{peso(sale.total)}</td>
                <td>{peso(sale.cash)}</td>
                <td>{peso(sale.change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sales.length === 0 && <p className="empty-alert-items">Sales will appear here after checkout.</p>}
    </section>
  );
}
