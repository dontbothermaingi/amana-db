import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function Team() {
  const navigate = useNavigate();

  const { data: team } = useQuery({
    queryKey: ["team"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents").then((res) => res.json()),
  });

  function handleDetails(id: any) {
    navigate(`/agent-details/${id}`);
  }

  return (
    <div className="h-fit py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="px-4 lg:py-20 py-10 items-center flex flex-col text-center"
      >
        <Typography
          color="#BA7F55"
          fontFamily="RM Medium"
          fontSize={{ md: "15px", lg: "18px" }}
        >
          [Meet the Amana Team]
        </Typography>

        <Typography
          color="#0B253F"
          fontFamily="IT Medium"
          fontSize={{ md: "40px", xs: "26px" }}
          className="leading-snug"
        >
          The Amana Team
        </Typography>

        <Typography
          color="gray"
          fontFamily="IT Light"
          fontSize={{ md: "18px", xs: "15px" }}
          className="max-w-2xl mt-3"
        >
          From the visionary leadership to the dedicated support specialists,
          discover the talent guiding your journey.
        </Typography>
      </motion.div>

      {/* Team Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10">
        {team?.map((member: any, index: number) => (
          <motion.div
            key={index}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleDetails(member.id)}
            className="cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative w-full h-80">
              <img
                src={member.img}
                alt={member.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <Typography fontFamily="IT Medium" fontSize="18px">
                  {member.name}
                </Typography>
                <Typography
                  fontFamily="IT Light"
                  fontSize="14px"
                  className="opacity-90"
                >
                  {member.specialization}
                </Typography>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Team;
