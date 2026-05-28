function CustomersTable({ customers, onSelectCustomer, texts }) {
  const statusLabel = {
    active: texts.statusActive,
    new: texts.statusNew,
    inactive: texts.statusInactive,
  };

  return (
    <section className="customers-panel">
      <div className="panel-header">
        <h3 className="panel-title">{texts.title}</h3>
        <button className="panel-link">{texts.viewAll}</button>
      </div>
      <div className="table-wrap">
        <table className="customers-table">
          <thead>
            <tr>
              <th>{texts.colName}</th>
              <th>{texts.colBusiness}</th>
              <th>{texts.colPhone}</th>
              <th>{texts.colCity}</th>
              <th>{texts.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} onClick={() => onSelectCustomer(c)}>
                <td>{c.name}</td>
                <td>{c.businessType}</td>
                <td>{c.phone}</td>
                <td>{c.city}</td>
                <td>
                  <span className={`status-badge tone-${c.status}`}>
                    {statusLabel[c.status] || c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
export default CustomersTable
