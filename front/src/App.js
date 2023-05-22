import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log(isAuthenticated, "isAuthenticated tesst");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/contact" element={<Contact />} />

        <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
          <Route element={<Navbar />}>
            <Route path="/app" element={<Home />} />
            <Route path="/app/catalogue" element={<ProductsTable />} />
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
