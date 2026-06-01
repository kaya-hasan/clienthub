import "./App.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StatsGrid from "./components/StatsGrid";
import CustomersTable from "./components/CustomersTable";
import DetailsPanel from "./components/DetailsPanel";
import CustomerForm from "./components/CustomerForm";
import ActivitiesPanel from "./components/ActivitiesPanel";
import { useEffect, useMemo, useState } from "react";
import { getCustomers, updateCustomer } from "./services/customerService";
import { createActivity, getActivities, getCustomerActivities } from "./services/activityService";

function App() {
  const [locale, setLocale] = useState("tr");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allActivities, setAllActivities] = useState([]);
  const [selectedCustomerActivities, setSelectedCustomerActivities] = useState([]);

  const translations = {
    tr: {
      brandTitle: "ClientHub CRM",
      topbarTitle: "Müşteri Operasyon Paneli",
      newCustomer: "Yeni Müşteri",
      closeForm: "Formu Kapat",
      dashboardTitle: "Dashboard",
      stats: {
        total: "Müşteriler",
        new: "Lead",
        active: "Müşteri",
        withPhone: "Telefonlu",
        live: "Canlı",
        last7Days: "Toplam",
        totalHint: "Toplam",
        contactHint: "İletişim",
      },
      sidebarMenu: ["Dashboard", "Müşteriler", "Aktiviteler", "Raporlar", "Ayarlar"],
      table: {
        title: "Müşteriler",
        viewAll: "Tümünü Gör",
        colName: "Ad",
        colBusiness: "İş Türü",
        colPhone: "Telefon",
        colCity: "Şehir",
        colStatus: "Durum",
        colLastContact: "Son İletişim",
        statusLead: "Lead",
        statusContacted: "Görüşüldü",
        statusCustomer: "Müşteri",
        statusLost: "Kaybedildi",
      },
      details: {
        customerTitle: "Seçili Müşteri",
        activityTitle: "Son Aktiviteler",
        name: "Ad",
        phone: "Telefon",
        email: "E-posta",
        city: "Şehir",
        businessType: "İş Türü",
        lastContact: "Son Temas",
        lastVisitDate: "Son Randevu",
        nextAppointmentDate: "Sonraki Randevu",
        serviceType: "Alınan Hizmet",
        notes: "Notlar",
        save: "Notu Kaydet",
        saving: "Kaydediliyor...",
        noteSaved: "Not başarıyla güncellendi.",
        noteSaveError: "Not güncellenemedi.",
        typeCall: "Arama",
        typeVisit: "Ziyaret",
        typeNote: "Not",
        activityType: "Aktivite Türü",
        activityDate: "Aktivite Tarihi",
        activityNote: "Aktivite Notu",
        addActivity: "Aktivite Ekle",
      },
      form: {
        title: "Müşteri Bilgileri",
        name: "Ad",
        phone: "Telefon",
        email: "E-posta",
        city: "Şehir",
        businessType: "İş Türü",
        notes: "Notlar",
        save: "Kaydet",
        saving: "Kaydediliyor...",
        validationRequired: "Ad ve Telefon zorunludur.",
      },
      filters: {
        searchPlaceholder: "İsim veya telefon ile ara",
        statusAll: "Tüm Durumlar",
      },
      todayAppointmentsTitle: "Bugün Randevusu Olanlar",
      noTodayAppointments: "Bugün randevu görünmüyor.",
      winbackTitle: "Geri Kazanılacak Müşteriler",
      noWinback: "30+ gün gelmeyen müşteri yok.",
      atRisk: "Kaybedilmek Üzere",
      activitiesMenuTitle: "Aktiviteler",
      noActivities: "Henüz aktivite yok.",
      todayContacted: "Bugün iletişim kuruldu",
      daysNotContacted: "gündür aranmamış",
      daysNotVisited: "gündür gelmedi",
      comingSoon: "Yakında",
    },
    en: {
      brandTitle: "ClientHub CRM",
      topbarTitle: "Customer Operations Panel",
      newCustomer: "New Customer",
      closeForm: "Close Form",
      dashboardTitle: "Dashboard",
      stats: {
        total: "Customers",
        new: "Leads",
        active: "Customers",
        withPhone: "With Phone",
        live: "Live",
        last7Days: "Total",
        totalHint: "Total",
        contactHint: "Contact",
      },
      sidebarMenu: ["Dashboard", "Customers", "Activities", "Reports", "Settings"],
      table: {
        title: "Customers",
        viewAll: "View All",
        colName: "Name",
        colBusiness: "Business",
        colPhone: "Phone",
        colCity: "City",
        colStatus: "Status",
        colLastContact: "Last Contact",
        statusLead: "Lead",
        statusContacted: "Contacted",
        statusCustomer: "Customer",
        statusLost: "Lost",
      },
      details: {
        customerTitle: "Selected Customer",
        activityTitle: "Recent Activities",
        name: "Name",
        phone: "Phone",
        email: "Email",
        city: "City",
        businessType: "Business",
        lastContact: "Last Contact",
        lastVisitDate: "Last Visit",
        nextAppointmentDate: "Next Appointment",
        serviceType: "Service Type",
        notes: "Notes",
        save: "Save Note",
        saving: "Saving...",
        noteSaved: "Note updated successfully.",
        noteSaveError: "Note could not be updated.",
        typeCall: "Call",
        typeVisit: "Visit",
        typeNote: "Note",
        activityType: "Activity Type",
        activityDate: "Activity Date",
        activityNote: "Activity Note",
        addActivity: "Add Activity",
      },
      form: {
        title: "Customer Information",
        name: "Name",
        phone: "Phone",
        email: "Email",
        city: "City",
        businessType: "Business",
        notes: "Notes",
        save: "Save",
        saving: "Saving...",
        validationRequired: "Name and phone are required.",
      },
      filters: {
        searchPlaceholder: "Search by name or phone",
        statusAll: "All Statuses",
      },
      todayAppointmentsTitle: "Today Appointments",
      noTodayAppointments: "No appointment for today.",
      winbackTitle: "Win-Back Customers",
      noWinback: "No customer absent for 30+ days.",
      atRisk: "At Risk",
      activitiesMenuTitle: "Activities",
      noActivities: "No activity yet.",
      todayContacted: "Contacted today",
      daysNotContacted: "days without contact",
      daysNotVisited: "days absent",
      comingSoon: "Coming Soon",
    },
  };

  const t = translations[locale];

  function formatDaysWithoutContact(lastContactedAt) {
    if (!lastContactedAt) return locale === "tr" ? "Kayıt yok" : "No record";
    const date = new Date(lastContactedAt);
    if (Number.isNaN(date.getTime())) return "-";
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return t.todayContacted;
    return `${days} ${t.daysNotContacted}`;
  }

  function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function getDaysSince(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  function mapActivity(item) {
    return {
      id: item.id,
      type: item.type,
      note: item.note,
      activityDate: formatDateTime(item.activity_date),
      customerName: item.customer_name || "-",
    };
  }

  async function loadCustomers() {
    const data = await getCustomers();
    const mapped = data.map((item) => ({
      id: item.id,
      name: item.full_name,
      businessType: item.business_type || "-",
      phone: item.phone || "-",
      email: item.email || "-",
      city: item.city || "-",
      notes: item.notes || "",
      status: item.status || "lead",
      lastContactedAt: item.last_contacted_at,
      lastContactText: formatDaysWithoutContact(item.last_contacted_at),
      lastContact: formatDaysWithoutContact(item.last_contacted_at),
      lastVisitDateRaw: item.last_visit_date,
      nextAppointmentDateRaw: item.next_appointment_date,
      lastVisitDate: formatDateTime(item.last_visit_date),
      nextAppointmentDate: formatDateTime(item.next_appointment_date),
      serviceType: item.service_type || "-",
    }));

    setCustomers(mapped);
    if (!selectedCustomer && mapped.length > 0) {
      setSelectedCustomer(mapped[0]);
      await loadActivitiesForCustomer(mapped[0].id);
    }
  }

  useEffect(() => {
    loadCustomers();
    loadAllActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAllActivities() {
    const data = await getActivities();
    setAllActivities(data.map(mapActivity));
  }

  async function loadActivitiesForCustomer(customerId) {
    const data = await getCustomerActivities(customerId);
    setSelectedCustomerActivities(data.map(mapActivity));
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const term = searchTerm.trim().toLowerCase();
      const matchedSearch =
        !term || c.name.toLowerCase().includes(term) || c.phone.toLowerCase().includes(term);
      const matchedStatus = statusFilter === "all" || c.status === statusFilter;
      return matchedSearch && matchedStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const winbackCustomers = useMemo(() => {
    return customers
      .filter((c) => c.status !== "lost")
      .filter((c) => {
        const days = getDaysSince(c.lastVisitDateRaw);
        if (days === null) return true;
        return days >= 30;
      })
      .slice(0, 5);
  }, [customers]);

  const todayAppointments = useMemo(() => {
    const now = new Date();
    return customers
      .filter((c) => c.nextAppointmentDateRaw)
      .filter((c) => {
        const d = new Date(c.nextAppointmentDateRaw);
        if (Number.isNaN(d.getTime())) return false;
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      })
      .slice(0, 5);
  }, [customers]);

  const stats = useMemo(() => {
    const total = customers.length;
    const leadCount = customers.filter((c) => c.status === "lead").length;
    const customerCount = customers.filter((c) => c.status === "customer").length;
    const withPhone = customers.filter((c) => c.phone && c.phone !== "-").length;

    return [
      { id: 1, label: t.stats.total, value: String(total), trend: t.stats.live, tone: "success" },
      { id: 2, label: t.stats.new, value: String(leadCount), trend: t.stats.last7Days, tone: "warning" },
      { id: 3, label: t.stats.active, value: String(customerCount), trend: t.stats.totalHint, tone: "success" },
      { id: 4, label: t.stats.withPhone, value: String(withPhone), trend: t.stats.contactHint, tone: "danger" },
    ];
  }, [customers, t]);

  async function handleSaveCustomerNotes(customerId, notes) {
    await updateCustomer(customerId, { notes });
    await loadCustomers();
    setSelectedCustomer((prev) => (prev ? { ...prev, notes } : prev));
  }

  async function handleSelectCustomer(customer) {
    setSelectedCustomer(customer);
    if (customer?.id) {
      await loadActivitiesForCustomer(customer.id);
    }
  }

  async function handleAddActivity(customerId, payload) {
    await createActivity({
      customerId,
      type: payload.type,
      note: payload.note,
      activityDate: payload.activityDate,
    });
    await loadActivitiesForCustomer(customerId);
    await loadAllActivities();
  }

  return (
    <div className="app-shell">
      <Sidebar
        brandTitle={t.brandTitle}
        menu={t.sidebarMenu}
        activeItem={activeMenuItem}
        onSelect={setActiveMenuItem}
      />
      <div className="main-area">
        <TopBar
          onNewCustomerClick={() => setIsFormOpen((prev) => !prev)}
          isFormOpen={isFormOpen}
          title={t.topbarTitle}
          newCustomerLabel={t.newCustomer}
          closeFormLabel={t.closeForm}
          locale={locale}
          onToggleLocale={() => setLocale((prev) => (prev === "tr" ? "en" : "tr"))}
        />
        <main className="content">
          <h2 className="page-title">{activeMenuItem}</h2>

          {activeMenuItem === t.sidebarMenu[0] && (
            <>
              <StatsGrid stats={stats} />

              <section className="customers-panel filters-panel">
                <input
                  className="filter-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.filters.searchPlaceholder}
                />
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">{t.filters.statusAll}</option>
                  <option value="lead">{t.table.statusLead}</option>
                  <option value="contacted">{t.table.statusContacted}</option>
                  <option value="customer">{t.table.statusCustomer}</option>
                  <option value="lost">{t.table.statusLost}</option>
                </select>
              </section>

              <CustomersTable
                customers={filteredCustomers}
                onSelectCustomer={handleSelectCustomer}
                texts={t.table}
              />

              <section className="customers-panel">
                <div className="panel-header">
                  <h3 className="panel-title">{t.todayAppointmentsTitle}</h3>
                </div>
                {todayAppointments.length === 0 ? (
                  <p>{t.noTodayAppointments}</p>
                ) : (
                  <ul className="todo-list">
                    {todayAppointments.map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong> - {c.nextAppointmentDate}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="customers-panel">
                <div className="panel-header">
                  <h3 className="panel-title">{t.winbackTitle}</h3>
                </div>
                {winbackCustomers.length === 0 ? (
                  <p>{t.noWinback}</p>
                ) : (
                  <ul className="todo-list">
                    {winbackCustomers.map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong> - {getDaysSince(c.lastVisitDateRaw) ?? 30} {t.daysNotVisited}
                        <span className="risk-chip">{t.atRisk}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <DetailsPanel
                selectedCustomer={
                  selectedCustomer || {
                    id: null,
                    name: "-",
                    phone: "-",
                    email: "-",
                    city: "-",
                    businessType: "-",
                    lastContact: "-",
                    notes: "",
                  }
                }
                activities={activities}
                texts={t.details}
                onSaveNotes={handleSaveCustomerNotes}
                onAddActivity={handleAddActivity}
              />
              {isFormOpen && (
                <CustomerForm
                  texts={t.form}
                  onCustomerCreated={async () => {
                    await loadCustomers();
                    setIsFormOpen(false);
                  }}
                />
              )}
            </>
          )}

          {activeMenuItem === t.sidebarMenu[2] && (
            <ActivitiesPanel
              activities={allActivities}
              title={t.activitiesMenuTitle}
              emptyText={t.noActivities}
            />
          )}

          {activeMenuItem !== t.sidebarMenu[0] && activeMenuItem !== t.sidebarMenu[2] && (
            <section className="customers-panel">
              <div className="panel-header">
                <h3 className="panel-title">{t.comingSoon}</h3>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
