# CRM App

Kuaför, emlakçı, danışman ve küçük ajanslar için FastAPI + React (Vite) tabanlı CRM projesi.

## Proje Yapısı

```
crm-app/
├── backend/     # FastAPI + SQLAlchemy + Alembic
└── frontend/    # Vite + React
```

## Backend Kurulum (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Backend `.env` Dosyası

`backend/.env` dosyasını oluşturup aşağıdaki değişkenleri tanımla:

- `APP_NAME=ClientHub API`
- `ENVIRONMENT=development`
- `DEBUG=false`
- `DATABASE_URL=sqlite:///./crm.db`
- `SECRET_KEY=replace-with-a-long-random-secret`
- `ACCESS_TOKEN_EXPIRE_MINUTES=480`
- `DEFAULT_ADMIN_EMAIL=admin@example.test`
- `DEFAULT_ADMIN_PASSWORD=replace-with-a-strong-password`
- `CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]`

### Geliştirme Sunucusunu Başlatma

```bash
uvicorn app.main:app --reload
```

Uygulama varsayılan olarak `http://localhost:8000` adresinde çalışır.  
Swagger UI: `http://localhost:8000/docs`

## Veritabanı Migrations (Alembic)

```bash
# Yeni bir migration oluştur (model değişikliklerini otomatik algılar)
alembic revision --autogenerate -m "migration açıklaması"

# Migration'ları uygula
alembic upgrade head

# Mevcut migration durumunu görüntüle
alembic current
```

Gerekirse güvenlik migration'larını uygulamak için doğrudan:

```bash
cd backend
alembic upgrade head
alembic current
```

## Frontend Kurulum (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Hızlı Başlangıç (2 Terminal)

### Terminal 1 - Backend

```bash
cd crm-app/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend

```bash
cd crm-app/frontend
npm install
npm run dev
```

## API Endpoints

| Method   | Endpoint                   | Açıklama                        |
| -------- | -------------------------- | ------------------------------- |
| `POST`   | `/customers/`              | Yeni müşteri oluştur            |
| `GET`    | `/customers/`              | Müşteri listesi (max 100 kayıt) |
| `GET`    | `/customers/{customer_id}` | Belirli bir müşteriyi getir     |
| `PUT`    | `/customers/{customer_id}` | Müşteri bilgilerini güncelle    |
| `DELETE` | `/customers/{customer_id}` | Müşteriyi sil                   |

> **Not:** `GET /customers/` endpoint'i `skip` ve `limit` (max: 100) query parametrelerini destekler.

## Validasyon Kuralları

| Alan        | Kural                                          |
| ----------- | ---------------------------------------------- |
| `full_name` | Zorunlu, minimum 3 karakter                    |
| `phone`     | Opsiyonel, `^\+?[0-9\s\-\(\)]{10,20}$` pattern |
| `email`     | Opsiyonel, geçerli e-posta formatı             |
| Update body | Boş body gönderilirse `400 Bad Request` döner  |
