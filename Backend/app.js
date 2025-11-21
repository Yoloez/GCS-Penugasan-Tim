import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("PORT 3000 ini");
});

app.listen(port, () => {
  console.log(`APLIKASI BERJALAN DI PORT: ${port}`);
});
