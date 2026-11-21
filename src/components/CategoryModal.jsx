import { useEffect, useRef, useState } from 'react';
import { CATEGORY_ICONS } from '../constants/inventory';

export default function CategoryModal({ isOpen, existingNames, onClose, onAddCategory }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState('#a8dfbf');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      alert('Enter a category name.');
      return;
    }
    if (existingNames.includes(trimmed.toLowerCase())) {
      alert('A category with this name already exists.');
      return;
    }

    const saved = onAddCategory({ name: trimmed, icon, color });
    if (saved) onClose();
  };

  return (
    <div
      className="overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="modal category-modal" onSubmit={handleSubmit}>
        <h3>Add a category</h3>

        <label htmlFor="categoryName">Category name</label>
        <input
          ref={inputRef}
          id="categoryName"
          placeholder="e.g. Pet supplies"
          maxLength={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="categoryIcon">Choose an icon</label>
        <select id="categoryIcon" value={icon} onChange={(e) => setIcon(e.target.value)} required>
          {CATEGORY_ICONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="categoryColor">Choose a color</label>
        <input
          id="categoryColor"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <div
          className="category-preview"
          aria-label="Category preview"
          style={{ '--custom-category-color': color }}
        >
          <span>{name.trim() ? name.trim().toUpperCase() : 'CATEGORY'}</span>
          <span className="cat-icon">{icon}</span>
        </div>

        <div className="modal-actions">
          <button className="cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="save" type="submit">
            Add category
          </button>
        </div>
      </form>
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import { CATEGORY_ICONS } from '../constants/inventory';

export default function CategoryModal({ isOpen, existingNames, onClose, onAddCategory }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState('#a8dfbf');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('📦');
      setColor('#a8dfbf');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      alert('Enter a category name.');
      return;
    }
    if (existingNames.includes(trimmed.toLowerCase())) {
      alert('A category with this name already exists.');
      return;
    }

    const saved = onAddCategory({ name: trimmed, icon, color });
    if (saved) onClose();
  };

  return (
    <div
      className="overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="modal category-modal" onSubmit={handleSubmit}>
        <h3>Add a category</h3>

        <label htmlFor="categoryName">Category name</label>
        <input
          ref={inputRef}
          id="categoryName"
          placeholder="e.g. Pet supplies"
          maxLength={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="categoryIcon">Choose an icon</label>
        <select id="categoryIcon" value={icon} onChange={(e) => setIcon(e.target.value)} required>
          {CATEGORY_ICONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="categoryColor">Choose a color</label>
        <input
          id="categoryColor"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <div
          className="category-preview"
          aria-label="Category preview"
          style={{ '--custom-category-color': color }}
        >
          <span>{name.trim() ? name.trim().toUpperCase() : 'CATEGORY'}</span>
          <span className="cat-icon">{icon}</span>
        </div>

        <div className="modal-actions">
          <button className="cancel" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="save" type="submit">
            Add category
          </button>
        </div>
      </form>
    </div>
  );
}