import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nextvoto_user');
    const storedToken = localStorage.getItem('nextvoto_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const guardarSesion = (data) => {
    const userData = {
      idUsuario: data.idUsuario,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
    };
    localStorage.setItem('nextvoto_token', data.token);
    localStorage.setItem('nextvoto_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return guardarSesion(response.data);
  };

  const register = async (datosRegistro) => {
    const response = await api.post('/auth/register', datosRegistro);
    return guardarSesion(response.data);
  };

  const loginGoogle = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    return guardarSesion(response.data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Si el token ya expiró en el servidor, limpiamos la sesión local igualmente
    } finally {
      localStorage.removeItem('nextvoto_token');
      localStorage.removeItem('nextvoto_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);