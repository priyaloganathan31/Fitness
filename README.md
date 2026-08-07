# FC Smart Audit System

An enterprise-grade, mobile-friendly web application designed for automated, tamper-proof College & Fulfillment Center (FC) compliance, safety, and operational audits. The system features location geofencing, checklist template management, anti-fraud trust scoring, PDF certificate generation, and automated corrective task notifications.

---

## 🚀 Key Features

### 🏛️ Dual-Role Workspace
* **Admin Dashboard**: Manage facility zone registries, construct and version audit templates, assign audits to ground staff, review high-risk flags, and issue digital fitness credentials.
* **Auditor Portal**: Execute location-based audits, view assigned checklists, attach photo evidence for failures, and review audit history.

### 📍 GPS Geofencing Gate
* Automatically requests browser location to calculate the distance between the auditor and the facility centroid (using the Haversine formula).
* Prevents audits from starting if the auditor is physically out-of-bounds.

### 🛡️ Anti-Fraud & Authenticity Scorecard
* Computes an **Authenticity Score (0-100%)** evaluating verification factors:
  * GPS proximity matching.
  * Timestamp consistency (detecting rapid click-through/lazy check-offs).
  * Evidence submission rate.
  * Auditor historical trust rating.

### 📝 Template Engine & CSV Parser
* Build checklists from scratch or upload custom audit questionnaire spreadsheets directly through a CSV/Text parser.
* Category grouping (Safety, Equipment, Inventory, Hygiene, Security) with priority classifications (High, Medium, Low).

### 🎓 Fitness Certificates & Task Escapes
* **Smart Certificates**: Auto-generates a formal downloadable compliance badge with score breakdown, QR verification mockup, and celebratory canvas-confetti.
* **Corrective Actions**: Dynamically templates and builds visual email notifications that can be sent to Venue Incharges for critical violations.

---

## 🛠️ Technology Stack

* **Frontend Library**: [React 19](https://react.dev/)
* **Type System**: [TypeScript](https://www.typescriptlang.org/)
* **Build & Dev Tooling**: [Vite 8](https://vite.dev/)
* **Styling**: Premium Vanilla CSS (Glassmorphism, CSS Variables, dark theme accents, and custom micro-animations)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Linting**: [Oxlint](https://oxc.rs/)

---

## ⚙️ Setup & Running Locally

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your machine.

### 1. Clone the repository and navigate to the project directory:
```bash
cd "Audit Management System/Faculty_SourceCode"
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start the local development server:
```bash
npm run dev
```

The application will start running on [http://localhost:5173/](http://localhost:5173/).

### 4. Build the application for production:
```bash
npm run build
```

---

## 💾 Storage & Data Persistence

The app operates as a self-contained Frontend SPA:
* **Initial State**: Seeded with default mock venues (e.g., Campus Health & Medical Center, FM Radio Station 90.4 MHz) and audit records from `src/data/`.
* **Persistence**: All changes (templates created, audits submitted, assignments added) are persisted inside your web browser's **Local Storage (`localStorage`)**.
* Stopping the development server or restarting Vite does not erase your data. However, sharing the link with a colleague will load a fresh instance with default templates on their machine, as local storage is bound to individual browsers.
