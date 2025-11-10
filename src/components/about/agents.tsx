import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function Agents() {
  const navigate = useNavigate();

  const { data: agents } = useQuery({
    queryKey: ["agent"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents").then((res) => res.json()),
  });

  function handleDetails(agentId: any) {
    navigate(`/agent-details/${agentId}`);
  }

  function handleAgents() {
    navigate(`/agents`);
  }

  return (
    <div className="h-fit py-10 bg-[#f2f2f2]">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="px-4 lg:py-20 py-10 items-center flex flex-col text-center"
      >
        <Typography
          color="#BA7F55"
          fontFamily={"RM Medium"}
          fontSize={{ md: "15px", lg: "18px" }}
        >
          [Meet Our Agents]
        </Typography>
        <Typography
          color="#0B253F"
          fontFamily={"IT Medium"}
          fontSize={{ md: "40px", xs: "26px" }}
          className="leading-snug"
        >
          Top Real Estate Agents in Dubai
        </Typography>
        <Typography
          color="gray"
          fontFamily={"IT Light"}
          fontSize={{ md: "18px", xs: "15px" }}
          className="max-w-2xl mt-3"
        >
          Connect with trusted real estate agents in Dubai at Amana Homes. Our
          team of licensed property consultants helps you buy, sell, or rent
          villas, apartments, and off-plan properties with confidence.
        </Typography>
      </motion.div>

      {/* Agents Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10">
        {agents?.map((agent: any, index: number) => (
          <motion.div
            key={index}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleDetails(agent.id)}
            className="cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative w-full h-80">
              <img
                src={agent.img}
                alt={agent.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <Typography fontFamily="IT Medium" fontSize="18px">
                  {agent.name}
                </Typography>
                <Typography
                  fontFamily="IT Light"
                  fontSize="14px"
                  className="opacity-90"
                >
                  {agent.specialization}
                </Typography>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center py-10"
      >
        <button
          className="group px-6 py-3 rounded-xl border border-[#0B253F] flex items-center gap-2 hover:bg-[#0B253F] transition-all duration-500"
          onClick={handleAgents}
        >
          <Typography fontFamily={"IT Medium"} color="#BA7F55">
            View All Experts
          </Typography>
          <ArrowRight className="bg-[#0B253F] rounded-full text-white w-8 h-8 p-2 group-hover:bg-white group-hover:text-[#0B253F] group-hover:rotate-[-60deg] transition-all duration-500" />
        </button>
      </motion.div>
    </div>
  );
}

export default Agents;
