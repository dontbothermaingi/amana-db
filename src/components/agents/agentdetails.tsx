import { useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "../properties/propertycard";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, User, ShieldCheck } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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

  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/agents/${agentId}`).then((res) =>
        res.json()
      ),
  });

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

  return (
    <div className="">
      <div className="lg:px-20 xl:px-20 mx-auto py-10 lg:py-20 px-5">
        {/* ---------- HERO SECTION ---------- */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {" "}
          {/* Changed items-center to items-start for better alignment if left column gets taller */}
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
              {" "}
              {/* Increased mb-6 to mb-8 */}
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

            {/* -------------------------------------------------- */}
            {/* NEW SECTION: Custom QR Code with Hover Effect    */}
            {/* -------------------------------------------------- */}
            {agent && (
              <div className="pt-6 border-t border-gray-200">
                <p
                  style={{ fontFamily: "IT Medium" }}
                  className="mb-4 text-gray-900 font-semibold"
                >
                  Scan to connect with {agent.name.split(" ")[0]}
                </p>
                {/* We use motion.a so the anchor tag itself animates */}
                <motion.a
                  // IMPORTANT: Replace 'agent.qr_destination_url' with the field that holds the link the QR goes to
                  href={"#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block p-2 bg-white rounded-2xl shadow-sm border border-gray-100"
                  // This defines the hover animation (scale up by 15%)
                  whileHover={{
                    scale: 1.15,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  // Optional: Slight shrink on click
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    // IMPORTANT: Your image source field
                    src={setQrCode(agent)}
                    alt={`${agent.name} QR Code`}
                    // Adjust w-36 h-36 if you need it bigger or smaller
                    className="w-36 h-36 object-contain rounded-xl"
                  />
                </motion.a>
              </div>
            )}
            {/* -------------------------------------------------- */}
            {/* END NEW SECTION                                  */}
            {/* -------------------------------------------------- */}
          </div>
          {/* Right HERO IMAGE (Unchanged) */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={agent.img}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ----------  MAIN CONTENT GRID (Unchanged) ---------- */}
        <div className="mt-10 gap-10">
          {/* ... keep rest of the component unchanged ... */}
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
              {/* ... existing listings code ... */}
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
