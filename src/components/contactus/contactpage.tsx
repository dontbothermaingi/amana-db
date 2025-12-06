import Form from "@/leads/form";
import { WhatsApp } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Mail, Phone } from "lucide-react";
import { useMemo } from "react";

function ContactUs() {
  const contactDetails = {
    whatsapp: "971529512700", // Format: CountryCode+Number (No + sign)
    phone: "+971529512700",
    email: "info@amanahomes.ae",
  };

  const iFrame = useMemo(
    () => (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.246971355556!2d55.239977576225634!3d25.05961707779983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6fd61a1ce523%3A0x57e47863527f05d5!2sAMANA%20HOMES!5e0!3m2!1sen!2sae!4v1754568723339!5m2!1sen!2sae"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full rounded-2xl"
      />
    ),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Hero */}
      <div className="relative bg-[url('/kim.JPG')] lg:bg-[url('/kim.JPG')] bg-cover bg-center lg:bg-top h-screen">
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/85 lg:via-black/20 to-transparent h-full w-full" />
        <div className="absolute inset-x-4 lg:inset-x-10 bottom-24 lg:bottom-10 text-left z-20">
          <div className="max-w-3xl">
            <Typography
              component="h3"
              fontFamily="IT Medium"
              color="#BA7F55"
              className="uppercase tracking-widest mb-3 text-sm lg:text-base"
            >
              Contact Us
            </Typography>

            <Typography
              component="h1"
              fontFamily="IT Medium"
              color="white"
              sx={{ fontSize: { xs: "34px", md: "48px", lg: "64px" } }}
              className="leading-tight mb-4"
              lineHeight={1.1}
            >
              Get In Touch With Us
            </Typography>

            <Typography
              fontFamily="IT Light"
              className="text-gray-100 leading-relaxed max-w-2xl mb-6"
              fontSize={{ lg: "17px", xs: "14px" }}
            >
              Our team is dedicated to earning your trust whether you’re buying,
              selling, renting, or investing by focusing on your unique
              priorities and helping you navigate the complexity of the market
              to find the perfect property match.
            </Typography>

            <div className="mt-8 flex flex-wrap gap-4">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${contactDetails.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#25D366] text-white hover:bg-[#1ebc57] transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
              >
                <WhatsApp className="w-5 h-5" />
                <span className="font-medium">WhatsApp</span>
              </a>

              {/* Call Button */}
              <a
                href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0B253F] border border-white/20 text-white hover:bg-[#163a5e] transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">Call Us</span>
              </a>

              {/* Email Button */}
              <a
                href={`mailto:${contactDetails.email}`}
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#BA7F55] text-white hover:bg-[#a66f48] transition-all duration-300 shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 md:px-10 lg:px-20 pb-10 mt-10">
        <Typography
          fontFamily={"IT Bold"}
          fontSize={{ lg: "30px" }}
          sx={{ pb: "10px" }}
        >
          Location
        </Typography>
        {iFrame}
      </div>

      {/* Contact Form */}
      <section className="px-4 md:px-10 lg:px-20 py-10">
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1">
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

export default ContactUs;
