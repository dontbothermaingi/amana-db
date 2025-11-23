import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Typography } from "@mui/material";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export interface Property {
  photos: any;
  id?: string;
  community: string;
  title: string;
  propertyType: string;
  price: number | string;
  location: string;
  latitude?: string;
  longitude?: string;
  newParameter?: { position?: string };
  rentParameter?: { position?: string };
  sellParam?: { position?: string };
  rentParam?: { position?: string };
  newParam?: { position?: string };
  communityLocation?: string;
  propertyId: string;
}

interface MapViewProps {
  listings: Property[];
}

// Fix missing marker icons in Leaflet (important)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapView: React.FC<MapViewProps> = ({ listings }) => {
  const center: [number, number] = [25.2048, 55.2708]; // Default center (e.g. Dubai)
  const navigate = useNavigate();

  return (
    <div className="h-[500px] lg:h-[95vh] w-full rounded-lg shadow-lg overflow-hidden mb-6">
      <MapContainer center={center} zoom={10} className="h-full w-full">
        <TileLayer
          url={`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en`}
          attribution="&copy; Google"
        />

        {listings.map((property) => {
          // Try to extract coordinates from different possible fields
          const positionString =
            property?.sellParam?.position ||
            property?.rentParam?.position ||
            property?.newParam?.position ||
            property?.communityLocation ||
            `${property.latitude},${property.longitude}`;

          // Split into [lat, lng]
          const [lat, lng] = positionString
            .split(",")
            .map((coord) => parseFloat(coord.trim()));

          // Ensure valid coordinates before rendering
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={property.propertyId} position={[lat, lng]}>
              <Popup>
                {/* <PropertyCard item={property} onClick={""} /> */}
                <div>
                  <Typography
                    lineHeight={1.0}
                    style={{ fontFamily: "IT Medium" }}
                  >
                    {property.community || property.title}
                  </Typography>

                  <div>
                    <img
                      src={property?.photos[0]}
                      alt="image"
                      className="rounded-md"
                    />
                  </div>

                  <Typography lineHeight={1.0} fontFamily={"IT Medium"}>
                    {new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                    }).format(Number(property.price))}
                  </Typography>
                </div>

                <Button
                  onClick={() =>
                    navigate(`/public-listings/${property.propertyId}`)
                  }
                  className="w-full cursor-pointer"
                >
                  View
                </Button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
