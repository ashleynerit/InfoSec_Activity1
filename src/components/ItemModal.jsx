import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_EXPIRING_WINDOW_DAYS,
  DEFAULT_LOW_STOCK_THRESHOLD,
  MAX_ITEM_PHOTO_BYTES,
} from '../constants/inventory';

export default function ItemModal({ isOpen, editingItem, onClose, onSaveItem }) {
<<<<<<< HEAD
  const [name, setName] = useState(editingItem?.name || '');
  const [quantity, setQuantity] = useState(editingItem ? String(editingItem.quantity) : '');
  const [lowStockThreshold, setLowStockThreshold] = useState(
    editingItem
      ? String(Number.isInteger(editingItem.lowStockThreshold) ? editingItem.lowStockThreshold : DEFAULT_LOW_STOCK_THRESHOLD)
      : ''
  );
  const [expirationDate, setExpirationDate] = useState(editingItem?.expirationDate || '');
  const [expiringDays, setExpiringDays] = useState(
    editingItem
      ? String(Number.isInteger(editingItem.expiringDays) ? editingItem.expiringDays : DEFAULT_EXPIRING_WINDOW_DAYS)
      : ''
  );
  const [photoData, setPhotoData] = useState(editingItem?.photoData || '');
  const [sku, setSku] = useState(editingItem?.sku || '');
  const [costPrice, setCostPrice] = useState(editingItem?.costPrice != null ? String(editingItem.costPrice) : '');
  const [sellingPrice, setSellingPrice] = useState(editingItem?.sellingPrice != null ? String(editingItem.sellingPrice) : '');
  const [supplier, setSupplier] = useState(editingItem?.supplier || '');
=======
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [expiringDays, setExpiringDays] = useState('');
  const [photoData, setPhotoData] = useState('');
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
<<<<<<< HEAD
    setTimeout(() => nameInputRef.current?.focus(), 0);
  }, [isOpen]);
=======

    if (editingItem) {
      setName(editingItem.name);
      setQuantity(String(editingItem.quantity));
      setLowStockThreshold(
        String(
          Number.isInteger(editingItem.lowStockThreshold)
            ? editingItem.lowStockThreshold
            : DEFAULT_LOW_STOCK_THRESHOLD
        )
      );
      setExpirationDate(editingItem.expirationDate);
      setExpiringDays(
        String(
          Number.isInteger(editingItem.expiringDays)
            ? editingItem.expiringDays
            : DEFAULT_EXPIRING_WINDOW_DAYS
        )
      );
      setPhotoData(editingItem.photoData || '');
    } else {
      setName('');
      setQuantity('');
      setLowStockThreshold('');
      setExpirationDate('');
      setExpiringDays('');
      setPhotoData('');
    }

    setTimeout(() => nameInputRef.current?.focus(), 0);
  }, [isOpen, editingItem]);
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Choose a valid image file.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_ITEM_PHOTO_BYTES) {
      alert('The item photo must be 2 MB or smaller.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoData(reader.result);
    reader.onerror = () =>
      alert('The item photo could not be read. Please choose another image.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert('Enter an item name.');
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      alert('Quantity must be a whole number greater than or equal to zero.');
      return;
    }

    const parsedThreshold = Number(lowStockThreshold);
    if (!Number.isInteger(parsedThreshold) || parsedThreshold < 0) {
      alert('Low-stock threshold must be a whole number greater than or equal to zero.');
      return;
    }

    const parsedExpiringDays = Number(expiringDays);
    if (!Number.isInteger(parsedExpiringDays) || parsedExpiringDays < 0) {
      alert('Expiration alert days must be a whole number greater than or equal to zero.');
      return;
    }
<<<<<<< HEAD
    const parsedCostPrice = Number(costPrice);
    const parsedSellingPrice = Number(sellingPrice);
    if (costPrice === '' || sellingPrice === '' || !Number.isFinite(parsedCostPrice) || parsedCostPrice < 0 || !Number.isFinite(parsedSellingPrice) || parsedSellingPrice < 0) {
      alert('Enter valid cost and selling prices.');
      return;
    }
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e

    const saved = onSaveItem({
      id: editingItem?.id || Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: trimmedName,
      quantity: parsedQuantity,
      lowStockThreshold: parsedThreshold,
      expirationDate,
      expiringDays: parsedExpiringDays,
      photoData,
<<<<<<< HEAD
      sku: sku.trim(),
      costPrice: parsedCostPrice,
      sellingPrice: parsedSellingPrice,
      supplier: supplier.trim(),
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
    });

    if (saved) onClose();
  };

  return (
    <div
      className="overlay open item-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="modal item-modal" onSubmit={handleSubmit}>
        <h3>{editingItem ? 'Edit item' : 'Add an item'}</h3>

        <div className="item-form-layout">
          <label className="photo-upload" htmlFor="itemPhoto">
            {photoData ? (
              <img id="itemPhotoPreview" src={photoData} alt="Selected item photo" />
            ) : (
              <span className="photo-upload-placeholder">
                <span aria-hidden="true">▧</span>
                <small>UPLOAD PHOTO</small>
              </span>
            )}
            <input id="itemPhoto" type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          <div className="item-form-fields">
            <div className="item-field item-name-field">
              <label htmlFor="itemName">Item name</label>
              <input
                ref={nameInputRef}
                id="itemName"
                maxLength={50}
                placeholder="e.g. Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="item-field">
              <label htmlFor="itemQuantity">Quantity</label>
              <input
                id="itemQuantity"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="item-field">
<<<<<<< HEAD
              <label htmlFor="itemSku">SKU / Barcode</label>
              <input
                id="itemSku"
                maxLength={40}
                placeholder="Optional"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div className="item-field">
              <label htmlFor="itemCostPrice">Cost price</label>
              <input
                id="itemCostPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                required
              />
            </div>

            <div className="item-field">
              <label htmlFor="itemSellingPrice">Selling price</label>
              <input
                id="itemSellingPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
              />
            </div>

            <div className="item-field">
              <label htmlFor="itemSupplier">Supplier</label>
              <input
                id="itemSupplier"
                maxLength={50}
                placeholder="Supplier name"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>

            <div className="item-field">
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
              <label htmlFor="itemLowStockThreshold">Low-stock alert at</label>
              <input
                id="itemLowStockThreshold"
                type="number"
                min="0"
                step="1"
                placeholder="2 items or fewer"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                required
              />
            </div>

            <div className="item-field">
              <label htmlFor="itemExpiration">Expiration date</label>
              <input
                id="itemExpiration"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
            </div>

            <div className="item-field">
              <label htmlFor="itemExpiringDays">Expiring alert (days before)</label>
              <input
                id="itemExpiringDays"
                type="number"
                min="0"
                step="1"
                placeholder="15 days"
                value={expiringDays}
                onChange={(e) => setExpiringDays(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="save" type="submit">
            Save item
          </button>
        </div>
      </form>
    </div>
  );
}