import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE;
  console.log("API_BASE:", API_BASE);
  

  const login = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Ingresa email y contraseña");
    setSuccess("");
    return;
  }

  try {
    const response = await fetch(`${API_BASE }/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      let errorMessage = "Error en el login";
      try {
        const errData = await response.json();
        errorMessage = errData.mensaje || errData.error || errorMessage;
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Respuesta login:", data);

    // Decodificar payload del JWT
    const token = data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.rol || payload.role || "USER";
    const userEmail = payload.sub || data.email;

    // Guardar en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", userEmail);

    setError("");
    setSuccess("Login exitoso");

    setTimeout(() => navigate("/home"), 2000);

  } catch (err) {
    setError(err.message);
    setSuccess("");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Login
        </h2>

        {/* ALERTAS */}
        <Stack spacing={2} className="mb-4">
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>

        <form onSubmit={login}>
          <div className="mb-6">
            <label className="block text-black font-bold mb-2">Correo</label>
            <input
              type="email"
              className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-black font-bold mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 hover:scale-105 transition transform">
            Ingresar
          </button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-blue-500 hover:underline font-semibold"
          >
            Crear usuario
          </Link>
        </p>
      </div>
    </div>
  );
}
