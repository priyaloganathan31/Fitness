# FC Smart Audit System — Technical & Implementation Documentation

## Executive Overview

The **FC Smart Audit System** is an enterprise-grade, mobile-first web application designed for automated, tamper-proof Fulfillment Center (FC) safety, operational, and inventory compliance auditing. It combines real-time geofencing verification, AI/Authenticity ranking, dynamic checklist templates, automated task notification emails, and Fitness Certificate issuance into a unified web portal.

---

## Technical Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Component-driven SPA architecture |
| **Build Tooling & HMR** | Vite 8 | Fast ESM bundler with hot module replacement |
| **Styling** | Modern Vanilla CSS | Glassmorphism, CSS variables, dark themes, responsive layout |
| **Iconography** | Lucide React | Modern vector icon set |
| **Visual Effects** | canvas-confetti | Celebration effects upon Fitness Certificate generation |
| **Static Code Analysis** | Oxlint | High-performance TypeScript and React linting |

---

## Core Components & Modules

### 1. Header Navigation & Mobile Simulator ([Navbar.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/Navbar.tsx))
- **Role:** Main navigation controller and global application controls.
- **Key Features:**
  - View switcher (Dashboard, Active Audit, Templates, Locations, Authenticity Scorecard, Email Demo).
  - Mobile Simulator Toggle button to test mobile layout frame directly on desktop.
  - Mobile view IP & server access helper guide.

### 2. Mobile Frame Container ([MobileFrameWrapper.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/MobileFrameWrapper.tsx))
- **Role:** Simulates an iOS/Android smartphone viewport on desktop displays.
- **Key Features:**
  - Device frame styling with status bar, home indicator, and dynamic viewport scaling.
  - Allows auditors and developers to preview exact mobile layout without leaving the desktop browser.

### 3. Audit Dashboard ([AuditDashboard.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/AuditDashboard.tsx))
- **Role:** High-level executive overview of all audit metrics across FC facilities.
- **Key Features:**
  - High-level KPIs: Total Audits, Pass Rate, Open Critical Findings, Average Audit Duration.
  - FC facility selector and status breakdown (Passed, Needs Attention, Failed).
  - Quick action launcher for starting new audits or reviewing certificates.

### 4. Active Audit Engine ([ActiveAuditSession.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/ActiveAuditSession.tsx))
- **Role:** Heart of the auditing workflow for on-ground auditors.
- **Key Features:**
  - Category-based checklist execution (Safety, Inventory, Equipment, Hygiene, Security).
  - Photo evidence requirement for failed or flagged items.
  - Severity weighting (Minor, Major, Critical) for score deduction.
  - Real-time score calculation and pass/fail indicator.
  - Fitness Certificate generation upon successful completion.

### 5. Geofencing Audit Gate ([GeoFenceAuditGate.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/GeoFenceAuditGate.tsx))
- **Role:** Security gate verifying that the auditor is physically inside the designated FC boundary before initiating an audit.
- **Key Features:**
  - Browser Geolocation API integration with latitude/longitude calculation.
  - Haversine distance formula calculation against FC location registry coordinates.
  - Proximity status indicator (In-Bounds vs. Out-of-Bounds with distance error in meters).

### 6. Authenticity Ranking Scorecard ([AuthenticityRankingScorecard.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/AuthenticityRankingScorecard.tsx))
- **Role:** Anti-fraud and trust verification engine evaluating audit validity.
- **Key Features:**
  - Computes an **Authenticity Score (0-100%)** based on:
    - GPS Geofence match rate.
    - Timestamp coherence (preventing rapid bulk check-offs).
    - Image EXIF metadata and photo evidence submission.
    - Auditor historical compliance rating.
  - Risk categorization: Low Risk (Green), Medium Risk (Yellow), High Risk / Flagged (Red).

### 7. Location Registry Manager ([LocationRegistryManager.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/LocationRegistryManager.tsx))
- **Role:** Facility setup and zone mapping registry.
- **Key Features:**
  - CRUD management for FC locations, zones (Aisle, Dock, Cold Storage, Mezzanine), and GPS coordinates.
  - Radius boundary settings (e.g. 150m radius around FC centroid).

### 8. Template Manager ([TemplateManager.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/TemplateManager.tsx))
- **Role:** Audit checklist template builder.
- **Key Features:**
  - Custom checklist question builder, section grouping, and severity assignment.
  - Version control for compliance templates (v1.0, v2.0).

### 9. Task Assignment & Email Notification Demo ([TaskAssignmentEmailDemo.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/TaskAssignmentEmailDemo.tsx))
- **Role:** Automated corrective action task dispatch system.
- **Key Features:**
  - Generates rich HTML email previews sent to Area Managers for failed audit items.
  - SLA tracking (e.g., 24-hour turnaround for critical safety violations).

### 10. FC Fitness Certificate Modal ([FitnessCertificateModal.tsx](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/components/FitnessCertificateModal.tsx))
- **Role:** Official digital certificate output for compliant FC facilities.
- **Key Features:**
  - Formal compliance badge, QR code verification mockup, score breakdown, and print/download ready layout.

---

## Data Models & Types ([src/types/audit.ts](file:///c:/Users/ELCOT/.gemini/antigravity-ide/scratch/fc-smart-audit-system/src/types/audit.ts))

- `AuditSession`: Represents an active or historical audit run (id, fcId, status, score, items, startTime, endTime, auditor).
- `AuditItem`: Individual checklist item (id, title, category, status: pass/fail/na, severity, notes, photoUrl).
- `FCLocation`: Facility registry object (id, code, name, latitude, longitude, geofenceRadiusMeters).
- `AuthenticityScore`: Trust metrics object (overallScore, geoMatch, timestampConsistency, photoMetadataScore, riskLevel).

---

## Mobile View & Local Network Testing Setup

To test the application on mobile phones or remote network devices:

1. **Find host IPv4 address:**
   ```bash
   ipconfig
   # Output: IPv4 Address . . . . . . . . . . . : 10.40.5.41
   ```
2. **Launch dev server with network interface binding:**
   ```bash
   npm run dev -- --host
   ```
3. **Access from mobile browser:**
   `http://10.40.5.41:5173`

---

## Verification & Build Commands

- **Start Development Server:** `npm run dev`
- **Lint Code:** `npm run lint`
- **Typecheck & Production Build:** `npm run build`
