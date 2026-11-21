import { formatExpiration, getItemAlertStatus } from '../constants/inventory';
import StatusLegend from './StatusLegend';

export default function InventoryAlerts({ items, onOpenCategory, onChangeQuantity }) {
  return (
    <section className="inventory-alerts" aria-labelledby="inventoryAlertsTitle">
      <h2 className="section-title" id="inventoryAlertsTitle">Items needing attention</h2>
      <StatusLegend />
      {items.length === 0 ? (
        <p className="empty-alert-items">No items currently have expiring or low-stock alerts.</p>
      ) : (
        <div className="item-list">
          {items.map((item) => {
            const { isLowStock, isExpiring, daysUntilExpiration } = getItemAlertStatus(item);

            return (
              <article key={`${item.categoryName}-${item.id}`} className="item-card">
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
                  <p><strong>Category:</strong> {item.categoryName}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Expires:</strong> {formatExpiration(item.expirationDate)}</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-controls" aria-label={`Quantity controls for ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(item.id, item.categoryName, -1)}
                      disabled={item.quantity <= 0}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −1
                    </button>
                    <strong aria-live="polite">{item.quantity}</strong>
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(item.id, item.categoryName, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +1
                    </button>
                  </div>
                  <button type="button" onClick={() => onOpenCategory(item.categoryName)}>
                    View category
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
