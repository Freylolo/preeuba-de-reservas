import { useState } from "react";
import Header from "../../components/Header.jsx";
import Alert from "@mui/material/Alert";
import useRooms from "../../hooks/useRooms.js";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";

export default function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const {
    rooms,
    loading,
    success,
    error,
    info,
    toggleEstado,
    eliminarRoom,
    editarRoom,
    guardarNuevaRoom,
  } = useRooms(token);

  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);

  const [roomEditar, setRoomEditar] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCapacidad, setNuevaCapacidad] = useState("");
  const [nuevaUbicacion, setNuevaUbicacion] = useState("");

  const [crearNombre, setCrearNombre] = useState("");
  const [crearCapacidad, setCrearCapacidad] = useState("");
  const [crearUbicacion, setCrearUbicacion] = useState("");

  const roomsFiltradas = rooms.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-serif">
      <Header />
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        <br></br>
        Lista de Salas
      </h1>

      {/* Alertas tipo Toast */}
      <Snackbar open={!!success} autoHideDuration={3000}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!info} autoHideDuration={3000}>
        <Alert severity="info">{info}</Alert>
      </Snackbar>

      {/* Botón Nueva Sala solo ADMIN */}
      {role === "ADMIN" && (
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-900 transition font-serif"
            onClick={() => setModalCrearOpen(true)}
          >
            Nueva Sala
          </button>
        </div>
      )}

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar sala..."
        className="w-full max-w-md mx-auto block border border-gray-300 bg-gray-50 text-gray-800 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Lista de Salas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={150}
                className="rounded-xl"
              />
            ))
          : roomsFiltradas.map((r) => (
              <div
                key={r.id}
                className={`bg-white border border-gray-200 p-5 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between ${
                  r.estado !== "AVAILABLE" ? "opacity-75" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {r.nombre}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.estado === "AVAILABLE"
                        ? "bg-green-200 text-green-900"
                        : "bg-red-200 text-red-900"
                    }`}
                  >
                    {r.estado === "AVAILABLE" ? "Disponible" : "No Disponible"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <strong>Capacidad:</strong> {r.capacidad}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {r.ubicacion}
                  </p>
                </div>

                {/* Botones ADMIN */}
                {role === "ADMIN" && (
                  <div className="flex justify-center gap-2 mt-auto flex-wrap">
                    <button
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                      onClick={() => toggleEstado(r.id, r.estado)}
                    >
                      {r.estado === "AVAILABLE"
                        ? "Marcar No Disponible"
                        : "Marcar Disponible"}
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-600 transition"
                      onClick={() => {
                        setRoomEditar(r);
                        setNuevoNombre(r.nombre);
                        setNuevaCapacidad(r.capacidad);
                        setNuevaUbicacion(r.ubicacion);
                        setModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                      onClick={() => eliminarRoom(r.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Modal Editar */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Editar Sala
            </h2>

            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nombre"
              className="w-full mb-3 border border-gray-200 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="number"
              value={nuevaCapacidad}
              onChange={(e) => setNuevaCapacidad(e.target.value)}
              placeholder="Capacidad"
              className="w-full mb-3 border border-gray-200 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              value={nuevaUbicacion}
              onChange={(e) => setNuevaUbicacion(e.target.value)}
              placeholder="Ubicación"
              className="w-full mb-3 border border-gray-200 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
                onClick={() =>
                  editarRoom(
                    roomEditar,
                    nuevoNombre,
                    nuevaCapacidad,
                    nuevaUbicacion,
                    () => setModalOpen(false)
                  )
                }
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear */}
      {modalCrearOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Nueva Sala
            </h2>

            <input
              type="text"
              placeholder="Nombre"
              value={crearNombre}
              onChange={(e) => setCrearNombre(e.target.value)}
              className="w-full mb-3 border border-gray-200 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Capacidad"
              value={crearCapacidad}
              onChange={(e) => setCrearCapacidad(e.target.value)}
              className="w-full mb-3 border border-gray-200 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Ubicación"
              value={crearUbicacion}
              onChange={(e) => setCrearUbicacion(e.target.value)}
              className="w-full mb-3 border border-gray-200 bg-gray-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition"
                onClick={() => setModalCrearOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
                onClick={() =>guardarNuevaRoom(crearNombre, crearCapacidad, crearUbicacion, () => setModalCrearOpen(false))}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
