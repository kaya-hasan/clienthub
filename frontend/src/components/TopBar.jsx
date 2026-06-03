function TopBar({
  onNewCustomerClick,
  isFormOpen,
  title,
  newCustomerLabel,
  closeFormLabel,
  locale,
  onToggleLocale,
  currentUserEmail,
  logoutLabel,
  onLogout,
}) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-actions">
        <span className="topbar-user">{currentUserEmail}</span>
        <button className="secondary-btn" onClick={onToggleLocale}>
          {locale === "tr" ? "EN" : "TR"}
        </button>
        <button className="secondary-btn" onClick={onLogout}>
          {logoutLabel}
        </button>
        <button className="primary-btn" onClick={onNewCustomerClick}>
          {isFormOpen ? closeFormLabel : newCustomerLabel}
        </button>
      </div>
    </header>
  )
}

export default TopBar
