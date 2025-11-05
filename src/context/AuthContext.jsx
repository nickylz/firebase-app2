/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { auth, GoogleProvider } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// 1️⃣ Crear el contexto
const AuthContext = createContext();

// 2️⃣ Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

// 3️⃣ Componente proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // Usuario actual
  const [loading, setLoading] = useState(true); // Cargando sesión

  // Escuchar cambios de sesión (login/logout/recarga)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    // Limpiar el listener al desmontar
    return () => unsubscribe();
  }, []);

  // --- 🔐 Funciones de autenticación ---

  // Registro con email/contraseña
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Login con email/contraseña
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Login con Google
  const loginWithGoogle = () => signInWithPopup(auth, GoogleProvider);

  // Reset de contraseña
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Logout
  const logout = () => signOut(auth);

  // 📦 Empaquetar todo en un objeto
  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
  };

  // 🧠 Proveer el contexto a los hijos
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-600 font-medium">Cargando sesión...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
