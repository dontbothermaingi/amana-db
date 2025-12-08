import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import MortgageCalculator from "../properties/morgagecalculator";
import { Typography } from "@mui/material";
import Form from "@/leads/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  MapPin,
  CalendarClock,
  DollarSign,
  BadgeCheck,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import { Button } from "../ui/button"; // Ensure you have this
import { Skeleton } from "../ui/skeleton"; // Ensure you have this
import { FaWhatsapp } from "react-icons/fa"; // Ensure you have this

const HERO_FALLBACK = "/placeholder-image.png";

function OffPlanDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 1. Fetch Offplan Project Details
  const {
    data: project,
    isLoading: projectLoading,
    error,
  } = useQuery({
    queryKey: ["offplan_detail", propertyId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/offplans/${propertyId}`).then(
        (resp) => resp.json()
      ),
  });

  // 2. Fetch Agent Details (Runs only when project data is available)
  const { data: agent, isLoading: agentLoading } = useQuery({
    queryKey: ["agent_for_offplan", project?.agent_id],
    queryFn: async () => {
      const res = await fetch("https://db-amana.onrender.com/agents");
      const allAgents = await res.json();
      // Find the agent matching the ID stored in the offplan project
      return allAgents.find((a: any) => a.id == project?.agent_id);
    },
    enabled: !!project?.agent_id, // Only run if project has loaded and has an agent_Id
    staleTime: 1000 * 60 * 10,
  });

  // Helper to handle image mapping
  function setPicture(agentData: any) {
    if (!agentData) return "/amana-logo.png";
    // If the agent has a direct img URL in DB, use it, otherwise fallback to switch logic
    if (agentData.img && agentData.img.startsWith("http")) return agentData.img;

    let pic = "";
    // Fallback logic if images aren't fully populated in DB yet
    switch (agentData.email) {
      case "Guergana@amanahomes.ae":
        pic = "/GG.JPG";
        break;
      case "attique@amanahomes.ae":
        pic = "/ATTIQUE.JPG";
        break;
      case "charlotte@amanahomes.ae":
        pic = "/CHARL.JPG";
        break;
      case "mohamedfahmy@amanahomes.ae":
        pic = "/MO.JPG";
        break;
      case "fatima@amanahomes.ae":
        pic = "/FATIMA.JPG";
        break;
      case "faizan@amanahomes.ae":
        pic = "/FAIZAN.JPG";
        break;
      case "muhammadanas@amanahomes.ae":
        pic = "/ANAS.JPG";
        break;
      case "mark@amanahomes.ae":
        pic = "/MARK.JPG";
        break;
      case "yang@amanahomes.ae":
        pic = "/yang.PNG"; // Ensure path is correct in your public folder
        break;
      default:
        pic = "/amana-logo.png";
    }
    return pic;
  }

  const handleAgentClick = () => {
    if (agent) {
      navigate(`/agent-details/${agent.id}`, { state: { agent } });
    }
  };

  if (projectLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );

  if (error || !project || project.error)
    return (
      <div className="h-screen flex items-center justify-center">
        Project not found.
      </div>
    );

  const hasVideo = project.video_url && project.video_url !== "";
  const heroMedia =
    project.photos && project.photos.length > 0
      ? project.photos[0]
      : HERO_FALLBACK;

  const getMapSrc = () => {
    const mapLink = project.location_map;
    if (
      mapLink &&
      mapLink.includes("embed") &&
      !mapLink.includes("googleusercontent")
    ) {
      return mapLink;
    }
    const locationQuery = encodeURIComponent(project.location || "Dubai");
    return `https://maps.google.com/maps?q=${locationQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="">
      <div className="lg:px-20 mx-auto py-10 lg:py-20 px-5">
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="max-w-2xl">
            <h1
              style={{ fontFamily: "GT Bold" }}
              className="text-4xl lg:text-5xl leading-tight mb-4"
            >
              {project.project_name || "Untitled Project"}
            </h1>

            <p
              style={{ fontFamily: "IT Regular" }}
              className="text-gray-700 leading-relaxed mb-6 lg:text-lg whitespace-pre-line"
            >
              {project.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
              <a
                href="#gallery"
                className="flex items-center gap-2 text-sm text-gray-700 underline underline-offset-2"
              >
                <button
                  className="px-6 py-3 bg-[#0B253F] text-white rounded-md lg:text-lg"
                  style={{ fontFamily: "IT Medium" }}
                >
                  View Gallery
                </button>
              </a>
            </div>
          </div>

          <div className="relative w-full h-[400px] lg:h-[520px] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            {hasVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={project.video_url.replace("watch?v=", "embed/")}
                title="Project Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full object-cover"
              ></iframe>
            ) : (
              <img
                src={heroMedia}
                alt={project.project_name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-12">
            {/* AMENITIES */}
            <section>
              <h3
                style={{ fontFamily: "IT Bold" }}
                className="text-2xl font-semibold mb-6 border-b pb-2"
              >
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(project.amenities || []).map(
                  (amenity: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-gray-800 rounded-lg text-md text-gray-700 flex items-center justify-center text-center"
                      style={{ fontFamily: "IT Medium" }}
                    >
                      {amenity}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* LOCATION */}
            <section>
              <h3
                className="text-2xl font-semibold mb-4 border-b pb-2"
                style={{ fontFamily: "IT Bold" }}
              >
                Location
              </h3>
              <p
                className="text-gray-600 mb-4 flex items-center gap-2"
                style={{ fontFamily: "IT Light" }}
              >
                <MapPin className="text-[#BA7F55]" size={20} />
                {project.location}
              </p>
              <iframe
                title="map"
                className="w-full h-72 rounded-xl border bg-gray-100"
                src={getMapSrc()}
                loading="lazy"
              />
            </section>

            {/* GALLERY */}
            {project.photos && project.photos.length > 0 && (
              <section id="gallery">
                <h3
                  className="text-2xl font-semibold mb-6 border-b pb-2"
                  style={{ fontFamily: "IT Bold" }}
                >
                  Gallery
                </h3>
                <div className="w-full">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {project.photos.map((photo: string, index: number) => (
                        <CarouselItem key={index} className="md:basis-1/1">
                          <div className="p-1">
                            <img
                              src={photo}
                              alt={`gallery-${index}`}
                              className="w-full h-[400px] sm:h-[500px] object-cover rounded-xl"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
              </section>
            )}

            {/* PAYMENT PLAN */}
            <section>
              <h3
                className="text-2xl font-semibold mb-4 border-b pb-2"
                style={{ fontFamily: "IT Bold" }}
              >
                Payment Structure
              </h3>
              <div className="p-6 bg-[#0B253F] text-white rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <Typography fontFamily="IT Light" className="opacity-80">
                    Structure
                  </Typography>
                  <Typography fontFamily="GT Bold" className="text-3xl">
                    {project.payment_plan}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography fontFamily="IT Medium">
                    Flexible Installments
                  </Typography>
                  <Typography
                    fontFamily="IT Light"
                    className="text-sm opacity-70"
                  >
                    Contact for full breakdown
                  </Typography>
                </div>
              </div>
            </section>

            {/* UNITS */}
            <section>
              <h3
                className="text-2xl font-semibold mb-6 border-b pb-2"
                style={{ fontFamily: "IT Bold" }}
              >
                Available Units
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {(project.units || []).map((unit: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        style={{ fontFamily: "IT Medium" }}
                        className="text-xl font-bold text-[#0B253F]"
                      >
                        {unit.unit_type}
                      </h4>
                    </div>
                    <div
                      className="group relative cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => setSelectedImage(unit.floor_plan_img)}
                    >
                      {unit.floor_plan_img && (
                        <>
                          <img
                            src={unit.floor_plan_img}
                            alt="Floor Plan"
                            className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-xs py-1 px-3 rounded-full shadow-sm transition-opacity">
                              View Fullscreen
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="space-y-1 mt-4">
                      <p className="text-gray-600 flex justify-between border-b border-gray-100 pb-1">
                        <span style={{ fontFamily: "IT Light" }}>Size:</span>
                        <span style={{ fontFamily: "IT Medium" }}>
                          {unit.sqft} Sq.ft
                        </span>
                      </p>
                      <p className="text-[#0B253F] flex justify-between pt-2">
                        <span style={{ fontFamily: "IT Light" }}>Price:</span>
                        <span
                          style={{ fontFamily: "GT Bold" }}
                          className="text-lg"
                        >
                          AED{" "}
                          {new Intl.NumberFormat("en-AE").format(unit.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR - FIXED */}
          <aside className="sticky top-5 self-start space-y-6 h-fit w-full">
            {/* 1. Project Summary Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full">
              <div className="mb-6 border-b pb-6">
                <div className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">
                  Starting From
                </div>
                <div
                  className="text-3xl font-bold text-[#0B253F]"
                  style={{ fontFamily: "GT Bold" }}
                >
                  {project.starting_price
                    ? new Intl.NumberFormat("en-AE", {
                        style: "currency",
                        currency: "AED",
                        maximumFractionDigits: 0,
                      }).format(project.starting_price)
                    : "Contact for Price"}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-gray-100 p-2 rounded-full">
                    <DollarSign size={16} className="text-[#BA7F55]" />
                  </div>
                  <div>
                    <div
                      style={{ fontFamily: "IT Medium" }}
                      className="text-gray-900"
                    >
                      Developer
                    </div>
                    <div className="text-gray-600 text-sm">
                      {project.developer}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-gray-100 p-2 rounded-full">
                    <CalendarClock size={16} className="text-[#BA7F55]" />
                  </div>
                  <div>
                    <div
                      style={{ fontFamily: "IT Medium" }}
                      className="text-gray-900"
                    >
                      Handover
                    </div>
                    <div className="text-gray-600 text-sm">
                      {project.handover}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Screen Image Viewer Dialog */}
              <Dialog
                open={!!selectedImage}
                onOpenChange={(open) => !open && setSelectedImage(null)}
              >
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-fit h-fit p-0 bg-transparent border-none shadow-none flex items-center justify-center outline-none">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-10 -right-0 lg:-right-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                    >
                      <Close fontSize="medium" />
                    </button>
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Full View"
                        className="max-h-[85vh] max-w-[90vw] lg:w-[900px] object-contain rounded-md shadow-2xl"
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger
                  className="w-full px-4 py-4 bg-[#BA7F55] hover:bg-[#a36f4a] text-white rounded-xl font-semibold transition-colors shadow-lg shadow-orange-900/10"
                  style={{ fontFamily: "IT Medium" }}
                >
                  Enquire Now
                </DialogTrigger>
                <DialogContent>
                  <div className="bg-white px-4 sm:px-8 py-6 flex flex-col items-center max-w-md mx-auto">
                    <Typography
                      fontFamily={"RM Medium"}
                      color="#BA7F55"
                      className="uppercase tracking-wide text-sm mb-2"
                    >
                      [Get In Touch]
                    </Typography>
                    <Typography
                      fontFamily={"DM Medium"}
                      fontSize={{ xs: "20px", lg: "24px" }}
                      className="text-center mb-3"
                    >
                      Register Your Interest
                    </Typography>
                    <Form
                      propertyId={project.project_name}
                      extraData={{ property_name: project.project_name }}
                      formType="default"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 2. AGENT CARD (Inserted Here) */}
            <div
              className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-slate-100 transition-all hover:shadow-2xl"
              onClick={handleAgentClick}
            >
              {agentLoading ? (
                // Agent Loading State
                <div className="absolute inset-0 flex flex-col justify-end p-6 h-full w-full">
                  <Skeleton className="absolute inset-0 w-full h-full z-0" />
                  <div className="relative z-10 space-y-4">
                    <Skeleton className="h-4 w-32 bg-slate-300/50" />
                    <Skeleton className="h-8 w-48 bg-slate-300/50" />
                    <Skeleton className="h-12 w-full rounded-md bg-slate-300/50" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Background Image */}
                  {agent ? (
                    <div
                      className="absolute inset-0 bg-cover bg-top transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${setPicture(agent)}')`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <p>Agent info unavailable</p>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B253F] via-[#0B253F]/70 to-transparent opacity-90"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                    <div className="mb-6">
                      <div
                        style={{ fontFamily: "IT Medium" }}
                        className="flex items-center gap-2 mb-1 text-[#BA7F55]"
                      >
                        <BadgeCheck className="w-5 h-5" />
                        <Typography
                          fontFamily="IT Bold"
                          className="uppercase tracking-wider text-xs"
                        >
                          Verified Agent
                        </Typography>
                      </div>
                      <Typography
                        fontFamily="DM Bold"
                        fontSize={{ xs: "24px", lg: "28px" }}
                        className="leading-tight"
                      >
                        {agent?.name || "Amana Homes"}
                      </Typography>
                      <Typography
                        fontFamily="IT Light"
                        className="text-gray-300 text-sm mt-1"
                      >
                        Property Advisor
                      </Typography>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${agent?.phone_number}`} // Assuming 'phone_number' from your seed
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white h-12 shadow-md"
                          style={{ fontFamily: "GT Bold" }}
                        >
                          <FaWhatsapp className="w-5 h-5 mr-2" />
                          WhatsApp
                        </Button>
                      </a>

                      {/* Call / Email Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${agent?.phone_number}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] h-10 transition-all backdrop-blur-md"
                            style={{ fontFamily: "IT Medium" }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        </a>
                        <a
                          href={`mailto:${agent?.email}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-white/30 bg-white/10 text-white hover:bg-[#BA7F55] hover:border-[#BA7F55] h-10 transition-all backdrop-blur-md"
                            style={{ fontFamily: "IT Medium" }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. Calculator Widget */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Mortgage Estimator
              </h4>
              <MortgageCalculator totalPrice={project.starting_price || 0} />
            </div>
          </aside>
        </div>

        {/* BOTTOM FORM SECTION */}
        <div className="bg-white shadow-xl shadow-gray-200/50 border border-gray-100 rounded-3xl px-4 sm:px-8 py-12 flex flex-col items-center max-w-4xl mx-auto mb-10 mt-10 relative overflow-hidden">
          <Typography
            fontFamily="RM Medium"
            color="#BA7F55"
            className="uppercase tracking-widest text-xs mb-3 font-bold"
          >
            Get In Touch
          </Typography>
          <Typography
            fontFamily="DM Medium"
            fontSize={{ xs: "24px", lg: "36px" }}
            className="text-center mb-4 text-[#0B253F]"
          >
            Let’s Make Your Property Journey Effortless
          </Typography>
          <Typography
            fontFamily="IT Light"
            className="text-center text-gray-600 leading-relaxed max-w-xl mb-8"
          >
            Whether you're buying, renting, or investing, our expert team is
            here to guide you every step of the way.
          </Typography>
          <Form
            propertyId={""}
            extraData={{
              location: "Submitted from the offplan listing page",
            }}
            formType="default"
          />
        </div>
      </div>
    </div>
  );
}

export default OffPlanDetails;
