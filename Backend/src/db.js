import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function openDb() {
  if (db) return db;

  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  // Buat tabel jika belum ada
  await initializeDatabase(db);

  return db;
}

async function initializeDatabase(database) {
  // Tabel untuk menyimpan flight plans
  await database.exec(`
    CREATE TABLE IF NOT EXISTS flight_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      waypoints TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabel untuk menyimpan trajectory records
  await database.exec(`
    CREATE TABLE IF NOT EXISTS trajectories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      points TEXT NOT NULL,
      duration INTEGER,
      distance REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabel untuk menyimpan UAV positions
  await database.exec(`
    CREATE TABLE IF NOT EXISTS uav_positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      altitude REAL DEFAULT 0,
      heading REAL DEFAULT 0,
      speed REAL DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized successfully");
}

// Helper functions untuk CRUD operations
export async function getAllFlightPlans() {
  const database = await openDb();
  return database.all("SELECT * FROM flight_plans ORDER BY created_at DESC");
}

export async function getFlightPlanById(id) {
  const database = await openDb();
  return database.get("SELECT * FROM flight_plans WHERE id = ?", id);
}

export async function createFlightPlan(name, description, waypoints) {
  const database = await openDb();
  const waypointsJson = JSON.stringify(waypoints);
  const result = await database.run("INSERT INTO flight_plans (name, description, waypoints) VALUES (?, ?, ?)", [name, description, waypointsJson]);
  return result.lastID;
}

export async function updateFlightPlan(id, name, description, waypoints) {
  const database = await openDb();
  const waypointsJson = JSON.stringify(waypoints);
  await database.run("UPDATE flight_plans SET name = ?, description = ?, waypoints = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [name, description, waypointsJson, id]);
}

export async function deleteFlightPlan(id) {
  const database = await openDb();
  await database.run("DELETE FROM flight_plans WHERE id = ?", id);
}

// Trajectory functions
export async function saveTrajectory(name, points, duration, distance) {
  const database = await openDb();
  const pointsJson = JSON.stringify(points);
  const result = await database.run("INSERT INTO trajectories (name, points, duration, distance) VALUES (?, ?, ?, ?)", [name, pointsJson, duration, distance]);
  return result.lastID;
}

export async function getAllTrajectories() {
  const database = await openDb();
  return database.all("SELECT * FROM trajectories ORDER BY created_at DESC");
}

export async function deleteTrajectory(id) {
  const database = await openDb();
  await database.run("DELETE FROM trajectories WHERE id = ?", id);
}

// UAV position functions
export async function saveUavPosition(latitude, longitude, altitude, heading, speed) {
  const database = await openDb();
  const result = await database.run("INSERT INTO uav_positions (latitude, longitude, altitude, heading, speed) VALUES (?, ?, ?, ?, ?)", [latitude, longitude, altitude, heading, speed]);
  return result.lastID;
}

export async function getLatestUavPosition() {
  const database = await openDb();
  return database.get("SELECT * FROM uav_positions ORDER BY timestamp DESC LIMIT 1");
}

export async function getUavPositionHistory(limit = 100) {
  const database = await openDb();
  return database.all("SELECT * FROM uav_positions ORDER BY timestamp DESC LIMIT ?", limit);
}
