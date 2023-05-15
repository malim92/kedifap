import React, { useState } from "react";
import { useNavigate   } from 'react-router-dom'
import axios from "axios";
import Cookies from "js-cookie";

import pill from "../assets/login img side.png";

function LoginForm({ setIsAuthenticated }) {
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loginCredentials = {
        username: username,
        password: password
      }

      let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      };
            
      const url = "https://kedifap-portal.com2go.co/authenticate"; //not correct
      //const url = "http://localhost:8000/authenticate";
      const response = await axios.post(url, loginCredentials);
      console.log( response,'response xxx' );
      Cookies.set('userId', username)

      setIsAuthenticated(true); 
      return navigate({
        pathname: '/app',
        //search: `?userId=${username}`,
      });
    } catch (error) {
      setIsAuthenticated(false);
      alert("Username or Password is wrong!");
      console.error(error);
    }
    //return window.location.href = "http://localhost:3000/app";
    //return (window.location.href = "https://kedi-app.com2go.co/app");
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
