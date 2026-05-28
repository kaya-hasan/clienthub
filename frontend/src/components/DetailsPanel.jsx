import { useEffect, useState } from "react";

function DetailsPanel({ selectedCustomer, activities, texts, onSaveNotes }) {
  const typeLabel = {
    call: texts.typeCall,
    visit: texts.typeVisit,
    note: texts.typeNote,
  };
  const [notesDraft, setNotesDraft] = useState(selectedCustomer.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotesDraft(selectedCustomer.notes || "");
  }, [selectedCustomer]);

  async function handleSaveNotes() {
    if (!selectedCustomer?.id || !onSaveNotes) return;
    setIsSaving(true);
    try {
      await onSaveNotes(selectedCustomer.id, notesDraft);
      alert(texts.noteSaved);
    } catch (error) {
      alert(error.message || texts.noteSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="details-grid">
      <article className="detail-card">
        <h3>{texts.customerTitle}</h3>
        <ul className="detail-list">
          <li>
            <strong>{texts.name}</strong>
            <span>{selectedCustomer.name}</span>
          </li>
          <li>
            <strong>{texts.phone}</strong>
            <span>{selectedCustomer.phone}</span>
          </li>
          <li>
            <strong>{texts.email}</strong>
            <span>{selectedCustomer.email}</span>
          </li>
          <li>
            <strong>{texts.city}</strong>
            <span>{selectedCustomer.city}</span>
          </li>
          <li>
            <strong>{texts.businessType}</strong>
            <span>{selectedCustomer.businessType}</span>
          </li>
          <li>
            <strong>{texts.lastContact}</strong>
            <span>{selectedCustomer.lastContact}</span>
          </li>
        </ul>
        <div className="notes-editor">
          <label>{texts.notes}</label>
          <textarea
            rows="4"
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
          />
          <button
            type="button"
            className="primary-btn"
            onClick={handleSaveNotes}
            disabled={isSaving || !selectedCustomer?.id}
          >
            {isSaving ? texts.saving : texts.save}
          </button>
        </div>
      </article>
      <article className="detail-card">
        <h3>{texts.activityTitle}</h3>
        <ul className="timeline">
          {activities.map((activity) => (
            <li className="timeline-item" key={activity.id}>
              <span className="timeline-dot"></span>
              <div className="timeline-content">
                <p className="timeline-note">{activity.note}</p>
                <small className="timeline-date">
                  {activity.date} • {typeLabel[activity.type] || activity.type}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
export default DetailsPanel
