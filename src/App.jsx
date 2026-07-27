import { useState } from "react";
import "./App.css";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("welcome");
  const [currentUser, setCurrentUser] = useState(null);

  // Welcome → Login
  const goToLogin = () => {
    setPage("login");
  };

  // Welcome → Register
  const goToRegister = () => {
    setPage("register");
  };

  // Login/Register → Welcome
  const goToWelcome = () => {
    setPage("welcome");
  };

  // Login successful → Dashboard
  const handleLoginSuccess = (user) => {
    console.log("Logged in user:", user);

    setCurrentUser(user);
    setPage("dashboard");
  };

  // Logout → Welcome
  const handleLogout = () => {
    setCurrentUser(null);
    setPage("welcome");
  };

  return (
    <div className="app">

      {/* WELCOME */}
      {page === "welcome" && (
        <Welcome
          onLogin={goToLogin}
          onRegister={goToRegister}
        />
      )}

      {/* LOGIN */}
      {page === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onRegister={goToRegister}
          onBack={goToWelcome}
        />
      )}

      {/* REGISTER */}
      {page === "register" && (
        <Register
          onLogin={goToLogin}
          onBack={goToWelcome}
          onRegisterSuccess={goToLogin}
        />
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && currentUser && (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;