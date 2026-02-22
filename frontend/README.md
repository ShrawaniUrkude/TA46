# 🏭 WareTrack - Smart Warehouse Management System

A comprehensive warehouse and inventory management system with real-time tracking, analytics, and specialized dashboards for different industries including hospitals.

## 🌟 Features

### 📦 Warehouse Management
- **Real-time Inventory Tracking** - Monitor stock levels across multiple zones
- **3D Warehouse Visualization** - Interactive warehouse floor plan
- **Zone Management** - Organize inventory by zones (A, B, C, D)
- **Pathfinding** - Optimal route guidance for workers

### 📊 Analytics Dashboard
- **Daily/Weekly/Monthly Reports** - Comprehensive analytics with time filtering
- **Carbon Footprint Tracking** - Environmental impact monitoring
- **Profit Analysis** - Revenue and cost breakdown by category
- **Worker Productivity** - Performance metrics and tracking

### 🏥 Hospital Dashboard
- **Medical Inventory Management** - Track medicines, supplies, and equipment
- **Equipment Map** - Real-time SVG visualization of medical equipment locations
- **Department Management** - Monitor bed occupancy and department stats
- **Supply Requests** - Track and manage supply requisitions

### ⚠️ Smart Alerts
- **Expiry Dashboard** - Track expiring products with priority suggestions
- **Stock Notifications** - Low stock and reorder alerts
- **Emergency Alerts** - Critical notifications for urgent situations

### 👷 Worker Management
- **Worker Authentication** - Secure login/signup with JWT
- **Role-based Access** - Worker, Supervisor, Admin roles
- **Shift Management** - Morning, Afternoon, Night shifts

### 🤖 AI Assistant
- **Natural Language Queries** - Ask questions about inventory
- **Smart Recommendations** - AI-powered suggestions

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks
- **Vite 7** - Fast build tool and dev server
- **CSS3** - Custom styling with modern CSS features
- **SVG Visualizations** - Interactive maps and charts

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 9** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
TA0046/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/          # Main dashboard components
│   │   │   ├── Warehouse/          # Warehouse visualization
│   │   │   ├── Analytics/          # Analytics charts
│   │   │   ├── HomePage/           # Landing page
│   │   │   ├── HospitalDashboard   # Medical inventory
│   │   │   ├── ExpiryDashboard     # Expiring products
│   │   │   ├── CarbonDashboard     # Environmental metrics
│   │   │   ├── WorkerAuth          # Authentication
│   │   │   ├── AIAssistant         # AI chat interface
│   │   │   └── ...
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── data/             # Static data files
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express Backend
│   ├── models/
│   │   ├── Asset.js          # Asset schema
│   │   ├── Warehouse.js      # Warehouse schema
│   │   └── Worker.js         # Worker schema with auth
│   ├── routes/
│   │   ├── assetRoutes.js    # Asset CRUD operations
│   │   ├── warehouseRoutes.js # Warehouse & inventory
│   │   ├── analyticsRoutes.js # Analytics endpoints
│   │   ├── hospitalRoutes.js  # Hospital inventory
│   │   └── authRoutes.js      # Authentication
│   ├── server.js             # Express server
│   ├── package.json
│   └── .env                  # Environment variables
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ShrawaniUrkude/TA46.git
cd TA46
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. **Start Backend Server**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

5. **Setup Frontend**
```bash
cd ../frontend
npm install
```

6. **Start Frontend Dev Server**
```bash
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new worker |
| POST | `/api/auth/login` | Login worker |
| GET | `/api/auth/me` | Get current user |

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| POST | `/api/assets` | Create asset |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |

### Warehouse
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/warehouse/inventory` | Get inventory |
| GET | `/api/warehouse/zones` | Get zones |
| GET | `/api/warehouse/expiry-alerts` | Expiring items |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/carbon` | Carbon footprint |
| GET | `/api/analytics/profit` | Profit analysis |

### Hospital
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospital/inventory` | Medical inventory |
| GET | `/api/hospital/departments` | Departments |
| POST | `/api/hospital/requests` | Supply request |

## 📸 Pages & Components

- **Home Page** - Landing page with features overview
- **Dashboard** - Main inventory dashboard with stats
- **Warehouse** - 3D warehouse visualization
- **Analytics** - Charts and reports
- **Hospital** - Medical inventory with equipment map
- **Expiry Dashboard** - Product expiration tracking
- **Carbon Dashboard** - Environmental metrics

## 🔐 Authentication

The system uses JWT-based authentication:
- Tokens expire in 7 days
- Passwords are hashed with bcryptjs
- Protected routes require `Authorization: Bearer <token>` header

## 👥 Team

- **WareTrack Team** - TA46

## 📄 License

ISC License

---

Made with ❤️ for Smart India Hackathon 2026
