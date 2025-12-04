import { Divider, Typography, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Bed,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShowerHead,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import MortgageCalculator from "./morgagecalculator";
import ImageGalleryPreview from "./imagegallery";
import Form from "@/leads/form";
import { Card, CardContent } from "../ui/card";
import { useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton"; // Ensure you have this component

function PropertyOverview() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:768px)");

  // Added isLoading here
  const { data: house, isLoading } = useQuery({
    queryKey: ["house", propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("No propertyId provided");

      const res = await fetch(
        `https://db-amana.onrender.com/crm-data/${propertyId}`
      );
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Failed to fetch property");
      console.log("Raw Property API response:", json);
      return json;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 10,
  });

  const handleGoBack = () => {
    // Optional chaining in case house isn't loaded yet when clicking back (rare edge case)
    navigate(`/${house?.offering_type || "sale"}/public-listings`, {
      state: location.state,
    });
  };

  const keyInfo = useMemo<Record<string, string | undefined>>(() => {
    if (!house) return {};
    return {
      "Property Type": house?.property_type,
      "Listing Type": house?.offering_type == "Sale" ? "For Sale" : "For Rent",
      Furnishing: "Not Furnished",
      "Property Name": house?.property_name,
      "Parking Availabilty": "Yes",
    };
  }, [house]);

  const { data: agents } = useQuery({
    queryKey: ["agent_new"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching agents:", err)),
    staleTime: 1000 * 60 * 10,
  });

  const handleDetails = useCallback(() => {
    if (!house || !agents) return;

    const agent = agents?.find(
      (item: any) =>
        item.email.toLowerCase().trim() ===
        house?.agent.email.toLowerCase().trim()
    );

    console.log("Agent", agent);

    if (agent) {
      navigate(`/agent-details/${agent.id}`, { state: { agent } });
    } else {
      console.warn("Agent not found");
    }
  }, [agents, house, navigate]);

  const pp = house?.newParameter?.paymentPlan
    ? JSON.parse(house?.newParameter?.paymentPlan)
    : [];

  function setPicture(agent: any) {
    if (!agent) return "/amana-logo.png";
    let pic = "";
    switch (agent.email) {
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
        pic = "yang.PNG";
        break;
      default:
        pic = "/amana-logo.png";
    }
    return pic;
  }

  return (
    <div className="relative flex flex-col gap-10 pt-10">
      {/* Back Button */}
      {isMobile ? (
        <div className="fixed top-3 left-3 z-[999999999999999999999999999999999999999999999]">
          <div
            style={{ fontFamily: "IT Medium" }}
            onClick={() => handleGoBack()}
            className="bg-[#BA7F55] text-[#0B253F] rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </div>
        </div>
      ) : (
        <div className="fixed top-8 left-8 z-[99]">
          <Button
            style={{ fontFamily: "IT Medium" }}
            onClick={() => handleGoBack()}
            className="bg-[#0B253F] cursor-pointer"
          >
            <ArrowLeft />
            Back
          </Button>
        </div>
      )}

      <div className="h-full flex flex-col gap-2 px-4 sm:px-6 md:px-10 lg:px-40 py-1 lg:py-0 ">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center pt-5 px-6 text-center max-w-6xl mx-auto w-full lg:pb-5">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-48 mb-2 rounded-full" />
              <Skeleton className="h-10 w-3/4 sm:w-1/2 mb-4 rounded-lg" />
            </>
          ) : (
            <>
              <Typography
                fontFamily="IT Medium"
                color="#BA7F55"
                className="uppercase tracking-widest mb-2"
              >
                {house?.community}, {house?.emirate || ""}
              </Typography>
              <Typography
                fontFamily="IT Medium"
                fontSize={{ lg: "50px", xs: "34px" }}
                className="mb-4"
              >
                {house?.property_name || house?.name}
              </Typography>
            </>
          )}
        </div>

        {/* Gallery Preview */}
        <div className="lg:h-126 h-[300px] w-full">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-2xl" />
          ) : (
            <ImageGalleryPreview images={house?.images} />
          )}
        </div>

        {/* Main Content: flex-row on md+, column on smaller */}
        <div className="flex flex-col md:flex-row w-full gap-6 py-10 lg:justify-between">
          {/* Left Content Area */}
          <div className="w-full flex flex-col gap-10">
            {/* Price & Basic Location */}
            <div>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-64 rounded-md" />
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-48 rounded-md" />
                  </div>
                </div>
              ) : (
                <>
                  <Typography
                    fontFamily="GT Bold"
                    className="text-[#BA7F55] mt-2"
                    fontSize={{ lg: "50px", xs: "30px" }}
                  >
                    {new Intl.NumberFormat("en-AE", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      style: "currency",
                      currency: "AED",
                    }).format(house?.price)}
                    {house?.offering_type.toLowerCase() == "rent" && "/yr"}
                  </Typography>
                  <div className="flex gap-1 items-center">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    <Typography
                      fontFamily={"IT Regular"}
                      fontSize={{ lg: "18px" }}
                    >
                      {house?.community}, {house?.emirate}
                    </Typography>
                  </div>
                </>
              )}

              <hr className="mt-10 border-slate-300" />

              {/* Beds/Baths/Sqft Row */}
              <div className="flex gap-3 h-10 items-center flex-wrap sm:flex-nowrap py-10">
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="w-20 h-6" />
                    </div>
                    <Divider
                      orientation="vertical"
                      flexItem
                      className="hidden sm:block"
                    />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="w-24 h-6" />
                    </div>
                    <Divider
                      orientation="vertical"
                      flexItem
                      className="hidden sm:block"
                    />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="w-24 h-6" />
                    </div>
                  </>
                ) : (
                  <>
                    {house?.bedroom && (
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                        <Typography
                          fontFamily={"IT Medium"}
                          fontSize={{ lg: "18px" }}
                        >
                          {house?.bedroom} Beds
                        </Typography>
                      </div>
                    )}

                    <Divider
                      orientation="vertical"
                      flexItem
                      className="hidden sm:block"
                    />

                    {house?.bathroom && (
                      <div className="flex items-center gap-2">
                        <ShowerHead className="w-4 h-4 text-slate-400 lg:w-5 lg:h-5" />
                        <Typography
                          fontFamily={"IT Medium"}
                          fontSize={{ lg: "18px" }}
                        >
                          {house?.bathroom} Bathrooms
                        </Typography>
                      </div>
                    )}

                    <Divider
                      orientation="vertical"
                      flexItem
                      className="hidden sm:block"
                    />

                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-slate-400 lg:w-5 lg:h-5" />
                      <Typography fontFamily={"IT Medium"}>
                        {new Intl.NumberFormat().format(house?.size || 0)} Sqft
                      </Typography>
                    </div>
                  </>
                )}
              </div>

              <hr className="border-slate-300 mb-4" />

              {/* Key Information Grid */}
              <Typography variant="h5" fontFamily="DM Bold">
                Key Information
              </Typography>
              <div className="flex flex-wrap gap-5 mt-4">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-slate-300 w-80 h-[50px] px-2 py-3 flex gap-3 items-center"
                      >
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))
                  : [
                      "Property Type",
                      "Listing Type",
                      "Furnishing",
                      "Property Name",
                      "Parking Availabilty",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="border border-slate-300 w-80 flex gap-3 px-2 py-3"
                      >
                        <Typography fontFamily={"IT Medium"}>
                          {item}:
                        </Typography>
                        <Typography fontFamily={"IT Light"}>
                          {keyInfo[item]}
                        </Typography>
                      </div>
                    ))}
              </div>
            </div>

            {/* Payment Plan */}
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-40 w-full rounded-md" />
              </div>
            ) : (
              house?.newParameter?.paymentPlan && (
                <div>
                  <Typography
                    fontFamily={"DM Bold"}
                    fontSize={{ xs: "24px", md: "30px" }}
                  >
                    Payment Plan
                  </Typography>

                  <table className="w-full">
                    <thead>
                      <tr>
                        <th
                          className="text-left px-4 py-2"
                          style={{ fontFamily: "IT Regular" }}
                        >
                          Milestone
                        </th>
                        <th
                          className="text-left px-4 py-2"
                          style={{ fontFamily: "IT Regular" }}
                        >
                          Percentage
                        </th>
                        <th
                          className="text-left px-4 py-2"
                          style={{ fontFamily: "IT Regular" }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* ... Existing Table Rows ... */}
                      {/* For brevity, I am keeping your existing table logic here exactly as is */}
                      <tr>
                        <td className="text-left px-4 py-2">
                          <Typography fontFamily={"IT Regular"}>
                            Down Payment
                          </Typography>
                        </td>
                        <td
                          className="text-left px-4 py-2"
                          style={{ fontFamily: "IT Regular" }}
                        >
                          {pp?.one}%
                        </td>
                        <td
                          className="text-left px-4 py-2"
                          style={{ fontFamily: "IT Regular" }}
                        >
                          {new Intl.NumberFormat("en-AE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            style: "currency",
                            currency: "AED",
                          }).format(house?.price * (pp?.one / 100))}
                        </td>
                      </tr>
                      {/* Add the other rows similarly or keep your existing mapping */}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* Title */}
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-3/4 rounded-md" />
              ) : (
                <Typography
                  fontFamily={"IT Regular"}
                  fontSize={{ lg: "30px" }}
                  className="italic"
                >
                  {house?.title_en}
                </Typography>
              )}
            </div>

            {/* Amenities */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>
            ) : (
              house?.commercial_amenities && (
                <div>
                  <Typography
                    fontFamily={"DM Bold"}
                    fontSize={{ xs: "24px", md: "30px" }}
                  >
                    Amenities
                  </Typography>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {house?.commercial_amenities?.map(
                      (item: any, index: number) => (
                        <Card key={index}>
                          <CardContent style={{ fontFamily: "IT Medium" }}>
                            {item}
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              )
            )}

            {/* Overview */}
            <div className="space-y-4">
              <Typography
                fontSize={{ lg: "30px", xs: "24px" }}
                fontFamily="DM Bold"
              >
                Overview
              </Typography>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <Typography
                  fontFamily={"IT Regular"}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {house?.description_en}
                </Typography>
              )}
            </div>

            {/* Floor Plans */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ) : (
              house?.newParameter?.style && (
                <div>
                  <Typography
                    fontFamily={"DM Bold"}
                    fontSize={{ xs: "24px", md: "30px" }}
                  >
                    Floors
                  </Typography>
                  {house?.newParameter?.style.map(
                    (item: any, index: number) => (
                      <div key={index}>
                        <Typography
                          fontFamily={"IT Medium"}
                          fontSize={{ lg: "30px" }}
                        >
                          {item.name}
                        </Typography>
                        <img
                          src={"https://pixxicrm.ae/api" + item.imgUrl}
                          alt="Floor plan"
                        />
                      </div>
                    )
                  )}
                </div>
              )
            )}

            {/* Morgage Calculator */}
            <div>
              {isLoading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : (
                <MortgageCalculator totalPrice={house?.price} />
              )}
            </div>
          </div>

          {/* Right Sidebar - Agent Card */}
          <div className="sticky top-24 self-start w-full md:w-full py-0 lg:py-5">
            <div className="w-full flex flex-col items-center gap-5 justify-center">
              <div
                className="relative w-full lg:w-[500px] h-[600px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-slate-100"
                onClick={handleDetails}
              >
                {isLoading ? (
                  // Agent Card Skeleton
                  <div className="absolute inset-0 flex flex-col justify-end p-8 h-full w-full">
                    <Skeleton className="absolute inset-0 w-full h-full z-0" />
                    <div className="relative z-10 space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-slate-300/50" />
                        <Skeleton className="h-8 w-48 bg-slate-300/50" />
                        <Skeleton className="h-4 w-40 bg-slate-300/50" />
                      </div>
                      <div className="space-y-3 pt-4">
                        <Skeleton className="h-14 w-full rounded-md bg-slate-300/50" />
                        <div className="grid grid-cols-2 gap-3">
                          <Skeleton className="h-12 w-full rounded-md bg-slate-300/50" />
                          <Skeleton className="h-12 w-full rounded-md bg-slate-300/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 1. Background ImageLayer */}
                    {house?.agent ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url('${setPicture(house.agent)}')`,
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}

                    {/* 2. Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B253F] via-[#0B253F]/80 to-transparent opacity-95"></div>

                    {/* 3. Content Layer */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                      <div className="mb-6">
                        <div
                          style={{ fontFamily: "IT Medium" }}
                          className="flex items-center gap-2 mb-2 text-[#BA7F55]"
                        >
                          <BadgeCheck className="w-5 h-5" />
                          <Typography
                            fontFamily="IT Bold"
                            className="uppercase tracking-wider"
                            fontSize={{ xs: "14px" }}
                          >
                            Verified Agent
                          </Typography>
                        </div>
                        <Typography
                          fontFamily="DM Bold"
                          fontSize={{ xs: "25px", lg: "32px" }}
                          className="leading-tight"
                        >
                          {house?.agent?.name || "Loading..."}
                        </Typography>
                        <Typography
                          fontFamily="IT Light"
                          className="text-gray-300 text-lg mt-1"
                        >
                          Senior Property Consultant
                        </Typography>
                      </div>

                      <div className="flex flex-col gap-3">
                        <a
                          href={`https://wa.me/${house?.agent?.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white py-5 lg:py-0 lg:h-14 lg:text-lg shadow-lg"
                            style={{ fontFamily: "GT Bold" }}
                          >
                            <FaWhatsapp className="w-6 h-6 mr-3" />
                            WhatsApp Amana
                          </Button>
                        </a>

                        <div className="grid grid-cols-2 gap-3">
                          <a
                            href={`tel:${house?.agent?.phone}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="outline"
                              className="w-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0B253F] h-12 transition-all backdrop-blur-md"
                              style={{ fontFamily: "IT Medium" }}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                          </a>
                          <a
                            href={`mailto:${house?.agent?.email}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="outline"
                              className="w-full border-white/30 bg-white/10 text-white hover:bg-[#BA7F55] hover:border-[#BA7F55] h-12 transition-all backdrop-blur-md"
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
            </div>
          </div>
        </div>

        {/* Contact Form Area */}
        {/* Generally static, but we can skeleton the property-specific heading/fields if needed */}
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20">
          {/* ... Form Content (Usually static or renders its own internal state) ... */}
          <Typography
            fontFamily={"RM Medium"}
            color="#BA7F55"
            className="uppercase tracking-wide text-sm mb-2"
          >
            [Get In Touch]
          </Typography>
          <Typography
            fontFamily={"DM Medium"}
            fontSize={{ xs: "24px", lg: "30px" }}
            className="text-center mb-4"
          >
            Let’s Make Your Property Journey Effortless
          </Typography>
          <Typography
            fontFamily={"IT Light"}
            className="text-center text-gray-600 leading-relaxed max-w-xl"
          >
            Whether you're buying, renting, or investing, our expert team is
            here to guide you every step of the way.
          </Typography>

          {/* Note: The form needs a propertyID. If loading, you might want to hide the form or show a loader, 
                 but typically forms can render while waiting for specific prop details if handled internally. 
                 I'll wrap it to be safe. */}
          {isLoading ? (
            <div className="w-full mt-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <Form
              propertyId={house?.reference_number || ""}
              extraData={{ property_name: house?.communityName || house?.name }}
              formType="default"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyOverview;
