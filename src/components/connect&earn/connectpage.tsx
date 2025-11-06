import { Divider, Typography } from "@mui/material";
import { CheckCircle, Gift, Handshake, Repeat, UserPlus } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mui/system";
import Form from "@/leads/form";
import { Button } from "../ui/button";

function ConnectAndEarn() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const formRef = useRef<HTMLDivElement | null>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="text-[#0B253F] bg-[#F9FAFB] pb-10">
      {/* NAVBAR + HERO SECTION */}
      <div
        className={`relative ${
          isMobile ? "bg-[url('/co1.jpg')]" : "bg-[url('/ab.jpg')]"
        } bg-cover bg-center h-[100vh]`}
      >
        <div
          className={`absolute h-full w-full ${
            isMobile
              ? "bg-gradient-to-t from-black/90 to-black/10"
              : "bg-gradient-to-r from-black/90 to-black/20"
          }`}
        />

        <div
          className={`absolute ${
            isMobile ? "bottom-28 left-4 px-4" : "bottom-24 left-20 max-w-3xl"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              fontFamily="IT Medium"
              color="#BA7F55"
              className="uppercase tracking-widest mb-2"
            >
              Earn Up to AED 9,500 Per Referral
            </Typography>

            <Typography
              fontFamily="IT Medium"
              fontSize={{ lg: "56px", xs: "32px" }}
              color="white"
              className="leading-tight mb-4"
            >
              Recommend Me Program
            </Typography>

            <Typography
              fontFamily="IT Light"
              fontSize={{ xs: "14px", lg: "18px" }}
              className="text-gray-100 leading-relaxed max-w-lg"
            >
              Refer friends or colleagues to Amana Homes’ real estate experts in
              Dubai and earn exclusive cash rewards when they buy, sell, or rent
              properties.
            </Typography>

            <button
              onClick={scrollToForm}
              className="flex items-center mt-5 gap-2 px-4 py-2 rounded-2xl border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] transition"
            >
              <Typography fontFamily="IT Medium">Start Earning Now</Typography>
            </button>
          </motion.div>
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <div className="px-6 lg:px-24 py-20 flex flex-col lg:flex-row gap-20 items-start">
        <div className="w-full lg:w-1/2">
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "42px", xs: "28px" }}
            className="leading-tight"
          >
            Earn Up to AED 9,500 with Amana’s Property Referral Program
          </Typography>

          <Typography
            fontFamily="IT Light"
            fontSize={{ lg: "18px", xs: "17px" }}
            className="pt-6 text-gray-700 leading-relaxed"
          >
            Looking to{" "}
            <span className="font-medium text-[#0B253F]">
              earn money by referring properties
            </span>{" "}
            in the UAE? With Amana’s program, you can earn up to AED 9,500 for
            each successful referral. It’s simple, rewarding, and designed to
            grow with your network.
          </Typography>

          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "28px", xs: "22px" }}
            className="pt-8"
          >
            Why Join?
          </Typography>

          <ul className="py-5 space-y-3 text-gray-700 text-lg">
            <li style={{ fontFamily: "IT Light" }}>
              <span
                style={{ fontFamily: "IT Medium" }}
                className="font-medium text-[#0B253F]"
              >
                Generous Rewards:
              </span>{" "}
              Earn up to AED 9,500 per successful referral.
            </li>
            <li style={{ fontFamily: "IT Light" }}>
              <span
                style={{ fontFamily: "IT Medium" }}
                className="font-medium text-[#0B253F]"
              >
                Simple Process:
              </span>{" "}
              Refer, relax, and get rewarded once the deal closes.
            </li>
            <li style={{ fontFamily: "IT Light" }}>
              <span
                style={{ fontFamily: "IT Medium" }}
                className="font-medium text-[#0B253F]"
              >
                Trusted Expertise:
              </span>{" "}
              Amana’s experienced real estate professionals handle everything.
            </li>
            <li style={{ fontFamily: "IT Light" }}>
              <span
                style={{ fontFamily: "IT Medium" }}
                className="font-medium text-[#0B253F]"
              >
                Unlimited Opportunities:
              </span>{" "}
              Refer as many people as you like each successful deal earns you
              more.
            </li>
          </ul>

          <Button onClick={scrollToForm} className="group bg-[#0B253F]">
            <Typography fontFamily="IT Medium">Start Earning Now</Typography>
          </Button>
        </div>

        {!isMobile && (
          <Divider orientation="vertical" sx={{ height: "690px" }} />
        )}

        {/* HOW IT WORKS */}
        <div className="w-full lg:w-1/2">
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "42px", xs: "28px" }}
            className="mb-8"
          >
            How It Works
          </Typography>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "1. Refer",
                desc: "Introduce someone who could benefit from our services by sharing their details with us.",
                icon: <UserPlus />,
              },
              {
                title: "2. We Connect",
                desc: "Our team reaches out to learn more about their needs and provide support.",
                icon: <Handshake />,
              },
              {
                title: "3. Deal Closes",
                desc: "Once your referral successfully completes a deal or transaction with us, it’s confirmed.",
                icon: <CheckCircle />,
              },
              {
                title: "4. Earn Your Reward",
                desc: "You’ll receive a reward as a token of appreciation once the process is completed.",
                icon: <Gift />,
              },
              {
                title: "5. Refer Again",
                desc: "Keep sharing — there’s no limit to how many people you can refer!",
                icon: <Repeat />,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="p-3 rounded-full bg-[#0B253F] text-white w-fit">
                  {step.icon}
                </div>
                <Typography
                  fontFamily="IT Medium"
                  className="text-lg text-[#0B253F]"
                >
                  {step.title}
                </Typography>
                <Typography fontFamily="IT Light" className="text-gray-600">
                  {step.desc}
                </Typography>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* REFERRAL FORM */}
      <div className="px-5">
        <div
          ref={formRef}
          className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mt-20"
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
          <Form propertyId={""} extraData={{}} formType="referral" />
        </div>
      </div>
    </div>
  );
}

export default ConnectAndEarn;
