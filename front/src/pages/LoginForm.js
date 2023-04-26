import React, { useState } from "react";

import pill from "../assets/login img side.png";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //return window.location.href = "http://localhost:3000/app";
    return (window.location.href = "https://kedi-app.com2go.co/app");
    console.log(`Username: ${username}, Password: ${password}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          placeholder="Όνομα Χρήστη"
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          placeholder="Κωδικός"
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            background: "#82b78d",
            marginTop: "15px",
            textAlign: "center",
            width: "10em",
            border: "0px",
            color: "#000",
          }}
          type="submit"
          className="btn btn-primary form-button"
        >
          Είσοδος
        </button>
        <img
          alt=""
          src={pill}
          style={{
            right: "30px",
            width: "6em",
            position: "relative",
            top: "10px",
          }}
        />
      </div>
    </form>
  );
}

export default LoginForm;
