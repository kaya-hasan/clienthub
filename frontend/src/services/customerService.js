export async function createCustomer(payload) {
  const apiPayload = {
    full_name: payload.name,
    phone: payload.phone,
    email: payload.email || null,
    city: payload.city || null,
    business_type: payload.businessType || null,
    notes: payload.notes || null,
    status: payload.status || "lead",
    last_contacted_at: payload.lastContactedAt || null,
  };

  const response = await fetch("http://127.0.0.1:8000/customers/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Müşteri oluşturulamadı");
  }

  return response.json();
}

export async function getCustomers() {
  const response = await fetch("http://127.0.0.1:8000/customers/");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Müşteriler getirilemedi");
  }

  const data = await response.json();
  return data;
}

export async function updateCustomer(customerId, payload) {
  const apiPayload = {
    ...(payload.name !== undefined ? { full_name: payload.name } : {}),
    ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
    ...(payload.email !== undefined ? { email: payload.email } : {}),
    ...(payload.city !== undefined ? { city: payload.city } : {}),
    ...(payload.businessType !== undefined
      ? { business_type: payload.businessType }
      : {}),
    ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
    ...(payload.lastContactedAt !== undefined
      ? { last_contacted_at: payload.lastContactedAt }
      : {}),
  };

  const response = await fetch(
    `http://127.0.0.1:8000/customers/${customerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Müşteri güncellenemedi");
  }

  return response.json();
}
