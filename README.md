# CampusX | Next-Gen University Placement & Recruitment Platform

A production-grade, full-stack **Campus Placement & Recruitment Platform** engineered for universities, corporate recruiters, placement officers, and students. Built with a clean layered architecture using **Java 21, Spring Boot 3, Spring Security 6 with JWT, PostgreSQL (Production) / H2 (Development), Hibernate 6, Bean Validation**, and a modern **React 18 + Vite + Tailwind CSS** frontend.

---

## 🌟 Key Capabilities & Features

### 1. 🎓 Student Portal
- **Profile Readiness & Portfolio**: Multi-tier student profile covering academic records (CGPA, Roll No, Branch, Passing Batch), education history, technical skills with proficiency levels (Beginner, Intermediate, Advanced, Expert), projects with GitHub/live URLs, internships, certifications, and PDF resume management.
- **Dynamic Real-Time Eligibility Engine**: Automatically checks student eligibility for any drive based on CGPA, allowed branches, graduation batch, and application deadlines. Instantly shows green **Eligible** badges or clear reasons for non-eligibility.
- **1-Click Application & Withdrawal**: Apply with a candidate statement of interest or withdraw applications before they are processed.
- **Visual Application Progression Tracker**: Interactive timeline tracking the candidate through each stage: `APPLIED` → `SHORTLISTED` → `INTERVIEW_SCHEDULED` → `SELECTED` → `OFFERED`.
- **Interview Hub**: View upcoming technical and HR rounds, interviewer notes, duration, and direct **Google Meet / Microsoft Teams** virtual meeting links.
- **Offer Management**: Review formal employment offers with full CTC package breakdown, expected joining dates, and one-click acceptance or decline. Accepting an offer automatically updates student status to **Placed**.
- **In-App Notification Center**: Instant alerts for interview calls, status updates, and new drive announcements with mark-as-read controls.

### 2. 💼 Recruiter Portal
- **Corporate Branding**: Manage company bio, careers website, location, logo, and verified campus recruiter credentials.
- **Placement Drive Creation**: Launch new hiring campaigns with custom CTC packages, job roles, detailed descriptions, and strict eligibility thresholds (Min CGPA, branch checkboxes, graduation year, application deadlines).
- **Comprehensive Candidate Roster**: Search, filter, and inspect applicants across all active drives. Filter by branch, CGPA, and application stage.
- **Student Dossier Modal**: One-click preview of complete candidate profiles, verified skills, portfolio projects, experience, and direct PDF resumes.
- **Interview Scheduling & Feedback**: Schedule multiple interview rounds with date/time, interviewer assignments, and meeting URLs; record candidate feedback.
- **Official Job Offer Generation**: Extend employment packages with designation, CTC, joining date, and offer letter URLs.

### 3. 🏛️ Placement Officer Portal
- **Institutional Placement Dashboard**: Real-time university KPIs including overall placement rate %, average package, highest package, total partner companies, and active drives.
- **Department-Wise Performance**: Visual progress bars monitoring placement ratios across branches (CSE, IT, ECE, EE, MECH, CIVIL).
- **Recruiter Governance**: Review and verify newly registered employers and companies before approving campus drives.
- **Drive Approval System**: Inspect recruiter compensation packages and job requirements, approving drives before publishing to students.
- **Printable NAAC/NIRF Placement Statements**: Formatted institutional audit report ready to print or archive.

### 4. ⚙️ Admin Portal
- **User Account Governance**: Search and manage all accounts across all 4 roles; toggle active/deactivated status; reassign roles.
- **Security & Activity Audit Trail**: Comprehensive, immutable chronological audit log tracking user authentication, entity mutations, IP addresses, and timestamps.
- **Platform Health Monitoring**: System status and active session counts.

---

## 🚀 Pre-Seeded Demo Accounts (1-Click Login Ready)

The application includes an instant **Quick Demo Role Switcher** in the top navigation bar and on the login page:

| Role | Demo Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `student.arjun@campusx.edu` | `Student@123` | Arjun Sharma • CSE, CGPA 8.85 • Top performer with scheduled Google interview & applications |
| **🎓 Student (Ineligible Demo)** | `student.rohit@campusx.edu` | `Student@123` | Rohit Verma • MECH, CGPA 6.80 • Demonstrates real-time eligibility rejection on high CGPA drives |
| **🎓 Student (Placed Demo)** | `student.priya@campusx.edu` | `Student@123` | Priya Patel • ECE, CGPA 7.90 • Accepted 28.5 LPA Microsoft Cloud Offer |
| **💼 Recruiter** | `recruiter.google@campusx.edu` | `Recruiter@123` | Sarah Jenkins • Google University Talent Lead |
| **💼 Recruiter 2** | `recruiter.microsoft@campusx.edu` | `Recruiter@123` | Vikram Malhotra • Microsoft Senior Technical Recruiter |
| **🏛️ Placement Officer** | `officer@campusx.edu` | `Officer@123` | Dr. Rajesh Nambiar • Head of Placement & Training |
| **⚙️ Admin** | `admin@campusx.edu` | `Admin@123` | Campus Administrator • Superuser with audit log access |

