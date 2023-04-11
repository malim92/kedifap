import logo from "../assets/kedifap-logo.png";
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
                                <Link to='/'>Αρχική</Link>
                            </li>
                            <li>
                                <Link to='/catalogue'>Κατάλογος</Link>
                            </li>
                            <li>
                                <Link to='/orders'>Παραγγελίες</Link>
                            </li>
                            <li>
                                <Link to='/general-information'>Σχετικά</Link>
                            </li>
                            <li>
                                <Link to='/contact'>Επικοινωνία</Link>
                            </li>
                            <li>
                                <Link to='/profile'>Το προφίλ μου</Link>
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