import { useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

export default function Map() {
    const center = useMemo(() => ({lat: 44, lng: -80}), []);

    return (
        <div className="basis-1/3">
            <GoogleMap zoom={10} center={center}>
                <Marker position={center} />
            </GoogleMap>
        </div>
    );
}