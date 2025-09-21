import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/"); 
  };

  return (
    <div className="bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-black-600">Reserva de Salas</h1>
      </div>

      <div className="flex gap-4">
        <Link
          to="/home"
          className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition"
        >
          Home
        </Link>
        <Link
          to="/reservas"
          className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition"
        >
          Reservas
        </Link>
        <button
          onClick={logout}
          className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
