import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMemo } from "react"; // Changed: Removed useEffect/useState, added useMemo

function Team() {
  const navigate = useNavigate();

  const { data: team } = useQuery({
    queryKey: ["team"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents").then((res) => res.json()),
  });

  // --------------------------------------------------------------------------
  // FIXED LOGIC: useMemo
  // --------------------------------------------------------------------------
  // We calculate both lists in one go. This only runs when 'team' data changes.
  const { advisors, supportingStaff } = useMemo(() => {
    // 1. Safety check
    if (!team) return { advisors: [], supportingStaff: [] };

    // 2. Initial Filter (remove Support category)
    const validAgents = team.filter(
      (member: any) => member.category !== "Support"
    );

    // 3. Split into groups
    const advisorsList = validAgents.filter(
      (item: any) => item.specialization === "Property Advisor"
    );

    const staffList = validAgents.filter(
      (item: any) => item.specialization !== "Property Advisor"
    );

    return { advisors: advisorsList, supportingStaff: staffList };
  }, [team]); // Only re-calculate if the fetch data changes

  // --------------------------------------------------------------------------
  // HELPER: CARD COMPONENT
  // --------------------------------------------------------------------------
  const MemberCard = ({ member, index }: { member: any; index: number }) => {
    const isAdvisor = member.specialization === "Property Advisor";

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={isAdvisor ? { y: -8 } : {}} // Disable hover lift if not clickable
        // FIXED: Use ternary to pass undefined if not an advisor
        onClick={
          isAdvisor ? () => navigate(`/agent-details/${member.id}`) : undefined
        }
        // FIXED: Conditionally apply cursor-pointer
        className={`group rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-all duration-300 
          ${isAdvisor ? "cursor-pointer hover:shadow-xl" : "cursor-default"}`}
      >
        <div className="relative w-full h-[360px]">
          <img
            src={member.img}
            alt={member.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isAdvisor ? "group-hover:scale-105" : ""
            }`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

          {/* Text Content */}
          <div
            className={`absolute bottom-0 left-0 w-full p-6 text-white transition-transform duration-300 ${
              isAdvisor ? "translate-y-2 group-hover:translate-y-0" : ""
            }`}
          >
            <div
              className={`w-10 h-0.5 bg-[#BA7F55] mb-3 transition-opacity duration-300 ${
                isAdvisor ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            ></div>
            <Typography fontFamily="IT Medium" fontSize="20px" className="mb-1">
              {member.name}
            </Typography>
            <Typography
              fontFamily="IT Light"
              fontSize="15px"
              className={`text-gray-300 transition-colors ${
                isAdvisor ? "group-hover:text-[#BA7F55]" : ""
              }`}
            >
              {member.specialization}
            </Typography>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-fit py-16 px-4 md:px-10">
      {/* --- PAGE HEADER --- */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <Typography
          color="#BA7F55"
          fontFamily="IT Medium"
          fontSize="14px"
          className="uppercase tracking-widest mb-3"
        >
          Meet The Experts
        </Typography>
        <Typography
          color="#0B253F"
          fontFamily="IT Medium"
          fontSize={{ xs: "32px", md: "48px", lg: "58px" }}
          className="leading-tight mb-6"
        >
          The Amana Team
        </Typography>
        <div className="w-20 h-1 bg-[#BA7F55] mx-auto mb-6 rounded-full"></div>
        <Typography
          color="text.secondary"
          fontFamily="IT Light"
          fontSize={{ xs: "16px", md: "18px" }}
          className="max-w-2xl mx-auto leading-relaxed"
        >
          From visionary leadership to dedicated support specialists, discover
          the talent guiding your journey.
        </Typography>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-20">
        {/* --- SECTION 1: AGENTS --- */}
        {advisors && advisors.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Typography
                color="#0B253F"
                fontFamily="IT Medium"
                fontSize="32px"
              >
                Property Consultants
              </Typography>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {advisors.map((member: any, index: number) => (
                <MemberCard
                  key={member.id || index}
                  member={member}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 2: SUPPORT STAFF --- */}
        {supportingStaff && supportingStaff.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Typography
                color="#0B253F"
                fontFamily="IT Medium"
                fontSize="32px"
              >
                Management & Support
              </Typography>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {supportingStaff.map((member: any, index: number) => (
                <MemberCard
                  key={member.id || index}
                  member={member}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
