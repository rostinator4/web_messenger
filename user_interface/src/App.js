import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "./transparent_logo2.png";
import "./App.css";
import Home from "./Main";

function Switch({ mode, setMode }) {
  return (
    <div style={{ margin: "10px 0" }}>
      {mode === "signin" ? (
        <button type="button" onClick={() => setMode("signup")}>
          Switch to Sign Up
        </button>
      ) : (
        <button type="button" onClick={() => setMode("signin")}>
          Switch to Sign In
        </button>
      )}
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // signin or signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("userName");
    const password = formData.get("password");

    const endpoint = mode === "signin" ? "login" : "register";

    try {
      const res = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (mode === "signin") navigate("/home", { state: { username } });
        else alert("Registration successful! You can now sign in.");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to Rostgramm!</h2>
        <h3>{mode === "signin" ? "Sign In to continue" : "Create an account"}</h3>

        <Switch mode={mode} setMode={setMode} />

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="Input1"
            name="userName"
            placeholder="Username"
            type="text"
          />
          <input
            className="Input2"
            name="password"
            placeholder="Password"
            type="password"
          />
          <button className="Button1" type="submit">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInForm />}></Route>
        <Route path="/home" element={<Home />}>
          {" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