---

## 🛠️ Architecture & Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.3.3
- **Security**: Spring Security 6 with stateless JWT authentication (`io.jsonwebtoken:jjwt-api:0.12.6`) and BCrypt password hashing
- **Persistence**: Spring Data JPA & Hibernate 6.5
- **Databases**:
  - **Local Development Mode (`dev`)**: Embedded H2 database in PostgreSQL compatibility mode with zero setup required.
  - **Production Mode (`prod`)**: Live PostgreSQL database configured dynamically via environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Min`, `@NotNull`)
- **API Design**: Standardized envelope pattern (`ApiResponse<T>`) with `@RestControllerAdvice` global exception handler

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom glassmorphism design system, dark-mode slate theme, and glow accents
- **Routing**: React Router v6 with `ProtectedRoute` role guarding
- **Icons**: Lucide React
- **HTTP Client**: Axios with request/response JWT interceptors and auto 401 handling

---

## ⚙️ Environment Variables Reference

### Backend Environment Variables

| Variable | Required in Prod | Default (Dev) | Description |
| :--- | :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Yes | `dev` | Application profile: `dev` for in-memory H2, `prod` for PostgreSQL. |
| `PORT` | Auto on Render | `8080` | Port on which the Spring Boot server listens. |
| `DB_URL` | Yes (in `prod`) | N/A | PostgreSQL JDBC connection URL (e.g. `jdbc:postgresql://<host>:<port>/<dbname>`). |
| `DB_USERNAME` | Yes (in `prod`) | N/A | PostgreSQL database username. |
| `DB_PASSWORD` | Yes (in `prod`) | N/A | PostgreSQL database password. |
| `JWT_SECRET` | Recommended | Built-in Dev Secret | 256-bit or 512-bit secure secret key for signing authentication tokens. |
| `JWT_EXPIRATION_MS` | No | `86400000` (24 hours) | JWT token lifespan in milliseconds. |
| `CORS_ALLOWED_ORIGINS` | Recommended | `*` | Comma-separated list of allowed frontend origins (e.g. `https://campusx-frontend.onrender.com,http://localhost:5173`). |

### Frontend Environment Variables

| Variable | Required in Prod | Default (Dev) | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Yes (in `prod`) | `/api` | Base URL for API requests (e.g. `https://campusx-backend.onrender.com/api`). In local development, defaults to `/api` which is proxied by Vite. |

---

## 🏃 Local Development Setup

### Prerequisites
- Java 21 installed (`java -version`)
- Maven 3.9+ installed (`mvn -version`)
- Node.js 18+ and npm installed (`node -v`, `npm -v`)

### Option A: Quick Start with In-Memory Database (Zero Config)

1. **Start Backend (Dev Profile - H2)**:
   ```bash
   cd backend
   mvn clean package -DskipTests
   java -jar target/campusx-backend-1.0.0.jar
   ```
   *The backend starts at `http://localhost:8080/` and automatically seeds demo data.*
   *(H2 Console available at `http://localhost:8080/h2-console`)*

2. **Start Frontend (Vite Dev Server)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend starts at `http://localhost:5173/` and proxies all `/api` requests to Spring Boot.*

### Option B: Local Development with PostgreSQL

1. **Ensure PostgreSQL is running locally** and create the database:
   ```sql
   CREATE DATABASE campusx_db;
   ```

2. **Run Backend with `prod` or `postgres` profile**:
   ```bash
   cd backend
   mvn clean package -DskipTests
   java -Dspring.profiles.active=prod -DDB_URL=jdbc:postgresql://localhost:5432/campusx_db -DDB_USERNAME=postgres -DDB_PASSWORD=your_password -jar target/campusx-backend-1.0.0.jar
   ```

---

## ☁️ Production Deployment on Render

