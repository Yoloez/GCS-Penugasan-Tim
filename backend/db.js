import mysql from "mysql2/promise";

export const db = await mysql.createPool({
	host: "localhost",
	user: "root",
	password: "yourpassword",
	database: "uav",
});
