import { Box, Divider, Typography } from "@mui/material";
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
} from "lucide-react";
import PropertyCard from "../properties/propertycard";
import { useCallback } from "react";
import { motion } from "framer-motion";

import { FaWhatsapp } from "react-icons/fa";

function AgentDetails() {
  const { agentId } = useParams();
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";
  const navigate = useNavigate();

  console.log("Type of agentId", typeof agentId);

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

  console.log("Properties", soldproperties);

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

  // function handleDelete() {
  //   fetch(`http://127.0.0.1:1313/agents/${agentId}`, {
  //     method: "DELETE",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Delete Successfull", data);
  //     });
  // }

  const handleDetails = useCallback(
    (propertyId: any) => {
      navigate(`/public-listings/${propertyId}`);
    },
    [navigate]
  );

  const properties = houses?.list?.filter(
    (item: any) => item.agent.name === "Mohammed Faizan"
  );

  // const totalValue = soldproperties?.reduce((total: number, property: any) => {
  //   return total + Number(property.price); // ensure numeric addition
  // }, 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F9FAFB 0%, #F0F2F5 100%)",
        p: { xs: 3, md: 6, lg: 5 },
      }}
    >
      {/* AGENT HEADER CARD */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2 flex">
          <img
            src={`${agent?.img}`}
            alt="image"
            loading="lazy"
            className="object-cover h-80 w-80 lg:h-130 lg:w-120 rounded-xl"
          />
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-full flex flex-col gap-6">
          <div>
            <div className="bg-[#0B253F] w-fit px-5 py-2 rounded-xl mb-2">
              <Typography fontFamily={"RM Medium"} color="#BA7F55">
                Verified Agent
              </Typography>
            </div>
            <Typography
              fontFamily={"DM Medium"}
              fontSize={{ lg: "55px", xs: "28px" }}
              color="#0B253F"
            >
              {agent?.name}
            </Typography>
            <Typography fontFamily={"IT Regular"}>{agent?.about}</Typography>
          </div>

          <div>
            <Typography
              fontFamily={"DM Medium"}
              fontSize={{ lg: "28px" }}
              color="#BA7F55"
            >
              Personal Info
            </Typography>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-3">
                <Mail className="text-slate-400 w-5 h-5" />
                <Typography fontFamily={"IT Regular"}>
                  {agent?.email}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-slate-400 w-5 h-5" />
                <Typography fontFamily={"IT Regular"}>
                  {agent?.phone_number}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-slate-400 w-5 h-5" />
                <Typography fontFamily={"IT Regular"}>
                  {agent?.specialization}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-slate-400 w-5 h-5" />
                <Typography fontFamily={"IT Regular"}>
                  {agent?.work_experience} Years
                </Typography>
              </div>
              <a
                href={`https://wa.me/${agent?.phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#25D366]">
                  <FaWhatsapp className="w-4 h-4" />
                  Whatsapp
                </Button>
              </a>
            </div>
          </div>

          <div>
            <Button className="bg-[#0B253F]">View Listed Properties</Button>
          </div>
        </div>
      </div>

      {/* Sold Listings */}
      <Box>
        <Typography
          fontFamily="IT Medium"
          fontSize={{ xs: "28px", md: "30px" }}
          sx={{ mt: 4, mb: 1, color: "#0B253F" }}
        >
          Properties Sold
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            lg: "repeat(4, 1fr)",
            md: "repeat(2,1fr)",
          }}
          gap="30px"
        >
          {soldproperties?.map((item: any) => (
            <div className="relative group flex flex-col">
              {/* SOLD Overlay */}
              <div className="absolute inset-0 z-50 flex pt-10 justify-center rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/10 rounded-2xl" />

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
                  SOLD
                </Typography>
              </div>

              <div
                key={item.id}
                className="flex flex-col gap-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white lg:h-120"
              >
                <div className="flex lg:flex-col md:flex-col flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 sm:h-60 lg:h-60 w-full overflow-hidden">
                    <img
                      src={item.photo}
                      alt="Property"
                      loading="lazy"
                      className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 text-sm rounded-full shadow-md">
                      High ROI
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  </div>

                  {/* Property Details */}
                  <div className="relative z-20 bg-[#FDFDFD] rounded-t-2xl p-5 flex flex-col justify-between gap-4 ">
                    {/* Property Type + Price */}

                    <Typography
                      fontFamily="IT Bold"
                      className="text-[#BA7F55]"
                      fontSize={{ lg: "25px" }}
                    >
                      {new Intl.NumberFormat("en-AE", {
                        currency: "AED",
                        style: "currency",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item?.price)}{" "}
                      {item?.listingType === "RENT" && "/Year"}
                    </Typography>

                    <Typography
                      fontFamily="IT Medium"
                      className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800"
                    >
                      {item?.property_type}
                    </Typography>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <Typography
                        fontFamily="IT Light"
                        className="text-xs sm:text-sm lg:text-base"
                      >
                        {item?.community}
                        {item?.community && ","}
                        {item?.city} {item?.cityName}
                      </Typography>
                    </div>

                    {/* Emotional Caption */}
                    <Typography
                      fontFamily="IT Medium"
                      className="text-sm sm:text-base italic text-gray-600"
                    >
                      {item?.title}
                    </Typography>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                        <Typography className="text-xs sm:text-sm lg:text-base">
                          {item?.beds || item?.newParam?.bedroomMax} Beds
                        </Typography>
                      </div>

                      <Divider
                        orientation="vertical"
                        flexItem
                        className="hidden sm:block"
                      />

                      <div className="flex items-center gap-2">
                        <ShowerHead className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                        <Typography className="text-xs sm:text-sm lg:text-base">
                          {item?.baths || item?.newParam?.bedroomMax} Baths
                        </Typography>
                      </div>

                      <Divider
                        orientation="vertical"
                        flexItem
                        className="hidden sm:block"
                      />

                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                        <Typography className="text-xs sm:text-sm lg:text-base">
                          {item?.sqft} {item?.newParam?.minSize}{" "}
                          {item?.newParam?.minSize && " - "}
                          {item?.newParam?.minSize &&
                            new Intl.NumberFormat().format(
                              item?.newParam?.maxSize
                            )}{" "}
                          Sqft
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Box>
      </Box>

      {/* LISTINGS */}
      <Box>
        <Typography
          fontFamily="IT Medium"
          fontSize={{ xs: "28px", md: "30px" }}
          sx={{ mb: 1, color: "#0B253F" }}
        >
          Agent Listings
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            lg: "repeat(2, 1fr)",
            md: "repeat(1,1fr)",
          }}
          gap="30px"
        >
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
        </Box>
      </Box>
    </Box>
  );
}

export default AgentDetails;
