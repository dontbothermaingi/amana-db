import { Typography } from "@mui/material";
import { Bed, MapPin, Ruler, ShowerHead } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { WhatsApp } from "@mui/icons-material";

type cardProps = {
  item: any;
  onClick: (id: string) => void;
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

  // Data Validation
  const hasPhotosArray = Array.isArray(item?.photos) && item.photos.length > 0;
  const mainPhoto = hasPhotosArray ? item.photos[0] : item?.photos;
  const navigate = useNavigate();

  function setPicture(agent: any) {
    const email = agent?.email || "";
    const agentImages: Record<string, string> = {
      "Guergana@amanahomes.ae": "/GG.JPG",
      "attique@amanahomes.ae": "/ATTIQUE.JPG",
      "charlotte@amanahomes.ae": "/CHARL.JPG",
      "mohamedfahmy@amanahomes.ae": "/MO.JPG",
      "fatima@amanahomes.ae": "/FATIMA.JPG",
      "faizan@amanahomes.ae": "/FAIZAN.JPG",
      "muhammadanas@amanahomes.ae": "/ANAS.JPG",
      "mark@amanahomes.ae": "/MARK.JPG",
      "yang@amanahomes.ae": "/yang.PNG",
    };
    return agentImages[email] || "/amana-logo.png";
  }

  // --- Handlers ---
  const { data: agents } = useQuery({
    queryKey: ["agent_new"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching agents:", err)),
    staleTime: 1000 * 60 * 10,
  });

  // 1. Main Card Click (View Property)
  const handleCardClick = () => {
    if (hasPhotosArray) {
      onClick(item.id);
    }
  };

  // 2. WhatsApp Click
  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the card click
    const phone = item?.portalAgent?.phone || "";
    // Format phone and open API
    if (phone)
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}`, "_blank");
  };

  // 3. Agent Profile Click
  const handleAgentClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevents triggering the card click
      const agent = agents?.find(
        (agt: any) =>
          agt.email.toLowerCase().trim() ===
          item?.portalAgent.email.toLowerCase().trim()
      );

      console.log("Agent", agent);

      if (agent) {
        navigate(`/agent-details/${agent.id}`, { state: { agent } });
      } else {
        console.warn("Agent not found");
      }
    },
    [agents, item, navigate]
  );

  const statusLabel =
    item?.listingType === "RENT"
      ? "RENTED"
      : item?.listingType === "SALE"
      ? "SOLD"
      : "";

  return (
    <div
      key={item.id}
      className={`group relative rounded-xl overflow-hidden shadow-md h-[450px] ${
        hasPhotosArray ? "hover:shadow-xl cursor-pointer" : "cursor-default"
      } transition-all duration-500`}
      onClick={handleCardClick}
    >
      {/* --- Image --- */}
      <img
        src={mainPhoto}
        alt="Property"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* --- Permanent Gradient (Always visible, slightly darker at bottom) --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

      {/* --- Top Info (Type) --- */}
      <div className="absolute top-4 right-4 z-20">
        <div
          style={{ fontFamily: "IT Bold" }}
          className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs uppercase tracking-wider text-black"
        >
          {item?.bedrooms == 0 ? 1 : item?.bedrooms} Bedroom
        </div>
      </div>

      {/* =========================================================
          LAYER A: DEFAULT VIEW (Price & Location)
          Disappears on Hover (opacity-0)
         ========================================================= */}
      <div
        style={{ fontFamily: "IT Medium" }}
        className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 transition-all duration-500 transform translate-y-0 group-hover:opacity-0 group-hover:translate-y-4 pointer-events-none"
      >
        <div
          style={{ fontFamily: "IT Medium" }}
          className="font-bold text-3xl mb-1"
        >
          {formatPrice(item?.price)}
          <span className="text-lg font-normal opacity-80">
            {item?.listingType.toLowerCase() === "rent" && " /yr"}
          </span>
        </div>
        <div
          style={{ fontFamily: "IT Medium" }}
          className="text-base opacity-90 flex items-center gap-1"
        >
          <MapPin className="w-4 h-4" />
          <span className="truncate">{item?.community || item?.location}</span>
        </div>
      </div>

      {/* =========================================================
          LAYER B: HOVER VIEW (Stats, Agent, Buttons)
          Appears on Hover (opacity-100)
         ========================================================= */}
      {hasPhotosArray && (
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-30 flex flex-col gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          {/* 1. Property Stats Row */}
          <div className="flex gap-6 border-b border-white/70 pb-4">
            <div className="flex items-center gap-2 text-sm">
              <Bed className="w-5 h-5 opacity-80" />
              <span className="font-medium">{item?.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShowerHead className="w-5 h-5 opacity-80" />
              <span className="font-medium">{item?.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Ruler className="w-5 h-5 opacity-80" />
              <span className="font-medium">{item?.size} Sqft</span>
            </div>
          </div>

          {/* 2. Agent & Actions Row */}
          {item?.portalAgent && (
            <div className="flex items-center justify-between gap-2">
              {/* Agent Profile (Clickable) */}
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors -ml-2"
                onClick={handleAgentClick}
              >
                <img
                  src={setPicture(item.portalAgent)}
                  className="w-15 h-15 rounded-full object-cover border border-white/30"
                  alt="Agent"
                />
                <div
                  style={{ fontFamily: "IT Medium" }}
                  className="flex flex-col"
                >
                  <span className="text-md font-bold leading-none">
                    {item.portalAgent.name}
                  </span>
                  <span className="text-[10px] opacity-70 uppercase tracking-wider mt-1">
                    View Agent
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Whatsapp Button */}
                <Button
                  size="icon"
                  className="bg-[#25D366] hover:bg-[#1ebc57] text-white rounded-full w-10 h-10 shadow-lg cursor-pointer"
                  onClick={handleWhatsappClick}
                >
                  <WhatsApp className="w-5 h-5" />
                </Button>

                {/* View Property Button (Visual cue for the main card click) */}
                {/* <Button
                  size="icon"
                  className="bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 shadow-lg cursor-pointer"
                  // No onClick needed here because it bubbles up to the main card click
                >
                  <ArrowRight className="w-5 h-5" />
                </Button> */}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Status Label if Sold/Rented (Keep original logic) --- */}
      {!hasPhotosArray && statusLabel && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center ">
          <Typography
            fontFamily="IT Bold"
            className="text-white font-extrabold tracking-widest select-none border-4 border-white p-4 rotate-[-15deg]"
            style={{ textShadow: "0 4px 15px rgba(0,0,0,0.5)" }}
            fontSize={32}
          >
            {statusLabel}
          </Typography>
        </div>
      )}
    </div>
  );
});

export default PropertyCard;
