import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

// set defaults otherwise map markers never renders?
const defaultCenter = { lat: 0, lng: 0 };
const defaultZoom = 2; 

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [mapIsReady, setMapIsReady] = useState(false); 

    const mapRef = useRef(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    useEffect(() => {
        axios.get("/api/locations")
            .then(res => setLocations(res.data))
            .catch(console.error);
    }, []);

    // on map load set new state to true
    const onMapLoad = map => {
        mapRef.current = map;
        setMapIsReady(true);
    };

    useEffect(() => {
        // Only run if locations have data AND the map object has been loaded
        if (mapIsReady && locations.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            
            locations.forEach(loc => {
                const lat = parseFloat(loc.latitude);
                const lng = parseFloat(loc.longitude);
                if (!isNaN(lat) && !isNaN(lng)) bounds.extend({ lat, lng });
            });
            

            requestAnimationFrame(() => {
                mapRef.current.fitBounds(bounds);
            });
        }
    }, [locations, mapIsReady]); 

    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <div className="page-container">
            <h1>Exam Sessions Map</h1>
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "600px" }}
            // more defaults?
            center={defaultCenter}
            zoom={defaultZoom}
            onLoad={onMapLoad}
        >
            {locations.map(loc => {
                const lat = parseFloat(loc.latitude);
                const lng = parseFloat(loc.longitude);
                if (isNaN(lat) || isNaN(lng)) return null;

                return (
                    <Marker
                        key={loc.id}
                        position={{ lat, lng }}
                        title={loc.country}
                        onClick={() => setSelectedLocation(loc)}
                    />
                );
            })}

            {selectedLocation && (
                <InfoWindow
                    position={{
                        lat: parseFloat(selectedLocation.latitude),
                        lng: parseFloat(selectedLocation.longitude),
                    }}
                    onCloseClick={() => setSelectedLocation(null)}
                >
                    <div>
                        <h3 className="mapinfo">{selectedLocation.country}</h3>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
        </div>
    );
}