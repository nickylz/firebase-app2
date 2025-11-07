import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ZonaUsuario } from "./ZonaUsuario";

export default function Navbar({ onAbrirLogin }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-linear-to-r from-yellow-500 via-pink-400 to-amber-300 text-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo o título */}
        <h1 className="text-2xl font-bold tracking-wide drop-shadow-sm">
          Tralalero Tralala
        </h1>

        {/* Botón menú móvil */}
        <button
          className="sm:hidden text-white hover:text-gray-800 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú principal */}
        <ul
          className={`flex flex-col sm:flex-row sm:static absolute 
          bg-linear-to-r from-yellow-500 via-pink-400 to-amber-300 
          sm:bg-transparent 
          left-0 w-full sm:w-auto sm:gap-8 gap-4 text-lg font-semibold 
          sm:items-center sm:justify-center p-4 sm:p-0 
          transition-all duration-300 ease-in-out ${
            open
              ? "top-16 opacity-100"
              : "top-[-400px] opacity-0 sm:opacity-100"
          }`}
        >
          {[
            { path: "/", label: "Inicio" },
            { path: "/usuarios", label: "Usuarios" },
            { path: "/post", label: "Post" },
            { path: "/productos", label: "Productos" },
          ].map((item, i) => (
            <li key={i}>
              <Link
                to={item.path}
                onClick={() => setOpen(false)}
                className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-900 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-gray-900 transition duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* 🔹 Zona del usuario (solo visible en móvil dentro del menú) */}
          <li className="sm:hidden">
            <ZonaUsuario onAbrirLogin={onAbrirLogin} />
          </li>
        </ul>

        {/* 🔹 ZonaUsuario visible en escritorio */}
        <div className="hidden sm:flex items-center">
          <ZonaUsuario onAbrirLogin={onAbrirLogin} />
        </div>
      </div>
    </nav>
  );
}
