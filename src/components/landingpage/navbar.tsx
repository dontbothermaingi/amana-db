import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const options = [
    { label: "Home", path: "/" },
    { label: "For Sale", path: "/SELL/public-listings" },
    { label: "For Rent", path: "/RENT/public-listings" },
    { label: "Off-Plan", path: "off-plan" },
    { label: "About", path: "/about-us" },
    { label: "Agents", path: "/agents" },
    { label: "Connect & Earn", path: "/earn" },

    {
      label: "Tenant-covered Investments",
      path: "/dubai-property-uk-investors",
    },
    { label: "Renovations", path: "/luxury-renovations-dubai" },
    { label: "Contact Us", path: "/contact-us" },
  ];

  // function handleNav(path: string) {
  //   navigate(path);
  //   setOpen(false);
  // }

  return (
    <div className="relative">
      {!isMobile ? (
        <div className="relative">
          {/* Floating Action Button (always bottom-right) */}
          <div className="fixed bottom-8 right-8 z-50">
            <div
              onClick={() => setOpen(!open)}
              className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#BA7F55] to-[#8B5E3C] rounded-full shadow-xl border border-white/20 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl ${
                open ? "opacity-0 scale-90" : "opacity-100 scale-100"
              }`}
            >
              <Menu className="text-white" size={26} />
            </div>
          </div>

          {/* Expanded Centered Navbar */}
          <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-4 px-6 py-4 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out origin-bottom ${
              open
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-90 pointer-events-none"
            }`}
          >
            {options.map((item, index) => (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                className="cursor-pointer font-medium text-gray-700 bg-white hover:bg-[#BA7F55] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md rounded-xl"
              >
                {item.label}
              </Button>
            ))}

            {/* Close Button (inside the navbar) */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#BA7F55] hover:bg-[#8B5E3C] text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
            >
              <X size={20} />
            </div>
          </div>
        </div>
      ) : (
        <Drawer>
          <DrawerTrigger className="-z-[1000] fixed bottom-5 right-5">
            <div className="p-3 bg-black/70 rounded-full shadow-lg backdrop-blur-md border border-white/30">
              <Menu className="text-white" />
            </div>
          </DrawerTrigger>
          <DrawerContent className="z-[9999]">
            <DrawerHeader>
              <DrawerTitle>Amana Homes</DrawerTitle>
              <DrawerDescription>Open Doors, Open Arms</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 p-4 justify-center items-center">
              {options.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="w-60"
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default Navbar;
