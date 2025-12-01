import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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
import { MapPin, CalendarClock, DollarSign } from "lucide-react";

const HERO_FALLBACK = "/placeholder-image.png";

function OffPlanDetails() {
  const { propertyId } = useParams();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["offplan_detail", propertyId],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/offplans/${propertyId}`).then(
        (resp) => resp.json()
      ),
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
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

  // --- MAP FIX LOGIC ---
  const getMapSrc = () => {
    const mapLink = project.location_map;

    // 1. If it's a valid embed link, return it (ensure HTTPS)
    if (
      mapLink &&
      mapLink.includes("embed") &&
      !mapLink.includes("googleusercontent")
    ) {
      return mapLink;
    }

    // 2. Fallback: Generate a search embed based on the Location Name
    // This works even if the database link is broken
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
                style={{ fontFamily: "IT Medium" }}
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
            <section className="">
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

            {/* LOCATION - FIXED */}
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
                src={getMapSrc()} // Uses the helper function
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
                Payment Plan
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

                    <div>
                      {unit.floor_plan_img && (
                        <img
                          src={unit.floor_plan_img}
                          alt="Floor Plan"
                          className="w-full h-auto"
                        />
                      )}
                    </div>

                    <div className="space-y-1 mt-4">
                      <p className="text-gray-600 flex justify-between border-b border-gray-100 pb-1">
                        <span style={{ fontFamily: "IT Light" }}>Size:</span>
                        <span style={{ fontFamily: "IT Medium" }}>
                          {unit.sqft} Sq.ft
                        </span>
                      </p>
                      {/* <p className="text-gray-600 flex justify-between border-b border-gray-100 pb-1 pt-1">
                        <span style={{ fontFamily: "IT Light" }}>
                          Bathrooms:
                        </span>
                        <span style={{ fontFamily: "IT Medium" }}>
                          {unit.baths}
                        </span>
                      </p> */}
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

          {/* RIGHT SIDEBAR - FIXED (Removed 'hidden') */}
          <aside className="sticky top-24 self-start space-y-6 h-fit">
            {/* Project Summary Card */}
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

                    <Typography
                      fontFamily={"IT Light"}
                      className="text-center text-gray-600 leading-relaxed max-w-xs mb-4"
                    >
                      Fill in your details below and our team will send you the
                      brochure and availability list.
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

            {/* Calculator Widget */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Mortgage Estimator
              </h4>
              <MortgageCalculator totalPrice={project.starting_price || 0} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OffPlanDetails;
