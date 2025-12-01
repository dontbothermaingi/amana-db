import { useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "../properties/propertycard";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, User, ShieldCheck } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// ------------------ Mapping Listings -------------------
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
  // Helper to check agent email match safely
  agentEmail: item.agent?.email || "",
});

// ------------------ MAIN COMPONENT -------------------
function AgentDetails() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState<"sale" | "rent">("sale");
  const listRef = useRef<HTMLDivElement | null>(null);

  // Fetch Agent
  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/agents/${agentId}`).then((res) =>
        res.json()
      ),
  });

  // Fetch Listings
  const { data: combinedListings = [], isLoading: isListingsLoading } =
    useQuery({
      // Included 'value' in queryKey so it refetches/re-filters when tab changes
      queryKey: ["agentListings", agentId, value],
      enabled: !!agent,
      queryFn: async () => {
        const [crmRes, soldRes] = await Promise.all([
          fetch("https://db-amana.onrender.com/crm-data"),
          fetch(`https://db-amana.onrender.com/properties/${agentId}`),
        ]);

        const crmDataRaw = (await crmRes.json())?.properties || [];
        const soldDataRaw = await soldRes.json();

        // 1. Combine raw data arrays first
        const allRawData = [...crmDataRaw, ...soldDataRaw];

        // 2. Map everything to a unified structure
        const mappedAll = allRawData.map(mapProperty);

        // 3. Filter strictly
        const filtered = mappedAll.filter((p) => {
          // Check if listing type matches current tab (Sale/Rent)
          const typeMatch =
            p.listingType?.toLowerCase() === value.toLowerCase();

          // Check if agent matches (some APIs return all props, some return specific)
          // We compare the property's agent email to the current agent's email
          // OR if the source was the specific agent endpoint (implied by context,
          // but explicit checking is safer if data is mixed).
          const agentMatch =
            p.agentEmail && agent?.email
              ? p.agentEmail.toLowerCase().trim() ===
                agent.email.toLowerCase().trim()
              : true; // Fallback: if data came from agent endpoint it might lack email field, assuming valid.

          // Note: You might need to adjust agentMatch logic depending on exactly what properties/${agentId} returns
          // If properties/${agentId} is TRUSTED to only be that agent's, you can skip strict email check for those items.
          // But simpler here:

          return typeMatch && agentMatch;
        });

        // 4. DEDUPLICATE based on unique propertyId
        // We use a Map: keys are propertyIds, values are the property objects.
        // This automatically overwrites duplicates, keeping the last one found.
        const uniqueMap = new Map();
        filtered.forEach((item) => {
          if (item.propertyId) {
            uniqueMap.set(item.propertyId, item);
          }
        });

        // Convert back to array and sort
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

  if (!agent) return <p className="text-center py-20">Loading...</p>;

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

  return (
    <div className="">
      <div className="lg:px-20 xl:px-20 mx-auto py-10 lg:py-20 px-5">
        {/* ---------- HERO SECTION ---------- */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
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

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
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
          </div>

          {/* Right HERO IMAGE */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={agent.img}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ----------  MAIN CONTENT GRID ---------- */}
        <div className="mt-10 gap-10">
          {/* LEFT MAIN CONTENT */}
          <div className="w-full space-y-10">
            {/* Agent Info */}
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

            {/* ACTIVE LISTINGS */}
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
                  // Show skeletons while fetching new data for the tab
                  [...Array(10)].map((_, idx) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDetails;
