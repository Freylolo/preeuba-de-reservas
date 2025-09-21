import { useState, useEffect, useCallback } from "react";

export default function useReserva(token, role) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_RESERVAS = "http://localhost:8080/api/reservations";

  const fetchReservas = useCallback(async () => {
    setLoading(true);
    try {
      const url = role === "ADMIN" ? API_RESERVAS : `${API_RESERVAS}/reservasusuario`;
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("No se pudieron cargar las reservas");
      const data = await response.json();
      console.log("Reservas cargadas:", data);
      setReservas(data); // Se setea tal cual venía de la API
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const crearReserva = async (reserva) => {
    setLoading(true);
    try {
      const response = await fetch(API_RESERVAS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(reserva),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.mensaje || "Error al crear reserva");
      }
      setSuccess("Reserva creada correctamente");
      fetchReservas();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editarReserva = async (reserva) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_RESERVAS}/${reserva.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(reserva),
      });
      if (!response.ok) throw new Error("Error al actualizar reserva");
      setSuccess("Reserva actualizada correctamente");
      fetchReservas();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarReserva = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_RESERVAS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar reserva");
      setSuccess("Reserva eliminada");
      fetchReservas();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    setLoading(true);
    try {
      const endpoint = estado === "CONFIRMED" ? "confirm" : "cancel";
      const response = await fetch(`${API_RESERVAS}/${id}/${endpoint}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cambiar estado");
      setSuccess(`Estado cambiado a ${estado}`);
      fetchReservas();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    reservas,
    loading,
    error,
    success,
    fetchReservas,
    crearReserva,
    editarReserva,
    eliminarReserva,
    cambiarEstado,
    setError,
    setSuccess,
  };
}
