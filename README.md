# 🏥 CareSync | Next-Gen Hospital Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

> A modern, full-stack hospital administration platform designed to eliminate data silos, automate inter-departmental communication, and provide real-time clinical workflows. 

CareSync unifies medical telemetry, pharmacy logistics, front-desk operations, and administrative oversight into a single, cohesive ecosystem utilizing strict Role-Based Access Control (RBAC).

---

## ✨ Core Features

* **📡 Live Telemetry & Vitals Tracking:** Dynamic charts plotting patient BPM, Blood Pressure, and SpO2 in real-time.
* **🔐 Role-Based Workspaces:** Dedicated, secure portals for Doctors, Patients, Admins, Pharmacists, and Receptionists.
* **💊 Centralized Pharmacy Ledger:** Database-driven medicine inventory with low-stock alerts and an interactive invoice builder.
* **🔄 Seamless Patient Transfers:** Instantly reassign patients to different specialists across the ward.
* **📝 Interactive Discharge Sequence:** Dual-authorization discharge flow requiring both physician approval and patient digital consent.
* **📊 Executive Analytics:** Live dashboard tracking total hospital revenue, active patient queues, and physician operational statuses.

---

## 🖥️ System Modules

| Module | Description |
| :--- | :--- |
| **Front Desk (Reception)** | Manages walk-in guest scheduling, doctor availability, and processes the intake queue to convert guests into registered patients. |
| **Doctor Console** | The clinical core. Allows physicians to manage their assigned ward, append telemetry readings, prescribe medications, and authorize patient discharges. |
| **Patient Portal** | A transparent medical ID dashboard where patients can view their diet plans, prescriptions, live vitals, and officially sign off on their discharge. |
| **Pharmacy Station** | An invoice builder that pulls from a central medicine database. Allows technicians to generate bills and toggle payment statuses on the ledger. |
| **Admin Dashboard** | The executive overview. Displays system-wide revenue, low-stock alerts, pending guest queues, and features an HR module to onboard new doctors. |

---

## 🚀 Installation & Setup

Follow these steps to deploy CareSync on your local machine.

### Prerequisites
* Node.js (v18+)
* Python (3.8+)
* MySQL Server (Running locally)

### 1. Database Configuration
1. Open your MySQL server (via Workbench or CLI) and create a fresh database:
   ```sql
   CREATE DATABASE healthcare_dashboard;
