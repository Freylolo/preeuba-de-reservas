import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/Login/index.jsx';
import Home from './pages/Home/index.jsx';
import Reservas from './pages/Reservas/index.jsx';
import Register from './pages/register/index.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
       <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reservas" element={<Reservas />} />
      <Route path="/home" element={<Home />} />
      <Route path="/registro" element={<Register />} />
    </Routes>
  );
}

export default App

