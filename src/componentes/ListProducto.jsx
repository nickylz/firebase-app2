import React, { useState, useEffect } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function ListProducto() {
  const [productos, setProductos] = useState([]);
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [formEdicion, setFormEdicion] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    precio: "",
    imagenURL: "",
  });
  const [imagenNuevaArchivo, setImagenNuevaArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const productosRef = collection(db, "productos");
    const q = query(productosRef, orderBy("creadoEn", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(docs);
    });

    return () => unsubscribe();
  }, []);

  const handleEdicionChange = (e) => {
    const { name, value } = e.target;
    setFormEdicion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagenNuevaChange = (e) => {
    const archivo = e.target.files[0];
    setImagenNuevaArchivo(archivo);
  };

  const empezarEdicion = (producto) => {
    setProductoEditandoId(producto.id);
    setFormEdicion({
      titulo: producto.titulo || "",
      descripcion: producto.descripcion || "",
      categoria: producto.categoria || "",
      precio: producto.precio || "",
      imagenURL: producto.imagenURL || "",
    });
    setImagenNuevaArchivo(null);
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setProductoEditandoId(null);
    setImagenNuevaArchivo(null);
    setMensaje("");
  };

  const guardarCambios = async (e, productoId) => {
    e.preventDefault();
    setMensaje("");

    if (
      !formEdicion.titulo ||
      !formEdicion.descripcion ||
      !formEdicion.categoria ||
      formEdicion.precio === ""
    ) {
      setMensaje("⚠️ Completa todos los campos antes de guardar.");
      return;
    }

    setCargando(true);

    try {
      const docRef = doc(db, "productos", productoId);
      const datosActualizados = {
        titulo: formEdicion.titulo,
        descripcion: formEdicion.descripcion,
        categoria: formEdicion.categoria,
        precio: Number(formEdicion.precio),
      };

      if (imagenNuevaArchivo) {
        const nombreArchivo = `${Date.now()}-${imagenNuevaArchivo.name}`;
        const imagenRef = ref(storage, `productos/${nombreArchivo}`);
        await uploadBytes(imagenRef, imagenNuevaArchivo);
        const nuevaURL = await getDownloadURL(imagenRef);
        datosActualizados.imagenURL = nuevaURL;
      }

      await updateDoc(docRef, datosActualizados);
      setMensaje("✅ Producto actualizado correctamente.");
      setProductoEditandoId(null);
      setImagenNuevaArchivo(null);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setMensaje("❌ Ocurrió un error al actualizar el producto.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (productoId) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    try {
      const docRef = doc(db, "productos", productoId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMensaje("❌ Ocurrió un error al eliminar el producto.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        🛍️ Lista de Productos
      </h2>

      {mensaje && (
        <p className="mb-4 text-sm text-gray-700 bg-yellow-100 border border-yellow-300 px-3 py-2 rounded-lg">
          {mensaje}
        </p>
      )}

      {productos.length === 0 ? (
        <p className="text-gray-600 text-center">
          No hay productos registrados todavía.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => {
            const estaEditando = productoEditandoId === producto.id;

            return (
              <div
                key={producto.id}
                className="bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-3 border hover:shadow-xl transition"
              >
                {estaEditando ? (
                  <form
                    onSubmit={(e) => guardarCambios(e, producto.id)}
                    className="flex flex-col gap-3"
                  >
                    <h3 className="text-lg font-semibold text-blue-700">
                      ✏️ Editar producto
                    </h3>

                    {formEdicion.imagenURL && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Imagen actual:
                        </p>
                        <img
                          src={formEdicion.imagenURL}
                          alt={formEdicion.titulo}
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva imagen (opcional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenNuevaChange}
                        className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Si eliges una nueva imagen, reemplazará a la anterior.
                      </p>
                    </div>

                    <input
                      type="text"
                      name="titulo"
                      value={formEdicion.titulo}
                      onChange={handleEdicionChange}
                      placeholder="Título"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                      name="descripcion"
                      value={formEdicion.descripcion}
                      onChange={handleEdicionChange}
                      placeholder="Descripción"
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      name="categoria"
                      value={formEdicion.categoria}
                      onChange={handleEdicionChange}
                      placeholder="Categoría"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="number"
                      name="precio"
                      value={formEdicion.precio}
                      onChange={handleEdicionChange}
                      placeholder="Precio (S/)"
                      min="0"
                      step="0.01"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        type="button"
                        onClick={cancelarEdicion}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={cargando}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                      >
                        {cargando ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {producto.imagenURL && (
                      <img
                        src={producto.imagenURL}
                        alt={producto.titulo}
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {producto.titulo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {producto.descripcion}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Categoría:{" "}
                        <span className="font-medium">
                          {producto.categoria}
                        </span>
                      </p>
                      <p className="text-sm font-bold text-green-700 mt-1">
                        S/ {producto.precio}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        onClick={() => empezarEdicion(producto)}
                        className="px-3 py-1 rounded-lg bg-yellow-400 text-gray-800 text-sm font-semibold hover:bg-yellow-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
