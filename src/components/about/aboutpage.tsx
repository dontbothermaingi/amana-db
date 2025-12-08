import { Box, Typography } from "@mui/material";
import Agents from "./agents";
import Form from "@/leads/form";

function AboutOverView() {
  const cards = [
    {
      id: 1,
      title: "Global Expertise, Local Heart",
      desc: "Our international experience informs our approach, while our deep understanding of local markets ensures you get the best of both worlds.",
    },
    {
      id: 2,
      title: "Relationship-Focused",
      desc: "We believe real estate is about more than transactions – it's about building lasting relationships, built on trust, that add value and grow over time.",
    },
    {
      id: 3,
      title: "Future-Oriented",
      desc: "Our aim is to help you make decisions beyond the considerations of just today’s market. We try to anticipate trends and future needs, positioning you for long-term success, whether you’re buying, selling, or investing.",
    },
    {
      id: 4,
      title: "Trusted Guidance",
      desc: "From your first conversation to long after the deal is done, Amana Homes is here to guide and support you every step of the way, ensuring a seamless experience and solid results.",
    },
  ];

  return (
    <div className="pb-20">
      <div className="relative bg-[url('/about5.jpg')] lg:bg-[url('/team.png')] bg-cover bg-right lg:bg-top h-[100vh]">
        <div className="absolute h-full w-full bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        {/* Hero Section */}
        <div className="absolute bottom-30 left-2 lg:bottom-20 lg:left-20 max-w-2xl px-2">
          <Typography
            fontFamily="IT Medium"
            color="#BA7F55"
            className="uppercase tracking-widest mb-2"
          >
            Open Doors Open Arms
          </Typography>
          <Typography
            color="white"
            fontFamily="IT Medium"
            fontSize={{ lg: "50px", xs: "34px" }}
            className="mb-4"
          >
            About Our Team
          </Typography>
          <Typography
            fontSize={{ lg: "17px", xs: "14px" }}
            fontFamily="IT Light"
            className="text-gray-100 leading-relaxed"
          >
            At Amana, we see real estate as more than buildings we see it as a
            bridge between people and possibilities. Our role is to meet you
            where you are, walk you through each step, and help you move forward
            with clarity and peace of mind.
          </Typography>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="pt-16 px-4 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0B253F] px-6 py-2 inline-block rounded-md mb-6">
            <Typography color="#BA7F55" fontFamily="IT Medium">
              Why Choose Us
            </Typography>
          </div>

          <Typography
            fontFamily={"IT Medium"}
            fontSize={{ lg: "48px", xs: "32px" }}
            className="mb-4"
          >
            Built on Trust
          </Typography>
          <Typography
            fontFamily={"DM Regular"}
            className="text-gray-700 max-w-3xl mx-auto"
          >
            Our team is dedicated to earning your trust—whether you’re buying,
            selling, renting, or investing—by focusing on your unique priorities
            and helping you navigate the complexity of the market to find the
            perfect property match.
          </Typography>
        </div>

        {/* Cards Grid */}
        <Box
          display="grid"
          gridTemplateColumns={{ md: "repeat(2, 1fr)", xs: "1fr" }}
          gap={4}
          className="w-full mt-10 max-w-6xl mx-auto px-4"
        >
          {cards.map((item) => (
            <div key={item.id} className="bg-[#BA7F55] px-6 py-4 rounded-xl">
              <Typography
                fontFamily={"IT Medium"}
                fontSize="20px"
                className="mb-2 text-white"
              >
                {item.title}
              </Typography>
              <Typography fontFamily={"IT Light"} className="text-white">
                {item.desc}
              </Typography>
            </div>
          ))}
        </Box>
      </section>

      {/* Agents Section */}
      <section className="px-4">
        <Agents />
      </section>

      {/* Clients Marquee */}
      <div className="pt-15">
        <Typography
          textAlign={"center"}
          fontFamily={"IT Medium"}
          fontSize={{ lg: "50px", md: "40px", xs: "30px" }}
        >
          Our Trusted Partners
        </Typography>

        <div className="flex flex-wrap items-center justify-center gap-10 py- lg:max-w-2xl mx-auto">
          <img
            src="/Aark.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/Arada.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/Azizi.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/Danube.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/HeartOfEurope.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/Mag.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/nshama.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/Object1.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />

          <img
            src="/Reportage.svg"
            alt="logo"
            loading="lazy"
            className="object-cover"
          />
        </div>
      </div>

      {/* Contact Form */}
      <section className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 py-10 lg:px-8 lg:py-12 max-w-3xl mx-auto my-10">
        <Typography
          fontFamily={"RM Medium"}
          color="#BA7F55"
          className="uppercase text-sm text-center mb-2"
        >
          [Get In Touch]
        </Typography>

        <Typography
          fontFamily={"DM Medium"}
          fontSize={{ lg: "30px", xs: "24px" }}
          className="text-center mb-4"
        >
          Let’s Make Your Property Journey Effortless
        </Typography>

        <Typography
          fontFamily={"IT Light"}
          className="text-center text-gray-600 max-w-xl mx-auto mb-6"
        >
          Whether you're buying, renting, or investing, our expert team is here
          to guide you every step of the way.
        </Typography>

        {/* <form className="flex flex-col gap-6 w-full">
          <div className="flex flex-col lg:flex-row gap-4">
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              variant="outlined"
            />
          </div>

          <TextField
            fullWidth
            label="How Can We Help You?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            minRows={6}
            maxRows={12}
            variant="outlined"
          />

          <button
            type="submit"
            className="bg-[#BA7F55] hover:bg-[#a26d49] text-white font-medium py-3 px-8 rounded-xl text-lg shadow-md self-center"
          >
            Send Message
          </button>
        </form> */}

        <Form
          propertyId=""
          extraData={{ location: "I filled the form at the about page." }}
          formType="default"
        />
      </section>
    </div>
  );
}

export default AboutOverView;
