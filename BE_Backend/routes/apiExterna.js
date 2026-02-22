// routes/apiExterna.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Importamos nuestro guardián

// ENDPOINT PROTEGIDO: Solo accesible con JWT
// Al inyectar 'auth' como segundo parámetro, Express ejecuta el middleware primero
router.get("/datos", auth, async (req, res) => {
  try {
    // Consumimos la API pública externa directamente desde Node.js
    // Node 18+ ya incluye fetch de forma nativa
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    const datos = await respuesta.json();

    // Enviamos los datos procesados a nuestro frontend
    res.json({
      mensaje: "Datos obtenidos exitosamente de la API externa",
      usuarios: datos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al comunicarse con la API externa" });
  }
});

module.exports = router;
