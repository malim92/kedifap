import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";

import { useState, useEffect } from "react";
import PrivateRoutes from "./pages/Routes/PrivateRoutes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductsTable from "./pages/ProductsTable";
import Orders from "./pages/Orders";
import Invoices from "./pages/Invoices";
import Statements from "./pages/Statements";
import Information from "./pages/Information";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Vendors from "./pages/Vendors";
import Backorders from "./pages/Backorders";
import ReturnPolicy from "./pages/ReturnPolicy";
//import router from "./Routes/routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isVendorName, setIsVendorName] = useState("");
  const [token, setToken] = useState('');
  
  console.log(isAuthenticated, "isAuthenticated tesst");
  console.log(token, "token tesst");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const validateUrl = new URL(
          "/validate-token",
          `${process.env.REACT_APP_API_URL}`
        );
        // Make a request to your '/authenticate' endpoint
        const response = await fetch(validateUrl.href, {
          // Include the token in the request headers
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // Token is valid
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          // Token expired or invalid
          setIsAuthenticated(false);
        } else {
          // Other error occurred
          throw new Error('Failed to authenticate token.');
        }
      } catch (error) {
        console.error(error);
        // Handle the error, e.g., show an error message or redirect to an error page
      }
    };

    validateToken();
  }, []); // Run the token validation only once when the component mounts


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Login setIsVendorName={setIsVendorName} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />}
        />
        <Route path="/contact" element={<Contact />} />

        <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
          <Route element={<Navbar isVendorName={isVendorName} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/catalogue" element={<ProductsTable isVendorName={isVendorName}/>} />
            <Route path="/app/orders" element={<Orders />} />
            <Route path="/app/invoices" element={<Invoices />} />
            <Route path="/app/customer-statements" element={<Statements />} />
            <Route path="/app/general-information" element={<Information />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/vendors" element={<Vendors />} />
            <Route path="/app/backorders" element={<Backorders />} />
            <Route path="/app/return-policy" element={<ReturnPolicy />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/contact" element={<Contact />} />

          </Route>
        </Route>
      </>
    )
  );

  return <div className="App">{<RouterProvider router={router} />}</div>;
}
export default App;
//export default withAuth(App);
