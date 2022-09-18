// import Navbar from "./components/navbar/navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Student from "./pages/student";
import Login from "./login";
import Dashboard from "./dashboard";
import Auth from "./hooks/auth";

function App() {
  const { getToken } = Auth();
  if (!getToken()) {
    return <Login />;
  }
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
