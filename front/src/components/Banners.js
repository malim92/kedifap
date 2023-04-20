import banner1 from "../assets/728x90.gif";
import banner2 from "../assets/300.gif";

function Banners() {
    return (
        <div className="flex items-center justify-start gap-x-6 py-10">
            <img src={banner1} alt="" />
            <img src={banner2} alt="" />
        </div>
    );
}

export default Banners;