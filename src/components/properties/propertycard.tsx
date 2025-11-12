import { Typography, Divider } from "@mui/material";
import { Bed, MapPin, Ruler, ShowerHead } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

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

  return (
    <div className="group flex flex-col">
      <div
        key={item.id}
        className="flex flex-col gap-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white"
      >
        {/* Layout: column below 1280px, row above */}
        <div
          onClick={() => onClick(item.id)}
          className="flex flex-col xl:flex-row"
        >
          {/* --- Image Section --- */}
          <div
            className={`relative w-full xl:w-1/2 
              h-64 sm:h-80 md:h-96 xl:h-auto overflow-hidden`}
          >
            {item?.photos?.length > 0 && (
              <img
                src={item.photos[0]}
                alt="Property"
                loading="lazy"
                className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
          </div>

          {/* --- Details Section --- */}
          <div className="relative z-20 bg-[#FDFDFD] rounded-t-2xl p-5 flex flex-col justify-between gap-4 xl:w-1/2">
            {/* Price */}
            <Typography
              fontFamily="IT Bold"
              className="text-[#BA7F55]"
              fontSize={{ lg: "25px" }}
            >
              {formatPrice(item?.price)}{" "}
              {item?.listingType === "RENT" && "/Year"}
            </Typography>

            {/* Property Type */}
            <Typography
              fontFamily="IT Medium"
              className="text-lg sm:text-xl xl:text-2xl font-semibold text-gray-800"
            >
              {item?.propertyType}
            </Typography>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 text-slate-400" />
              <Typography
                fontFamily="IT Light"
                className="text-xs sm:text-sm xl:text-base"
              >
                {item?.community} {item?.community && ","} {item?.region},{" "}
                {item?.cityName}
              </Typography>
            </div>

            {/* Emotional Caption */}
            <Typography
              fontFamily="IT Medium"
              className="text-sm sm:text-base italic text-gray-600"
            >
              {item?.title}
            </Typography>

            {/* --- Amenities --- */}
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 xl:w-5 xl:h-5 text-slate-400" />
                <Typography className="text-xs sm:text-sm xl:text-base">
                  {item?.bedRooms || item?.newParam?.bedroomMax} Beds
                </Typography>
              </div>

              <Divider
                orientation="vertical"
                flexItem
                className="hidden sm:block"
              />

              <div className="flex items-center gap-2">
                <ShowerHead className="w-4 h-4 xl:w-5 xl:h-5 text-slate-400" />
                <Typography className="text-xs sm:text-sm xl:text-base">
                  {item?.bathRooms || item?.newParam?.bathroomMax} Baths
                </Typography>
              </div>

              <Divider
                orientation="vertical"
                flexItem
                className="hidden sm:block"
              />

              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 xl:w-5 xl:h-5 text-slate-400" />
                <Typography className="text-xs sm:text-sm xl:text-base">
                  {new Intl.NumberFormat().format(item?.size)} Sqft
                </Typography>
              </div>
            </div>

            {/* --- Agent + CTAs --- */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    item?.portalAgent?.originalAvatar ||
                    item?.portalAgent?.avatar
                  }
                  alt="agent"
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <Typography className="text-sm font-semibold text-gray-800">
                    {item?.portalAgent?.name}
                  </Typography>
                  <Typography className="text-xs text-gray-500">
                    Verified Agent
                  </Typography>
                </div>
              </div>

              <a
                href={`https://wa.me/${item?.portalAgent?.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-[#25D366] rounded-lg px-3 py-2 flex items-center gap-2 text-white text-sm font-semibold shadow-md hover:scale-105 transition">
                  <FaWhatsapp className="w-4 h-4" />
                  Whatsapp
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PropertyCard;