You can deploy the complete platform on [Render](https://render.com) using either **1-Click Blueprint (`render.yaml`)** or **Manual Service Setup**.

### Method 1: 1-Click Render Blueprint (`render.yaml`)

1. Fork or push this repository to GitHub.
2. Go to **Render Dashboard** -> **Blueprints** -> **New Blueprint Instance**.
3. Connect your repository. Render will automatically detect `render.yaml` and configure:
   - **PostgreSQL Database** (`campusx-postgres`)
   - **Backend Web Service** (`campusx-backend`)
   - **Frontend Static Site** (`campusx-frontend`)
4. Click **Apply** to deploy all components automatically!

---

### Method 2: Manual Step-by-Step Deployment on Render

#### Step 1: Create PostgreSQL Database on Render
1. Go to **Render Dashboard** -> **New +** -> **PostgreSQL**.
2. Set Name: `campusx-postgres`
3. Set Database: `campusx_db`
4. Set User: `campusx`
5. Select the **Free** instance type.
6. Click **Create Database**.
7. Once provisioned, note the:
   - **Internal Database URL** (e.g. `postgres://campusx:password@dpg-xxxx-a:5432/campusx_db`)
   - **User**: `campusx`
   - **Password**: `<generated-password>`
   - **Host / Database Name**

> **Note on JDBC URL Format**: Spring Boot JDBC requires the `jdbc:postgresql://` prefix. For example:
> `jdbc:postgresql://dpg-xxxx-a:5432/campusx_db` (or with external host `jdbc:postgresql://dpg-xxxx-a.oregon-postgres.render.com:5432/campusx_db?sslmode=require`)

#### Step 2: Deploy Backend Web Service on Render
1. Go to **Render Dashboard** -> **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `campusx-backend`
   - **Language / Runtime**: `Java` (or `Docker`)
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/campusx-backend-1.0.0.jar`
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `DB_URL` | `jdbc:postgresql://<render-db-host>:5432/campusx_db` |
   | `DB_USERNAME` | `campusx` |
   | `DB_PASSWORD` | `<your-render-db-password>` |
   | `JWT_SECRET` | `<generate-a-random-32+-character-secret>` |
   | `CORS_ALLOWED_ORIGINS` | `*` (or your frontend Render URL once created) |
5. Click **Create Web Service**. Your backend will deploy at `https://campusx-backend.onrender.com`.

#### Step 3: Deploy Frontend Static Site on Render
1. Go to **Render Dashboard** -> **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the site:
   - **Name**: `campusx-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://campusx-backend.onrender.com/api` |
5. Add **Redirects / Rewrites** (under Static Site Settings):
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**. Your frontend will deploy at `https://campusx-frontend.onrender.com`.

---

## 📡 REST API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate with email & password, returns JWT token and user profile
- `POST /api/auth/register`: Register new student or recruiter account
- `GET /api/auth/me`: Fetch current authenticated user claims

### Placement Drives (`/api`)
- `GET /api/drives`: List all placement drives with real-time eligibility evaluation for current student
- `GET /api/drives/{id}`: Single drive details with eligibility checklist
- `POST /api/recruiter/drives`: Create new placement drive (Recruiter only)
- `PUT /api/recruiter/drives/{id}`: Update placement drive criteria
- `PATCH /api/officer/drives/{id}/status`: Approve or close drive (Placement Officer only)

### Applications (`/api`)
- `POST /api/student/applications`: Submit application (enforces eligibility validation)
- `PATCH /api/student/applications/{id}/withdraw`: Withdraw pending application
- `GET /api/student/applications`: Get current student's application history with stage progression
- `GET /api/recruiter/applications`: Recruiter view all applicants across company drives
- `PATCH /api/recruiter/applications/{id}/status`: Update candidate stage (`SHORTLISTED`, `REJECTED`, `SELECTED`)

### Interviews (`/api`)
- `POST /api/recruiter/interviews`: Schedule interview round with Google Meet link & notify candidate
- `GET /api/student/interviews`: List student interview rounds
- `GET /api/recruiter/interviews`: List recruiter company interviews
- `PATCH /api/interviews/{id}`: Record interviewer feedback & mark round completed

### Job Offers (`/api`)
- `POST /api/recruiter/offers`: Issue official offer letter with CTC package
- `GET /api/student/offers`: View extended offers
- `PATCH /api/student/offers/{id}/respond`: Accept (marks student placed) or decline offer

### Placement Officer & Admin (`/api`)
- `GET /api/officer/dashboard`: Institutional placement statistics, branch-wise metrics, top recruiters
- `GET /api/officer/students`: Directory of all students with placement statuses
- `GET /api/officer/companies`: Corporate partners directory
- `PATCH /api/officer/companies/{id}/verify`: Verify or revoke employer verification
- `GET /api/admin/dashboard`: System-wide metrics and user role breakdown
- `GET /api/admin/users`: User management
- `PATCH /api/admin/users/{id}/status`: Activate or deactivate account
- `GET /api/admin/audit-logs`: Chronological security and data mutation audit trail
