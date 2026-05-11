# 🏢 Employee & Leave Management System

A production-grade full-stack HR management system built with Java Spring Boot and React TypeScript.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Zustand |
| Backend | Java 17, Spring Boot 3, Spring Security |
| Database | PostgreSQL |
| Auth | JWT + BCrypt |
| Charts | Recharts |

## ✨ Features

- 🔐 JWT Authentication with BCrypt password encryption
- 👥 Employee management — Add, Delete, Search
- 📋 Leave management — Apply, Approve, Reject
- 📊 Dashboard with charts and analytics
- 📧 Email notifications for leave status
- 🛡️ Role-based access (Admin, Manager, Employee)
- 🌙 Modern dark UI

## 📦 Setup

### Backend
```bash
cd backend
# Set up PostgreSQL and update application.properties
# Run in IntelliJ or with Maven
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/login | Login |
| POST | /api/users/add | Register |
| GET | /api/users/all | All employees |
| POST | /api/leaves/apply | Apply leave |
| GET | /api/leaves/all | All leaves |
| PUT | /api/leaves/approve/:id | Approve leave |
| PUT | /api/leaves/reject/:id | Reject leave |

## 👩‍💻 Author
Poonam — Full Stack Developer