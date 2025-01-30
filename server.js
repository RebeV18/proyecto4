const express = require("express");
const app = express();
require("dotenv").config();

const reservasRouter = require("./routes/reservas.routes");

const puerto = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/reservas", reservasRouter);

app.listen(puerto, () => {
  console.log("Nos conectamos al puerto ", puerto);
});
