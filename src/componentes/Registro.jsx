import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  // variable para guardar Auth
  const { register, loginWithGoogle } = useAuth();

  // estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // función para traducir errores de Firebase
  function traducirError(code) {
    switch (code) {
      case "auth/email-already-in-use":
        return "Este correo ya está registrado.";
      case "auth/invalid-email":
        return "El formato del correo no es válido.";
      case "auth/weak-password":
        return "La contraseña es demasiado débil. Intenta con una más segura.";
      default:
        return "Ocurrió un error inesperado. Intenta nuevamente.";
    }
  }

  // función para registrar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(email, password);
      console.log("Usuario registrado correctamente ✅");
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
    }
  };

  // función para login con Google
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

  // 🌟 interfaz estilizada tipo "formulario dorado"
  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-amber-100 text-gray-800 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-amber-600 text-center drop-shadow-sm">
        Crear cuenta ✨
      </h1>

      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-md border border-amber-100">
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-amber-700">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-amber-700">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-sm hover:shadow-md"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full border border-amber-200 hover:bg-amber-50 text-amber-700 font-medium py-2 rounded-lg transition text-sm sm:text-base shadow-sm"
          >
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
