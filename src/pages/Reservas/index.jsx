import { useState } from "react";
import Header from "../../components/Header.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Snackbar, Alert } from "@mui/material";
import useReservas from "../../hooks/useReserva.js";
import useRooms from "../../hooks/useRooms.js";

export default function Reservas() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const {
    reservas,
    error,
    success,
    crearReserva,
    editarReserva,
    eliminarReserva,
    cambiarEstado,
    setError,
    setSuccess
  } = useReservas(token, role);

  const { rooms } = useRooms(token);

  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nuevaReserva, setNuevaReserva] = useState({
    id: null,
    roomId: "",
    fechaHoraInicio: null,
    fechaHoraFin: null,
  });

  const abrirModalEditar = (reserva) => {
    setNuevaReserva({
      id: reserva.id,
      roomId: reserva.roomId,
      fechaHoraInicio: reserva.fechaHoraInicio,
      fechaHoraFin: reserva.fechaHoraFin,
    });
    setShowModal(true);
  };

  const handleGuardar = () => {
    if (!nuevaReserva.roomId || !nuevaReserva.fechaHoraInicio || !nuevaReserva.fechaHoraFin) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (nuevaReserva.id) {
      editarReserva(nuevaReserva);
    } else {
      crearReserva(nuevaReserva);
    }

    setNuevaReserva({ id: null, roomId: "", fechaHoraInicio: null, fechaHoraFin: null });
    setShowModal(false);
  };

  const reservasFiltradas = reservas.filter(
    (r) =>
      r.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      rooms.find((s) => s.id === r.roomId)?.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getRoomName = (id) => rooms.find((s) => s.id === id)?.nombre || `Sala ${id}`;

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <Header />

      <h1 className="text-4xl font-bold text-black mb-6 text-center">Lista de Reservas</h1>

      {/* Buscador y botón */}
      <div className="flex flex-col items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Buscar por usuario o sala..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md mx-auto block border border-gray-300 bg-gray-50 text-gray-800 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900"
          onClick={() => setShowModal(true)}
        >
          Nueva Reserva
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Sala</th>
              <th className="p-3 text-left">Inicio</th>
              <th className="p-3 text-left">Fin</th>
              <th className="p-3 text-left">Estado</th>
              {role === "ADMIN" && <th className="p-3 text-left">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{r.email}</td>
                <td className="p-3">{getRoomName(r.roomId)}</td>
                <td className="p-3">{new Date(r.fechaHoraInicio).toLocaleString()}</td>
                <td className="p-3">{new Date(r.fechaHoraFin).toLocaleString()}</td>
                <td className="p-3">
                  {r.estado === "PENDING" && <span className="px-2 py-1 rounded text-sm font-semibold bg-yellow-200 text-yellow-800">Pendiente</span>}
                  {r.estado === "CONFIRMED" && <span className="px-2 py-1 rounded text-sm font-semibold bg-green-200 text-green-800">Confirmada</span>}
                  {r.estado === "CANCELLED" && <span className="px-2 py-1 rounded text-sm font-semibold bg-red-200 text-red-800">Cancelada</span>}
                </td>
                {role === "ADMIN" && (
                  <td className="p-3 flex gap-2">
                    <button
                      className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                      onClick={() => abrirModalEditar(r)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => eliminarReserva(r.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className={`px-2 py-1 rounded text-white ${r.estado === "CONFIRMED" ? "bg-yellow-500" : "bg-green-600"}`}
                      onClick={() => cambiarEstado(r.id, r.estado === "CONFIRMED" ? "CANCELLED" : "CONFIRMED")}
                    >
                      {r.estado === "CONFIRMED" ? "Cancelar" : "Confirmar"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md font-serif">
            <h2 className="text-2xl font-bold mb-6 text-center">{nuevaReserva.id ? "Editar Reserva" : "Nueva Reserva"}</h2>

            <div className="flex flex-col gap-4">
              <label className="font-semibold">Sala:</label>
              <select
                value={nuevaReserva.roomId}
                onChange={(e) => setNuevaReserva({ ...nuevaReserva, roomId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Seleccione una sala</option>
                {rooms.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>

              <label className="font-semibold">Fecha y hora inicio:</label>
              <DatePicker
                selected={nuevaReserva.fechaHoraInicio ? new Date(nuevaReserva.fechaHoraInicio) : null}
                onChange={(date) => setNuevaReserva({ ...nuevaReserva, fechaHoraInicio: date ? date.toISOString() : null })}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Seleccione fecha y hora"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />

              <label className="font-semibold">Fecha y hora fin:</label>
              <DatePicker
                selected={nuevaReserva.fechaHoraFin ? new Date(nuevaReserva.fechaHoraFin) : null}
                onChange={(date) => setNuevaReserva({ ...nuevaReserva, fechaHoraFin: date ? date.toISOString() : null })}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Seleccione fecha y hora"
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                  onClick={handleGuardar}
                >
                  {nuevaReserva.id ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </div>
  );
}
