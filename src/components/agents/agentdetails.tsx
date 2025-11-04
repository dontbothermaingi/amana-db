import { Box, Divider, Typography, Avatar, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Bed,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShowerHead,
  User,
  ShieldCheck,
} from "lucide-react";
import PropertyCard from "../properties/propertycard";
import { useCallback, type JSX } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

function AgentDetails() {
  const { agentId } = useParams();
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";
  const navigate = useNavigate();

  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/agents/${agentId}`).then((res) =>
        res.json()
      ),
  });

  const { data: soldproperties } = useQuery({
    queryKey: ["property_sold", agentId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/properties/${agentId}`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const { data: houses = [] } = useQuery({
    queryKey: ["house", access_token],
    queryFn: async () => {
      const res = await fetch(
        "https://dataapi.pixxicrm.ae/pixxiapi/v1/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-PIXXI-TOKEN": access_token,
          },
          body: JSON.stringify({
            listingType: "SELL",
            size: 84,
            sort: "ID",
            sortType: "DESC",
          }),
        }
      );

      const json = await res.json();
      return json?.list || json?.data || json || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const handleDetails = useCallback(
    (propertyId: any) => {
      navigate(`/public-listings/${propertyId}`);
    },
    [navigate]
  );

  const properties = houses?.list?.filter(
    (item: any) => item.agent.name === "Mohammed Faizan"
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8F9FB",
      }}
    >
      {/* Hero Section */}
      <div className="relative w-full h-full py-10 lg:h-[450px] bg-gradient-to-r from-[#0B253F] via-[#1a385c] to-[#24456c] flex items-end justify-start px-6 lg:px-20 pb-12">
        <div className="relative flex flex-col lg:flex-row items-center gap-8 z-10">
          <Avatar
            src={agent?.img}
            sx={{
              width: 180,
              height: 180,
              border: "5px solid white",
              boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
            }}
          />
          <div className="text-white flex flex-col gap-2">
            <Typography
              fontFamily="DM Medium"
              fontSize={{ xs: 32, lg: 48 }}
              className="font-bold tracking-tight"
            >
              {agent?.name}
            </Typography>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400 w-5 h-5" />
              <Typography fontFamily="IT Regular" color="#BA7F55">
                Verified Agent
              </Typography>
            </div>
            <Typography
              fontFamily="IT Regular"
              className="text-gray-200 max-w-2xl"
            >
              {agent?.about}
            </Typography>
            <div className="flex gap-4 mt-4">
              <a
                href={`https://wa.me/${agent?.phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#25D366] hover:bg-[#20b85c] flex gap-2 text-white">
                  <FaWhatsapp className="w-4 h-4" />
                  Whatsapp
                </Button>
              </a>
              <Button className="bg-[#BA7F55] hover:bg-[#a36f49] text-white">
                View Listed Properties
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Card */}
      <Box
        className="mx-auto -mt-16 mb-10 w-[90%] lg:w-[80%] bg-white rounded-3xl shadow-xl p-8"
        sx={{ backdropFilter: "blur(8px)" }}
      >
        <Typography
          fontFamily="DM Medium"
          fontSize={{ lg: 28, xs: 22 }}
          color="#0B253F"
          mb={2}
        >
          Personal Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow icon={<Mail />} label="Email" value={agent?.email} />
          <InfoRow icon={<Phone />} label="Phone" value={agent?.phone_number} />
          <InfoRow
            icon={<MapPin />}
            label="Specialization"
            value={agent?.specialization}
          />
          <InfoRow
            icon={<User />}
            label="Experience"
            value={`${agent?.work_experience} Years`}
          />
        </div>
      </Box>

      {/* Sold Properties */}
      <Section title="Properties Sold" color="#0B253F">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {soldproperties?.length ? (
            soldproperties?.map((item: any) => (
              <div className="relative group flex flex-col">
                {" "}
                {/* SOLD Overlay */}{" "}
                <div className="absolute inset-0 z-50 flex pt-10 justify-center rounded-2xl overflow-hidden pointer-events-none">
                  {" "}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/10 rounded-2xl" />{" "}
                  <Typography
                    fontFamily="IT Bold"
                    className="text-white font-extrabold tracking-widest opacity-90 select-none"
                    style={{
                      textShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      letterSpacing: "0.1em",
                      position: "absolute",
                    }}
                    fontSize={"100px"}
                  >
                    {" "}
                    SOLD{" "}
                  </Typography>{" "}
                </div>{" "}
                <div
                  key={item.id}
                  className="flex flex-col gap-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white lg:h-120"
                >
                  {" "}
                  <div className="flex lg:flex-col md:flex-col flex-col">
                    {" "}
                    {/* Image Section */}{" "}
                    <div className="relative h-48 sm:h-60 lg:h-60 w-full overflow-hidden">
                      {" "}
                      <img
                        src={item.photo}
                        alt="Property"
                        loading="lazy"
                        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />{" "}
                      {/* Badge */}{" "}
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 text-sm rounded-full shadow-md">
                        {" "}
                        High ROI{" "}
                      </div>{" "}
                      {/* Gradient Overlay */}{" "}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />{" "}
                    </div>{" "}
                    {/* Property Details */}{" "}
                    <div className="relative z-20 bg-[#FDFDFD] rounded-t-2xl p-5 flex flex-col justify-between gap-4 ">
                      {" "}
                      {/* Property Type + Price */}{" "}
                      <Typography
                        fontFamily="IT Bold"
                        className="text-[#BA7F55]"
                        fontSize={{ lg: "25px" }}
                      >
                        {" "}
                        {new Intl.NumberFormat("en-AE", {
                          currency: "AED",
                          style: "currency",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(item?.price)}{" "}
                        {item?.listingType === "RENT" && "/Year"}{" "}
                      </Typography>{" "}
                      <Typography
                        fontFamily="IT Medium"
                        className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800"
                      >
                        {" "}
                        {item?.property_type}{" "}
                      </Typography>{" "}
                      {/* Location */}{" "}
                      <div className="flex items-center gap-2 text-gray-500">
                        {" "}
                        <MapPin className="w-4 h-4 text-slate-400" />{" "}
                        <Typography
                          fontFamily="IT Light"
                          className="text-xs sm:text-sm lg:text-base"
                        >
                          {" "}
                          {item?.community} {item?.community && ","}{" "}
                          {item?.city} {item?.cityName}{" "}
                        </Typography>{" "}
                      </div>{" "}
                      {/* Emotional Caption */}{" "}
                      <Typography
                        fontFamily="IT Medium"
                        className="text-sm sm:text-base italic text-gray-600"
                      >
                        {" "}
                        {item?.title}{" "}
                      </Typography>{" "}
                      {/* Amenities */}{" "}
                      <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-xs sm:text-sm">
                        {" "}
                        <div className="flex items-center gap-2">
                          {" "}
                          <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />{" "}
                          <Typography className="text-xs sm:text-sm lg:text-base">
                            {" "}
                            {item?.beds || item?.newParam?.bedroomMax} Beds{" "}
                          </Typography>{" "}
                        </div>{" "}
                        <Divider
                          orientation="vertical"
                          flexItem
                          className="hidden sm:block"
                        />{" "}
                        <div className="flex items-center gap-2">
                          {" "}
                          <ShowerHead className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />{" "}
                          <Typography className="text-xs sm:text-sm lg:text-base">
                            {" "}
                            {item?.baths ||
                              item?.newParam?.bedroomMax} Baths{" "}
                          </Typography>{" "}
                        </div>{" "}
                        <Divider
                          orientation="vertical"
                          flexItem
                          className="hidden sm:block"
                        />{" "}
                        <div className="flex items-center gap-2">
                          {" "}
                          <Ruler className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />{" "}
                          <Typography className="text-xs sm:text-sm lg:text-base">
                            {" "}
                            {item?.sqft} {item?.newParam?.minSize}{" "}
                            {item?.newParam?.minSize && " - "}{" "}
                            {item?.newParam?.minSize &&
                              new Intl.NumberFormat().format(
                                item?.newParam?.maxSize
                              )}{" "}
                            Sqft{" "}
                          </Typography>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ))
          ) : (
            <Typography>No sold properties found.</Typography>
          )}
        </div>
      </Section>

      {/* Active Listings */}
      <Section title="Active Listings" color="#0B253F">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {properties?.length ? (
            properties.map((item: any) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard
                  item={item}
                  onClick={() => handleDetails(item.propertyId)}
                />
              </motion.div>
            ))
          ) : (
            <Typography color="text.secondary">
              No listings available for this agent.
            </Typography>
          )}
        </div>
      </Section>
    </Box>
  );
}

export default AgentDetails;

/* ------------------------ Reusable Components ------------------------ */

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl hover:bg-[#f1f2f5] transition">
    <Tooltip title={label}>
      <span className="text-[#BA7F55]">{icon}</span>
    </Tooltip>
    <div>
      <Typography
        fontFamily="IT Regular"
        className="text-sm text-gray-500 uppercase tracking-wider"
      >
        {label}
      </Typography>
      <Typography fontFamily="IT Medium" color="#0B253F">
        {value}
      </Typography>
    </div>
  </div>
);

const Section = ({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color: string;
}) => (
  <Box className="mx-auto w-[90%] lg:w-[80%] mb-14">
    <Typography
      fontFamily="DM Medium"
      fontSize={{ xs: 26, lg: 30 }}
      color={color}
      mb={3}
    >
      {title}
    </Typography>
    {children}
  </Box>
);
