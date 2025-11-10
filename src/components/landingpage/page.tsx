import { Typography, useMediaQuery } from "@mui/material";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { memo } from "react";

// Predefine text constants
const MOBILE_TEXT =
  "We listen to understand your needs — guiding you to the perfect property in the UAE. AMANA opens doors to your dream home and a vision of tomorrow.";

const DESKTOP_TEXT =
  "We listen to you so we understand your needs. Only then can we be your knowledgeable guide to add value in your search for property in the UAE of endless possibilities, AMANA opens doors to your perfect home. More than just properties, we offer a vision of tomorrow in UAE.";

const Page = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();

  // Lazy-load hero image
  const heroImage = isMobile ? "/la.jpg" : "/la.jpg"; // Use WebP for better compression

  return (
    <div
      className={`relative bg-cover bg-center transition-opacity duration-700`}
      style={{
        backgroundImage: `url(${heroImage})`,
        height: isMobile ? "100vh" : "100vh",
      }}
    >
      {/* Unified gradient overlay */}
      <div
        className={`absolute h-full w-full ${
          isMobile
            ? "bg-gradient-to-t from-black/60 via-black/60 to-black/30"
            : "bg-gradient-to-b from-black/30 to-black/30"
        }`}
      />

      {/* Content */}
      <div className="h-full relative mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-sm lg:max-w-4xl px-5">
          <Typography
            fontFamily="IT Bold"
            color="white"
            fontSize={{ lg: "70px", xs: "32px" }}
            textAlign="center"
          >
            Open Doors, Open Arms
          </Typography>

          <Typography
            color="white"
            fontFamily="IT Regular"
            fontSize={{ lg: "18px", xs: "15px" }}
            textAlign="center"
            className="mt-4"
          >
            {isMobile ? MOBILE_TEXT : DESKTOP_TEXT}
          </Typography>

          {isMobile && (
            <Button
              onClick={() => navigate("/SELL/public-listings")}
              className="flex items-center mt-5 gap-2 px-4 py-2 rounded-2xl border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] transition"
            >
              Explore Properties
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Page);
