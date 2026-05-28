function TopBar({
  onNewCustomerClick,
  isFormOpen,
  title,
  newCustomerLabel,
  closeFormLabel,
  locale,
  onToggleLocale,
}) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-actions">
        <button className="secondary-btn" onClick={onToggleLocale}>
          {locale === "tr" ? "EN" : "TR"}
        </button>
        <button className="primary-btn" onClick={onNewCustomerClick}>
          {isFormOpen ? closeFormLabel : newCustomerLabel}
        </button>
      </div>
    </header>
  )
}

export default TopBar
