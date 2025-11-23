import { Route, Routes } from "react-router-dom";
import "./App.css";
import Page from "./components/landingpage/page";
import PropertiesPage from "./components/properties/propertiespage";
import Navbar from "./components/landingpage/navbar";
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

const LOADER_KEY = "loadershowdown";
const LOADER_EXPIRE = 1000 * 60 * 60 * 2;
const FADE_DURATION_MS = 1500;

function App() {
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(() => {
    const item = localStorage.getItem(LOADER_KEY);
    if (!item) return true;

    const parsed = JSON.parse(item);
    const expired = Date.now() - parsed.timestamp > LOADER_EXPIRE;
    return expired;
  });

  useEffect(() => {
    if (!loading) return;

    // Timer for when the loader starts fading out
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);

      // mark loader as shown
      localStorage.setItem(
        LOADER_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );

      // Timer for when the component is completely hidden and unmounted
      const hideTimer = setTimeout(() => {
        setLoading(false);
      }, FADE_DURATION_MS);

      return () => clearTimeout(hideTimer);
    }, 5000);

    return () => clearTimeout(fadeOutTimer);
  }, [loading]);

  return (
    <div className="relative h-screen">
      <ScrollToTop />

      {loading && (
        <div
          className={`fixed inset-0 z-[99999] transition-opacity duration-[${FADE_DURATION_MS}ms] ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Loader />
        </div>
      )}

      <div
        className={`w-full h-full transition-opacity duration-[${FADE_DURATION_MS}ms] ${
          // Content should be transparent initially, and fade in as the loader fades out.
          // It should be fully opaque when the loader is gone or fading out.
          loading && !fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="fixed bottom-10 w-full flex flex-col justify-center items-center z-[999]">
          <div className="w-full">
            <Navbar />
          </div>
        </div>

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
  );
}

export default App;
