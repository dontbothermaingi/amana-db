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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const HERO_FALLBACK = "/mnt/data/9466482e-8bd2-418b-9c02-171551ae9c43.png";

function OffPlanDetails() {
  const { propertyId } = useParams();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", propertyId],
    queryFn: () =>
      fetch(
        `https://68e7771910e3f82fbf3f4033.mockapi.io/offplan/offplan/${propertyId}`
      ).then((resp) => resp.json()),
    // staleTime, cacheTime etc could be added here
  });

  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center py-20">Something went wrong.</p>;
  if (!project) return <p className="text-center py-20">Project not found.</p>;

  // safe values & fallbacks
  const heroImage =
    project?.images && project.images.length > 0
      ? project.images[Math.min(3, project.images.length - 1)]
      : project?.images?.[0] ?? HERO_FALLBACK;

  return (
    <div className="bg-white">
      <div className="lg:px-40 mx-auto py-10 lg:py-16 px-5">
        {/* HERO - 2 column on large screens */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Text content (narrow column) */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              {/* <Typography
                fontFamily={"IT Regular"}
                className="text-sm text-gray-600"
              >
                {project?.tagline ?? "Premium Offplan"}
              </Typography> */}
            </div>

            <h1
              style={{ fontFamily: "GT Bold" }}
              className="text-4xl lg:text-5xl leading-tight mb-4"
            >
              {project?.title ?? "Untitled Project"}
            </h1>

            <p
              style={{ fontFamily: "IT Regular" }}
              className="text-gray-700 leading-relaxed mb-6 lg:text-lg"
            >
              {project?.overview ??
                "A thoughtfully designed development in a prime location."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
              <a
                href="#gallery"
                className="flex items-center gap-2 text-sm text-gray-700 underline underline-offset-2"
                style={{ fontFamily: "IT Medium" }}
              >
                <button
                  className="px-6 py-3 bg-black text-white rounded-md lg:text-lg"
                  style={{ fontFamily: "IT Medium" }}
                >
                  View Gallery
                </button>
              </a>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex-1">
                  <div
                    style={{ fontFamily: "IT Medium" }}
                    className="text-lg uppercase text-gray-500"
                  >
                    Since
                  </div>
                  <div
                    style={{ fontFamily: "IT Regular" }}
                    className="lg:text-lg mt-1"
                  >
                    {project?.since ?? "2024"}
                  </div>
                </div>

                <div className="flex-1">
                  <div
                    style={{ fontFamily: "IT Medium" }}
                    className="text-lg uppercase text-gray-500"
                  >
                    Type
                  </div>
                  <div
                    style={{ fontFamily: "IT Regular" }}
                    className="lg:text-lg mt-1"
                  >
                    {project?.type ?? "Off-plan"}
                  </div>
                </div>

                <div className="flex-1">
                  <div
                    style={{ fontFamily: "IT Medium" }}
                    className="text-lg uppercase text-gray-500"
                  >
                    Status
                  </div>
                  <div
                    style={{ fontFamily: "IT Regular" }}
                    className="lg:text-lg mt-1"
                  >
                    {project?.status ?? "TBC"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tall hero image */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={heroImage}
              alt={project?.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-10 grid lg:grid-cols-3 gap-10">
          {/* Left column (main content) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview + Amenities */}
            <section className="bg-white">
              {/* Amenities */}
              <div className="mt-6">
                <h3
                  style={{ fontFamily: "IT Bold" }}
                  className="text-2xl font-semibold mb-3"
                >
                  Amenities
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(project?.amenities ?? []).map((a: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2 border rounded-md text-md text-gray-700 flex items-center justify-center"
                      style={{ fontFamily: "IT Medium" }}
                    >
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "IT Bold" }}
              >
                Location
              </h3>
              <p
                className="text-gray-600 mb-4"
                style={{ fontFamily: "IT Light" }}
              >
                {/* {project?.map?.description ?? "Prime location in the city."} */}
              </p>
              {project?.map?.lat && project?.map?.lng ? (
                <iframe
                  title="map"
                  className="w-full h-64 rounded-xl border"
                  src={`https://www.google.com/maps?q=${project.map.lat},${project.map.lng}&z=14&output=embed`}
                />
              ) : (
                <div className="w-full h-64 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  Map not available
                </div>
              )}
            </section>

            {/* Gallery */}
            <section id="gallery">
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: "IT Bold" }}
              >
                Gallery
              </h3>

              <div className="w-full">
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    {(project?.images ?? []).map((item: any, index: number) => (
                      <CarouselItem key={index}>
                        <img
                          src={item ?? HERO_FALLBACK}
                          alt={`gallery-${index}`}
                          className="w-full h-[420px] object-cover rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </section>

            {/* Video */}
            {project?.video && (
              <section>
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={{ fontFamily: "IT Bold" }}
                >
                  Project Video
                </h3>
                <video
                  src={project.video}
                  controls
                  className="w-full rounded-xl"
                />
              </section>
            )}

            {/* Payment Plan */}
            <section>
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: "IT Bold" }}
              >
                Payment Plan
              </h3>
              <ul className="space-y-2">
                {(project?.paymentPlan ?? []).map((step: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <span style={{ fontFamily: "IT Medium" }}>
                      {step.milestone}
                    </span>
                    <span
                      style={{ fontFamily: "IT Medium" }}
                      className="font-semibold"
                    >
                      {step.percentage}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Property Types */}
            <section>
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ fontFamily: "IT Bold" }}
              >
                Property Types
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {(project?.propertyTypes ?? []).map(
                  (unit: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-xl shadow-sm bg-white"
                    >
                      <h4
                        style={{ fontFamily: "IT Medium" }}
                        className="text-lg font-medium"
                      >
                        {unit.type}
                      </h4>
                      <p
                        style={{ fontFamily: "IT Light" }}
                        className="text-gray-600"
                      >
                        Size: {unit.size}
                      </p>
                      <p
                        style={{ fontFamily: "IT Light" }}
                        className="text-gray-900 font-semibold"
                      >
                        From {unit.priceFrom}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Right column (sticky sidebar) */}
          <aside className="sticky top-10 self-start space-y-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm w-full">
              <div className="mb-3">
                <div className="text-md text-gray-500">Starting From</div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "GT Bold" }}
                >
                  {new Intl.NumberFormat("en-AE", {
                    style: "currency",
                    currency: "AED",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(project?.startingPrice) ?? "Contact"}
                </div>
              </div>

              <div className="mb-4">
                <div
                  style={{ fontFamily: "IT Medium" }}
                  className="text-xl text-gray-500"
                >
                  Developer
                </div>
                <div className="text-lg">{project?.developer ?? "-"}</div>
              </div>

              <Dialog>
                <DialogTrigger
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-md font-semibold"
                  style={{ fontFamily: "IT Medium" }}
                >
                  Enquire Now
                </DialogTrigger>
                <DialogHeader className="hidden">
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
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
                      Let’s Make Your Property Journey Effortless
                    </Typography>

                    <Typography
                      fontFamily={"IT Light"}
                      className="text-center text-gray-600 leading-relaxed max-w-xs mb-4"
                    >
                      Whether you're buying, renting, or investing, our expert
                      team is here to guide you every step of the way.
                    </Typography>

                    <Form
                      propertyId={project.title}
                      extraData={{ property_name: project.title }}
                      formType="default"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <h4 className="text-sm text-gray-500 mb-2">
                Mortgage Calculator
              </h4>
              <MortgageCalculator totalPrice={""} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OffPlanDetails;
