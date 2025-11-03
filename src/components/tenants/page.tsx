import Form from "@/leads/form";
import { TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, Percent, Home } from "lucide-react";
import { useRef, useState } from "react";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message?: string;
};

function Tenants() {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const formRef = useRef<HTMLDivElement | null>(null);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const highlights = [
    { value: "£30,000", label: "Starting Price" },
    { value: "0%", label: "Property & Income Tax" },
    { value: "8-10%", label: "Rental Yields" },
  ];

  const advantages = [
    {
      icon: <Home color="#BA7F55" />,
      title: "Apartments from £250,000",
      desc: "Less than a starter flat in Greater London",
    },
    {
      icon: <Percent color="#BA7F55" />,
      title: "Rental yields up to 8-10%",
      desc: "Among the highest globally",
    },
    {
      icon: <Building2 color="#BA7F55" />,
      title: "Full foreign ownership rights",
      desc: "In designated investment zones",
    },
    {
      icon: <Percent color="#BA7F55" />,
      title: "Zero property & rental tax",
      desc: "Keep more of what you earn",
    },
  ];

  const marketStats = [
    { value: "19.46%", label: "YoY Growth (Nov 2024)" },
    { value: "180,987", label: "Transactions in 2024" },
    { value: "£142.25B", label: "Total Market Volume" },
  ];

  return (
    <div>
      {/* Hero (unchanged) */}
      <div className="relative bg-[url('/l5.jpg')] bg-cover h-[100vh] bg-center">
        <div className="absolute h-full w-full bg-gradient-to-t lg:bg-gradient-to-r from-black/100 to-black/30" />

        <div className="absolute bottom-30 lg:bottom-20 left-2 lg:left-20 px-3">
          <Typography
            fontFamily="IT Medium"
            color="#BA7F55"
            className="uppercase tracking-widest mb-2"
          >
            Investments
          </Typography>

          <Typography
            color="white"
            fontFamily="IT Medium"
            fontSize={{ lg: "50px", xs: "34px" }}
            className="mb-4"
          >
            Tenant-Covered Investments
          </Typography>

          <Typography
            fontSize={{ lg: "17px", xs: "14px" }}
            fontFamily="IT Light"
            className="text-gray-100 leading-relaxed max-w-xl"
          >
            Invest with confidence in Dubai properties backed by reliable
            tenants. Our tenant-covered real estate investments secure your
            rental income, reduce risks, and maximize long-term growth
            opportunities.
          </Typography>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToForm}
            style={{ fontFamily: "IT Bold" }}
            className="w-fit px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:bg-[#a66d49] transition-all mt-5  bg-white/20 backdrop-blur-3xl border border-white/30"
          >
            Book your consultation
          </motion.button>
        </div>
      </div>

      {/* Overview */}
      <section className="px-5 lg:px-60 py-10">
        <Typography
          fontFamily={"IT Medium"}
          fontSize={{ lg: "40px", xs: "25px", md: "32px" }}
        >
          Invest with Confidence: Tenant-Covered Properties in the UAE
        </Typography>
        <Typography
          color="black"
          fontFamily={"IT Light"}
          fontSize={{ lg: "18px" }}
          className="pt-5"
        >
          At Amana, we provide ready-to-invest properties with tenants in place,
          giving you secure rental income from day one. Minimize risk, maximize
          returns, and enjoy a hands-off investment experience, backed by our
          proven track record across the UAE property market.
        </Typography>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToForm}
          className="w-fit bg-[#BA7F55] px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:bg-[#a66d49] transition-all mt-5"
        >
          Book your consultation
        </motion.button>
      </section>

      {/* Why Dubai Section */}
      <section className="bg-white px-5 lg:px-60 py-0 flex flex-col gap-1">
        <div>
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "38px", xs: "24px" }}
          >
            Why Dubai Real Estate?
          </Typography>
          <Typography
            color="black"
            fontFamily={"IT Light"}
            fontSize={{ lg: "18px" }}
            className="pt-5"
          >
            Dubai offers a unique opportunity for investors seeking strong
            growth, high rental yields, and tax-free income. With properties
            starting from just £30,000, you can enter one of the world’s most
            dynamic real estate markets with unmatched potential.
          </Typography>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 py-5">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center"
            >
              <Typography
                fontFamily="IT Medium"
                fontSize={{ lg: "32px" }}
                className="text-[#0B253F]"
              >
                {h.value}
              </Typography>
              <Typography fontFamily="IT Medium" className="text-[#BA7F55]">
                {h.label}
              </Typography>
            </motion.div>
          ))}
        </div>

        <div className="py-5">
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "25px", xs: "24px" }}
          >
            Key Benefits
          </Typography>
          <div className="pt-2">
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>Affordable Entry:</span>{" "}
              Apartments from £250,000 – less than a starter flat in Greater
              London.
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>
                High Rental Yields:
              </span>{" "}
              Earn 8–10%, among the highest globally.
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>Tax-Free Income:</span>{" "}
              0% property and rental tax – keep more of what you earn.
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>
                Full Ownership Rights:
              </span>{" "}
              Foreign investors can own property in designated investment zones.
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>
                Strong Market Growth:
              </span>{" "}
              Benefit from Dubai’s robust property market and ongoing
              development.
            </Typography>
          </div>
        </div>

        <div className="py-5">
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "25px", xs: "24px" }}
          >
            Smart Payment Plan
          </Typography>
          <div className="pt-2">
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>1.</span> 10% initial
              payment.
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>2.</span> 1% monthly
              installments.
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>3.</span> 50%
              post-handover (3 years).
            </Typography>
            <Typography fontFamily={"IT Light"} fontSize={{ lg: "18px" }}>
              <span style={{ fontFamily: "IT Medium" }}>4.</span> Tenant’s rent
              covers payments.
            </Typography>
          </div>
        </div>
      </section>

      {/* Market Stats Strip */}
      <div className="px-0 lg:px-60 py-5">
        <section className="bg-[#102C4F] py-12 px-5 lg:px-20 flex flex-wrap justify-center gap-12">
          {marketStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Typography
                fontFamily="IT Medium"
                fontSize={{ lg: "28px" }}
                className="text-white"
              >
                {stat.value}
              </Typography>
              <Typography fontFamily="IT Light" className="text-[#E8B899]">
                {stat.label}
              </Typography>
            </motion.div>
          ))}
        </section>
      </div>

      {/* Final Form */}
      <section
        ref={formRef}
        className="bg-gray-50 px-5 lg:px-60 py-20 grid lg:grid-cols-2 gap-20 items-start"
      >
        <div className="flex flex-col gap-6">
          <Typography
            fontFamily={"IT Medium"}
            fontSize={{ lg: "32px", xs: "20px" }}
          >
            Your Investment Journey Starts Here
          </Typography>
          <Typography fontFamily={"IT Medium"}>
            Book your free consultation and get:
          </Typography>

          {[
            "Tailored property recommendations",
            "Rental yield breakdowns in prime areas",
            "Flexible payment plans",
            "Step-by-step buying guide",
            "Strategies to maximize rental income",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <BadgeCheck color="#BA7F55" />
              <Typography fontFamily={"IT Light"}>{text}</Typography>
            </div>
          ))}

          <Typography fontFamily={"IT Light"} className="text-sm text-gray-600">
            *No obligation. ROI calculations based on current market data.
          </Typography>
        </div>

        <div
          ref={formRef}
          className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1"
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
          <Form
            propertyId={""}
            extraData={{ location: "Submitted from the offplan page" }}
            formType="default"
          />
        </div>
      </section>
    </div>
  );
}

export default Tenants;
