import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

//Simpan dan update plan
app.post("/plan", async (req, res) => {
	const { id, name, data } = req.body;

	try {
		await db.query(`REPLACE INTO plan (id, name, data) VALUES (?, ?, ?)`, [
			id,
			name,
			JSON.stringify(data),
		]);
		res.json({ message: "Plan saved succesfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

//Buat single plan
app.get("/plan/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const [rows] = await db.query(`SELECT * FROM plans WHERE id = ?`, [id]);

		if (rows.length === 0) {
			return res.status(404).json({ error: "Plan not found" });
		}
		const plans = rows.map((p) => ({
			...p,
			data: JSON.parse(p.data),
		}));
		res.json(plans);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

//Hapus rencana
app.delete("/plan/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await db.query(`DELETE FROM plans WHERE id = ?`, [id]);
		res.json({ message: "Plan deleted" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(4000, () => console.log("Server running on port 4000"));
