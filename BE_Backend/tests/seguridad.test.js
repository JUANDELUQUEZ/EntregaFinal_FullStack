const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

// Cerramos la conexión a la base de datos después de terminar todas las pruebas
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Pruebas de Seguridad y Autenticación", () => {
  test("Debe bloquear el acceso a la ruta externa si no se envía un JWT (Error 401)", async () => {
    const respuesta = await request(app).get("/api/externa/datos");

    // Verificamos que el servidor rechace la petición correctamente
    expect(respuesta.statusCode).toBe(401);
    expect(respuesta.body).toHaveProperty("error");
  });

  test("Debe devolver un error si las credenciales de login son incorrectas (Error 400)", async () => {
    const respuesta = await request(app).post("/api/auth/login").send({
      email: "correo_que_no_existe@test.com",
      password: "password_falsa",
    });

    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.body.error).toBe("Credenciales inválidas");
  });
});
