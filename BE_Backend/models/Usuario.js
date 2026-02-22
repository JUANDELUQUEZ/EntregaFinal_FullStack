// models/Usuario.js
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Evita correos duplicados en la base de datos
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
); // Añade fecha de creación y actualización automáticamente

module.exports = mongoose.model("Usuario", usuarioSchema);
