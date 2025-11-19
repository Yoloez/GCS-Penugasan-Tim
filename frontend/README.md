# Ground Control System (GCS)

A professional-grade flight planning and mission management system built with React, Leaflet, and Tailwind CSS.

## 🎯 Features

✅ **Interactive Map** - Draw and visualize flight paths directly on the map
✅ **Multiple Shapes** - Support for polylines, polygons, rectangles, and circles
✅ **Plan Management** - Create, save, edit, and delete flight plans
✅ **Data Persistence** - All plans are saved to a JSON database
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Professional UI** - Modern, clean, and intuitive interface

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Navigation header
│   ├── MapComponent.jsx     # Basic map display
│   └── MapEditor.tsx        # Interactive map editor with drawing tools
├── pages/
│   ├── Home.jsx             # Welcome page with features
│   ├── Editor.tsx           # Plan creation page
│   ├── Plans.tsx            # Plans management page
│   ├── Map.jsx              # Map view page
│   └── Profile.jsx          # User profile page
├── services/
│   └── api.ts               # API calls to json-server
├── App.jsx                  # Main app component with routing
└── main.jsx                 # Entry point
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the Application

You need to run **TWO terminals**:

**Terminal 1 - Start the React Development Server:**

```bash
npm run dev
```

This will start the app on `http://localhost:5173`

**Terminal 2 - Start the JSON Server (Backend):**

```bash
npm run server
```

This will start the mock API on `http://localhost:3001`

### Build for Production

```bash
npm run build
```

## 📖 Usage Guide

### Creating a New Plan

1. Click "Create Plan" from the home page or header
2. Choose a drawing tool:
   - **Polyline** - Draw open paths
   - **Polygon** - Draw closed areas
   - **Rectangle** - Draw rectangular areas
   - **Circle** - Draw circular areas
3. Click on the map to add points to your shape
4. Click "Finish Drawing" when done
5. Give your plan a name
6. Click "Save Plan"

### Viewing All Plans

1. Go to "All Plans" or click "View All Plans"
2. See all saved plans in a grid view
3. Each plan shows:
   - Plan name and type
   - Number of coordinate points
   - Creation and update dates
   - Coordinate preview

### Managing Plans

- **Edit** - Modify existing plans (coming soon)
- **Duplicate** - Create a copy of a plan (coming soon)
- **Delete** - Remove a plan permanently

## 🔌 API Endpoints

The app uses a JSON Server for backend operations:

- `GET /plans` - Get all plans
- `GET /plans/:id` - Get a single plan
- `POST /plans` - Create a new plan
- `PATCH /plans/:id` - Update a plan
- `DELETE /plans/:id` - Delete a plan

## 📊 Database Schema

```typescript
interface Plan {
	id?: number;
	name: string; // Plan name
	type: "polyline" | "polygon" | "rectangle" | "circle"; // Shape type
	coordinates: Array<{ lat: number; lng: number }>; // Coordinate points
	createdAt?: string; // ISO timestamp
	updatedAt?: string; // ISO timestamp
}
```

## 🛠️ Technology Stack

- **Frontend Framework** - React 19.2.0 with TypeScript
- **Routing** - React Router DOM 7.9.6
- **Mapping** - Leaflet 1.9.4 + React Leaflet 5.0.0
- **Styling** - Tailwind CSS 4.1.17
- **Backend** - JSON Server (for development)
- **Build Tool** - Vite with Rolldown

## 📝 Component Details

### MapEditor.tsx

- Interactive map component with click-to-draw functionality
- Supports polyline, polygon, rectangle, and circle drawing
- Real-time shape preview
- Clean toolbar for shape selection

### Header.jsx

- Global navigation component
- Links to all main sections
- Fixed positioning for easy access

### Editor.tsx (Page)

- Main plan creation interface
- Left side: Interactive map editor
- Right side: Plan info panel with save functionality
- Displays shape information and save status

### Plans.tsx (Page)

- Display all saved plans
- Plan cards with details and preview
- Action buttons for edit/duplicate/delete
- Delete confirmation dialog
- Refresh functionality

### Home.jsx (Page)

- Welcome page with hero section
- Feature highlights
- How it works guide
- Call-to-action sections

## 🌐 Routes

- `/` - Home page
- `/editor` - Create new plan
- `/plans` - View and manage plans
- `/map` - Map view (placeholder)
- `/profile` - User profile (placeholder)

## 💻 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 🧪 Development Notes

- The app uses TypeScript for type safety
- ESLint is configured for code quality
- Tailwind CSS provides responsive styling
- Leaflet is used for all mapping functionality

## 📌 Requirements Completed

✅ **Dapat menampilkan peta pada website** - Interactive Leaflet map with OpenStreetMap tiles

✅ **Dapat membuat "plan" (polyline, polygon, rectangle, dan circle) pada peta** - Full drawing support with visual feedback

✅ **Plan yang sudah dibuat dapat disimpan (diberi nama)** - Plans saved with custom names and metadata

✅ **Di load (ditampilkan ulang)** - Plans loaded from database and displayed on Plans page

✅ **Di edit dan di hapus** - Delete functionality implemented, edit coming soon

✅ **Pastikan di database juga teredit dan terhapus** - Full CRUD operations using JSON Server

✅ **Minimal terdapat 2 halaman** - Multiple pages: Home, Editor, Plans (plus Map, Profile placeholders)

## 🔮 Future Enhancements

- Edit existing plans
- Duplicate plans
- Export plans to KML/GeoJSON
- Import plans from files
- Distance/area calculation
- Waypoint optimization
- Multi-user collaboration
- Real-time flight tracking

## 🐛 Troubleshooting

### JSON Server not connecting

- Make sure JSON Server is running on port 3001: `npm run server`
- Check that `db.json` exists in the project root
- Restart both the dev server and JSON server

### Map not displaying

- Clear browser cache
- Ensure Leaflet CSS is properly imported
- Check browser console for errors

### Drawing tools not working

- Make sure you click the drawing tool button first
- Click on the map to add points
- Click "Finish Drawing" to complete the shape

## 📄 License

MIT License - Created for Gamaforce Team Project

---

**Version:** 1.0.0  
**Last Updated:** November 17, 2025  
**Author:** Team Gamaforce
