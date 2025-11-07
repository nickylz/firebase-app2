import { useState } from "react";
import { Upload, Loader2, UserPlus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegistroModal({ onCerrar }) {
  const { register, loginWithGoogle } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // --- Manejar imagen de perfil ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- Registro normal ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, username, avatarFile);
      setSuccess(true);
      setTimeout(() => onCerrar(), 1000); // cerrar tras éxito
    } catch (err) {
      console.error(err);
      setError("Error al registrar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // --- Login con Google ---
  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      onCerrar();
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  // --- Cerrar al hacer clic fuera del modal ---
  const handleClickFondo = (e) => {
    if (e.target.id === "fondoModal") {
      onCerrar();
    }
  };

  return (
    <div
      id="fondoModal"
      onClick={handleClickFondo}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3"
    >
      <div
        onClick={(e) => e.stopPropagation()} // evita que el clic dentro cierre
        className="bg-white border border-amber-100 shadow-xl rounded-2xl w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh] animate-fadeIn"
      >
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        {/* Encabezado */}
        <h1 className="text-3xl font-bold text-amber-600 mb-2">Crea tu cuenta</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Únete y comparte tus publicaciones 🌍
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: OliverTC"
              className="w-full border border-amber-200 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-amber-300 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              className="w-full border border-amber-200 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-amber-300 outline-none transition"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-amber-200 rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-amber-300 outline-none transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Debe tener al menos 6 caracteres.
            </p>
          </div>

          {/* Imagen de perfil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de perfil (opcional)
            </label>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
                <Upload size={16} /> Subir
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="w-14 h-14 rounded-full border-2 border-amber-300 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-600 rounded-lg p-2 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-200 text-green-600 rounded-lg p-2 text-sm text-center">
              ¡Cuenta creada con éxito! 🎉
            </div>
          )}

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-lg shadow-md flex justify-center items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        {/* Iniciar con Google */}
        <div className="mt-5">
          <button
            onClick={handleGoogle}
            className="w-full border border-gray-300 rounded-lg py-2.5 flex justify-center items-center gap-3 text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Iniciar con Google
          </button>
        </div>

        {/* Pie */}
        <p className="text-gray-500 text-sm mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-amber-600 hover:underline cursor-pointer"
            onClick={onCerrar}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}
