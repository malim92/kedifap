import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import withAuth from './middlewares/tokenValidation';

import ProductsTable from "./pages/ProductsTable";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Information from "./pages/Information";
import Orders from "./pages/Orders";
import Statements from "./pages/Statements";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route element={<Navbar />}>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue" element={<ProductsTable />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/customer-statements" element={<Statements />} />
      <Route path="/general-information" element={<Information />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="/login" element={<Login />} /> */}
    </Route>
    <Route path="/login" element={<Login />} />
    </>
  )
);

function App() {
  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}
export default App;
//export default withAuth(App);
