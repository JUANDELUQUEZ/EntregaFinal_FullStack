// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Interceptar el header de autorización
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ error: "Acceso denegado. No hay token." });

  // 2. Extraer el token (El formato es "Bearer eyJhb...")
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verificar la firma con tu clave secreta
    const verificado = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Inyectar la data del usuario en la request
    req.user = verificado;

    // 5. Permitir que la petición continúe
    next();
  } catch (ex) {
    res.status(400).json({ error: "Token inválido o expirado." });
  }
};
