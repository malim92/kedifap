import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
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
  return (
    <div className="App">    
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
