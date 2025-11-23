# API Documentation - UAV Backend

Base URL: `http://localhost:3000`

## Database Schema

### Tables

#### 1. flight_plans
- `id` - INTEGER PRIMARY KEY
- `name` - TEXT (nama flight plan)
- `description` - TEXT (deskripsi)
- `waypoints` - TEXT (JSON array koordinat)
- `created_at` - DATETIME
- `updated_at` - DATETIME

#### 2. trajectories
- `id` - INTEGER PRIMARY KEY
- `name` - TEXT (nama trajectory)
- `points` - TEXT (JSON array koordinat)
- `duration` - INTEGER (durasi dalam detik)
- `distance` - REAL (jarak dalam meter)
- `created_at` - DATETIME

#### 3. uav_positions
- `id` - INTEGER PRIMARY KEY
- `latitude` - REAL
- `longitude` - REAL
- `altitude` - REAL
- `heading` - REAL
- `speed` - REAL
- `timestamp` - DATETIME

---

## Endpoints

### Root
```
GET /
```
Response: Informasi API dan daftar endpoints

---

## Flight Plans

### Get All Flight Plans
```
GET /api/flight-plans
```
Response:
```json
[
  {
    "id": 1,
    "name": "Mission 1",
    "description": "Test mission",
    "waypoints": [[lat, lng], [lat, lng]],
    "created_at": "2025-11-23 10:00:00",
    "updated_at": "2025-11-23 10:00:00"
  }
]
```

### Get Single Flight Plan
```
GET /api/flight-plans/:id
```

### Create Flight Plan
```
POST /api/flight-plans
Content-Type: application/json

{
  "name": "Mission 1",
  "description": "Test mission",
  "waypoints": [[-6.2, 106.816], [-6.21, 106.82]]
}
```

### Update Flight Plan
```
PUT /api/flight-plans/:id
Content-Type: application/json

{
  "name": "Updated Mission",
  "description": "Updated description",
  "waypoints": [[-6.2, 106.816], [-6.21, 106.82]]
}
```

### Delete Flight Plan
```
DELETE /api/flight-plans/:id
```

---

## Trajectories

### Get All Trajectories
```
GET /api/trajectories
```

### Save Trajectory
```
POST /api/trajectories
Content-Type: application/json

{
  "name": "Flight Record 1",
  "points": [[-6.2, 106.816], [-6.21, 106.82]],
  "duration": 120,
  "distance": 1500.5
}
```

### Delete Trajectory
```
DELETE /api/trajectories/:id
```

---

## UAV Position

### Get Latest Position
```
GET /api/uav-position
```

### Get Position History
```
GET /api/uav-position/history?limit=100
```

### Save Position
```
POST /api/uav-position
Content-Type: application/json

{
  "latitude": -6.2,
  "longitude": 106.816,
  "altitude": 100.5,
  "heading": 45.0,
  "speed": 15.5
}
```

---

## Example Usage

### JavaScript Fetch
```javascript
// Get all flight plans
const response = await fetch('http://localhost:3000/api/flight-plans');
const plans = await response.json();

// Create new flight plan
const newPlan = await fetch('http://localhost:3000/api/flight-plans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mission 1',
    description: 'Test',
    waypoints: [[-6.2, 106.816], [-6.21, 106.82]]
  })
});
```

---

## Running the Server

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (development)
npm run dev
```

Database file akan dibuat otomatis di: `./database.sqlite`
