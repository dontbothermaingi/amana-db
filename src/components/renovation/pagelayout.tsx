import { useRef, type JSX } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import Form from "@/leads/form";

const valueCards = [
  {
    img: "/r1.jpg",
    title: "Transparent Pricing",
    desc: "Every detail itemized upfront. No hidden costs — only clarity and trust.",
  },
  {
    img: "/r2.jpg",
    title: "Effortless Approvals",
    desc: "We manage permits and approvals with Dubai authorities on your behalf.",
  },
  {
    img: "/r3.jpg",
    title: "Precision in Every Detail",
    desc: "From 3D visualization to final execution — craftsmanship you can rely on.",
  },
];

export default function Renovation(): JSX.Element {
  const formRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function scrollToContent() {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="text-[#0B253F] overflow-hidden">
      {/* Hero */}
      <div className="relative bg-[url('/renovate3.jpg')] lg:bg-[url('/INT1.jpg')] bg-cover bg-bottom lg:bg-center h-screen">
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/85 via-black/40 lg:via-black/20 to-transparent h-full w-full" />
        <div className="absolute inset-x-4 lg:inset-x-20 bottom-24 lg:bottom-28 text-left z-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Typography
              component="h3"
              fontFamily="IT Medium"
              color="#BA7F55"
              className="uppercase tracking-widest mb-3 text-sm lg:text-base"
            >
              Where design meets detail
            </Typography>

            <Typography
              component="h1"
              fontFamily="IT Medium"
              color="white"
              sx={{ fontSize: { xs: "34px", md: "48px", lg: "64px" } }}
              className="leading-tight mb-4"
              lineHeight={1.1}
            >
              Luxury Property Renovations in Dubai
            </Typography>

            <Typography
              fontFamily="IT Light"
              className="text-gray-100 leading-relaxed max-w-2xl mb-6 text-sm lg:text-lg"
            >
              Amana Homes delivers luxury villa and apartment renovations in
              Dubai — transparent pricing, meticulous finishes and a seamless
              experience for homeowners and investors.
            </Typography>

            <div className="mt-5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToContent}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] transition"
                aria-label="View portfolio"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Overview with stats */}
      <section ref={contentRef} className="px-6 lg:px-40 pt-12 lg:pt-20 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            // variants={containerVariants}
            className="max-w-xl"
          >
            <Typography
              fontFamily={"IT Medium"}
              sx={{ fontSize: { xs: "26px", lg: "40px" } }}
              className="mb-4"
            >
              Why Choose Us for Your Renovation
            </Typography>

            <Typography
              fontFamily={"IT Light"}
              sx={{ fontSize: { xs: "14px", lg: "18px" } }}
              className="text-gray-700"
            >
              We transform spaces with precision, creativity and lasting
              quality. From luxury villa upgrades to smart apartment
              refurbishments, our approach is tailored, transparent and built
              for value on time, on budget.
            </Typography>

            <div className="mt-5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToForm}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/30 bg-[#0B253F] text-white transition cursor-pointer"
                aria-label="View portfolio"
              >
                Enquire
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            // variants={containerVariants}
            className="bg-[#F9F9F9] rounded-3xl p-2 lg:p-2 shadow-sm"
          >
            {/* A short client testimonial or mini portfolio preview */}
            {/* <Typography className="mb-4 font-semibold" fontFamily={"IT Medium"}>
              Recent Transformation
            </Typography> */}
            <div className="rounded-2xl overflow-hidden h-60 lg:h-72 relative shadow-lg">
              <img
                src="/r1.jpg"
                alt="Recent renovation"
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="px-6 lg:px-40 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {valueCards.map((card, idx) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-lg group bg-white"
                aria-labelledby={`card-${idx}-title`}
              >
                <div
                  className="h-56 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('${card.img}')`,
                  }}
                />

                <div className="p-6">
                  <div className="h-0.5 w-12 bg-[#BA7F55] mb-3 rounded" />
                  <Typography
                    id={`card-${idx}-title`}
                    fontFamily={"IT Medium"}
                    sx={{ fontSize: "20px" }}
                    className="mb-2"
                  >
                    {card.title}
                  </Typography>
                  <Typography fontFamily={"IT Light"} className="text-gray-600">
                    {card.desc}
                  </Typography>
                </div>

                {/* overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <div className="px-5 pb-5">
        <div
          ref={formRef}
          className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20"
        >
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
            Let’s Make Your Property Renovation Effortless
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
            extraData={{ reason: "Submitted at the renovations page" }}
            formType="default"
          />
        </div>
      </div>
    </div>
  );
}
