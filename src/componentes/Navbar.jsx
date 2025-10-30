import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-linear-to-r from-yellow-500 via-amber-400 to-yellow-300 text-white shadow-lg p-4 sticky top-0 z-50">
      <ul className="flex justify-center gap-8 font-semibold text-lg">
        <li>
          <Link
            className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-900 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-gray-800 transition duration-300"
            to="/"
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            className="relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-900 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-gray-800 transition duration-300"
            to="/usuarios"
          >
            Usuarios
          </Link>
        </li>
        <li>
          <Link
            className="relative after:content-[''] after:absolute after:w-0 after:h-0.5] after:bg-gray-900 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-gray-800 transition duration-300"
            to="/post"
          >
            Post
          </Link>
        </li>
        <li>
          <Link
            className="relative after:content-[''] after:absolute after:w-0 after:h-0.5] after:bg-gray-900 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 hover:text-gray-800 transition duration-300"
            to="/productos"
          >
            Productos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
