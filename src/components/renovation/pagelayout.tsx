import React, { useRef, useState, type JSX } from "react";
import { TextField, Typography, Button } from "@mui/material";
import { ArrowRight, Check, Clock } from "lucide-react";
import { motion } from "framer-motion";

type FormData = {
  full_name: string;
  email: string;
  phone_number: string;
  message: string;
};

const stats = [
  { label: "Projects Completed", value: "120+" },
  { label: "Years Experience", value: "15" },
  { label: "Average ROI", value: "18%" },
];

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
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    phone_number: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    // Basic guard
    if (!formData.full_name || !formData.email) {
      // In real app, show a validation error component / snackbar
      return;
    }
    setSubmitting(true);

    // Simulate request (replace with real API call)
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);

    // optionally reset after delay:
    // setFormData({ full_name: "", email: "", phone_number: "", message: "" });
  }

  return (
    <div className="bg-white text-[#0B253F] overflow-hidden">
      {/* Hero */}
      <div className="relative bg-[url('/renovate3.jpg')] lg:bg-[url('/INT1.jpg')] bg-cover bg-bottom lg:bg-center h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/20 to-transparent h-full w-full" />
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
                onClick={scrollToForm}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] transition"
                aria-label="View portfolio"
              >
                Book your call
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Overview with stats */}
      <section className="px-6 lg:px-40 pt-12 lg:pt-20 pb-8">
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
              for value — on time, on budget.
            </Typography>

            <div className="mt-6 flex gap-4">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-semibold text-[#0B253F]">
                    {s.value}
                  </span>
                  <span className="text-sm text-gray-600">{s.label}</span>
                </div>
              ))}
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
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-xl p-3">
                <Typography fontFamily={"IT Medium"} sx={{ fontSize: "14px" }}>
                  Villa Jumeirah — Full Interior & Landscape
                </Typography>
                <Typography className="text-xs text-gray-600">
                  Completed: May 2025
                </Typography>
              </div>
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

      {/* Split Hero: Text + Video */}
      <section className="px-6 lg:px-40 py-12 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <Typography
            fontFamily={"IT Medium"}
            sx={{ fontSize: { xs: "30px", lg: "56px" } }}
            className="leading-tight bg-gradient-to-r from-[#0B253F] to-[#BA7F55] bg-clip-text text-transparent"
          >
            Bespoke Design, Flawless Execution
          </Typography>

          <Typography
            fontFamily={"IT Light"}
            className="text-lg text-gray-600 mt-4 max-w-xl"
          >
            Experience seamless property transformation — from concept to
            completion, without the complexity.
          </Typography>

          <div className="mt-6 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToForm}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0B253F] text-white shadow-lg"
            >
              Book Your Call
              <ArrowRight />
            </motion.button>

            <button
              onClick={() => window.open("/case-studies", "_blank")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-300"
            >
              Case Studies
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="rounded-3xl overflow-hidden shadow-2xl relative h-72 lg:h-96"
        >
          <video
            src="/R7.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      </section>

      {/* Consultation Form */}
      <section ref={formRef} className="px-6 lg:px-40 py-12 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-8"
        >
          <Typography
            fontFamily={"IT Medium"}
            sx={{ fontSize: { xs: "24px", lg: "42px" } }}
          >
            Ready to Elevate Your Property?
          </Typography>
          <Typography className="text-gray-600 mt-2">
            Schedule a private consultation — no commitment. A design specialist
            will review your brief and advise next steps.
          </Typography>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 grid gap-6"
          aria-label="Consultation form"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextField
              label="Your Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ "aria-label": "full name" }}
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              fullWidth
              inputProps={{ "aria-label": "phone number" }}
            />
          </div>

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ "aria-label": "email" }}
          />

          <TextField
            label="Message (optional)"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            minRows={4}
            fullWidth
            inputProps={{ "aria-label": "message" }}
          />

          <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
            <div className="text-sm text-gray-600 flex items-center gap-3">
              <Clock className="w-4 h-4" />
              <span>We’ll contact you within 48 business hours</span>
            </div>

            <div className="w-full md:w-auto flex gap-3">
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || submitted}
                sx={{
                  background: "linear-gradient(90deg,#BA7F55,#0B253F)",
                  px: 4,
                  py: 1.5,
                  borderRadius: "1rem",
                  fontWeight: 600,
                }}
              >
                {!submitted
                  ? submitting
                    ? "Booking..."
                    : "Book Your Call"
                  : "Booked"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  // quick call action: tel: or open calendar
                  window.open("tel:+971XXXXXXXXX");
                }}
                className="rounded-2xl"
              >
                Call Us
              </Button>
            </div>
          </div>

          {submitted && (
            <div className="mt-2 flex items-center gap-3 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">
                Thanks! Your request has been received. We’ll contact you
                shortly.
              </span>
            </div>
          )}
        </motion.form>
      </section>
    </div>
  );
}
