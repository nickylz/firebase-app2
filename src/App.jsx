import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Post from "./paginas/Post";
import { Usuario } from "./paginas/Usuario";
import { Productos } from "./paginas/Productos";
import { Inicio } from "./paginas/incio";
import Registro from "./componentes/Registro"; // 👈 tu modal de registro/login

function App() {
  const [mostrarLogin, setMostrarLogin] = useState(false);

  return (
    <>
      {/* Navbar con función que abre el modal */}
      <Navbar onAbrirLogin={() => setMostrarLogin(true)} />

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/post" element={<Post />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>

      {/* Modal de login/registro */}
      {mostrarLogin && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={() => setMostrarLogin(false)} // 👈 cerrar al hacer clic fuera
        >
          {/* Contenedor del modal */}
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-lg relative overflow-y-auto max-h-[90vh] animate-fade-in"
            onClick={(e) => e.stopPropagation()} // 👈 evita que se cierre si clic dentro
          >
            {/* Botón para cerrar */}
            <button
              onClick={() => setMostrarLogin(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            {/* Pasamos la función de cierre al modal */}
            <Registro onCerrar={() => setMostrarLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
