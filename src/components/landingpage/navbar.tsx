import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  ShoppingBag,
  Key,
  Calendar,
  Info,
  Users,
  Gift,
  Phone,
  ToolCase,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Scroll visibility logic
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setVisible(false);
      else setVisible(true);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const options = [
    { label: "Home", path: "/", icon: <Home size={20} /> },
    {
      label: "For Sale",
      path: "/SELL/public-listings",
      icon: <ShoppingBag size={20} />,
    },
    {
      label: "For Rent",
      path: "/RENT/public-listings",
      icon: <Key size={20} />,
    },
    { label: "Off-Plan", path: "/off-plan", icon: <Calendar size={20} /> },
    { label: "About", path: "/about-us", icon: <Info size={20} /> },
    { label: "Agents", path: "/agents", icon: <Users size={20} /> },
    { label: "Connect & Earn", path: "/earn", icon: <Gift size={20} /> },
    {
      label: "Renovations",
      path: "/luxury-renovations-dubai",
      icon: <ToolCase size={20} />,
    },
    { label: "Contact Us", path: "/contact-us", icon: <Phone size={20} /> },
  ];

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <motion.div
            className="fixed bottom-6 right-6 z-50 p-2 bg-gradient-to-br from-[#BA7F55] to-[#8B5E3C] rounded-full shadow-2xl border border-white/20 cursor-pointer"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <Menu className="text-white w-5 h-5" />
          </motion.div>
        </DrawerTrigger>
        <DrawerContent className="z-[999999] bg-white/95 backdrop-blur-lg rounded-t-2xl shadow-xl">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold text-[#8B5E3C]">
              Amana Homes
            </DrawerTitle>
            <DrawerDescription>Open Doors, Open Arms</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4 items-center">
            {options.map((item, index) => (
              <Button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`w-60 flex items-center gap-3 font-large ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#BA7F55] to-[#8B5E3C] text-white"
                    : "bg-[#0B253F] hover:bg-[#BA7F55]/20"
                }`}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>
          <div className="p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Amana Homes
          </div>
          <DrawerClose />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-260 z-50 flex justify-center items-center gap-10 bg-white/90 backdrop-blur-2xl border border-black/30 shadow-2xl px-8 py-4 rounded-full"
          style={{ minWidth: "fit-content" }}
        >
          {options.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={index}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center text-sm font-medium cursor-pointer transition-all ${
                  isActive ? "text-[#8B5E3C]" : "text-gray-700"
                }`}
              >
                <div
                  className={`p-2 rounded-full transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-[#BA7F55] to-[#8B5E3C] text-white shadow-lg"
                      : "hover:bg-[#BA7F55]/10"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`mt-1 ${
                    isActive ? "text-[#8B5E3C]" : "text-[#0B253F]"
                  }`}
                  style={{ fontFamily: "IT Medium", fontSize: "16px" }}
                >
                  {item.label}
                </span>

                {/* Animated underline */}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 w-6 h-[2px] bg-[#8B5E3C] rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default Navbar;
