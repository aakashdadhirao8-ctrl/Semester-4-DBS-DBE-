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

Follow these comprehensive steps to deploy the CareSync environment on your local machine.

### Prerequisites
* **Node.js** (v18.0 or higher)
* **Python** (v3.8 or higher)
* **MySQL Server** (Running locally on default port 3306)
* **Git**

### 1. Clone the Repository
Open your terminal and clone the project to your local machine:

    git clone https://github.com/yourusername/caresync.git
    cd caresync

### 2. Database Configuration (MySQL)
CareSync requires a relational database to manage hospital records. 

1. Open MySQL Workbench or your MySQL CLI and create a fresh database:

    CREATE DATABASE healthcare_dashboard;

2. Navigate to `backend/database.py` in your code editor.
3. Update the `SQLALCHEMY_DATABASE_URL` string to match your local MySQL root username and password. It should look like this:

    # Replace 'root' and 'password' with your actual MySQL credentials
    SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:password@localhost/healthcare_dashboard"

### 3. Backend Environment Setup (FastAPI)
It is highly recommended to use a Python virtual environment to prevent dependency conflicts.

    # Navigate to the backend directory
    cd backend

    # Create a virtual environment named 'venv'
    python -m venv venv

    # Activate the virtual environment
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate

    # Install all required Python packages
    pip install -r requirements.txt

**Seed the Database:** 
Inject the massive demo dataset (Doctors, Patients, Vitals, Inventory, Bills) by running the seeder script. This will automatically build your SQL tables and fill them with data:

    python seed.py

**Start the Backend Server:**

    python -m uvicorn main:app --reload

*The FastAPI backend is now actively listening for requests at `http://127.0.0.1:8000`.*

### 4. Frontend Environment Setup (React/Vite)
Leave the backend server running, open a **new terminal tab**, and set up the React client.

    # Navigate to the frontend directory
    cd src 

    # Install Node modules
    npm install

    # Start the Vite development server
    npm run dev

*The React application will launch in your browser at `http://localhost:5173`.*

### 5. Common Troubleshooting
* **Database Connection Refused:** Double-check that your MySQL server is currently running in the background and that your password in `database.py` is correct.
* **Port Conflicts:** If port 8000 or 5173 is already in use, you can specify a different port (e.g., `uvicorn main:app --port 8080`). If you do this, remember to update the `API_BASE_URL` in `src/api.js` to match the new port!

---

## 🔑 Demo Access Credentials

The database seeder automatically creates the following mock credentials for testing the Role-Based Access Control boundaries:

* **Receptionist Portal:** `reception123`
* **Physician Portal:** `1234` *(Select any doctor from the dropdown)*
* **Pharmacy Portal:** `pharmacy123`
* **Admin/Executive Portal:** `admin123`
* **Patient Portal:** Enter a valid Patient ID (e.g., `1`, `2`, `3`...)

---

## 🛠️ Tech Stack Breakdown
* **Frontend:** React.js, Vite, HTML5, CSS3
* **UI/UX Libraries:** Lucide-React (Iconography), Recharts (Live Data Visualization)
* **Backend:** Python, FastAPI, Uvicorn (ASGI Server)
* **Database:** MySQL, SQLAlchemy (Object-Relational Mapper)
* **API Integration:** Axios (Asynchronous HTTP Client)
