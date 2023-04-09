import banner1 from "../assets/banner-1.jpg";
import banner2 from "../assets/banner-2.jpg";

function Banners() {
    return (
        <div className="flex items-center justify-start gap-x-6 py-10">
            <img src={banner1} alt="" />
            <img src={banner2} alt="" />
        </div>
    );
}

export default Banners;