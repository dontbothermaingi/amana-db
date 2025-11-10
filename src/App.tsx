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

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem(
          LOADER_KEY,
          JSON.stringify({ timestamp: Date.now() })
        ); // mark loader as shown
      }, 700); // match transition duration
    }, 5000); // loader visible duration
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className="relative h-screen">
      <ScrollToTop />
      {loading && (
        <div
          className={`fixed inset-0 z-99999 transition-opacity duration-700 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Loader />
        </div>
      )}
      <div className="fixed top-10 w-full flex flex-col justify-center items-center z-[999]">
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
        <Route path="/agents" element={<AgentsOverview />} />
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
  );
}

export default App;
