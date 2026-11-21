import {
  formatExpiration,
  getItemAlertStatus,
  hasItemAlert,
} from '../constants/inventory';
import StatusLegend from './StatusLegend';

export default function ItemView({
<<<<<<< HEAD
=======
  categoryName,
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
  items,
  onOpenAddItem,
  onEditItem,
  onRemoveItem,
<<<<<<< HEAD
  onChangeQuantity,
  categoryName,
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
}) {
  const sortedItems = [...items].sort((a, b) => {
    const alertOrder = Number(hasItemAlert(b)) - Number(hasItemAlert(a));
    return alertOrder || a.expirationDate.localeCompare(b.expirationDate);
  });

  return (
    <section className="item-view">
      <StatusLegend />

      <div className="item-view-heading">
        <h2>All items</h2>
        <button className="add-item" type="button" onClick={onOpenAddItem}>
          ADD ITEM
        </button>
      </div>

      <div className="item-list">
        {sortedItems.length === 0 ? (
          <p className="empty-items">
            No items in this category yet. Add an item to get started.
          </p>
        ) : (
          sortedItems.map((item) => {
            const { isLowStock, isExpiring, daysUntilExpiration } = getItemAlertStatus(item);

            return (
              <article key={item.id} className="item-card">
                <div className="item-statuses">
                  {isExpiring && (
                    <img
                      className="expiring-sticker"
                      src="/assets/icons/expiring.png"
                      alt={daysUntilExpiration < 0 ? 'Expired' : 'Expiring soon'}
                    />
                  )}

                  {isLowStock && (
                    <img
                      className="low-stock-sticker"
                      src="/assets/icons/low_stocks.png"
                      alt="Low stock"
                    />
                  )}
                </div>

                {item.photoData ? (
                  <div className="item-photo">
                    <img src={item.photoData} alt={item.name} />
                  </div>
                ) : (
                  <div className="item-photo" aria-label="Photo placeholder">
                    <span aria-hidden="true">▧</span>
                    <small>PHOTO</small>
                  </div>
                )}

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
<<<<<<< HEAD
                  {item.sku && (
                    <p><strong>SKU:</strong> {item.sku}</p>
                  )}
                  {item.sellingPrice != null && (
                    <p><strong>Price:</strong> ₱{Number(item.sellingPrice).toFixed(2)}</p>
                  )}
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
                  <p>
                    <strong>Expires:</strong> {formatExpiration(item.expirationDate)}
                  </p>
                </div>

<<<<<<< HEAD
                <div className="quantity-controls" aria-label={`Quantity controls for ${item.name}`}>
                  <button
                    type="button"
                    onClick={() => onChangeQuantity(item.id, categoryName, -1)}
                    disabled={item.quantity <= 0}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −1
                  </button>
                  <strong aria-live="polite">{item.quantity}</strong>
                  <button
                    type="button"
                    onClick={() => onChangeQuantity(item.id, categoryName, 1)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +1
                  </button>
                </div>

=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
                <div className="item-actions">
                  <button type="button" onClick={() => onEditItem(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => {
                      if (window.confirm('Remove this item?')) {
                        onRemoveItem(item.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}