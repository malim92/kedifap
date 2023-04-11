import ContactInfo from "../components/Contact/ContactInfo";
import {  useLoadScript} from "@react-google-maps/api";
import Map from "../components/Contact/Map";


function Contact() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: ""
    });

    return (
        <div className="shadow-md rounded-md">
            <h1 className="text-2xl p-4 bg-kedifapgreen-300 rounded-md ">Στοιχεία Επικοινωνίας</h1>
            <div className="flex items-top py-5 px-4">
                <ContactInfo />
                {!isLoaded ? <div>Loading ...</div> : <Map /> }
            </div>
        </div>
    );
}

export default Contact;