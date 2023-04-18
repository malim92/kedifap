import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import ProductsTable from "./pages/ProductsTable";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Information from "./pages/Information";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Navbar />}>
      <Route path="/" element={<Home />} />
      <Route path="/catalogue" element={<ProductsTable />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/general-information" element={<Information />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  )
);

function App() {
  const token = Cookies.get("jwt_token");
  // return (
  //   <div className="App">
  //       <RouterProvider router={router} />
  //   </div>
  // );
  if (!token) {
    //window.location.href = "http://localhost:8000/?error=noToken";
    //window.location.href = "http://kedifap-portal.com2go.co/?error=noToken";
    return (
      <div className="App">
        <RouterProvider router={router} />
      </div>
    );
  } else {
    return (
      <div className="App">
        <RouterProvider router={router} />
      </div>
    );
  }
}

export default App;
