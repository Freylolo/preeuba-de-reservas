import { useState, useEffect, useCallback } from "react";


export default function useRooms(token) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const API_ROOMS = import.meta.env.VITE_API_ROOMS;

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetch(API_ROOMS, {
      headers: token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("No se pudieron cargar las salas");
    const data = await response.json();
    setRooms(data);
    setError("");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [token, API_ROOMS]);


 useEffect(() => {
  fetchRooms();
}, [fetchRooms]);


  // Limpieza automática de mensajes
  useEffect(() => {
    if (success || error || info) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
        setInfo("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, info]);

  // Toggle estado
  const toggleEstado = async (id, estado) => {
    if (!token) return setInfo("Debes estar logueado para actualizar");

    try {
      const nuevoEstado = estado?.toUpperCase() === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
      const response = await fetch(`${API_ROOMS}/${id}/estado?estado=${nuevoEstado}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al actualizar sala");

      setRooms(prev =>
        prev.map(r => (r.id === id ? { ...r, estado: nuevoEstado } : r))
      );
      setSuccess("Estado actualizado correctamente");
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar sala
  const eliminarRoom = async id => {
    if (!token) return setInfo("Debes estar logueado para eliminar");
    try {
      const response = await fetch(`${API_ROOMS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al eliminar sala");
      setSuccess("Sala eliminada con éxito");
      fetchRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  // Editar sala
  const editarRoom = async (roomEditar, nuevoNombre, nuevaCapacidad, nuevaUbicacion, closeModal) => {
    if (!token) return setInfo("Sin permisos");
    try {
      const response = await fetch(`${API_ROOMS}/${roomEditar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...roomEditar,
          nombre: nuevoNombre,
          capacidad: parseInt(nuevaCapacidad),
          ubicacion: nuevaUbicacion,
          estado: "AVAILABLE",
        }),
      });
      if (!response.ok) throw new Error("Error al editar sala");

      setRooms(prev =>
        prev.map(r =>
          r.id === roomEditar.id
            ? { ...r, nombre: nuevoNombre, capacidad: parseInt(nuevaCapacidad), ubicacion: nuevaUbicacion, estado: "AVAILABLE" }
            : r
        )
      );
      setSuccess("Sala editada correctamente");
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Crear nueva sala
  const guardarNuevaRoom = async (crearNombre, crearCapacidad, crearUbicacion, closeModal) => {
    if (!crearNombre || !crearCapacidad || !crearUbicacion) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!token) return setInfo("Sin permisos");

    try {
      const body = {
        nombre: crearNombre,
        capacidad: parseInt(crearCapacidad),
        ubicacion: crearUbicacion,
        estado: "AVAILABLE",
      };
      const response = await fetch(API_ROOMS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensaje || errorData?.error || `Error ${response.status}`);
      }
      setSuccess("Sala creada exitosamente");
      fetchRooms();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    rooms,
    loading,
    success,
    error,
    info,
    fetchRooms,
    toggleEstado,
    eliminarRoom,
    editarRoom,
    guardarNuevaRoom,
  };
}
