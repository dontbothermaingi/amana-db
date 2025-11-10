import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Form from "@/leads/form";
import { Skeleton } from "../ui/skeleton";

interface OffPlanItem {
  id: string;
  title: string;
  developer: string;
  img: string;
  startingPrice: number;
  pp: string;
  handover: string;
}

function OffPlan() {
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { data: stats } = useQuery<OffPlanItem[]>({
    queryKey: ["project"],
    queryFn: () =>
      fetch(`https://68e7771910e3f82fbf3f4033.mockapi.io/offplan/offplan`).then(
        (resp) => resp.json()
      ),
  });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Something went wrong.</p>;

  const handleDetails = useCallback(
    (propertyId: String) => {
      navigate(`/off-plan/${propertyId}`);
    },
    [navigate]
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center max-w-4xl mx-auto">
        <Typography
          fontFamily="IT Medium"
          color="#BA7F55"
          className="uppercase tracking-widest mb-2"
        >
          Off-plan Opportunities
        </Typography>
        <Typography
          fontFamily="IT Medium"
          fontSize={{ lg: "50px", xs: "34px" }}
          className="mb-4"
        >
          Find Your Next Investment
        </Typography>
        <Typography
          fontFamily="IT Light"
          className="text-gray-600 leading-relaxed"
        >
          Our property experts are ready to guide you through Dubai's finest
          off-plan opportunities. Whether you have questions about specific
          projects or want to explore all options, we're here to help.
        </Typography>
      </div>

      {/* Projects Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{
          lg: "repeat(3, 1fr)",
          md: "repeat(2, 1fr)",
          xs: "repeat(1, 1fr)",
        }}
        gap="30px"
        className="max-w-7xl mx-auto px-6 py-5"
      >
        {stats ? (
          <>
            {stats?.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => handleDetails(item.id)}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-white flex flex-col"
              >
                {/* Image */}
                <img
                  src={`${item.img}`}
                  alt={item.title}
                  loading="lazy"
                  className="object-cover h-56 w-full"
                />

                {/* Content */}
                <div className="p-6 flex flex-col">
                  {/* Developer */}
                  <div className="pb-3 border-b border-gray-200">
                    <Typography fontFamily="IT Light">
                      <strong style={{ fontFamily: "IT Medium" }}>
                        Developer:
                      </strong>{" "}
                      {item.developer}
                    </Typography>
                  </div>

                  {/* Project Name */}
                  <div className="py-3 border-b border-gray-200">
                    <Typography
                      fontFamily="IT Light"
                      className="text-xl text-[#0B253F] font-semibold"
                    >
                      <strong style={{ fontFamily: "IT Medium" }}>
                        Project Name:
                      </strong>{" "}
                      {item.title}
                    </Typography>
                  </div>

                  {/* Pricing */}
                  <div className="py-3 border-b border-gray-200">
                    <Typography
                      fontFamily="IT Light"
                      className="text-lg text-[#0B253F]"
                    >
                      <strong style={{ fontFamily: "IT Medium" }}>
                        Starting Price:
                      </strong>{" "}
                      AED {new Intl.NumberFormat().format(item.startingPrice)}
                    </Typography>
                  </div>

                  {/* Payment Plan */}
                  <div className="py-3 border-b border-gray-200">
                    <Typography
                      fontFamily="IT Light"
                      className="text-lg text-[#0B253F]"
                    >
                      <strong style={{ fontFamily: "IT Medium" }}>
                        Payment Plan:
                      </strong>{" "}
                      {item.pp}
                    </Typography>
                  </div>

                  {/* Handover */}
                  <div className="pt-3">
                    <Typography
                      fontFamily="IT Light"
                      className="text-lg text-[#0B253F]"
                    >
                      <strong style={{ fontFamily: "IT Medium" }}>
                        Handover:
                      </strong>{" "}
                      {item.handover}
                    </Typography>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-5 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={scrollToForm}
                      style={{ fontFamily: "IT Medium" }}
                      className="w-full bg-slate-500 text-white flex items-center justify-center gap-3 font-semibold py-2 rounded-md shadow-md hover:bg-[#a66d49] transition-all"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </Box>

      {/* Form */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mt-20">
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
          Whether you're buying, renting, or investing, our expert team is here
          to guide you every step of the way. Let's turn your property goals
          into reality—together.
        </Typography>

        {/* Form */}
        <Form
          propertyId={""}
          extraData={{ location: "Submitted from the offplan page" }}
          formType="default"
        />
      </div>
    </div>
  );
}

export default OffPlan;
