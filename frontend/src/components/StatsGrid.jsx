function StatsGrid({ stats }) {
  return (
    <div className="cards-grid">
      {stats.map((stat) => (
        <article key={stat.id} className="stat-card">
          <h3 className="stat-card-title">{stat.label}</h3>
          <p className="stat-card-value">{stat.value}</p>
          <span className={`stat-trend tone-${stat.tone}`}>
            {stat.trend}
          </span>
        </article>
      ))}
    </div>
  )
}
export default StatsGrid