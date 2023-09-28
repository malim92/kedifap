import logo from "../assets/kedi logo.png";
import { Link, Outlet } from "react-router-dom";
import Banners from "./Banners";
import Button from "react-bootstrap/Button";

import "./Navbar.css";

export default function Navbar({ setIsAuthenticated, isVendorName }) {
  console.log(isVendorName, "isVendorName in nav ");
  function logout() {
    localStorage.removeItem("kedTokAuth");
    setIsAuthenticated(false);
  }
  return (
    <>
      <nav className="py-5 bg-gray-200">
        <div className="w-4/5 flex items-center justify-start mx-auto gap-x-11">
          <div className="basis-2/14">
            <img className="w-full" src={logo} alt="" />
          </div>
          <div className="basis-12/14">
            <ul className="flex gap-x-6">
              <li className="nav-link-txt">
                <Link to="/app">Αρχική</Link>
              </li>
              <li className="nav-link-txt">
                <Link to="/app/catalogue">Κατάλογος</Link>
              </li>
              <li className="nav-link-txt">
                <Link to="/app/orders">Παραγγελίες</Link>
              </li>
              {isVendorName =='' && (
                <>
                  <li className="nav-link-txt">
                    <Link to="/app/invoices">Τιμολόγια</Link>
                  </li>
                  <li className="nav-link-txt">
                    <Link to="/app/customer-statements">
                      Κατάσταση λογαριασμού
                    </Link>
                  </li>
                  <li className="nav-link-txt">
                    <Link to="/app/vendors">Αντιπρόσωποι</Link>
                  </li>
                  <li className="nav-link-txt">
                    <Link to="/app/return-policy">Πολιτική επιστροφών</Link>
                  </li>
                  {/* <li className="nav-link-txt">
                    <Link to="/app/profile">Το προφίλ μου</Link>
                  </li> */}
                </>
              )}
              <li className="nav-link-txt">
                <Link to="/app/backorders">Backorders</Link>
              </li>

              <li className="nav-link-txt">
                <Link to="/app/contact">Επικοινωνία</Link>
              </li>
              <li className="nav-link-txt">
                <Button
                  variant="danger border-0"
                  style={{ color: "red", bottom: "5px", position: "relative" }}
                  onClick={logout}
                >
                  Aποσύνδεση
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="w-4/5 mx-auto px-4">
        <Banners />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
