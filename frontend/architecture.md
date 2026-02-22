# 🏗️ WareTrack Architecture

## Overview
WareTrack is a full-stack warehouse management system with modular frontend and backend, real-time analytics, and industry-specific dashboards (hospital, warehouse, etc).

---

## 📦 Folder Structure

```
TA0046/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # UI components (Dashboard, Analytics, Hospital, etc)
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── data/             # Static data
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express API
│   ├── models/               # Mongoose schemas (Asset, Worker, Warehouse)
│   ├── routes/               # API endpoints (auth, assets, warehouse, analytics, hospital)
│   ├── server.js             # Express server
│   ├── package.json
│   └── .env                  # Environment variables
└── README.md
```

---

## 🖥️ Frontend Architecture

- **React 19** SPA (Single Page Application)
- **Component-based**: Each feature (Dashboard, Analytics, Hospital, Expiry, Carbon, WorkerAuth, AIAssistant) is a modular component
- **State Management**: React hooks, local state, and context for authentication
- **API Layer**: `/src/services/api.js` centralizes backend calls
- **Routing**: Page navigation via state (can be extended with React Router)
- **SVG Visualization**: Real-time equipment map and analytics charts

---

## 🗄️ Backend Architecture

- **Express 5** REST API
- **MongoDB Atlas** for persistent storage
- **Mongoose Models**: Asset, Worker, Warehouse
- **JWT Authentication**: Secure login/signup, role-based access
- **Password Hashing**: bcryptjs for secure storage
- **Modular Routes**: `/routes/` folder for each domain (auth, assets, warehouse, analytics, hospital)
- **Environment Config**: `.env` for secrets and DB connection

---

## 🔗 API Flow

1. **Frontend** sends requests via `fetch` or API service
2. **Backend** receives, authenticates, and processes requests
3. **MongoDB** stores/retrieves data
4. **Frontend** updates UI with real-time data

---

## 🏥 Hospital Dashboard Example

- **Equipment Map**: SVG visualization, markers mapped to room coordinates
- **Inventory**: Medical supplies, expiry tracking
- **Departments**: Bed occupancy, stats
- **Supply Requests**: CRUD operations via API

---

## 📊 Analytics Example

- **Dashboard**: Time-filtered stats (daily/weekly/monthly)
- **Carbon Dashboard**: Environmental metrics
- **Profit Analysis**: Revenue/cost breakdown

---

## 🔐 Authentication Flow

- **Signup/Login**: `/api/auth/signup`, `/api/auth/login`
- **JWT Token**: Stored in localStorage, sent in Authorization header
- **Protected Routes**: Backend verifies token, returns user data

---

## 🛠️ Extensibility

- Add new dashboards/components in `frontend/src/components/`
- Add new API endpoints in `backend/routes/`
- Add new data models in `backend/models/`

---

## 📝 Diagram

```
[User]
   |
   |  (React SPA)
   v
[Frontend Components] <----> [API Service Layer]
   |
   |  (HTTP Requests)
   v
[Express Backend Routes] <----> [Mongoose Models]
   |
   |  (MongoDB Atlas)
   v
[Database]
```

---

## 👥 Team & License
- WareTrack Team (TA46)
- ISC License

---

Made with ❤️ for Smart India Hackathon 2026
