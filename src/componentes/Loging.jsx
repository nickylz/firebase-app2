import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function traducirError(code) {
    switch (code) {
      case "auth/user-not-found":
        return "No existe una cuenta con este correo.";
      case "auth/wrong-password":
        return "La contraseña es incorrecta.";
      case "auth/invalid-email":
        return "El formato del correo no es válido.";
      default:
        return "Ocurrió un error inesperado. Intenta nuevamente.";
    }
  }
     //hace el logueo con correo y contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      console.log("Inicio de sesión exitoso ✅");
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      console.log("Inicio de sesión con Google exitoso ✅");
    } catch (err) {
      console.error(err);
      setError("Error al iniciar con Google.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-amber-100 text-gray-800 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-amber-600 text-center drop-shadow-sm">
        Iniciar sesión
      </h1>

      {/* Cuadro principal */}
      <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col gap-6 w-full max-w-3xl border border-amber-100">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Campo correo */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-amber-700">
              Correo electrónico
            </label>
            <div className="flex items-center border border-amber-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-amber-300">
              <Mail className="text-amber-500 mr-2" size={18} />
              <input
                type="email"
                className="w-full outline-none text-sm sm:text-base placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
          </div>

          {/* Campo contraseña */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-amber-700">
              Contraseña
            </label>
            <div className="flex items-center border border-amber-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-amber-300">
              <Lock className="text-amber-500 mr-2" size={18} />
              <input
                type="password"
                className="w-full outline-none text-sm sm:text-base placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Iniciar sesión
          </button>
        </form>

        {/* Botón Google */}
        <button
          type="button"
          onClick={handleGoogle}
          className="border border-amber-200 hover:bg-amber-50 text-amber-700 font-medium py-3 rounded-lg transition text-sm sm:text-base shadow-sm flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
