import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ActivitiesPanel from "./components/ActivitiesPanel";
import CustomerForm from "./components/CustomerForm";
import CustomersTable from "./components/CustomersTable";
import DetailsPanel from "./components/DetailsPanel";
import LoginForm from "./components/LoginForm";
import Sidebar from "./components/Sidebar";
import StatsGrid from "./components/StatsGrid";
import TopBar from "./components/TopBar";
import {
  createActivity,
  deleteActivity,
  getActivities,
  getCustomerActivities,
} from "./services/activityService";
import {
  clearSession,
  fetchCurrentUser,
  getStoredSession,
  login,
} from "./services/authService";
import {
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "./services/customerService";

function App() {
  const [locale, setLocale] = useState("tr");
  const [session, setSession] = useState(() => getStoredSession());
  const [currentUser, setCurrentUser] = useState(() => getStoredSession()?.user || null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [allActivities, setAllActivities] = useState([]);
  const [selectedCustomerActivities, setSelectedCustomerActivities] = useState([]);
  const [undoAction, setUndoAction] = useState(null);
  const [bootError, setBootError] = useState("");

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
        quickActions: "Hızlı Aksiyonlar",
        quickCalled: "Arandı",
        quickMessaged: "Mesaj Gönderildi",
        quickBooked: "Randevu Alındı",
        oneClickAppointment: "Tek Tık Randevu",
        saveAppointment: "Randevuyu Kaydet",
        undoPrompt: "Hızlı aksiyon kaydedildi.",
        undo: "Geri Al",
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
      auth: {
        kicker: "Güvenli erişim",
        title: "ClientHub CRM",
        copy: "Müşteri verilerine erişmek için oturum açın.",
        email: "E-posta",
        password: "Şifre",
        emailPlaceholder: "owner@clienthub.local",
        passwordPlaceholder: "Şifreniz",
        submit: "Giriş Yap",
        loading: "Giriş yapılıyor...",
        error: "Giriş başarısız",
        logout: "Çıkış",
      },
      todayAppointmentsTitle: "Bugün Randevusu Olanlar",
      noTodayAppointments: "Bugün randevu görünmüyor.",
      winbackTitle: "Geri Kazanılacak Müşteriler",
      noWinback: "30+ gün gelmeyen müşteri yok.",
      atRisk: "Kaybedilmek Üzere",
      activitiesMenuTitle: "Aktiviteler",
      noActivities: "Henüz aktivite yok.",
      reportsTitle: "Rapor Özeti",
      reportTotalActivities: "Toplam Aktivite",
      reportTodayAppointments: "Bugünkü Randevular",
      reportWinback: "Geri Kazanılacak",
      reportLostRate: "Kaybedilen Oranı",
      segmentTitle: "Akıllı Segmentasyon",
      segmentRed: "30+ Gün Gelmeyenler",
      segmentYellow: "7-30 Gün Arası",
      segmentGreen: "Aktif Müşteriler",
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
        quickActions: "Quick Actions",
        quickCalled: "Called",
        quickMessaged: "Message Sent",
        quickBooked: "Appointment Booked",
        oneClickAppointment: "One-Click Appointment",
        saveAppointment: "Save Appointment",
        undoPrompt: "Quick action saved.",
        undo: "Undo",
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
      auth: {
        kicker: "Secure access",
        title: "ClientHub CRM",
        copy: "Sign in before accessing customer data.",
        email: "Email",
        password: "Password",
        emailPlaceholder: "owner@clienthub.local",
        passwordPlaceholder: "Your password",
        submit: "Sign In",
        loading: "Signing in...",
        error: "Sign in failed",
        logout: "Logout",
      },
      todayAppointmentsTitle: "Today Appointments",
      noTodayAppointments: "No appointment for today.",
      winbackTitle: "Win-Back Customers",
      noWinback: "No customer absent for 30+ days.",
      atRisk: "At Risk",
      activitiesMenuTitle: "Activities",
      noActivities: "No activity yet.",
      reportsTitle: "Reports Summary",
      reportTotalActivities: "Total Activities",
      reportTodayAppointments: "Today Appointments",
      reportWinback: "Win-Back Pool",
      reportLostRate: "Lost Rate",
      segmentTitle: "Smart Segmentation",
      segmentRed: "30+ Days Absent",
      segmentYellow: "7-30 Days",
      segmentGreen: "Active Customers",
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

  function mapCustomerSummary(item) {
    return {
      id: item.id,
      name: item.full_name,
      businessType: item.business_type || "-",
      phone: item.phone || "-",
      city: item.city || "-",
      status: item.status || "lead",
      lastContactedAt: item.last_contacted_at,
      lastContactText: formatDaysWithoutContact(item.last_contacted_at),
      lastContact: formatDaysWithoutContact(item.last_contacted_at),
      lastVisitDateRaw: item.last_visit_date,
      nextAppointmentDateRaw: item.next_appointment_date,
      lastVisitDate: formatDateTime(item.last_visit_date),
      nextAppointmentDate: formatDateTime(item.next_appointment_date),
      serviceType: item.service_type || "-",
    };
  }

  function mapCustomerDetail(item) {
    return {
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
    };
  }

  async function loadAllActivities() {
    const data = await getActivities();
    setAllActivities(data.map(mapActivity));
  }

  async function loadActivitiesForCustomer(customerId) {
    const data = await getCustomerActivities(customerId);
    setSelectedCustomerActivities(data.map(mapActivity));
  }

  async function loadCustomerDetail(customerId) {
    const data = await getCustomerById(customerId);
    const mapped = mapCustomerDetail(data);
    setSelectedCustomer(mapped);
    return mapped;
  }

  async function loadCustomers() {
    const data = await getCustomers();
    const mapped = data.map(mapCustomerSummary);

    setCustomers(mapped);
    if (!selectedCustomer && mapped.length > 0) {
      await loadCustomerDetail(mapped[0].id);
      await loadActivitiesForCustomer(mapped[0].id);
      return;
    }

    if (selectedCustomer?.id) {
      const stillExists = mapped.some((customer) => customer.id === selectedCustomer.id);
      if (stillExists) {
        await loadCustomerDetail(selectedCustomer.id);
      } else {
        setSelectedCustomer(null);
        setSelectedCustomerActivities([]);
      }
    }
  }

  useEffect(() => {
    async function bootstrapApp() {
      if (!session?.access_token) return;

      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
        await loadCustomers();
        await loadAllActivities();
        setBootError("");
      } catch (error) {
        clearSession();
        setSession(null);
        setCurrentUser(null);
        setCustomers([]);
        setSelectedCustomer(null);
        setAllActivities([]);
        setSelectedCustomerActivities([]);
        setBootError(error.message || "Oturum doğrulanamadı");
      }
    }

    bootstrapApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const term = searchTerm.trim().toLowerCase();
      const matchedSearch =
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term);
      const matchedStatus = statusFilter === "all" || customer.status === statusFilter;
      return matchedSearch && matchedStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const winbackCustomers = useMemo(() => {
    return customers
      .filter((customer) => customer.status !== "lost")
      .filter((customer) => {
        const days = getDaysSince(customer.lastVisitDateRaw);
        if (days === null) return true;
        return days >= 30;
      })
      .slice(0, 5);
  }, [customers]);

  const todayAppointments = useMemo(() => {
    const now = new Date();
    return customers
      .filter((customer) => customer.nextAppointmentDateRaw)
      .filter((customer) => {
        const date = new Date(customer.nextAppointmentDateRaw);
        if (Number.isNaN(date.getTime())) return false;
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      })
      .slice(0, 5);
  }, [customers]);

  const stats = useMemo(() => {
    const total = customers.length;
    const leadCount = customers.filter((customer) => customer.status === "lead").length;
    const customerCount = customers.filter((customer) => customer.status === "customer").length;
    const withPhone = customers.filter((customer) => customer.phone && customer.phone !== "-").length;

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
    await loadCustomerDetail(customerId);
  }

  async function handleSelectCustomer(customer) {
    if (!customer?.id) return;
    await loadCustomerDetail(customer.id);
    await loadActivitiesForCustomer(customer.id);
    setActiveMenuItem(t.sidebarMenu[2]);
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

  async function handleQuickAction(customerId, actionKey) {
    const now = new Date().toISOString();
    const currentCustomer = customers.find((customer) => customer.id === customerId);
    const previousLastContactedAt = currentCustomer?.lastContactedAt || null;
    const actionMap = {
      called: { type: "call", note: locale === "tr" ? "Müşteri arandı." : "Customer was called." },
      messaged: { type: "message", note: locale === "tr" ? "Müşteriye mesaj gönderildi." : "Message sent to customer." },
      booked: { type: "appointment", note: locale === "tr" ? "Randevu alındı." : "Appointment booked." },
    };
    const action = actionMap[actionKey];
    if (!action) return;

    const created = await createActivity({
      customerId,
      type: action.type,
      note: action.note,
      activityDate: now,
    });
    await updateCustomer(customerId, { lastContactedAt: now });
    setUndoAction({
      customerId,
      activityId: created.id,
      previousLastContactedAt,
    });
    await loadCustomers();
    await loadCustomerDetail(customerId);
    await loadActivitiesForCustomer(customerId);
    await loadAllActivities();
  }

  async function handleUndoQuickAction() {
    if (!undoAction) return;

    await deleteActivity(undoAction.activityId);
    await updateCustomer(undoAction.customerId, {
      lastContactedAt: undoAction.previousLastContactedAt,
    });
    await loadCustomers();
    await loadCustomerDetail(undoAction.customerId);
    await loadActivitiesForCustomer(undoAction.customerId);
    await loadAllActivities();
    setUndoAction(null);
  }

  async function handleQuickAppointment(customerId, appointmentDate) {
    await updateCustomer(customerId, {
      nextAppointmentDate: appointmentDate,
      lastContactedAt: new Date().toISOString(),
    });
    await createActivity({
      customerId,
      type: "appointment",
      note: locale === "tr" ? "Randevu tarihi oluşturuldu." : "Appointment date created.",
      activityDate: appointmentDate,
    });
    await loadCustomers();
    await loadCustomerDetail(customerId);
    await loadActivitiesForCustomer(customerId);
    await loadAllActivities();
  }

  async function handleLogin(email, password) {
    const nextSession = await login(email, password);
    setSession(nextSession);
    setCurrentUser(nextSession.user);
    setBootError("");
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setCurrentUser(null);
    setCustomers([]);
    setSelectedCustomer(null);
    setAllActivities([]);
    setSelectedCustomerActivities([]);
    setUndoAction(null);
    setIsFormOpen(false);
  }

  const lostRate = useMemo(() => {
    if (customers.length === 0) return "0%";
    const lost = customers.filter((customer) => customer.status === "lost").length;
    return `${Math.round((lost / customers.length) * 100)}%`;
  }, [customers]);

  const segmentSummary = useMemo(() => {
    const red = customers.filter((customer) => {
      const days = getDaysSince(customer.lastVisitDateRaw);
      return days === null || days >= 30;
    }).length;
    const yellow = customers.filter((customer) => {
      const days = getDaysSince(customer.lastVisitDateRaw);
      return days !== null && days >= 7 && days < 30;
    }).length;
    const green = customers.filter((customer) => {
      const days = getDaysSince(customer.lastVisitDateRaw);
      return days !== null && days < 7;
    }).length;
    return { red, yellow, green };
  }, [customers]);

  if (!session?.access_token) {
    return <LoginForm texts={t.auth} onLogin={handleLogin} />;
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
          currentUserEmail={currentUser?.email || session.user?.email || "-"}
          logoutLabel={t.auth.logout}
          onLogout={handleLogout}
        />
        <main className="content">
          {bootError ? (
            <section className="customers-panel">
              <p className="form-error">{bootError}</p>
            </section>
          ) : null}
          <h2 className="page-title">{activeMenuItem}</h2>

          {activeMenuItem === t.sidebarMenu[0] && (
            <>
              <StatsGrid stats={stats} />

              <section className="customers-panel">
                <div className="panel-header">
                  <h3 className="panel-title">{t.todayAppointmentsTitle}</h3>
                </div>
                {todayAppointments.length === 0 ? (
                  <p>{t.noTodayAppointments}</p>
                ) : (
                  <ul className="todo-list">
                    {todayAppointments.map((customer) => (
                      <li key={customer.id}>
                        <strong>{customer.name}</strong> - {customer.nextAppointmentDate}
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
                    {winbackCustomers.map((customer) => (
                      <li key={customer.id}>
                        <strong>{customer.name}</strong> - {getDaysSince(customer.lastVisitDateRaw) ?? 30} {t.daysNotVisited}
                        <span className="risk-chip">{t.atRisk}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="customers-panel">
                <div className="panel-header">
                  <h3 className="panel-title">{t.segmentTitle}</h3>
                </div>
                <div className="segment-grid">
                  <article className="segment-card segment-red">
                    <strong>{t.segmentRed}</strong>
                    <span>{segmentSummary.red}</span>
                  </article>
                  <article className="segment-card segment-yellow">
                    <strong>{t.segmentYellow}</strong>
                    <span>{segmentSummary.yellow}</span>
                  </article>
                  <article className="segment-card segment-green">
                    <strong>{t.segmentGreen}</strong>
                    <span>{segmentSummary.green}</span>
                  </article>
                </div>
              </section>
            </>
          )}

          {activeMenuItem === t.sidebarMenu[1] && (
            <>
              <section className="customers-panel filters-panel">
                <input
                  className="filter-input"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t.filters.searchPlaceholder}
                />
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
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

              {isFormOpen ? (
                <CustomerForm
                  texts={t.form}
                  onCustomerCreated={async () => {
                    await loadCustomers();
                    setIsFormOpen(false);
                  }}
                />
              ) : null}
            </>
          )}

          {activeMenuItem === t.sidebarMenu[2] && (
            <>
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
                    lastVisitDate: "-",
                    nextAppointmentDate: "-",
                    serviceType: "-",
                  }
                }
                activities={selectedCustomerActivities}
                texts={t.details}
                onSaveNotes={handleSaveCustomerNotes}
                onAddActivity={handleAddActivity}
                onQuickAction={handleQuickAction}
                onQuickAppointment={handleQuickAppointment}
                undoAction={undoAction}
                onUndoQuickAction={handleUndoQuickAction}
              />
              <ActivitiesPanel
                activities={allActivities}
                title={t.activitiesMenuTitle}
                emptyText={t.noActivities}
              />
            </>
          )}

          {activeMenuItem === t.sidebarMenu[3] && (
            <section className="customers-panel">
              <div className="panel-header">
                <h3 className="panel-title">{t.reportsTitle}</h3>
              </div>
              <div className="cards-grid">
                <article className="stat-card">
                  <p className="stat-card-title">{t.reportTotalActivities}</p>
                  <p className="stat-card-value">{allActivities.length}</p>
                </article>
                <article className="stat-card">
                  <p className="stat-card-title">{t.reportTodayAppointments}</p>
                  <p className="stat-card-value">{todayAppointments.length}</p>
                </article>
                <article className="stat-card">
                  <p className="stat-card-title">{t.reportWinback}</p>
                  <p className="stat-card-value">{winbackCustomers.length}</p>
                </article>
                <article className="stat-card">
                  <p className="stat-card-title">{t.reportLostRate}</p>
                  <p className="stat-card-value">{lostRate}</p>
                </article>
              </div>
            </section>
          )}

          {activeMenuItem !== t.sidebarMenu[0] &&
            activeMenuItem !== t.sidebarMenu[1] &&
            activeMenuItem !== t.sidebarMenu[2] &&
            activeMenuItem !== t.sidebarMenu[3] && (
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
