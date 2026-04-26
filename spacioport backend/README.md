# SpacioPort Backend — Node.js + Express + MongoDB (Local)

All data is stored **locally on your PC** in MongoDB. No cloud servers involved.

---

## 📋 Prerequisites

1. **Node.js** (v18+) — [Download](https://nodejs.org/)
2. **MongoDB Community Edition** — [Download](https://www.mongodb.com/try/download/community)

---

## 🚀 Setup Instructions

### Step 1: Install MongoDB on your PC

**Windows:**
- Download the MSI installer from the link above
- Install with default settings (it runs as a Windows service automatically)
- Data is stored at `C:\data\db` by default

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Set up the backend

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# (Optional) Edit .env to change JWT_SECRET

# Seed the database with initial data
npm run seed

# Start the server
npm run dev
```

The API will run at **http://localhost:8000**

---

## 📁 Where is my data stored?

MongoDB stores data locally at:
- **Windows:** `C:\data\db\` or `C:\Program Files\MongoDB\Server\{version}\data\`
- **macOS:** `/usr/local/var/mongodb/` (Homebrew) or `/data/db`
- **Linux:** `/var/lib/mongodb/`

Your database is named **`spacioport`**. No data leaves your machine.

---

## 🔑 Default Login Credentials

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Admin  | admin@spacioport.in    | admin123    |
| Client | rahul@example.com      | password123 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Auth     | Description          |
|--------|--------------------|----------|----------------------|
| POST   | /api/auth/register | Public   | Register new user    |
| POST   | /api/auth/login    | Public   | Login, get JWT token |
| GET    | /api/auth/me       | Required | Get current user     |

### Spaces
| Method | Endpoint          | Auth       | Description               |
|--------|-------------------|------------|---------------------------|
| GET    | /api/spaces       | Public     | List spaces (with filters)|
| GET    | /api/spaces/:id   | Public     | Get space details         |
| POST   | /api/spaces       | Admin only | Create new space          |
| PUT    | /api/spaces/:id   | Admin only | Update space              |
| DELETE | /api/spaces/:id   | Admin only | Delete space              |

**Query params:** `?city=Delhi&type=longterm&maxPrice=20000&minCapacity=10&page=1&limit=12`

### Bookings
| Method | Endpoint                    | Auth     | Description         |
|--------|-----------------------------|----------|---------------------|
| GET    | /api/bookings               | Required | List user's bookings|
| POST   | /api/bookings               | Required | Create booking      |
| PATCH  | /api/bookings/:id/status    | Admin    | Update status       |
| DELETE | /api/bookings/:id           | Required | Cancel booking      |

### Wishlist
| Method | Endpoint                | Auth     | Description           |
|--------|-------------------------|----------|-----------------------|
| GET    | /api/wishlist           | Required | Get user's wishlist   |
| POST   | /api/wishlist           | Required | Add to wishlist       |
| DELETE | /api/wishlist/:spaceId  | Required | Remove from wishlist  |

### Campaigns
| Method | Endpoint            | Auth     | Description          |
|--------|---------------------|----------|----------------------|
| GET    | /api/campaigns      | Required | List campaigns       |
| POST   | /api/campaigns      | Required | Create campaign      |
| PUT    | /api/campaigns/:id  | Required | Update campaign      |
| DELETE | /api/campaigns/:id  | Required | Delete campaign      |

### Inquiries
| Method | Endpoint                    | Auth       | Description        |
|--------|-----------------------------|------------|--------------------|
| POST   | /api/inquiries              | Public     | Submit inquiry     |
| GET    | /api/inquiries              | Admin only | List all inquiries |
| PATCH  | /api/inquiries/:id/status   | Admin only | Update status      |

---

## 🔗 Connecting the Frontend

When you're ready to connect the React frontend to this backend, create `src/lib/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Usage examples:
// const { data } = await api.get('/spaces?city=Mumbai');
// const { data } = await api.post('/auth/login', { email, password });
// const { data } = await api.post('/bookings', { spaceId, startDate, endDate });
```

---

## 🛡️ Security Notes

- Passwords are hashed with **bcrypt** (12 rounds)
- Auth uses **JWT** tokens (7-day expiry)
- Admin routes are protected with role-based middleware
- CORS is configured for `http://localhost:5173` (Vite dev server)

---

## 💡 Useful MongoDB Commands

```bash
# Open MongoDB shell
mongosh

# Switch to spacioport database
use spacioport

# View all collections
show collections

# View all spaces
db.spaces.find().pretty()

# View all users (passwords are hashed)
db.users.find().pretty()

# Count bookings
db.bookings.countDocuments()

# Delete all data and re-seed
# Exit mongosh, then run: npm run seed
```

---

## 🆕 Refactored Schema (v2)

### `Space`
| Field        | Type                                     | Notes                                                  |
|--------------|------------------------------------------|--------------------------------------------------------|
| `name`       | String, required                         | Title                                                  |
| `type`       | `'virtual' \| 'physical'`, required      |                                                        |
| `duration`   | `'long-term' \| 'on-demand'`             | **Required when `type=physical`**                      |
| `city`       | String                                   | **Required when `type=physical`**                      |
| `address`    | String                                   | **Required when `type=physical`**                      |
| `price`      | Number, required                         | INR                                                    |
| `priceUnit`  | `/month` `/hour` `/day` `/year`          |                                                        |
| `images`     | `[String]` (URLs)                        | Cloudinary / Unsplash / any URL                        |
| `isActive`   | Boolean, default `true`                  | `DELETE` sets this to `false` (soft delete)            |

### `Booking` (lead form)
| Field    | Type                          | Notes                              |
|----------|-------------------------------|------------------------------------|
| `space`  | ObjectId → Space, required    |                                    |
| `user`   | ObjectId → User (optional)    | Auto-attached if JWT is sent       |
| `name`   | String, required              |                                    |
| `email`  | String, required, validated   |                                    |
| `phone`  | String, required              |                                    |
| `message`| String                        |                                    |
| `status` | `new \| contacted \| confirmed \| cancelled` | Default `new`            |

---

## 📡 Endpoints (v2)

### Public
- `GET  /api/spaces?type=physical&duration=long-term&city=Delhi&maxPrice=30000`
- `GET  /api/spaces/:id`
- `POST /api/bookings` — body: `{ spaceId, name, email, phone, message? }`
- `POST /api/inquiries` — contact form
- `POST /api/auth/login` / `POST /api/auth/register`

### Authenticated (any logged-in user)
- `GET /api/bookings` — your own leads
- `GET /api/auth/me`

### Admin only (`role: 'admin'`)
- `POST   /api/spaces`
- `PUT    /api/spaces/:id`
- `DELETE /api/spaces/:id` — **soft delete** (`isActive=false`)
- `GET    /api/bookings` — all leads
- `PATCH  /api/bookings/:id/status` — `new | contacted | confirmed | cancelled`
- `DELETE /api/bookings/:id` — hard delete a lead

---

## 🌱 Seed Data

`npm run seed` creates:
- `admin@spacioport.in` / `admin123` (admin role)
- `rahul@example.com` / `password123` (client role)
- **30 spaces**: 10 virtual + 10 long-term physical (Delhi/Mumbai/Bangalore) + 10 on-demand physical (mixed cities)
