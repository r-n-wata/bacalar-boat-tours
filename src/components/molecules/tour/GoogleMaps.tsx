import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "256px", // equivalent to h-64 in Tailwind (64 * 4px = 256px)
  borderRadius: "12px", // rounded corners
  overflow: "hidden", // to keep corners clean
};

const center = {
  lat: 18.6813,
  lng: -88.3933,
};

export default function TourMap() {
  return (
    <LoadScript
      googleMapsApiKey={
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
