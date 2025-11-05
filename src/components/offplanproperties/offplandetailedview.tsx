import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MortgageCalculator from "../properties/morgagecalculator";
import { Dialog, Typography } from "@mui/material";
import { useState } from "react";
import Form from "@/leads/form";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function OffPlanDetails() {
  const { propertyId } = useParams();
  const [open, setOpen] = useState(false);

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
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div>
      <div className="max-w-6xl mx-auto py-10 lg:py-30 space-y-12 px-5">
        {/* Hero Section */}
        <section className="relative">
          <img
            src={project.images[3]}
            alt={project.title}
            className="w-full h-[400px] object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
            <h1
              style={{ fontFamily: "GT Bold" }}
              className="text-white text-4xl font-bold"
            >
              {project.title}
            </h1>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4 flex flex-col lg:flex-row">
          <a
            href={project.cta.brochure}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            style={{ fontFamily: "IT Medium" }}
          >
            Download Brochure
          </a>
          <a
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
            style={{ fontFamily: "IT Medium" }}
          >
            Enquire Now
          </a>
        </section>

        {/* Overview */}
        <section>
          <h2
            style={{ fontFamily: "IT Bold" }}
            className="text-2xl font-semibold mb-4"
          >
            Overview
          </h2>
          <p style={{ fontFamily: "IT Light" }} className="text-gray-700">
            {project.overview}
          </p>
        </section>

        {/* Location */}
        <section>
          <h2
            style={{ fontFamily: "IT Bold" }}
            className="text-2xl font-semibold mb-1"
          >
            Location
          </h2>
          <p style={{ fontFamily: "IT Light" }} className="text-gray-600 mb-4">
            {project.map.description}
          </p>

          <iframe
            title="map"
            className="w-full h-64 rounded-xl"
            src={`https://www.google.com/maps?q=${project.map.lat},${project.map.lng}&hl=es;z=14&output=embed`}
          ></iframe>
        </section>

        {/* Gallery */}
        <h2
          style={{ fontFamily: "IT Bold" }}
          className="text-2xl font-semibold mb-4"
        >
          Gallery
        </h2>
        <section className="flex justify-center px-10">
          <Carousel className="w-full max-w-xs lg:max-w-2xl">
            <CarouselContent>
              {project?.images.map((item: any, index: any) => (
                <CarouselItem key={index}>
                  <img src={item} alt="image" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Video */}
        {project.video && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Video</h2>
            <video
              src={project.video}
              controls
              className="w-full rounded-xl"
            ></video>
          </section>
        )}

        {/* Property Types */}
        <section>
          <h2
            style={{ fontFamily: "IT Bold" }}
            className="text-2xl font-semibold mb-4"
          >
            Property Types
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {project.propertyTypes.map((unit: any, idx: number) => (
              <div
                key={idx}
                className="p-4 border rounded-xl shadow-sm bg-white"
              >
                <h3
                  style={{ fontFamily: "IT Medium" }}
                  className="text-lg font-medium"
                >
                  {unit.type}
                </h3>
                <p style={{ fontFamily: "IT Light" }} className="text-gray-600">
                  Size: {unit.size}
                </p>
                <p
                  style={{ fontFamily: "IT Light" }}
                  className="text-gray-900 font-semibold"
                >
                  From {unit.priceFrom}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Plan */}
        <section>
          <h2
            style={{ fontFamily: "IT Bold" }}
            className="text-2xl font-semibold mb-4"
          >
            Payment Plan
          </h2>
          <ul className="space-y-2">
            {project.paymentPlan.map((step: any, idx: number) => (
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

        <section>
          <MortgageCalculator totalPrice={""} />
        </section>

        {/* Amenities */}
        <section>
          <h2
            style={{ fontFamily: "IT Bold" }}
            className="text-2xl font-semibold mb-4"
          >
            Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.amenities.map((amenity: any, idx: number) => (
              <div
                key={idx}
                className="p-3 border rounded-lg text-center text-gray-700"
                style={{ fontFamily: "IT Medium" }}
              >
                {amenity}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={open} className="relative p-4">
        <X
          onClick={() => setOpen(false)}
          className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
        />
        {/* Form */}
        <div className="bg-white px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20">
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
            propertyId={project.title}
            extraData={{ property_name: project.title }}
            formType="default"
          />
        </div>
      </Dialog>
    </div>
  );
}

export default OffPlanDetails;
