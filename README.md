# Doctor Appointment Booking System

A full-stack web application for booking doctor appointments — built with Spring Boot, React, MySQL, JWT, and Razorpay.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Database | MySQL 8+ |
| Frontend | React 18, Vite, Tailwind CSS |
| Auth | JWT (jjwt 0.12.x) |
| Payment | Razorpay |
| Email | JavaMail (Gmail SMTP) |

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+
- Razorpay account (for payments)
- Gmail App Password (for emails)

---

## Setup

### 1. Database

```sql
CREATE DATABASE doctor_db;
```

### 2. Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

### 3. Run Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`

On first run, it automatically creates:
- Admin user: `admin@docapp.com` / `admin123`
- 12 specializations

### 4. Frontend Configuration

Edit `frontend/.env`:

```env
VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
```

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## User Roles & Default Credentials

| Role | Email | Password | Created by |
|------|-------|----------|-----------|
| Admin | admin@docapp.com | admin123 | Auto on startup |
| Doctor | (set by admin) | (set by admin) | Admin creates doctors |
| Patient | (self-register) | (self-set) | /register page |

---

## API Endpoints

### Auth (Public)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Patient registration |
| POST | `/api/auth/login` | Login (all roles) |

### Doctors (Public)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/doctors` | Search/list doctors |
| GET | `/api/doctors/{id}` | Doctor profile |
| GET | `/api/doctors/{id}/slots?date=YYYY-MM-DD` | Available slots |

### Appointments (Patient)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments/my` | My appointments |
| DELETE | `/api/appointments/{id}` | Cancel appointment |

### Doctor Dashboard (Doctor)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/doctor/profile` | Doctor profile |
| GET | `/api/doctor/appointments` | My appointments |
| PUT | `/api/doctor/appointments/{id}/status` | Update status |
| GET | `/api/doctor/slots` | My time slots |
| POST | `/api/doctor/slots` | Add slots |
| DELETE | `/api/doctor/slots/{id}` | Remove slot |

### Admin
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| CRUD | `/api/admin/doctors` | Manage doctors |
| GET | `/api/admin/appointments` | All appointments |
| CRUD | `/api/admin/specializations` | Manage specializations |

### Payments (Patient)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |

---

## Frontend Pages

| URL | Role | Page |
|-----|------|------|
| `/` | All | Home (hero + search) |
| `/login` | All | Login |
| `/register` | All | Patient Register |
| `/doctors` | All | Doctor Search/List |
| `/doctors/:id` | All | Doctor Profile + Booking |
| `/my-appointments` | Patient | Appointment History |
| `/doctor/dashboard` | Doctor | Doctor Dashboard |
| `/doctor/appointments` | Doctor | Manage Appointments |
| `/doctor/slots` | Doctor | Manage Time Slots |
| `/admin/dashboard` | Admin | Analytics Dashboard |
| `/admin/doctors` | Admin | CRUD Doctors |
| `/admin/appointments` | Admin | All Appointments |

---

## Project Structure

```
doctor-appointment-system/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/docapp/
│       ├── config/          # Security, CORS, Async, DataInitializer
│       ├── controller/      # Auth, Doctor, Appointment, DoctorDashboard, Admin, Payment
│       ├── model/           # User, Doctor, Specialization, TimeSlot, Appointment, Payment
│       ├── repository/      # JPA repositories
│       ├── service/         # Business logic
│       ├── dto/             # Request/Response DTOs
│       ├── security/        # JWT, UserPrincipal, AuthFilter
│       └── exception/       # Global exception handler
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── pages/           # auth/, patient/, doctor/, admin/
        ├── components/      # common/, patient/, doctor/, admin/
        ├── context/         # AuthContext
        ├── services/        # API service layer
        └── App.jsx          # Routes
```

---

## Key Features

- JWT authentication with role-based access (PATIENT / DOCTOR / ADMIN)
- Double-booking prevention using pessimistic DB locking
- Razorpay payment integration with HMAC signature verification
- Email notifications on booking/cancellation (async)
- Responsive UI (mobile + desktop) with Tailwind CSS
- Auto-seeded admin account and 12 specializations on first run
