import logo from "../assets/kedi logo.png";
import { Link, Outlet } from "react-router-dom";
import Banners from "./Banners";

export default function Navbar() {
    return (
        <>
            <nav className="py-5 bg-gray-200">
                <div className="w-4/5 flex items-center justify-start mx-auto gap-x-12">
                    <div className="basis-2/12">
                        <img className="w-full" src={logo} alt="" />
                    </div>
                    <div className="basis-10/12">
                        <ul className="flex gap-x-6">
                            <li>
                                <Link to='/app'>Αρχική</Link>
                            </li>
                            <li>
                                <Link to='/app/catalogue'>Κατάλογος</Link>
                            </li>
                            <li>
                                <Link to='/app/orders'>Παραγγελίες</Link>
                            </li>
                            <li>
                                <Link to='/app/invoices'>Τιμολόγια</Link>
                            </li>
                            <li>
                                <Link to='/app/customer-statements'>Statements</Link>
                            </li>
                            <li>
                                <Link to='/app/general-information'>Σχετικά</Link>
                            </li>
                            <li>
                                <Link to='/app/contact'>Επικοινωνία</Link>
                            </li>
                            <li>
                                <Link to='/app/profile'>Το προφίλ μου</Link>
                            </li>
                            <li>
                                <Link to='/app/vendors'>Vendors</Link>
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