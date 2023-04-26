import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
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
//import router from "./Routes/routes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Navbar />}>
        <Route path="/app" element={<Home />} />
        <Route path="/app/catalogue" element={<ProductsTable />} />
        <Route path="/app/orders" element={<Orders />} />
        <Route path="/app/invoices" element={<Invoices />} />
        <Route path="/app/customer-statements" element={<Statements />} />
        <Route path="/app/general-information" element={<Information />} />
        <Route path="/app/contact" element={<Contact />} />
        <Route path="/app/profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Login />} />
    </>
  )
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}
export default App;
//export default withAuth(App);
