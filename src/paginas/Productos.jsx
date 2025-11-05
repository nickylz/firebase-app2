import { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function Productos() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    precio: "",
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    setImagenArchivo(archivo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.categoria ||
      !formData.precio ||
      !imagenArchivo
    ) {
      setMensaje("Por favor, completa todos los campos y selecciona una imagen.");
      return;
    }

    setCargando(true);

    try {
      const nombreArchivo = `${Date.now()}-${imagenArchivo.name}`;
      const imagenRef = ref(storage, `productos/${nombreArchivo}`);

      await uploadBytes(imagenRef, imagenArchivo);
      const imagenURL = await getDownloadURL(imagenRef);

      await addDoc(collection(db, "productos"), {
        ...formData,
        precio: Number(formData.precio),
        imagenURL,
        creadoEn: serverTimestamp(),
      });

      setFormData({ titulo: "", descripcion: "", categoria: "", precio: "" });
      setImagenArchivo(null);
      e.target.reset?.();
      setMensaje("✅ Producto guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setMensaje("❌ Ocurrió un error al guardar el producto.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-amber-100 text-gray-800 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-amber-600 text-center drop-shadow-sm">
        Agregar Producto
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-2xl border border-amber-100 space-y-5"
      >
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: Laptop básica"
            className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Escribe una breve descripción del producto"
            className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 mb-1">
            Categoría
          </label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Ej: Computación, Belleza, Textil..."
            className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 mb-1">
            Precio (S/)
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Ej: 150.00"
            min="0"
            step="0.01"
            className="w-full border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold text-amber-700 mb-1">
            Imagen del producto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="w-full border border-amber-200 rounded-lg p-3 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-sm hover:shadow-md"
        >
          {cargando ? "Guardando..." : "Guardar producto"}
        </button>

        {/* Mensaje */}
        {mensaje && (
          <p className="mt-3 text-center text-sm font-medium text-gray-700">
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}
