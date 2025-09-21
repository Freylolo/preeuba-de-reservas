import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";   

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  
  const API_URL = "http://localhost:8080";
  const register = async (e) => {
    e.preventDefault();

    const userData = { name, email, password, role };

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = "Error al crear usuario";
        try {
          const errorData = await response.json();
          errorMessage = errorData.mensaje || errorData.error || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Usuario creado:", data);

      setError("");
      setSuccess("Usuario registrado correctamente!");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Registro
        </h2>
         <Stack spacing={2} className="mb-4">
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
        <form onSubmit={register}>
          <div className="mb-4">
            <label className="block text-black font-bold mb-2">Nombre</label>
            <input
              type="text"
              className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black font-bold mb-2">Correo</label>
            <input
              type="email"
              className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black font-bold mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-black font-bold mb-2">Rol</label>
            <select
              className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 hover:scale-105 transition transform">
            Registrar
          </button>
        </form>

        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
