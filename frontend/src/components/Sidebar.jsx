function Sidebar({ brandTitle, menu, activeItem, onSelect }) {
  return (
    <aside className="aside-sidebar">
      <h2 className="sidebar-title">{brandTitle}</h2>
      <nav className="sidebar-nav">
        {menu.map((item) => (
          <button
            key={item}
            className={activeItem === item ? "is-active" : ""}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
