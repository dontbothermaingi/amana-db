import { Route, Routes } from "react-router-dom";
import "./App.css";
import Page from "./components/landingpage/page";
import PropertiesPage from "./components/properties/propertiespage";
import "leaflet/dist/leaflet.css";
import PropertyOverview from "./components/properties/propertyoverview";
import OffPlan from "./components/offplanproperties/offplanpage";
import OffPlanDetails from "./components/offplanproperties/offplandetailedview";
import AboutOverView from "./components/about/aboutpage";
import AgentsOverview from "./components/agents/agentspage";
import { useState } from "react";
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

const VIDEO_DISPLAY_TIME = 7000;
const FADE_DURATION = 1000;
const SESSION_KEY = "has_seen_loader_v1"; // Key for session storage

function App() {
  const [fadeOut, setFadeOut] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  // 1. CHECK SESSION STORAGE ON INITIALIZATION
  const [loading, setLoading] = useState(() => {
    // If we find the key in sessionStorage, user has been here this session
    const hasSeen = sessionStorage.getItem(SESSION_KEY);
    // If hasSeen is true, loading should be false. If not, loading is true.
    return !hasSeen;
  });

  const handleVideoStart = () => {
    // 2. MARK SESSION AS "VISITED"
    // We set this as soon as the video starts playing.
    // If they refresh after this point, the loader will NOT show again.
    sessionStorage.setItem(SESSION_KEY, "true");

    setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        setLoading(false);
      }, FADE_DURATION);
    }, VIDEO_DISPLAY_TIME);
  };

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
          className={`fixed inset-0 z-[9999] transition-opacity duration-[${FADE_DURATION}ms] ease-in-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Ensure your Loader component still uses onPlaying={onVideoStart} */}
          <Loader onVideoStart={handleVideoStart} />
        </div>
      )}

      <div
        className={`flex flex-col md:flex-row w-full h-full transition-opacity duration-[${FADE_DURATION}ms] ${
          loading && !fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <ResponsiveSidebar items={menuItems} socialItems={socialItems} />

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
