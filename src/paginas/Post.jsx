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
import { Pencil, Trash2, Save } from "lucide-react";

function Post() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // orden descendente por fecha
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPost(docs);
    });
    return () => unsubscribe();
  }, []);

  const agregarPost = async () => {
    if (!texto.trim()) return alert("Por favor escribe un mensaje");
    await addDoc(collection(db, "post"), {
      mensaje: texto,
      createdAt: new Date(),
      updatedAt: null,
    });
    setTexto("");
  };

  const borrarPost = async (id) => {
    const documento = doc(db, "post", id);
    await deleteDoc(documento);
  };

  const comenzarEdicion = (m) => {
    setEditId(m.id);
    setEditText(m.mensaje ?? "");
  };

  const guardarEdicion = async () => {
    const id = editId;
    if (!id) return;
    const ref = doc(db, "post", id);
    await updateDoc(ref, {
      mensaje: editText,
      updatedAt: new Date(),
    });
    setEditId(null);
    setEditText("");
  };

  const onEditKeyDown = (e) => {
    if (e.key === "Enter") guardarEdicion();
    if (e.key === "Escape") {
      setEditId(null);
      setEditText("");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-amber-100 text-gray-800 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-6 text-amber-600 drop-shadow-sm">
        Publicaciones
      </h1>

      {/* Input para nuevo post */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col sm:flex-row gap-4 w-full max-w-2xl border border-amber-100">
        <input
          className="flex-1 border border-amber-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-300 placeholder-gray-400"
          type="text"
          placeholder="Escribe algo bonito..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarPost()}
        />
        <button
          className="bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-sm hover:shadow-md"
          onClick={agregarPost}
        >
          Enviar
        </button>
      </div>

      {/* Lista de posts */}
      <div className="mt-10 bg-white shadow-md rounded-xl p-6 w-full max-w-2xl border border-amber-100">
        <h3 className="text-2xl font-semibold mb-4 text-amber-600">Mensajes</h3>
        <ul className="space-y-3">
          {post.map((m) => {
            const enEdicion = editId === m.id;
            const fechaCreacion = m.createdAt
              ? new Date(
                  m.createdAt.seconds
                    ? m.createdAt.seconds * 1000
                    : m.createdAt
                ).toLocaleString()
              : "";
            const fechaEdicion = m.updatedAt
              ? new Date(
                  m.updatedAt.seconds
                    ? m.updatedAt.seconds * 1000
                    : m.updatedAt
                ).toLocaleString()
              : null;

            return (
              <li
                key={m.id}
                className="p-4 bg-amber-50 hover:bg-amber-100 transition rounded-lg border border-amber-100 shadow-sm flex flex-col gap-2"
              >
                {enEdicion ? (
                  <div className="flex flex-col gap-2">
                    <input
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={onEditKeyDown}
                      className="w-full p-2 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-300 outline-none"
                      placeholder="Editar mensaje..."
                    />
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={guardarEdicion}
                        className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
                      >
                        <Save size={16} /> Guardar
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 break-wrap-words">
                        {m.mensaje}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {fechaCreacion}
                        {fechaEdicion && (
                          <span className="ml-1 text-gray-400">
                            · editado {fechaEdicion}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => comenzarEdicion(m)}
                        className="text-amber-600 hover:text-amber-800 transition"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => borrarPost(m.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Post;
