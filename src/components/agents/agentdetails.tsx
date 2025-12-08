import { useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "../properties/propertycard";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// --- Types ---
interface AgentOffplanItem {
  id: number;
  offplan_Id: string;
  project_name: string;
  developer: string;
  location: string;
  starting_price: number;
  payment_plan: string;
  handover: string;
  photo?: string; // The backend returns a single thumbnail in the nested object
  photos?: string[]; // Fallback if full object is passed
}

const FALLBACK_IMAGE = "/placeholder-image.png";

const mapProperty = (item: any) => ({
  listingType: item.offering_type || item.listing_type || "",
  community: item.community || item.sub_community || "",
  location: item.city || "",
  propertyType: item.property_type || "",
  region: item.community || "",
  title: item.title_en || "High Rental Yield | Smart Investment",
  photos: Array.isArray(item.images) ? item.images : item.photo || [],
  portalAgent: item.agent || null,
  propertyId: item.reference_number || item.property_Id,
  bedrooms: Number(item.bedroom || item.beds || 0),
  bathrooms: Number(item.bathroom || item.baths || 0),
  size: Number(item.size || item.sqft || 0),
  price: Number(item.price || 0),
  agentEmail: item.agent?.email || "",
});

function AgentDetails() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState<"sale" | "rent">("sale");
  const listRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch Agent Data (Includes nested offplan_properties due to backend update)
  const { data: agent, isLoading: isAgentLoading } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/agents/${agentId}`).then((res) =>
        res.json()
      ),
  });

  // 2. Fetch Resale Listings
  const { data: combinedListings = [], isLoading: isListingsLoading } =
    useQuery({
      queryKey: ["agentListings", agentId, value],
      enabled: !!agent,
      queryFn: async () => {
        const [crmRes, soldRes] = await Promise.all([
          fetch("https://db-amana.onrender.com/crm-data"),
          fetch(`https://db-amana.onrender.com/properties/${agentId}`),
        ]);

        const crmDataRaw = (await crmRes.json())?.properties || [];
        const soldDataRaw = await soldRes.json();
        const allRawData = [...crmDataRaw, ...soldDataRaw];
        const mappedAll = allRawData.map(mapProperty);
        const filtered = mappedAll.filter((p) => {
          const typeMatch =
            p.listingType?.toLowerCase() === value.toLowerCase();
          const agentMatch =
            p.agentEmail && agent?.email
              ? p.agentEmail.toLowerCase().trim() ===
                agent.email.toLowerCase().trim()
              : true;
          return typeMatch && agentMatch;
        });
        const uniqueMap = new Map();
        filtered.forEach((item) => {
          if (item.propertyId) {
            uniqueMap.set(item.propertyId, item);
          }
        });
        return Array.from(uniqueMap.values()).sort(
          (a: any, b: any) => a.price - b.price
        );
      },
    });

  const scrollToListings = () =>
    listRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleDetails = useCallback(
    (id: string) => navigate(`/public-listings/${id}`),
    [navigate]
  );

  const handleOffPlanDetails = useCallback(
    (offplanId: string) => navigate(`/off-plan/${offplanId}`),
    [navigate]
  );

  if (isAgentLoading) return <p className="text-center py-20">Loading...</p>;
  if (!agent) return <p className="text-center py-20">Agent not found.</p>;

  const details = [
    { label: "Email", value: agent.email, icon: <Mail /> },
    { label: "Phone", value: agent.phone_number, icon: <Phone /> },
    { label: "Specialization", value: agent.specialization, icon: <MapPin /> },
    {
      label: "Experience",
      value: `${agent.work_experience} Years`,
      icon: <User />,
    },
  ];

  function setQrCode(agent: any) {
    if (!agent) return "/amana-logo.png";
    let pic = "";
    switch (agent.email) {
      case "Guergana@amanahomes.ae":
        pic = "/gigiqr.png";
        break;
      case "attique@amanahomes.ae":
        pic = "/attiqueqr.png";
        break;
      case "charlotte@amanahomes.ae":
        pic = "/charlotteqr.png";
        break;
      case "mohamedfahmy@amanahomes.ae":
        pic = "/moqr.png";
        break;
      case "fatima@amanahomes.ae":
        pic = "/fatimaqr.png";
        break;
      case "faizan@amanahomes.ae":
        pic = "/faizanqr.png";
        break;
      case "muhammadanas@amanahomes.ae":
        pic = "/muhammadanasqr.png";
        break;
      case "mark@amanahomes.ae":
        pic = "/markqr.png";
        break;
      case "thekla@amanahomes.ae":
        pic = "/thekla.png";
        break;
      default:
        pic = "/amana-logo.png";
    }
    return pic;
  }

  // ACCESSING OFF-PLANS DIRECTLY FROM AGENT OBJECT - O(1) Access
  const agentOffPlans: AgentOffplanItem[] = agent.offplan_properties || [];

  return (
    <div className="">
      <div className="lg:px-20 xl:px-20 mx-auto py-10 lg:py-20 px-5">
        {/* ---------- HERO SECTION ---------- */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-green-500 w-6 h-6" />
              <p
                style={{ fontFamily: "IT Medium" }}
                className="uppercase text-sm text-gray-600"
              >
                Verified Agent
              </p>
            </div>

            <h1
              className="text-4xl lg:text-5xl leading-tight mb-4"
              style={{ fontFamily: "GT Bold" }}
            >
              {agent.name}
            </h1>

            <p
              className="text-gray-700 leading-relaxed mb-6 lg:text-lg"
              style={{ fontFamily: "IT Regular" }}
            >
              {agent.about}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
              <a
                href={`https://wa.me/${agent.phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="px-6 py-3 bg-green-600 text-white rounded-md lg:text-lg flex items-center gap-2"
                  style={{ fontFamily: "IT Medium" }}
                >
                  <FaWhatsapp className="w-5 h-5" /> Chat on WhatsApp
                </button>
              </a>
              <button
                onClick={scrollToListings}
                className="px-6 py-3 bg-black text-white rounded-md lg:text-lg"
                style={{ fontFamily: "IT Medium" }}
              >
                View Listings
              </button>
            </div>

            {/* QR CODE SECTION */}
            {agent.email !== "yang@amanahomes.ae" && (
              <div className="pt-6 border-t border-gray-200">
                <p
                  style={{ fontFamily: "IT Medium" }}
                  className="mb-4 text-gray-900 font-semibold"
                >
                  Scan to connect with {agent.name.split(" ")[0]}
                </p>
                <motion.a
                  href={"#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block p-2 bg-white rounded-2xl shadow-sm border border-gray-100"
                  whileHover={{
                    scale: 1.15,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={setQrCode(agent)}
                    alt={`${agent.name} QR Code`}
                    className="w-36 h-36 object-contain rounded-xl"
                  />
                </motion.a>
              </div>
            )}
          </div>
          {/* HERO IMAGE */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={agent.img}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ---------- MAIN CONTENT GRID ---------- */}
        <div className="mt-10 gap-10">
          <div className="w-full space-y-20">
            {" "}
            {/* Increased spacing between sections */}
            {/* 1. PERSONAL INFO */}
            <section>
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: "IT Bold" }}
              >
                Personal Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {details.map((i, idx) => (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg bg-gray-50 flex gap-3 items-center"
                  >
                    <div className="text-[#BA7F55]">{i.icon}</div>
                    <div>
                      <p
                        className="text-xs uppercase text-gray-500"
                        style={{ fontFamily: "IT Light" }}
                      >
                        {i.label}
                      </p>
                      <p style={{ fontFamily: "IT Medium" }}>{i.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* 2. RESALE LISTINGS */}
            <section ref={listRef}>
              <h3
                className="text-2xl font-semibold mb-4 pt-5"
                style={{ fontFamily: "IT Bold" }}
              >
                Properties
              </h3>

              <Tabs defaultValue="sale" className="mb-6">
                <TabsList>
                  <TabsTrigger value="sale" onClick={() => setValue("sale")}>
                    For Sale
                  </TabsTrigger>
                  <TabsTrigger value="rent" onClick={() => setValue("rent")}>
                    For Rent
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {isListingsLoading ? (
                  [...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-94 w-full rounded-xl" />
                  ))
                ) : combinedListings.length > 0 ? (
                  combinedListings.map((item: any) => (
                    <motion.div
                      key={item.propertyId}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <PropertyCard
                        item={item}
                        onClick={() => handleDetails(item.propertyId)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center">
                    <p
                      style={{ fontFamily: "IT Regular" }}
                      className="text-gray-500"
                    >
                      No properties found for {value}.
                    </p>
                  </div>
                )}
              </div>
            </section>
            {/* 3. OFF-PLAN PORTFOLIO (NEW SECTION) */}
            {agentOffPlans.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-6 border-b pb-4">
                  <div>
                    <h3
                      className="text-2xl font-semibold"
                      style={{ fontFamily: "IT Bold" }}
                    >
                      Exclusive Off-Plan Projects
                    </h3>
                    <p
                      className="text-gray-500 mt-1"
                      style={{ fontFamily: "IT Light" }}
                    >
                      Projects represented by {agent.name.split(" ")[0]}
                    </p>
                  </div>
                  <div
                    className="text-[#BA7F55] flex items-center gap-1 cursor-pointer hover:underline"
                    style={{ fontFamily: "IT Medium" }}
                    onClick={() => navigate("/off-plan")}
                  >
                    View All <ArrowRight size={16} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {agentOffPlans.map((item: AgentOffplanItem) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-black h-[400px]"
                      onClick={() => handleOffPlanDetails(item.offplan_Id)}
                    >
                      {/* Image */}
                      <img
                        src={
                          item.photo ||
                          (item.photos && item.photos[0]) ||
                          FALLBACK_IMAGE
                        }
                        alt={item.project_name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />

                      {/* Developer Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <div
                          style={{ fontFamily: "IT Medium" }}
                          className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-[#0B253F] shadow-lg"
                        >
                          {item.developer}
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white transition-transform duration-500 transform translate-y-2 group-hover:translate-y-[-10px]">
                        <div
                          style={{ fontFamily: "GT Bold" }}
                          className="text-xl mb-1 leading-none shadow-black drop-shadow-md"
                        >
                          {item.project_name}
                        </div>

                        <div
                          style={{ fontFamily: "IT Regular" }}
                          className="text-sm opacity-90 flex items-center gap-1 mb-2"
                        >
                          <MapPin size={14} className="text-[#BA7F55]" />
                          {item.location}
                        </div>

                        {/* Hidden details that slide up */}
                        <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                          <div className="w-10 h-0.5 bg-[#BA7F55] mb-3 mt-1"></div>

                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span
                                style={{ fontFamily: "IT Medium" }}
                                className="opacity-70"
                              >
                                From:
                              </span>
                              <span style={{ fontFamily: "IT Medium" }}>
                                AED{" "}
                                {new Intl.NumberFormat("en-AE", {
                                  maximumFractionDigits: 0,
                                  notation: "compact",
                                }).format(item.starting_price)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span
                                style={{ fontFamily: "IT Medium" }}
                                className="opacity-70"
                              >
                                Handover:
                              </span>
                              <span style={{ fontFamily: "IT Medium" }}>
                                {item.handover}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDetails;
