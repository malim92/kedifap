import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ProductsTable from "./pages/ProductsTable";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Information from "./pages/Information";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Cookies from "js-cookie";

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
const token = "Bearer " + Cookies.get("jwt_token");
console.log(`Token is ${token}!`);

if (token) {
  // token exists, send it to validation endpoint
  fetch("http://localhost:8000/validate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data is !", data);
      if (data.valid) {
        console.log("Token is valid!");
      } else {
        console.log("Token is invalid!");
      }
    })
    .catch((error) => {
      console.error("Error validating token:", error);
    });
} else {
  // token does not exist, do something else
  console.log("no token");
}

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
