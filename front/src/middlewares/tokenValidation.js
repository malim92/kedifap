import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";

function withAuth(Component) {
  return function WithAuth(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
      const token = Cookies.get("jwt_token");
      async function checkAuth() {
        console.log();
        // Make a request to the server to check if the token is authenticated
        const response = await fetch('http://localhost:8000/validate-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      }
      checkAuth();
    }, []);

    if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      // Redirect the user to a login page or display an error message
      return window.location.href = "http://localhost:8000/?error=noToken";
      //return <p>You are not authorized to access this page.</p>;
    }
  };
}

export default withAuth;
//http://localhost:8000/validate-token