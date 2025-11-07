import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Registro from "../componentes/Registro";

export default function RutaProtegida({ children }) {
  const { user } = useAuth();
  const [mostrarLogin, setMostrarLogin] = useState(true); // inicia en true si no hay user

  // Si el usuario no está autenticado, muestra el modal
  if (!user && mostrarLogin) {
    return (
      <div
        className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
        onClick={() => setMostrarLogin(false)} // cerrar si hace clic fuera
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative animate-fade-in"
          onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
        >
          {/* Botón de cierre */}
          <button
            onClick={() => setMostrarLogin(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg"
          >
            ✕
          </button>

          {/* Modal de registro/login */}
          <Registro onCerrar={() => setMostrarLogin(false)} />
        </div>
      </div>
    );
  }

  // Si el usuario está logueado, muestra el contenido protegido
  return children;
}
