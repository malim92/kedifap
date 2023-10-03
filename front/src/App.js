import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
  Navigate
} from "react-router-dom";
import axios from "axios";
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
  const [isVendorName, setIsVendorName] = useState("");
  const token = localStorage.getItem("kedTokAuth");
  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);
  
  console.log(isAuthenticated, "isAuthenticated tesst");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/check-token?token=${token}`
        );

        console.log(response, "response token");

        if (response.status === 200) {
          // Token is valid
          console.log("token validated", token);
          if (response.data.role == "vendor") setIsVendorName(response.data.userId);
          setIsAuthenticated(true);
          console.log(isVendorName, "isVendorName tesst");


          // return navigate({
          //   pathname: "/app",
          //   //search: `?userId=${username}`,
          // });
        }else {
          // Other error occurred
          throw new Error("Failed to authenticate token.");
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('kedTokAuth');
        console.error(error);
        // Handle the error, e.g., show an error message or redirect to an error page
      }
    };

    validateToken();
  }, [token]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {!isAuthenticated ?
          <>
            <Route
              path="/"
              element={
                <Login
                  // setIsVendorName={setIsVendorName}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        :
          <Route
            element={
              <Navbar
                isVendorName={isVendorName}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          >
            <Route path="/app" element={<Home isVendorName={isVendorName} />} />
            <Route
              path="/app/catalogue"
              element={<ProductsTable isVendorName={isVendorName} />}
            />
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
            <Route path="*" element={<Navigate to="/app" />} />
          </Route>
        }
      </>
    )
  );

  return <div className="App">{<RouterProvider router={router} />}</div>;
}
export default App;
//export default withAuth(App);
