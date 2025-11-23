# UAV Backend API

Backend Express.js dengan SQLite database untuk UAV (Unmanned Aerial Vehicle) management system.

## 🏗️ Architecture

Project ini menggunakan **MVC (Model-View-Controller)** pattern yang terstruktur:

- **Models**: Business logic & data transformation
- **Controllers**: HTTP request/response handling
- **Routes**: URL mapping & endpoint definitions
- **Database**: SQLite with raw SQL queries

Lihat [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) untuk penjelasan lengkap.

## 📁 Folder Structure

```
backend/
├── src/
│   ├── models/              # Business logic layer
│   │   ├── flightPlanModel.js
│   │   ├── trajectoryModel.js
│   │   └── uavPositionModel.js
│   ├── controllers/         # HTTP handlers
│   │   ├── flightPlanController.js
│   │   ├── trajectoryController.js
│   │   └── uavPositionController.js
│   ├── routes/             # Route definitions
│   │   ├── index.js        # Main router
│   │   ├── flightPlans.js
│   │   ├── trajectories.js
│   │   └── uavPosition.js
│   └── db.js               # Database layer
├── app.js                  # Express configuration
├── database.sqlite         # SQLite database (auto-generated)
└── package.json
```

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run Server

```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

### Development Mode (Auto-reload)

```bash
npm run dev
```

## 📡 API Endpoints

### Root

- `GET /` - API information
- `GET /api` - API endpoints list

### Flight Plans

- `GET /api/flight-plans` - Get all flight plans
- `GET /api/flight-plans/:id` - Get single flight plan
- `POST /api/flight-plans` - Create new flight plan
- `PUT /api/flight-plans/:id` - Update flight plan
- `DELETE /api/flight-plans/:id` - Delete flight plan

### Trajectories

- `GET /api/trajectories` - Get all trajectories
- `POST /api/trajectories` - Save new trajectory
- `DELETE /api/trajectories/:id` - Delete trajectory

### UAV Position

- `GET /api/uav-position` - Get latest position
- `GET /api/uav-position/history?limit=100` - Get position history
- `POST /api/uav-position` - Save new position

Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk detail lengkap.

## 💾 Database

Database SQLite akan otomatis dibuat saat server pertama kali dijalankan.

### Tables:

1. **flight_plans** - Menyimpan rencana penerbangan
2. **trajectories** - Menyimpan rekaman jejak UAV
3. **uav_positions** - Menyimpan histori posisi UAV

## 🔧 Technologies

- **Express.js** - Web framework
- **SQLite3** - Database
- **sqlite** - Promise-based SQLite wrapper
- **CORS** - Cross-Origin Resource Sharing

## 📝 Example Usage

### Create Flight Plan

```bash
curl -X POST http://localhost:3000/api/flight-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mission 1",
    "description": "Test flight",
    "waypoints": [[-6.2, 106.816], [-6.21, 106.82]]
  }'
```

### Get All Flight Plans

```bash
curl http://localhost:3000/api/flight-plans
```

### Save UAV Position

```bash
curl -X POST http://localhost:3000/api/uav-position \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -6.2,
    "longitude": 106.816,
    "altitude": 100,
    "heading": 45,
    "speed": 15
  }'
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Detailed API reference
- [Project Structure](./PROJECT_STRUCTURE.md) - Architecture & best practices

## 🎯 Best Practices

✅ **Separation of Concerns**: Models, Controllers, dan Routes terpisah  
✅ **Error Handling**: Comprehensive error handling di setiap layer  
✅ **Async/Await**: Modern JavaScript async patterns  
✅ **RESTful API**: Standard REST conventions  
✅ **Clean Code**: Readable & maintainable code structure

## 🔜 Future Improvements

- [ ] Add authentication & authorization (JWT)
- [ ] Add input validation middleware (express-validator)
- [ ] Add unit & integration tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add request logging
- [ ] Add rate limiting
- [ ] Migrate to ORM (Sequelize/Prisma)
- [ ] Add environment configuration (.env)

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please read the contributing guidelines first.
