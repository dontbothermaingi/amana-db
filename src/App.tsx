import { Route, Routes } from "react-router-dom";
import "./App.css";
import Page from "./components/landingpage/page";
import PropertiesPage from "./components/properties/propertiespage";
// import Navbar from "./components/landingpage/navbar";
import "leaflet/dist/leaflet.css";
import PropertyOverview from "./components/properties/propertyoverview";
import OffPlan from "./components/offplanproperties/offplanpage";
import OffPlanDetails from "./components/offplanproperties/offplandetailedview";
import AboutOverView from "./components/about/aboutpage";
import AgentsOverview from "./components/agents/agentspage";
import { useEffect, useState } from "react";
import Loader from "./components/landingpage/loader";
import AgentDetails from "./components/agents/agentdetails";
import ConnectAndEarn from "./components/connect&earn/connectpage";
import Renovation from "./components/renovation/pagelayout";
import Tenants from "./components/tenants/page";
import ScrollToTop from "./ScrollTop";
import ContactUs from "./components/contactus/contactpage";
import { LoginPage } from "./components/Authentication/loginpage";
import AdminPage from "./components/admin/page";
import { useMediaQuery } from "@mui/material";
import ResponsiveSidebar from "./components/landingpage/desktopnavbar";

const LOADER_KEY = "loadershowdown";
const LOADER_EXPIRE = 1000 * 60 * 60 * 2;
const FADE_DURATION_MS = 9000;

function App() {
  const [fadeOut, setFadeOut] = useState(false);

  // FIX 1: Add parentheses around the media query
  const isMobile = useMediaQuery("(max-width:768px)");

  const [loading, setLoading] = useState(() => {
    const item = localStorage.getItem(LOADER_KEY);
    if (!item) return true;

    const parsed = JSON.parse(item);
    const expired = Date.now() - parsed.timestamp > LOADER_EXPIRE;
    return expired;
  });

  // localStorage.removeItem(LOADER_KEY);

  useEffect(() => {
    if (!loading) return;

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
      localStorage.setItem(
        LOADER_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );

      const hideTimer = setTimeout(() => {
        setLoading(false);
      }, FADE_DURATION_MS);

      return () => clearTimeout(hideTimer);
    }, 7000);

    return () => clearTimeout(fadeOutTimer);
  }, [loading]);

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    {
      label: "For Sale",
      ariaLabel: "Learn about us",
      link: "/sale/public-listings",
    },
    {
      label: "For Rent",
      ariaLabel: "View our services",
      link: "/rent/public-listings",
    },
    { label: "OffPlan", ariaLabel: "Get in touch", link: "/off-plan" },
    { label: "About Our Team", ariaLabel: "Learn about us", link: "/about-us" },
    { label: "Connect & Earn", ariaLabel: "Connect and earn", link: "/earn" },
    {
      label: "Renovations",
      ariaLabel: "View renovation services",
      link: "/luxury-renovations-dubai",
    },
    { label: "Contact Us", ariaLabel: "Get in touch", link: "/contact-us" },
  ];

  const socialItems = [
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/company/amana-homes-real-estate",
    },
    {
      label: "Instagram",
      link: " https://www.instagram.com/amanahomes_realestate",
    },
    {
      label: "Facebook",
      link: "https://www.facebook.com/amanahomesrealestate/",
    },
    { label: "YouTube", link: "https://www.youtube.com/@AmanaHomesRealEstate" },
    { label: "X", link: "https://x.com/amanahomesllc" },
    { label: "TikTok", link: "https://www.tiktok.com/@amana_homes_realestate" },
    { label: "Snapchat", link: "https://www.snapchat.com/add/amanahomes" },
  ];

  return (
    <div className="relative h-screen">
      {loading && (
        <div
          className={`fixed inset-0 transition-opacity duration-[${FADE_DURATION_MS}ms] ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Loader />
        </div>
      )}

      {/* FIX 2: Changed 'flex-row' to 'flex-col md:flex-row' */}
      <div
        className={`flex flex-col md:flex-row w-full h-full transition-opacity duration-[${FADE_DURATION_MS}ms] ${
          loading && !fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <ResponsiveSidebar items={menuItems} socialItems={socialItems} />

        {/* Content Area */}
        <div className="flex-1 h-full overflow-y-auto relative">
          <ScrollToTop />
          {isMobile && <div className="h-7" />}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<Page />} />
            <Route path="/:type/public-listings" element={<PropertiesPage />} />
            <Route path="/off-plan/:propertyId" element={<OffPlanDetails />} />
            <Route path="/amana-team" element={<AgentsOverview />} />
            <Route path="/off-plan" element={<OffPlan />} />
            <Route path="/about-us" element={<AboutOverView />} />
            <Route path="/agent-details/:agentId" element={<AgentDetails />} />
            <Route path="/earn" element={<ConnectAndEarn />} />
            <Route path="/luxury-renovations-dubai" element={<Renovation />} />
            <Route path="/dubai-property-uk-investors" element={<Tenants />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route
              path="/public-listings/:propertyId"
              element={<PropertyOverview />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
