import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
// Assuming Form component path is correct
import Form from "@/leads/form";

interface AgentData {
  id: string;
  img: string;
  name: string;
  specialization: string;
}

function AgentsOverview() {
  const navigate = useNavigate();

  const { data: fetchedAgents, isLoading } = useQuery<AgentData[]>({
    queryKey: ["agent_new"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching agents:", err)),
    staleTime: 1000 * 60 * 10,
  });

  const handleDetails = useCallback(
    (agentId: string) => {
      navigate(`/agent-details/${agentId}`);
    },
    [navigate]
  );

  return (
    <div className="flex flex-col gap-6 pt-10 lg:pt-1">
      {/* GLOBAL HEADER */}
      <div className="px-4">
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center max-w-6xl mx-auto">
          <Typography
            fontFamily="IT Medium"
            color="#BA7F55"
            className="uppercase tracking-widest mb-2"
          >
            meet the people who make it happen
          </Typography>
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "50px", xs: "34px" }}
            className="mb-4 text-gray-900"
          >
            The Amana Team
          </Typography>
          <Typography
            fontFamily="IT Light"
            className="text-gray-600 leading-relaxed"
          >
            From the visionary leadership to the dedicated support specialists,
            discover the talent guiding your journey.
          </Typography>
        </div>

        {/* --- TEAM SECTIONS --- */}
        <div className="px-3 lg:px-30 mx-auto">
          {isLoading ? (
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-[350px] w-full rounded-xl" />
              ))}
            </Box>
          ) : (
            <Box
              display="grid"
              sx={{ mt: "20px" }}
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: `repeat(3, 1fr)`, // Dynamic columns based on category importance
              }}
              gap={5}
            >
              {fetchedAgents?.map((item) => (
                <div
                  key={item.id}
                  onClick={
                    item.specialization == "Property Advisor"
                      ? () => handleDetails(item.id)
                      : undefined
                  }
                  className={`group ${
                    item.specialization == "Property Advisor"
                      ? "cursor-pointer"
                      : ""
                  }`}
                >
                  <div
                    className="relative h-[350px] w-full bg-cover bg-center rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300"
                    style={{
                      backgroundImage: item.img.startsWith("url(")
                        ? item.img
                        : `url(${item.img})`,
                    }}
                    aria-label={`Team member ${item.name}`}
                  >
                    <div className="absolute bg-gradient-to-t from-black/70 to-transparent h-full w-full" />

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Typography fontFamily={"IT Medium"} fontSize="20px">
                        {item.name}
                      </Typography>
                      <Typography fontSize="16px" fontFamily={"IT Light"}>
                        {item.specialization}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </Box>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div className="px-5 py-5">
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20">
          {/* Tagline, Heading, Subheading, and Form */}
          <Typography
            fontFamily={"RM Medium"}
            color="#BA7F55"
            className="uppercase tracking-wide text-sm mb-2"
          >
            [Get In Touch]
          </Typography>

          <Typography
            fontFamily={"DM Medium"}
            fontSize={{ xs: "24px", lg: "30px" }}
            className="text-center mb-4"
          >
            Let’s Make Your Property Journey Effortless
          </Typography>

          <Typography
            fontFamily={"IT Light"}
            className="text-center text-gray-600 leading-relaxed max-w-xl"
          >
            Whether you're buying, renting, or investing, our expert team is
            here to guide you every step of the way. Let's turn your property
            goals into reality—together.
          </Typography>

          <Form
            propertyId={""}
            extraData={{ reason: "Submitted at the agents page" }}
            formType="default"
          />
        </div>
      </div>
    </div>
  );
}

export default AgentsOverview;
