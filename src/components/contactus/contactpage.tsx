import Form from "@/leads/form";
import { Box, Typography } from "@mui/material";
import { Mail, MapPin, Phone } from "lucide-react";

function ContactUs() {
  const cards = [
    {
      id: 1,
      title: "Address",
      desc: "104, The Offices, 22nd street - 3rd - Arjan - Al Barsha South - Dubai",
      icon: <MapPin className="w-10 h-10 text-[#BA7F55]" />,
    },
    {
      id: 2,
      title: "Phone",
      desc: "+971529512700",
      icon: <Phone className="w-10 h-10 text-[#BA7F55]" />,
    },
    {
      id: 3,
      title: "Email",
      desc: "info@amanahomes.ae",
      icon: <Mail className="w-10 h-10 text-[#BA7F55]" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-center py-10 px-6 text-center max-w-6xl mx-auto">
        <Typography
          fontFamily="IT Medium"
          color="#BA7F55"
          className="uppercase tracking-widest mb-2"
        >
          Contact us
        </Typography>
        <Typography
          fontFamily="IT Medium"
          fontSize={{ lg: "50px", xs: "34px" }}
          className="mb-4"
        >
          Get in Touch With Us
        </Typography>
        <Typography
          fontFamily="IT Light"
          className="text-gray-600 leading-relaxed"
        >
          Our Dubai real estate team is here to answer your questions, explore
          investment opportunities, and help you find the right property.
        </Typography>
      </div>

      {/* Info Cards */}
      <Box
        className="px-4 md:px-10 lg:px-20 py-0 lg:py-1"
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0B253F] flex flex-col gap-3 p-6 rounded-xl h-full"
          >
            {card.icon}
            <div>
              <Typography
                color="#BA7F55"
                fontFamily={"IT Medium"}
                fontSize="24px"
                className="mb-1 pt-20"
              >
                {card.title}
              </Typography>
              <Typography color="white" fontFamily={"DM Light"}>
                {card.desc}
              </Typography>
            </div>
          </div>
        ))}
      </Box>

      {/* Map */}
      <div className="px-4 md:px-10 lg:px-20 pb-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.246971355556!2d55.239977576225634!3d25.05961707779983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6fd61a1ce523%3A0x57e47863527f05d5!2sAMANA%20HOMES!5e0!3m2!1sen!2sae!4v1754568723339!5m2!1sen!2sae"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full rounded-2xl"
        />
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
