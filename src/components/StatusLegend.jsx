export default function StatusLegend() {
  return (
    <div className="status-legend" role="group" aria-label="Item status legend">
      <span>
        <img className="status-icon" src="/assets/icons/low_stocks.png" alt="" />
        Low stock: at or below the item's set quantity limit
      </span>
      <span>
        <img className="status-icon" src="/assets/icons/expiring.png" alt="" />
        Expiring: within the item's alert window or already expired
      </span>
    </div>
  );
}
