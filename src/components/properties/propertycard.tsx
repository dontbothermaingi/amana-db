import { Typography } from "@mui/material";
import { Bed, MapPin, Ruler, ShowerHead } from "lucide-react";
import React from "react";

type cardProps = {
  item: any;
  onClick: any;
};

const PropertyCard = React.memo(function PropertyCard({
  item,
  onClick,
}: cardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      currency: "AED",
      style: "currency",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // New: detect whether photos is an array with elements
  const hasPhotosArray = Array.isArray(item?.photos) && item.photos.length > 0;
  const mainPhoto =
    hasPhotosArray && item.photos.length > 0 ? item.photos[0] : item?.photos;

  // Determine status label
  const statusLabel =
    item?.listingType === "RENT"
      ? "RENTED"
      : item?.listingType === "SALE"
      ? "SOLD"
      : "";

  return (
    <div
      key={item.id}
      className={`group relative rounded-xl overflow-hidden shadow-md ${
        hasPhotosArray ? "hover:shadow-xl cursor-pointer" : "cursor-default"
      }transition-all duration-500 cursor-pointer`}
      onClick={() => hasPhotosArray && onClick(item.id)}
    >
      {/* --- Image --- */}
      <img
        src={mainPhoto}
        alt="Property"
        loading="lazy"
        className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* --- Full Card Gradient Overlay --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80  to-transparent z-10" />

      {/* --- Top Info Overlay (on top of gradient) --- */}
      <div className="absolute top-2 right-2 text-base opacity-90">
        <div
          style={{ fontFamily: "IT Medium" }}
          className="bg-white px-2 py-1 rounded-md text-sm"
        >
          {item?.propertyType}
        </div>
      </div>

      {/* --- Bottom Info Overlay (on top of gradient) --- */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
        <div style={{ fontFamily: "IT Medium" }} className="font-bold text-2xl">
          {formatPrice(item?.price)}
          {item?.listingType.toLowerCase() == "rent" && "/yr"}
        </div>
        <div style={{ fontFamily: "IT Medium" }} className="text-sm opacity-80">
          <MapPin className="inline-block w-4 h-4 mr-1 mb-0.5" />
          {item?.community || item?.location}
        </div>
      </div>

      {/* --- Hover Extra Info --- */}
      {hasPhotosArray && (
        <div className="absolute inset-0 z-20 bg-black/100 opacity-0 group-hover:opacity-100 transition duration-500 p-6 text-white flex flex-col justify-end gap-4">
          <div className="flex items-center gap-3 text-base">
            <Bed className="w-5 h-5" /> {item?.bedrooms} Beds
          </div>

          <div className="flex items-center gap-3 text-base">
            <ShowerHead className="w-5 h-5" /> {item?.bathrooms} Baths
          </div>

          <div className="flex items-center gap-3 text-base">
            <Ruler className="w-5 h-5" /> {item?.size} Sqft
          </div>

          {item?.portalAgent && (
            <div className="flex items-center gap-4 border-t border-white/30 pt-4 mt-2">
              <img
                src={item.portalAgent.photo}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm">
                <div className="font-semibold text-base">
                  {item.portalAgent.name}
                </div>
                <div className="opacity-70">Verified Agent</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Status Label if Sold/Rented --- */}
      {!hasPhotosArray && statusLabel && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
          <Typography
            fontFamily="IT Bold"
            className="text-white font-extrabold tracking-widest select-none"
            style={{ textShadow: "0 4px 15px rgba(0,0,0,0.3)" }}
            fontSize={40}
          >
            {statusLabel}
          </Typography>
        </div>
      )}
    </div>
  );
});

export default PropertyCard;
