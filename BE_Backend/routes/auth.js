// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const router = express.Router();

// ENDPOINT: Registro de Usuario
router.post("/registro", async (req, res) => {
  try {
    // Extraemos los datos que envía el frontend en el cuerpo de la petición
    const { nombre, email, password } = req.body;

    // 1. Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // 2. Encriptar la contraseña (Hashing)
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    // 3. Crear el nuevo usuario en la base de datos
    usuario = new Usuario({
      nombre,
      email,
      password: passwordHasheada,
    });

    await usuario.save();
    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ENDPOINT: Login de Usuario (Generación de JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // 2. Comparar la contraseña enviada con el hash de la base de datos
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // 3. Generar el JWT
    // Firmamos el token con el ID del usuario y la clave secreta. Expira en 1 hora.
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4. Enviar el token al frontend
    res.json({ token, mensaje: "Autenticación exitosa" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
