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

  const translations = {
    tr: {
      brandTitle: "ClientHub CRM",
      topbarTitle: "Müşteri Operasyon Paneli",
      newCustomer: "Yeni Müşteri",
      closeForm: "Formu Kapat",
      dashboardTitle: "Dashboard",
      stats: {
        total: "Müşteriler",
        new: "Yeni Kayıt",
        active: "Aktif",
        withPhone: "Telefonlu",
        live: "Canlı",
        last7Days: "7 gün",
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
        statusActive: "Aktif",
        statusNew: "Yeni",
        statusInactive: "Pasif",
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
        new: "New Records",
        active: "Active",
        withPhone: "With Phone",
        live: "Live",
        last7Days: "Last 7 days",
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
        statusActive: "Active",
        statusNew: "New",
        statusInactive: "Inactive",
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
      comingSoon: "Coming Soon",
    },
  };

  const t = translations[locale];

  function getStatus(createdAt) {
    if (!createdAt) return "active";
    const createdDate = new Date(createdAt);
    if (Number.isNaN(createdDate.getTime())) return "active";
    const ageInDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays <= 7 ? "new" : "active";
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US");
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
      status: getStatus(item.created_at),
      lastContact: formatDate(item.updated_at || item.created_at),
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
    {
      id: "1",
      type: "call",
      note: "Duyurulduğumuz yeni kampanyalar hakkında bilgi verildi.",
      date: "26.05.2026",
    },
    {
      id: "2",
      type: "visit",
      note: "Ürünlerimiz hakkında detaylı sunum yapıldı, katalog teslim edildi.",
      date: "24.05.2026",
    },
    {
      id: "3",
      type: "note",
      note: "Fiyat listesi talep edildi, en kısa sürede gönderilecek.",
      date: "20.05.2026",
    },
  ];

  const stats = useMemo(() => {
    const total = customers.length;
    const newCount = customers.filter((c) => c.status === "new").length;
    const activeCount = customers.filter((c) => c.status === "active").length;
    const withPhone = customers.filter((c) => c.phone && c.phone !== "-").length;

    return [
      { id: 1, label: t.stats.total, value: String(total), trend: t.stats.live, tone: "success" },
      { id: 2, label: t.stats.new, value: String(newCount), trend: t.stats.last7Days, tone: "warning" },
      { id: 3, label: t.stats.active, value: String(activeCount), trend: t.stats.totalHint, tone: "success" },
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
              <CustomersTable
                customers={customers}
                onSelectCustomer={(customer) => setSelectedCustomer(customer)}
                texts={t.table}
              />
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
