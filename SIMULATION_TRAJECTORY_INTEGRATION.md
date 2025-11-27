# Simulation Trajectory Database Integration

## 🎯 Overview

Successfully integrated database persistence for UAV simulation trajectories in MapComponent. Users can now record, save, and manage simulation trajectories with full database support.

## ✨ New Features

### 1. **Automatic Trajectory Saving**

- Trajectories are automatically saved to database when recording stops
- Each trajectory includes:
  - **Name**: Auto-generated with timestamp (e.g., "Simulation_11/25/2025, 2:16:22 PM")
  - **Points**: All GPS coordinates recorded during simulation
  - **Duration**: Total recording time in seconds
  - **Distance**: Calculated total distance traveled in meters (using Haversine formula)
  - **Created At**: Timestamp of when trajectory was saved

### 2. **Trajectory List Management**

- Visual list of all saved trajectories in control panel
- Each trajectory card displays:
  - 📍 Number of GPS points recorded
  - ⏱️ Duration in seconds
  - 📏 Total distance in meters
  - 🕒 Creation timestamp
  - 🗑️ Individual delete button

### 3. **Persistent Storage**

- All trajectories automatically loaded from database on component mount
- Trajectories persist across page refreshes and browser sessions
- Full CRUD operations: Create, Read, Delete

### 4. **Enhanced UI/UX**

- Loading states for database operations
- Saving indicator when stopping recording
- Disabled buttons during async operations
- Confirmation dialog for bulk delete
- Success/error alerts with detailed feedback

### 5. **Distance Calculation**

- Implemented Haversine formula for accurate GPS distance calculation
- Accounts for Earth's curvature
- Result in meters for precision

## 🔧 Technical Implementation

### Modified Files

- **`frontend/src/components/MapComponent.jsx`**
  - Added trajectory API imports
  - Implemented `loadTrajectoriesFromDB()` function
  - Enhanced `handleStopRecord()` with database save
  - Modified `handleClearTrajectory()` for database bulk delete
  - Added `handleDeleteSingleTrajectory()` for individual deletion
  - Added `calculateDistance()` using Haversine formula
  - New state variables: `recordingStartTime`, `isSaving`, `isLoading`
  - Updated trajectory data structure to include metadata
  - Added trajectory list UI in control panel

### API Integration

Using existing endpoints from `frontend/src/services/api.js`:

- `saveTrajectory(trajectory)` - POST /api/trajectories
- `getTrajectories()` - GET /api/trajectories
- `deleteTrajectory(id)` - DELETE /api/trajectories/:id

### Database Schema

Table: `trajectories`

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
points TEXT NOT NULL (JSON array)
duration INTEGER (seconds)
distance INTEGER (meters)
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

## 📊 Data Flow

### Save Trajectory Flow:

1. User clicks "Start Recording" → `recordingStartTime` set
2. UAV moves, positions recorded in `trajectory` state
3. User clicks "Stop Recording" → `handleStopRecord()` triggered
4. Calculate duration (current time - start time)
5. Calculate distance (Haversine formula on all points)
6. Auto-generate trajectory name with timestamp
7. Call `saveTrajectory()` API → Backend saves to SQLite
8. Backend returns saved trajectory with database ID
9. Update local `recordedTrajectories` state
10. Show success alert with metrics

### Load Trajectories Flow:

1. Component mounts → `useEffect` triggers
2. Call `loadTrajectoriesFromDB()`
3. Fetch all trajectories from backend API
4. Transform database format to component format
5. Populate `recordedTrajectories` state
6. Trajectories displayed on map and in list

### Delete Flow:

1. User clicks individual delete button
2. Call `deleteTrajectory(id)` API
3. Backend removes from SQLite database
4. Update local state (filter out deleted trajectory)
5. Map and list automatically re-render

## 🎨 UI Components

### Control Panel Status Display:

```
Status: 🔴 Recording / ⚪ Idle
Saved Tracks: [count]
Current Points: [count] (when recording)
GPS Accuracy: ±2m
```

### Trajectory List (scrollable, max-height: 200px):

```
📊 Saved Trajectories (3)
┌──────────────────────────────────┐
│ Simulation_11/25/2025, 2:16:22 PM│
│ 📍 Points: 145 | ⏱️ 28s | 📏 320m │
│ 🕒 11/25/2025, 2:16:22 PM        │
│ [🗑️ Delete]                       │
└──────────────────────────────────┘
```

### Button States:

- **Start Recording**: Green (enabled) / Gray (disabled when loading)
- **Stop Recording**: Red (enabled) / Gray (disabled when saving)
- **Clear All Tracks**: Orange (enabled) / Gray (disabled when empty or processing)

## 🔍 Haversine Distance Formula

```javascript
// Calculate distance between two GPS coordinates
const R = 6371000; // Earth radius in meters
const dLat = ((lat2 - lat1) * Math.PI) / 180;
const dLng = ((lng2 - lng1) * Math.PI) / 180;
const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c; // meters
```

## ✅ Testing Checklist

- [x] Backend API endpoints functional (verified with curl)
- [x] No TypeScript/ESLint errors in MapComponent.jsx
- [x] Trajectory saves with correct metadata (name, points, duration, distance)
- [x] Trajectories load on component mount
- [x] Trajectories display on map as blue polylines
- [x] Individual trajectory deletion works
- [x] Bulk trajectory deletion (Clear All) works
- [x] Loading/Saving states display correctly
- [x] Distance calculation accurate with Haversine formula
- [x] Duration calculation accurate
- [x] Trajectory list UI scrollable and responsive

## 🚀 Usage Instructions

1. **Start Simulation**:

   - Use WASD or Arrow keys to move UAV
   - Click "▶ Start Recording" to begin trajectory capture

2. **Record Trajectory**:

   - Move UAV around the map
   - Current points count updates in status panel
   - Red polyline shows live trajectory

3. **Stop & Save**:

   - Click "⏹ Stop Recording"
   - Button shows "💾 Saving..." during database save
   - Success alert displays duration and distance metrics
   - Trajectory automatically added to "Saved Trajectories" list

4. **View Saved Trajectories**:

   - All trajectories displayed as blue polylines on map
   - Scroll through list in control panel
   - View metadata (points, duration, distance, timestamp)

5. **Delete Trajectory**:

   - Click "🗑️ Delete" button on individual trajectory card
   - Confirmation alert appears
   - Trajectory removed from database and map

6. **Clear All**:
   - Click "🗑️ Clear All Tracks" button
   - Confirmation dialog for bulk delete
   - All trajectories removed from database

## 🔗 Related Components

- **Backend**: `/backend/src/routes/trajectories.js`
- **Backend**: `/backend/src/controllers/trajectoryController.js`
- **Backend**: `/backend/src/models/trajectoryModel.js`
- **Frontend API**: `/frontend/src/services/api.js`
- **Database**: SQLite with `trajectories` table

## 📝 Notes

- Trajectories auto-load on page refresh (persistent)
- Maximum list height: 200px (scrollable)
- GPS accuracy: ±2 meters
- Distance precision: Rounded to nearest meter
- Duration precision: Rounded to nearest second
- Auto-generated names include full timestamp for uniqueness

## 🎉 Result

The UAV simulator now has full database integration for trajectory management, matching the functionality of the MapPlanning feature. Users can record, save, view, and delete simulation runs with persistent storage and comprehensive metadata tracking.
