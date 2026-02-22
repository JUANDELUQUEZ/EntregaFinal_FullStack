import { useState } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  // Nuevo estado para almacenar los datos que vengan de la API
  const [usuariosApi, setUsuariosApi] = useState([]);

  const manejarAccion = async (e, accion) => {
    e.preventDefault(); 
    const url = accion === 'registro' ? '/api/auth/registro' : '/api/auth/login';
    const body = accion === 'registro' ? { nombre, email, password } : { email, password };

    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        if (accion === 'login') {
          localStorage.setItem('token', data.token);
          setMensaje('Login exitoso. Token guardado.');
        } else {
          setMensaje('Registro exitoso. Ahora puedes iniciar sesión.');
        }
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
      console.error(error);
    }
  };

  // NUEVA FUNCIÓN: Consumir la API Protegida
  const obtenerDatosProtegidos = async () => {
    // 1. Recuperamos el token del almacenamiento local
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMensaje('Acceso denegado. No tienes un token guardado. Inicia sesión primero.');
      return;
    }

    try {
      // 2. Hacemos la petición inyectando el token en los headers
      const respuesta = await fetch('/api/externa/datos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setUsuariosApi(data.usuarios); // Guardamos el array de usuarios en el estado
        setMensaje(data.mensaje);
      } else {
        // Si el token expiró o fue alterado, el backend devolverá 400 o 401
        setMensaje(`Fallo de seguridad: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error al intentar obtener los datos de la API.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h2>Autenticación Full Stack y Consumo de API</h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px', marginBottom: '30px' }}>
        <input type="text" placeholder="Nombre (Solo para registro)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button onClick={(e) => manejarAccion(e, 'login')} type="button">Iniciar Sesión</button>
        <button onClick={(e) => manejarAccion(e, 'registro')} type="button">Registrarse</button>
      </form>

      <div style={{ borderTop: '2px solid #ccc', paddingTop: '20px' }}>
        <button onClick={obtenerDatosProtegidos} style={{ background: '#007BFF', color: 'white', padding: '10px' }}>
          Obtener Datos de API Externa
        </button>
      </div>

      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensaje}</p>}

      {/* Renderizamos los datos si existen */}
      {usuariosApi.length > 0 && (
        <ul style={{ marginTop: '20px', background: '#f4f4f4', padding: '20px', borderRadius: '5px' }}>
          {usuariosApi.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email} (Compañía: {user.company.name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;