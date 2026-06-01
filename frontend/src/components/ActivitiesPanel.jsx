function ActivitiesPanel({ activities, title, emptyText }) {
  return (
    <section className="customers-panel">
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
      </div>
      {activities.length === 0 ? (
        <p>{emptyText}</p>
      ) : (
        <ul className="timeline">
          {activities.map((activity) => (
            <li className="timeline-item" key={activity.id}>
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <p className="timeline-note">{activity.note}</p>
                <small className="timeline-date">
                  {activity.activityDate} • {activity.customerName} • {activity.type}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ActivitiesPanel;
