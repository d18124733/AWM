import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./components/MapPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import BaseLayout from "./components/BaseLayout";

const App = () => {
  
  // used to store log in state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // SPA routing
  return (
    <Router>
      <BaseLayout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser}/>} />
        </Routes>
      </BaseLayout>
    </Router>
  );
};

export default App;
