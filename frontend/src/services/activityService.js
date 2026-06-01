export async function getActivities() {
  const response = await fetch("http://127.0.0.1:8000/activities/");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Aktiviteler getirilemedi");
  }
  return response.json();
}

export async function getCustomerActivities(customerId) {
  const response = await fetch(`http://127.0.0.1:8000/activities/customer/${customerId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Müşteri aktiviteleri getirilemedi");
  }
  return response.json();
}

export async function createActivity(payload) {
  const response = await fetch("http://127.0.0.1:8000/activities/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: payload.customerId,
      type: payload.type,
      note: payload.note,
      activity_date: payload.activityDate,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Aktivite kaydedilemedi");
  }

  return response.json();
}

export async function deleteActivity(activityId) {
  const response = await fetch(`http://127.0.0.1:8000/activities/${activityId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Aktivite silinemedi");
  }
  return response.json();
}
