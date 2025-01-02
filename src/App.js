import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

const MainApp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (token) {
      alert("You are already logged in!");
      return;
    }

    try {
      const response = await axios.post("https://faircloudserver-hardik-trivedis-projects-038e8892.vercel.app/login", { username, password });
      if (response && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://faircloudserver-hardik-trivedis-projects-038e8892.vercel.app/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load dashboard.");
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isLoggedIn ? (
            <div>
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit">Login</button>
              </form>
            </div>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <div>
              <h2>Dashboard</h2>
              <button onClick={fetchDashboard}>Load Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
