import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { QrCode } from "lucide-react";
import PropertyCard from "../properties/propertycard";
import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AgentSoldProperties from "./agentsoldproperties";

function AgentDetails() {
  const { agentId } = useParams();
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";
  const navigate = useNavigate();

  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      fetch(
        `https://6895ec7a039a1a2b2890d0a3.mockapi.io/amana/agents/${agentId}`
      ).then((res) => res.json()),
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
        background: "linear-gradient(180deg, #F9FAFB 0%, #F0F2F5 100%)",
        p: { xs: 3, md: 6, lg: 10 },
      }}
    >
      {/* AGENT HEADER CARD */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          p: { xs: 4, md: 6 },
          mb: 8,
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={agent?.img}
          alt={agent?.name}
          loading="lazy"
          sx={{
            width: { xs: "150px", md: "200px", lg: "240px" },
            height: { xs: "150px", md: "200px", lg: "240px" },
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #E0E0E0",
          }}
        />

        <Box flex={1}>
          <Typography
            fontFamily="IT Medium"
            fontSize={{ xs: "28px", md: "42px" }}
            fontWeight={600}
            color="#0B253F"
          >
            {agent?.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "600px", lineHeight: 1.6 }}
          >
            {agent?.description ||
              "Passionate about connecting clients to premium real estate opportunities across the UAE."}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <a href="https://wa.me/971501234567" target="_blank">
              <Button className="bg-[#25D366] text-white px-6 py-3 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
                Chat on WhatsApp
              </Button>
            </a>
            <Button className="bg-[#0B253F] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#14385F] transition-all duration-300">
              View Properties
            </Button>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button>Add Sold Properties</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AgentSoldProperties />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Box>
        </Box>

        <Box
          sx={{
            background: "linear-gradient(135deg, #F3F4F6 0%, #EAEAEA 100%)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <QrCode className="w-24 h-24 text-gray-500" />
        </Box>
      </Box>

      {/* METRICS SECTION */}
      <Box
        sx={{
          background: "#0B253F",
          color: "white",
          borderRadius: "24px",
          py: { xs: 3, md: 5 },
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-around",
          alignItems: "center",
          textAlign: "center",
          gap: { xs: 3, md: 0 },
          mb: 8,
        }}
      >
        {[
          { label: "Properties For Sale", value: "17" },
          { label: "Properties For Rent", value: "6" },
          { label: "Closed Deals", value: "1" },
          { label: "Total Deals Value", value: "775K AED" },
        ].map((metric, i) => (
          <Box key={i}>
            <Typography
              fontFamily="IT Medium"
              fontSize={{ xs: "24px", md: "32px" }}
              color="#BA7F55"
            >
              {metric.value}
            </Typography>
            <Typography fontFamily="IT Medium" color="white">
              {metric.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography
          fontFamily="IT Medium"
          fontSize={{ xs: "28px", md: "40px" }}
          sx={{ color: "#0B253F" }}
        >
          About
        </Typography>

        <div>
          <Typography fontFamily={"IT Medium"}>
            Area of Expertise:{" "}
            <span style={{ fontFamily: "IT Light" }}>{agent?.location}</span>
          </Typography>

          <Typography fontFamily={"IT Medium"}>
            Phone Number:{" "}
            <span style={{ fontFamily: "IT Light" }}>{agent?.phoneNumber}</span>
          </Typography>

          <Typography fontFamily={"IT Medium"}>
            Email:{" "}
            <span style={{ fontFamily: "IT Light" }}>{agent?.email}</span>
          </Typography>

          <Typography fontFamily={"IT Medium"}>
            Experience:{" "}
            <span style={{ fontFamily: "IT Light" }}>
              {agent?.yearsOfExperience}
            </span>
          </Typography>
        </div>
      </Box>

      {/* LISTINGS */}
      <Box>
        <Typography
          fontFamily="IT Medium"
          fontSize={{ xs: "28px", md: "40px" }}
          sx={{ mb: 4, color: "#0B253F" }}
        >
          Listings by {agent?.name}
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
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
