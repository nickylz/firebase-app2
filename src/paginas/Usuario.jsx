import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Edit, Trash2 } from "lucide-react";

export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
  });

  // Leer usuarios
  useEffect(() => {
    const consulta = query(collection(db, "usuarios"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(docs);
    });
    return () => unsubscribe();
  }, []);

  // Agregar usuario
  const agregarUsuario = async (e) => {
    e.preventDefault();
    if (
      !formulario.nombre.trim() ||
      !formulario.apellidos.trim() ||
      !formulario.correo.trim() ||
      !formulario.telefono.trim()
    ) {
      return alert("Por favor completa todos los campos");
    }

    await addDoc(collection(db, "usuarios"), {
      ...formulario,
      fecha: new Date().toLocaleDateString(),
    });

    setFormulario({
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
    });
  };

  // Borrar usuario
  const borrarUsuario = async (id) => {
    const documento = doc(db, "usuarios", id);
    await deleteDoc(documento);
  };

  // Editar usuario
  const comenzarEdicion = (u) => {
    setEditId(u.id);
    setEditForm({
      nombre: u.nombre,
      apellidos: u.apellidos,
      correo: u.correo,
      telefono: u.telefono,
    });
  };

  const guardarEdicion = async (id) => {
    const ref = doc(db, "usuarios", id);
    await updateDoc(ref, editForm);
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-amber-100 text-gray-800 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-amber-600 text-center drop-shadow-sm">
        Usuarios
      </h1>

      {/* Formulario */}
      <form
        onSubmit={agregarUsuario}
        className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 w-full max-w-lg border border-amber-100"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={(e) =>
              setFormulario({ ...formulario, nombre: e.target.value })
            }
            className="border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={formulario.apellidos}
            onChange={(e) =>
              setFormulario({ ...formulario, apellidos: e.target.value })
            }
            className="border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="number"
            placeholder="Teléfono"
            value={formulario.telefono}
            onChange={(e) =>
              setFormulario({ ...formulario, telefono: e.target.value })
            }
            className="border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="email"
            placeholder="Correo"
            value={formulario.correo}
            onChange={(e) =>
              setFormulario({ ...formulario, correo: e.target.value })
            }
            className="border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-300"
          />
        </div>
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 w-full"
        >
          Agregar usuario
        </button>
      </form>

      {/* Lista */}
      <div className="mt-10 bg-white shadow-md rounded-xl p-6 w-full max-w-4xl border border-amber-100">
        <h3 className="text-2xl font-semibold mb-4 text-amber-600 text-center sm:text-left">
          Lista de Usuarios
        </h3>
        <ul className="space-y-4">
          {usuarios.map((u) => (
            <li
              key={u.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-amber-50 hover:bg-amber-100 transition rounded-lg p-4 border border-amber-100 shadow-sm"
            >
              {editId === u.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nombre: e.target.value })
                    }
                    className="border border-amber-200 rounded p-2"
                  />
                  <input
                    type="text"
                    value={editForm.apellidos}
                    onChange={(e) =>
                      setEditForm({ ...editForm, apellidos: e.target.value })
                    }
                    className="border border-amber-200 rounded p-2"
                  />
                  <input
                    type="number"
                    value={editForm.telefono}
                    onChange={(e) =>
                      setEditForm({ ...editForm, telefono: e.target.value })
                    }
                    className="border border-amber-200 rounded p-2"
                  />
                  <input
                    type="email"
                    value={editForm.correo}
                    onChange={(e) =>
                      setEditForm({ ...editForm, correo: e.target.value })
                    }
                    className="border border-amber-200 rounded p-2"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => guardarEdicion(u.id)}
                      className="bg-amber-400 hover:bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-semibold"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-lg text-gray-800">
                      {u.nombre} {u.apellidos}
                    </p>
                    <p className="text-sm text-gray-600">{u.correo}</p>
                    <p className="text-sm text-gray-600">{u.telefono}</p>
                    <p className="text-xs text-gray-400 italic">
                      Registrado el {u.fecha}
                    </p>
                  </div>
                  <div className="flex justify-center sm:justify-end gap-4 mt-2 sm:mt-0">
                    <button
                      onClick={() => comenzarEdicion(u)}
                      className="text-amber-600 hover:text-amber-800 transition"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => borrarUsuario(u.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
