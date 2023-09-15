import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import pill from "../assets/login img side.png";

function LoginForm({ setIsAuthenticated, setIsVendorName  }) {
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
        password: password,
      };
      
      const url = `${process.env.REACT_APP_API_URL}/authenticate`; //not correct
      //const url = "http://localhost:8000/authenticate";
      const response = await axios.post(url, loginCredentials);
      console.log(response, "response xxxG");
      const token = response.data.token;
      let userId = response.data.user.CUSTNAME;
      const userDesc = response.data.user.FIRM;
      const vendorId = response.data.user.SUPNAME;
      // userId == '' ? userId = vendorId : userId = userId;
      
      if (userId == '' || userId ==null) userId = vendorId;

      localStorage.setItem('kedTokAuth', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userDesc', userDesc);

      console.log(vendorId, "vendorId xxx");
      console.log(userId, "userId 2");
      if (userId.startsWith("V")) setIsVendorName(userId);
      
      setIsAuthenticated(true);
      return navigate({
        pathname: "/app",
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

      <div
        className="form-group"
        style={{ display: "flex", alignItems: "center" }}
      >
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
      <div
        className="form-group"
        style={{ display: "flex", alignItems: "center" }}
      >
        <a href="http://">Forgot Password</a>
      </div>
      <div
        className="form-group d-flex justify-content-start"
        style={{ display: "flex", alignItems: "center" }}
      >
        <input  type="checkbox" name="" id="" />
        <p style={{ padding: "5px" }}>Remember me</p>
      </div>
    </form>
  );
}

export default LoginForm;
