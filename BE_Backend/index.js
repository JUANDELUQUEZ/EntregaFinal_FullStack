// Cargar variables de entorno antes que cualquier otra cosa
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares globales
app.use(cors()); // Permite peticiones de otros orígenes
app.use(express.json()); // Permite a Express entender los cuerpos de petición en formato JSON

const mongoose = require("mongoose");

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((error) => console.error("Error conectando a MongoDB:", error));

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ mensaje: "Servidor Backend funcionando correctamente" });
});

// Integración de rutas
app.use("/api/auth", require("./routes/auth"));

// Integración de rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/externa", require("./routes/apiExterna")); // AGREGA ESTA LÍNEA

// Exportar la app para las pruebas
const PORT = process.env.PORT || 3000;

// Solo iniciamos el servidor si este archivo se ejecuta directamente (no cuando es importado por los tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
}

module.exports = app;
