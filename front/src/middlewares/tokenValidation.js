import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function withAuth(Component) {
  return function WithAuth(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
      const token = Cookies.get("jwt_token");
      async function checkAuth() {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        axios
          //.post("http://localhost:8000/validate-token", 'data', config)
          .post("https://kedifap-portal.com2go.co/validate-token", config)
          .then((response) => {
            console.log(response.data.isTokenValid,'hert 1');
            setIsAuthenticated(response.data.isTokenValid);
          })
          .catch((error) => {
            console.log(error);
          });

        // console.log("here 1", props);
        // // Make a request to the server to check if the token is authenticated
        // const response = await fetch("http://localhost:8000/validate-token", {
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // console.log("here 2");
        // const data = await response.json();
        // console.log(data, "data");
        // debugger;
        // setIsAuthenticated(data.isAuthenticated);
      }
      checkAuth();
    }, []);

    if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      // Redirect the user to a login page or display an error message
      return window.location.href = "https://kedifap-portal.com2go.co/?error=noToken";
      //return window.location.href = "http://localhost:8000/?error=noToken";
      //return <p>You are not authorized to access this page.</p>;
    }
  };
}

export default withAuth;