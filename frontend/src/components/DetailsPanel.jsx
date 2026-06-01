import { useEffect, useState } from "react";

function DetailsPanel({
  selectedCustomer,
  activities,
  texts,
  onSaveNotes,
  onAddActivity,
  onQuickAction,
  onQuickAppointment,
  undoAction,
  onUndoQuickAction,
}) {
  const typeLabel = {
    call: texts.typeCall,
    visit: texts.typeVisit,
    note: texts.typeNote,
    message: texts.quickMessaged,
    appointment: texts.quickBooked,
  };
  const [notesDraft, setNotesDraft] = useState(selectedCustomer.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [activityDraft, setActivityDraft] = useState({
    type: "call",
    note: "",
    activityDate: "",
  });
  const [appointmentDraft, setAppointmentDraft] = useState("");

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

  async function handleAddActivity() {
    if (!selectedCustomer?.id || !onAddActivity) return;
    if (!activityDraft.note || !activityDraft.activityDate) return;
    await onAddActivity(selectedCustomer.id, activityDraft);
    setActivityDraft({ type: "call", note: "", activityDate: "" });
  }

  async function handleQuickAction(actionKey) {
    if (!selectedCustomer?.id || !onQuickAction) return;
    await onQuickAction(selectedCustomer.id, actionKey);
  }

  async function handleQuickAppointment() {
    if (!selectedCustomer?.id || !onQuickAppointment || !appointmentDraft) return;
    await onQuickAppointment(selectedCustomer.id, appointmentDraft);
    setAppointmentDraft("");
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
          <li>
            <strong>{texts.lastVisitDate}</strong>
            <span>{selectedCustomer.lastVisitDate || "-"}</span>
          </li>
          <li>
            <strong>{texts.nextAppointmentDate}</strong>
            <span>{selectedCustomer.nextAppointmentDate || "-"}</span>
          </li>
          <li>
            <strong>{texts.serviceType}</strong>
            <span>{selectedCustomer.serviceType || "-"}</span>
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
        <div className="notes-editor">
          <label>{texts.quickActions}</label>
          {undoAction && (
            <div className="undo-inline">
              <span>{texts.undoPrompt}</span>
              <button type="button" className="secondary-btn" onClick={onUndoQuickAction}>
                {texts.undo}
              </button>
            </div>
          )}
          <div className="quick-action-row">
            <button type="button" className="secondary-btn" onClick={() => handleQuickAction("called")}>
              {texts.quickCalled}
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleQuickAction("messaged")}>
              {texts.quickMessaged}
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleQuickAction("booked")}>
              {texts.quickBooked}
            </button>
          </div>
        </div>
        <div className="notes-editor">
          <label>{texts.oneClickAppointment}</label>
          <input
            type="datetime-local"
            value={appointmentDraft}
            onChange={(e) => setAppointmentDraft(e.target.value)}
          />
          <button type="button" className="primary-btn" onClick={handleQuickAppointment}>
            {texts.saveAppointment}
          </button>
        </div>
        <div className="notes-editor">
          <label>{texts.activityType}</label>
          <select
            value={activityDraft.type}
            onChange={(e) => setActivityDraft((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="call">{texts.typeCall}</option>
            <option value="visit">{texts.typeVisit}</option>
            <option value="note">{texts.typeNote}</option>
          </select>
          <label>{texts.activityDate}</label>
          <input
            type="datetime-local"
            value={activityDraft.activityDate}
            onChange={(e) => setActivityDraft((prev) => ({ ...prev, activityDate: e.target.value }))}
          />
          <label>{texts.activityNote}</label>
          <textarea
            rows="3"
            value={activityDraft.note}
            onChange={(e) => setActivityDraft((prev) => ({ ...prev, note: e.target.value }))}
          />
          <button type="button" className="primary-btn" onClick={handleAddActivity}>
            {texts.addActivity}
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
                  {activity.activityDate} • {typeLabel[activity.type] || activity.type}
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
