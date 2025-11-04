import { Typography, useMediaQuery } from "@mui/material";
import { Button } from "../ui/button";

function Page() {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <div className="relative h-screen bg-[url(/la.jpg)] bg-cover bg-center">
      <div className="absolute bg-gradient-to-b from-black/30 to-black/30 h-full w-full" />

      <div className="h-screen relative mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-sm lg:max-w-4xl">
          <Typography
            fontFamily={"IT Bold"}
            color="white"
            fontSize={{ lg: "70px", xs: "32px" }}
          >
            Open Doors, Open Arms
          </Typography>

          <Typography
            color="white"
            fontFamily={"IT Regular"}
            fontSize={{ lg: "18px", xs: "15px" }}
            textAlign={"center"}
            className="px-5"
          >
            {isMobile
              ? "We listen to understand your needs — guiding you to the perfect property in the UAE. AMANA opens doors to your dream home and a vision of tomorrow."
              : "We listen to you so we understand your needs. Only then can we be your knowledgeable guide to add value in your search for property inthe UAE of endless possibilities, AMANA opens doors to your perfect home. More than just properties, we offer a vision of tomorrow in UAE."}
          </Typography>

          {isMobile && (
            <Button className="flex items-center mt-5 gap-2 px-4 py-2 rounded-2xl border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] transition">
              Explore Properties
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
