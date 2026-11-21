import { useEffect, useRef, useState } from 'react';

export default function Topbar({
  pageTitle,
  activePage,
  showSearch,
  showBackButton,
  searchQuery,
  onSearchChange,
  onBack,
<<<<<<< HEAD
  onGoToDashboard,
  onGoToInventory,
  onGoToCategories,
  onGoToSales,
  onGoToReports,
=======
  onGoToInventory,
  onGoToCategories,
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleNavClick = (callback) => {
    setMenuOpen(false);
    callback();
  };

  return (
    <header className="topbar">
      {showBackButton ? (
        <button
          className="back-button topbar-back-button"
          type="button"
          aria-label="Back to categories"
          onClick={() => handleNavClick(onBack)}
        >
          <img src="/assets/icons/back-button.png" alt="" />
        </button>
      ) : (
        <button
          ref={buttonRef}
          className="hamburger"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="navigationMenu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      )}

      <h1 key={pageTitle}>{pageTitle}</h1>

      {showSearch && (
        <label className="search">
          <span>⌕</span>
          <input
            placeholder="Search"
            aria-label="Search categories"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
      )}

      {!showBackButton && menuOpen && (
        <>
          <div
            className="navigation-backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            ref={menuRef}
            className="navigation-menu"
            id="navigationMenu"
            aria-label="Main navigation"
          >
<<<<<<< HEAD
            <button
              className={`menu-item${activePage === 'dashboard' ? ' is-current' : ''}`}
              type="button"
              onClick={() => handleNavClick(onGoToDashboard)}
            >
              Dashboard
            </button>
            <button
              className={`menu-item${activePage === 'sales' ? ' is-current' : ''}`}
              type="button"
              onClick={() => handleNavClick(onGoToSales)}
            >
              Point of Sale
=======
            <button className="menu-item" type="button" onClick={() => setMenuOpen(false)}>
              Profile
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
            </button>
            <button
              className={`menu-item${activePage === 'inventory' ? ' is-current' : ''}`}
              type="button"
              aria-current={activePage === 'inventory' ? 'page' : undefined}
              onClick={() => handleNavClick(onGoToInventory)}
            >
              Inventory
            </button>
            <button
              className={`menu-item${activePage === 'categories' ? ' is-current' : ''}`}
              type="button"
              aria-current={activePage === 'categories' ? 'page' : undefined}
              onClick={() => handleNavClick(onGoToCategories)}
            >
              Categories
            </button>
<<<<<<< HEAD
            <button
              className={`menu-item${activePage === 'reports' ? ' is-current' : ''}`}
              type="button"
              onClick={() => handleNavClick(onGoToReports)}
            >
              Reports
=======
            <button className="menu-item" type="button" onClick={() => setMenuOpen(false)}>
              Archived
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
            </button>
            <button
              className="menu-item logout-item"
              type="button"
              onClick={() => handleNavClick(onLogout)}
            >
              Log out
            </button>
          </nav>
        </>
      )}
    </header>
  );
}