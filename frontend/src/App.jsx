import "./App.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StatsGrid from "./components/StatsGrid";
import CustomersTable from "./components/CustomersTable";
import DetailsPanel from "./components/DetailsPanel";
import CustomerForm from "./components/CustomerForm";
import { useEffect, useMemo, useState } from "react";
import { getCustomers, updateCustomer } from "./services/customerService";

function App() {
  const [locale, setLocale] = useState("tr");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
        notes: "Notlar",
        save: "Notu Kaydet",
        saving: "Kaydediliyor...",
        noteSaved: "Not başarıyla güncellendi.",
        noteSaveError: "Not güncellenemedi.",
        typeCall: "Arama",
        typeVisit: "Ziyaret",
        typeNote: "Not",
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
      todosTitle: "Bugün Yapılacaklar",
      noTodos: "Bugün aranacak müşteri yok.",
      todayContacted: "Bugün iletişim kuruldu",
      daysNotContacted: "gündür aranmamış",
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
        notes: "Notes",
        save: "Save Note",
        saving: "Saving...",
        noteSaved: "Note updated successfully.",
        noteSaveError: "Note could not be updated.",
        typeCall: "Call",
        typeVisit: "Visit",
        typeNote: "Note",
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
      todosTitle: "Today Tasks",
      noTodos: "No customers to call today.",
      todayContacted: "Contacted today",
      daysNotContacted: "days without contact",
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
    }));

    setCustomers(mapped);
    if (!selectedCustomer && mapped.length > 0) {
      setSelectedCustomer(mapped[0]);
    }
  }

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activities = [
    { id: "1", type: "call", note: "Takip görüşmesi tamamlandı.", date: "26.05.2026" },
    { id: "2", type: "visit", note: "Ürün sunumu yapıldı.", date: "24.05.2026" },
    { id: "3", type: "note", note: "Fiyat listesi gönderilecek.", date: "20.05.2026" },
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const term = searchTerm.trim().toLowerCase();
      const matchedSearch =
        !term || c.name.toLowerCase().includes(term) || c.phone.toLowerCase().includes(term);
      const matchedStatus = statusFilter === "all" || c.status === statusFilter;
      return matchedSearch && matchedStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const todoCustomers = useMemo(() => {
    return customers
      .filter((c) => c.status !== "lost")
      .filter((c) => {
        if (!c.lastContactedAt) return true;
        const d = new Date(c.lastContactedAt);
        if (Number.isNaN(d.getTime())) return true;
        const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
        return days >= 3;
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
                onSelectCustomer={(customer) => setSelectedCustomer(customer)}
                texts={t.table}
              />

              <section className="customers-panel">
                <div className="panel-header">
                  <h3 className="panel-title">{t.todosTitle}</h3>
                </div>
                {todoCustomers.length === 0 ? (
                  <p>{t.noTodos}</p>
                ) : (
                  <ul className="todo-list">
                    {todoCustomers.map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong> - {c.lastContactText}
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

          {activeMenuItem !== t.sidebarMenu[0] && (
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
