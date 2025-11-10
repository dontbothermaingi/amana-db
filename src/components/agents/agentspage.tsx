import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
// import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/leads/form";
import { Skeleton } from "../ui/skeleton";

interface AgentsProps {
  id: string;
  img: string;
  name: string;
  specialization: string;
}

function AgentsOverview() {
  const navigate = useNavigate();

  const { data: agents } = useQuery<AgentsProps[]>({
    queryKey: ["agent_new"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching agents:", err)),
    staleTime: 1000 * 60 * 10,
  });

  const handleDetails = useCallback((agentId: string) => {
    navigate(`/agent-details/${agentId}`);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="px-4">
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center max-w-6xl mx-auto">
          <Typography
            fontFamily="IT Medium"
            color="#BA7F55"
            className="uppercase tracking-widest mb-2"
          >
            meet our experts
          </Typography>
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "50px", xs: "34px" }}
            className="mb-4"
          >
            Top Real Estate Agents in Dubai
          </Typography>
          <Typography
            fontFamily="IT Light"
            className="text-gray-600 leading-relaxed"
          >
            Connect with trusted real estate agents in Dubai at Amana Homes. Our
            team of licensed property consultants helps you buy, sell, or rent
            villas, apartments, and off-plan properties with confidence.
          </Typography>
        </div>

        {/* Agents Grid */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={4}
          className="mt-10 px-3 lg:px-50"
        >
          {agents ? (
            <>
              {agents?.map((item: any, index: any) => (
                <div
                  key={index}
                  onClick={() => handleDetails(item.id)}
                  className="cursor-pointer"
                >
                  <div
                    className="relative h-[300px] lg:h-150 w-full bg-cover bg-center rounded-xl hover:grayscale transition-all"
                    style={{ backgroundImage: `url(${item.img})` }}
                    aria-label={`Agent ${item.name}`}
                  >
                    <div className="absolute bg-gradient-to-t from-black/60 to-black/20 h-full w-full rounded-xl" />

                    <div className="absolute bottom-3 left-3 right-3 rounded-md py-3 px-4 flex flex-col gap-3">
                      <div>
                        <Typography
                          fontFamily={"IT Medium"}
                          fontSize={{ lg: "30px", xs: "14px" }}
                          color="white"
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          fontSize={{ lg: "17px", xs: "14px" }}
                          fontFamily={"IT Light"}
                          color="white"
                        >
                          {item.specialization}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            [...Array(6)].map((_, idx) => (
              <Skeleton key={idx} className="h-[300px] w-full rounded-xl" />
            ))
          )}
        </Box>
      </div>

      {/* Contact Form */}
      <div className="px-5 py-5">
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20">
          {/* Tagline */}
          <Typography
            fontFamily={"RM Medium"}
            color="#BA7F55"
            className="uppercase tracking-wide text-sm mb-2"
          >
            [Get In Touch]
          </Typography>

          {/* Heading */}
          <Typography
            fontFamily={"DM Medium"}
            fontSize={{ xs: "24px", lg: "30px" }}
            className="text-center mb-4"
          >
            Let’s Make Your Property Journey Effortless
          </Typography>

          {/* Subheading */}
          <Typography
            fontFamily={"IT Light"}
            className="text-center text-gray-600 leading-relaxed max-w-xl"
          >
            Whether you're buying, renting, or investing, our expert team is
            here to guide you every step of the way. Let's turn your property
            goals into reality—together.
          </Typography>

          {/* Form */}
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
