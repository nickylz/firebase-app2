import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react"; // íconos modernos

export default function Registro() {
  const { register, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-amber-100 flex items-center justify-center px-4">
      {/* Tarjeta contenedora */}
      <div className="bg-white shadow-2xl rounded-2xl border border-amber-100 w-full max-w-4x73 p-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-amber-600 mb-8 drop-shadow-sm text-center">
          Crear cuenta
        </h1>

        <div className="w-full max-w-lg">
          {error && (
            <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Registrarse
            </button>
          </form>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full border border-amber-200 hover:bg-amber-50 text-amber-700 font-medium py-3 rounded-lg transition text-sm sm:text-base shadow-sm flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}
