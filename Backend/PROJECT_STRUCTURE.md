# Backend Project Structure

## Arsitektur MVC (Model-View-Controller)

Project ini menggunakan pola arsitektur MVC yang terstruktur dan mengikuti best practices Express.js.

```
backend/
├── src/
│   ├── models/           # Business logic & data layer
│   │   ├── flightPlanModel.js
│   │   ├── trajectoryModel.js
│   │   └── uavPositionModel.js
│   ├── controllers/      # Request handlers & HTTP logic
│   │   ├── flightPlanController.js
│   │   ├── trajectoryController.js
│   │   └── uavPositionController.js
│   ├── routes/          # Route definitions
│   │   ├── index.js
│   │   ├── flightPlans.js
│   │   ├── trajectories.js
│   │   └── uavPosition.js
│   └── db.js            # Database access layer
├── app.js               # Express app configuration
├── package.json
└── database.sqlite      # SQLite database file
```

---

## Layer Responsibilities

### 1. **Models** (`src/models/`)
- Menghandle business logic
- Validasi data
- Transformasi data (JSON parse/stringify)
- Memanggil fungsi database dari `db.js`
- **Tidak** menghandle HTTP requests/responses

**Example:**
```javascript
// flightPlanModel.js
export async function create(data) {
  const { name, waypoints } = data;
  if (!name || !waypoints) {
    throw new Error("Name and waypoints are required");
  }
  return await createFlightPlan(name, description, waypoints);
}
```

### 2. **Controllers** (`src/controllers/`)
- Menghandle HTTP requests dan responses
- Memanggil fungsi dari Models
- Menangani error dan mengirim status codes
- Logging
- **Tidak** mengakses database secara langsung

**Example:**
```javascript
// flightPlanController.js
export async function create(req, res) {
  try {
    const result = await FlightPlanModel.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}
```

### 3. **Routes** (`src/routes/`)
- Mendefinisikan endpoint URLs
- Mapping URLs ke controller functions
- Grouping related endpoints
- **Tidak** menghandle business logic

**Example:**
```javascript
// flightPlans.js
router.get("/", FlightPlanController.getAll);
router.post("/", FlightPlanController.create);
router.put("/:id", FlightPlanController.update);
```

### 4. **Database Layer** (`src/db.js`)
- Raw database operations (SQL queries)
- Database initialization
- Connection management
- **Tidak** menghandle business logic atau HTTP

---

## Request Flow

```
Client Request
    ↓
app.js (Express middleware)
    ↓
routes/index.js (Route matching)
    ↓
routes/flightPlans.js (Specific route)
    ↓
controllers/flightPlanController.js (HTTP handling)
    ↓
models/flightPlanModel.js (Business logic)
    ↓
db.js (Database operations)
    ↓
SQLite Database
```

---

## Benefits of This Structure

### ✅ **Separation of Concerns**
- Setiap layer punya tanggung jawab yang jelas
- Mudah dimodifikasi tanpa mempengaruhi layer lain

### ✅ **Testability**
- Controllers bisa ditest dengan mock models
- Models bisa ditest dengan mock database
- Unit tests lebih mudah dibuat

### ✅ **Scalability**
- Mudah menambah endpoint baru
- Mudah menambah business logic
- Struktur konsisten untuk semua features

### ✅ **Maintainability**
- Code terorganisir dan mudah dibaca
- Mudah mencari dan memperbaiki bugs
- Onboarding developer baru lebih cepat

### ✅ **Reusability**
- Model functions bisa dipanggil dari controller mana saja
- Business logic tidak terduplikasi

---

## How to Add New Feature

### 1. Create Model (`src/models/newFeatureModel.js`)
```javascript
import { dbFunction } from "../db.js";

export async function findAll() {
  return await dbFunction();
}

export async function create(data) {
  // Validation
  if (!data.field) throw new Error("Field required");
  return await dbFunction(data);
}
```

### 2. Create Controller (`src/controllers/newFeatureController.js`)
```javascript
import * as Model from "../models/newFeatureModel.js";

export async function getAll(req, res) {
  try {
    const items = await Model.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 3. Create Routes (`src/routes/newFeature.js`)
```javascript
import express from "express";
import * as Controller from "../controllers/newFeatureController.js";

const router = express.Router();
router.get("/", Controller.getAll);
export default router;
```

### 4. Register in Main Router (`src/routes/index.js`)
```javascript
import newFeatureRouter from "./newFeature.js";
router.use("/new-feature", newFeatureRouter);
```

---

## Best Practices

### ✅ DO:
- Keep controllers thin (hanya HTTP handling)
- Put business logic in models
- Use async/await consistently
- Handle errors at every layer
- Use descriptive function names
- Add JSDoc comments
- Validate input in models
- Return consistent response formats

### ❌ DON'T:
- Put business logic in controllers
- Access database directly from controllers
- Mix HTTP logic with business logic
- Ignore error handling
- Use synchronous code unnecessarily
- Hardcode values
- Skip input validation

---

## Running the Application

```bash
# Start server
npm start

# Development mode (auto-reload)
npm run dev
```

Server runs at: **http://localhost:3000**

API endpoints: **http://localhost:3000/api**

---

## Next Steps for Improvement

1. **Add Middleware**
   - Request validation (express-validator)
   - Authentication (JWT)
   - Rate limiting
   - Request logging

2. **Add Services Layer** (Optional)
   - Complex business logic
   - Integration with external APIs
   - Data aggregation

3. **Add Testing**
   - Unit tests (Jest/Mocha)
   - Integration tests (Supertest)
   - Test coverage reporting

4. **Add Documentation**
   - Swagger/OpenAPI
   - JSDoc
   - Postman collection

5. **Environment Configuration**
   - .env files
   - Config management
   - Different environments (dev/prod)

6. **Database Migration**
   - Consider using ORM (Sequelize/Prisma)
   - Migration scripts
   - Seeding data
