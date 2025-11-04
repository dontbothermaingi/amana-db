import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TextField, Typography } from "@mui/material";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useCallback, useState } from "react";
import PropertyCard from "../properties/propertycard";

function AgentView() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/agents/${agentId}`).then((res) =>
        res.json()
      ),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["house"],
    queryFn: async () => {
      const res = await fetch(
        "https://dataapi.pixxicrm.ae/pixxiapi/v1/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-PIXXI-TOKEN": access_token,
          },
          body: JSON.stringify({
            listingType: "SELL",
            size: 84,
            sort: "ID",
            sortType: "DESC",
          }),
        }
      );

      const json = await res.json();
      console.log("Raw API response:", json);
      return json?.list || json?.data || json || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  function handleProperties() {
    navigate("/properties");
  }

  // function handleDetails(propertyId) {
  //   navigate(`/public-listings/${propertyId}`);
  // }

  const handleDetails = useCallback((propertyId: any) => {
    navigate(`/public-listings/${propertyId}`);
  }, []);

  return (
    <div>
      {/* Agent Profile Section */}
      <div className="px-4 lg:px-20 lg:py-10 py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={`${agent?.img}`}
              alt="image"
              loading="lazy"
              className="object-cover h-80 w-80 lg:h-130 lg:w-120 rounded-xl"
            />
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div>
              <div className="bg-[#0B253F] w-fit px-5 py-2 rounded-xl mb-2">
                <Typography fontFamily={"RM Medium"} color="white">
                  {agent?.specialty}
                </Typography>
              </div>
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "35px", xs: "28px" }}
                color="#BA7F55"
              >
                {agent?.name}
              </Typography>
              <Typography fontFamily={"IT Regular"}>
                {agent?.description}
              </Typography>
            </div>

            <div>
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "28px" }}
                color="#BA7F55"
              >
                Work Experience
              </Typography>
              <Typography fontFamily={"IT Regular"}>
                {agent?.workExperience}
              </Typography>
            </div>

            <div>
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "28px" }}
                color="#BA7F55"
              >
                Personal Info
              </Typography>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-3">
                  <Mail className="text-slate-400 w-5 h-5" />
                  <Typography fontFamily={"IT Regular"}>
                    {agent?.email}
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-slate-400 w-5 h-5" />
                  <Typography fontFamily={"IT Regular"}>
                    {agent?.phoneNumber}
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-slate-400 w-5 h-5" />
                  <Typography fontFamily={"IT Regular"}>
                    {agent?.location}
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-slate-400 w-5 h-5" />
                  <Typography fontFamily={"IT Regular"}>
                    {agent?.yearsOfExperience} Years
                  </Typography>
                </div>
              </div>
            </div>

            <div>
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "28px" }}
                color="#BA7F55"
              >
                Follow Me
              </Typography>
              <div className="flex gap-3 mt-2">
                {[FaWhatsapp, FaInstagram, FaLinkedin].map((Icon, i) => (
                  <div
                    key={i}
                    className="bg-[#0B253F] p-2 rounded-xl hover:bg-[#BA7F55] transition"
                  >
                    <Icon className="text-white w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
            <Typography
              fontFamily={"DM Medium"}
              fontSize={{ lg: "30px", xs: "22px" }}
            >
              Browse More Properties
            </Typography>
            <button
              className="bg-[#0B253F] px-4 py-2 rounded-xl"
              onClick={handleProperties}
            >
              <span
                className="text-white text-sm lg:text-base"
                style={{ fontFamily: "MT Medium" }}
              >
                All Properties
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties?.list?.slice(0, 4).map((item: any) => (
              <PropertyCard
                key={item.id}
                item={item}
                onClick={() => handleDetails(item.propertyId)}
              />
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-6 py-10 max-w-3xl mx-auto my-10">
          <Typography
            fontFamily={"RM Medium"}
            color="#BA7F55"
            className="uppercase tracking-wide text-sm text-center mb-2"
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
            className="text-center text-gray-600 mb-6"
          >
            Whether you're buying, renting, or investing, our expert team is
            here to guide you every step of the way.
          </Typography>

          <form className="flex flex-col gap-6 w-full">
            {/* Name Fields */}
            <div className="flex flex-col lg:flex-row gap-4">
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col lg:flex-row gap-4">
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Message */}
            <TextField
              fullWidth
              label="How Can We Help You?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              minRows={6}
              maxRows={12}
            />

            <button
              type="submit"
              className="bg-[#BA7F55] hover:bg-[#a26d49] text-white font-medium py-3 px-6 rounded-xl text-lg shadow-md w-fit self-center"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgentView;
