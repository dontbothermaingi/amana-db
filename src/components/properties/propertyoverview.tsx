import { Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Bed,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShowerHead,
} from "lucide-react";
import { useParams } from "react-router-dom";
import PropertyMap from "./propertymap";
import { FaWhatsapp } from "react-icons/fa";
import MortgageCalculator from "./morgagecalculator";
import ImageGalleryPreview from "./imagegallery";
import Form from "@/leads/form";
import { Card, CardContent } from "../ui/card";
import { useMemo } from "react";

function PropertyOverview() {
  const { propertyId } = useParams();
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";

  const { data: house } = useQuery({
    queryKey: ["house", propertyId],
    queryFn: async () => {
      if (!propertyId) {
        throw new Error("No propertyId provided");
      }

      const res = await fetch(
        `https://dataapi.pixxicrm.ae/pixxiapi/v1/${propertyId}`,
        {
          method: "GET",
          headers: {
            "X-PIXXI-TOKEN": access_token,
          },
        }
      );

      const json = await res.json();
      // console.log("Raw API response:", json);

      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch property");
      }

      return json?.list || json?.data || json || [];
    },
    enabled: !!propertyId, // don't run unless propertyId is defined
    staleTime: 1000 * 60 * 10,
  });

  const keyInfo = useMemo<Record<string, string | undefined>>(() => {
    if (!house) return {};
    return {
      "Property Type": house?.houseType?.[0],
      "Listing Type": house?.propertyType,
      Furnishing: "Not Furnished",
      Completion:
        house?.rentParameter?.buildYear ||
        house?.sellParameter?.buildYear ||
        house?.newParameter?.handoverTime?.split(" ")[0],
      "Parking Availabilty": "Yes",
      Developer: house?.developerName,
      "Built-up Area": `${
        house?.landSqM || house?.size || house?.newParameter?.maxSize
      } Sqft`,
    };
  }, [house]);

  // const { data: developers } = useQuery({
  //   queryKey: ["develope"],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://dataapi.pixxicrm.ae/pixxiapi/v1/developer/list`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "X-PIXXI-TOKEN": access_token,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           size: 100,
  //         }),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Raw Developer API response:", data);
  //     return data; // ✅ Return the data so useQuery can store it
  //   },
  // });

  // const { data: areas } = useQuery({
  //   queryKey: ["communit", house?.regionName],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://dataapi.pixxicrm.ae/pixxiapi/v1/search/${house?.regionName}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "X-PIXXI-TOKEN": access_token,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           size: 100,
  //         }),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Raw Area API response:", data);
  //     return data; // ✅ Return the data so useQuery can store it
  //   },
  // });

  // const { data: agents } = useQuery({
  //   queryKey: ["ajent"],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `https://dataapi.pixxicrm.ae/pixxiapi/v1/agent/list`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "X-PIXXI-TOKEN": access_token,
  //         },
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Raw Agent API response:", data);
  //     return data; // ✅ Return the data so useQuery can store it
  //   },
  // });

  const { data: amenity } = useQuery({
    queryKey: ["amenity"],
    queryFn: async () => {
      const res = await fetch(
        `https://dataapi.pixxicrm.ae/pixxiapi/v1/amenities`,
        {
          method: "GET",
          headers: {
            "X-PIXXI-TOKEN": access_token,
          },
        }
      );

      const data = await res.json();
      // console.log("Raw Amenity API response:", data);
      return data; // ✅ Return the data so useQuery can store it
    },
  });

  function getAmenityNames(codes: string, amenities: any[]) {
    if (!codes || !amenities) return [];

    const passedArray = codes.split(","); // split string into array

    // map each code to its matching label
    const result = passedArray
      .map((code) => {
        const found = amenities.find((a) => a.code === code);
        return found ? found.label : null; // return label if found
      })
      .filter(Boolean); // remove nulls if any code wasn’t found

    return result;
  }

  const amenityNames = useMemo(() => {
    return getAmenityNames(
      house?.newParameter?.amenities ||
        house?.rentParameter?.amenities ||
        house?.sellParameter?.amenities,
      amenity?.data
    );
  }, [house, amenity]);

  const pp = house?.newParameter?.paymentPlan
    ? JSON.parse(house?.newParameter?.paymentPlan)
    : [];

  return (
    <div className="flex flex-col gap-10">
      <div className="h-full flex flex-col gap-2 px-4 sm:px-6 md:px-10 lg:px-40 py-1 lg:py-0">
        {/* Hero Image */}

        <div className="flex flex-col items-center justify-center pt-5 px-6 text-center max-w-6xl mx-auto">
          <Typography
            fontFamily="IT Medium"
            color="#BA7F55"
            className="uppercase tracking-widest mb-2"
          >
            {house?.regionName}, {house?.cityName || ""}
          </Typography>
          <Typography
            fontFamily="IT Medium"
            fontSize={{ lg: "50px", xs: "34px" }}
            className="mb-4"
          >
            {house?.communityName || house?.name}
          </Typography>
        </div>

        <div className="lg:h-126 h-full">
          <ImageGalleryPreview images={house?.photos} />
        </div>

        {/* Main Content: flex-row on md+, column on smaller */}
        <div className="flex flex-col md:flex-row w-full gap-6 py-10 lg:justify-between">
          {/* Left Content */}
          <div className="w-full flex flex-col gap-10">
            {/* Title + Location + Basic Info */}

            {house ? (
              <div>
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
                  {house?.rentParameter?.priceType && "/"}{" "}
                  {house?.rentParameter?.priceType}
                </Typography>
                <div className="flex gap-1 items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Typography
                    fontFamily={"IT Regular"}
                    fontSize={{ lg: "18px" }}
                  >
                    {house?.regionName}, {house?.cityName}
                  </Typography>
                </div>

                <hr className="mt-10 border-slate-300" />

                {/* Property Detail */}
                <div className="flex gap-3 h-10 items-center flex-wrap sm:flex-nowrap py-10">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                    <Typography
                      fontFamily={"IT Medium"}
                      fontSize={{ lg: "18px" }}
                    >
                      {house?.newParameter?.bedroomMax || house?.bedRoomNum}{" "}
                      Beds
                    </Typography>
                  </div>

                  <Divider
                    orientation="vertical"
                    flexItem
                    className="hidden sm:block"
                  />

                  <div className="flex items-center gap-2">
                    <ShowerHead className="w-4 h-4 text-slate-400 lg:w-5 lg:h-5" />
                    <Typography
                      fontFamily={"IT Medium"}
                      fontSize={{ lg: "18px" }}
                    >
                      {house?.bathrooms ||
                        house?.newParameter?.bedroomMax ||
                        house?.bedRoomNum}{" "}
                      Bathrooms
                    </Typography>
                  </div>

                  <Divider
                    orientation="vertical"
                    flexItem
                    className="hidden sm:block"
                  />

                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-slate-400 lg:w-5 lg:h-5" />
                    <Typography fontFamily={"IT Medium"}>
                      {house?.newParameter?.maxSize || house?.size} Sqft
                    </Typography>
                  </div>
                </div>

                <hr className="border-slate-300 mb-4" />

                {/* Key Information */}
                <Typography variant="h5" fontFamily="DM Bold">
                  Key Information
                </Typography>
                <div className="flex flex-wrap gap-5 mt-4">
                  {[
                    "Property Type",
                    "Listing Type",
                    "Furnishing",
                    "Completion",
                    "Parking Availabilty",
                    "Developer",
                    "Built-up Area",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-300 w-80 flex gap-3 px-2 py-3"
                    >
                      <Typography fontFamily={"IT Medium"}>{item}:</Typography>
                      <Typography fontFamily={"IT Light"}>
                        {keyInfo[item]}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
            )}

            {/* Payment Plan */}
            {house?.newParameter?.paymentPlan && (
              <div>
                <Typography
                  fontFamily={"DM Bold"}
                  fontSize={{ xs: "24px", md: "30px" }}
                >
                  Payment Plan
                </Typography>

                <table>
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

                  <tr>
                    <td className="text-left px-4 py-2">
                      <Typography fontFamily={"IT Regular"}>
                        Second Payment
                      </Typography>
                    </td>
                    <td
                      className="text-left px-4 py-2"
                      style={{ fontFamily: "IT Regular" }}
                    >
                      {pp?.two}%
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
                      }).format(house?.price * (pp?.two / 100))}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-left px-4 py-2">
                      <Typography fontFamily={"IT Regular"}>
                        Third installment
                      </Typography>
                    </td>
                    <td
                      className="text-left px-4 py-2"
                      style={{ fontFamily: "IT Regular" }}
                    >
                      {pp?.three}%
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
                      }).format(house?.price * (pp?.three / 100))}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-left px-4 py-2">
                      <Typography fontFamily={"IT Regular"}>
                        Final installment
                      </Typography>
                    </td>
                    <td
                      className="text-left px-4 py-2"
                      style={{ fontFamily: "IT Regular" }}
                    >
                      {pp?.four}%
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
                      }).format(house?.price * (pp?.four / 100))}
                    </td>
                  </tr>
                </table>
              </div>
            )}

            {/* Location Map */}
            <div>
              <div className="px-2 py-1">
                {house?.newParameter?.position && (
                  <div>
                    <Typography
                      fontFamily={"DM Bold"}
                      fontSize={{ xs: "24px", md: "30px" }}
                    >
                      Location
                    </Typography>
                    <PropertyMap position={house?.newParameter?.position} />
                  </div>
                )}

                {house?.rentParameter?.position && (
                  <div>
                    <Typography
                      fontFamily={"DM Bold"}
                      fontSize={{ xs: "24px", md: "30px" }}
                    >
                      Location
                    </Typography>
                    <PropertyMap position={house?.rentParameter?.position} />
                  </div>
                )}

                {house?.communityLocation && (
                  <div>
                    <Typography
                      fontFamily={"DM Bold"}
                      fontSize={{ xs: "24px", md: "30px" }}
                    >
                      Location
                    </Typography>
                    <PropertyMap position={house?.communityLocation} />
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Typography
                fontFamily={"DM Bold"}
                fontSize={{ xs: "24px", md: "30px" }}
              >
                Amenities
              </Typography>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {amenityNames.map((item, index) => (
                  <Card key={index}>
                    <CardContent style={{ fontFamily: "IT Medium" }}>
                      {item}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="overview">
              <Typography
                fontSize={{ lg: "30px", xs: "24px" }}
                fontFamily="DM Bold"
              >
                Overview
              </Typography>
              <Typography
                fontFamily={"IT Regular"}
                style={{ whiteSpace: "pre-line" }}
              >
                {house?.description}
              </Typography>
            </div>

            {/* Floor Plans */}
            {house?.newParameter?.style && (
              <div>
                <Typography
                  fontFamily={"DM Bold"}
                  fontSize={{ xs: "24px", md: "30px" }}
                >
                  Floors
                </Typography>
                {house?.newParameter?.style.map((item: any, index: number) => (
                  <div key={index}>
                    <Typography
                      fontFamily={"IT Medium"}
                      fontSize={{ lg: "30px" }}
                    >
                      {item.name}
                    </Typography>
                    <img src={"https://pixxicrm.ae/api" + item.imgUrl} />
                  </div>
                ))}
              </div>
            )}

            {/* Community Info */}

            {/* Morgage Calculator */}
            <div>
              <MortgageCalculator totalPrice={house?.price} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sticky top-0 self-start w-full md:w-full py-0 lg:py-5">
            <div className="w-full flex flex-col items-center gap-5 justify-center">
              {/* Agent Information */}
              <div className="w-full lg:w-[350px] py-5">
                <div className="border border-gray-200 px-6 py-6 rounded-2xl shadow-lg bg-white flex flex-col gap-5">
                  {/* Agent Profile */}
                  {house?.agentName ? (
                    <div className="flex items-center gap-4">
                      <div
                        style={{
                          backgroundImage: `url('${
                            "https://pixxicrm.ae/api" + house?.agentAvatar
                          }')`,
                        }}
                        className="bg-cover bg-top rounded-full h-16 w-16 sm:h-20 sm:w-20"
                      />
                      <div>
                        <Typography fontFamily="IT Medium" className="text-lg">
                          {house?.agentName}{" "}
                          <BadgeCheck className="inline text-[#0B253F]" />
                        </Typography>
                        <Typography
                          fontFamily="IT Regular"
                          className="text-sm text-gray-500"
                        >
                          Verified Agent
                        </Typography>
                      </div>
                    </div>
                  ) : (
                    <Typography>Loading agent info...</Typography>
                  )}

                  {/* Contact CTA
                  <Typography fontFamily="MT Medium" className="text-center">
                    Book a Viewing Today
                  </Typography> */}
                  <div className="flex flex-col gap-3">
                    <a>
                      <button
                        style={{ fontFamily: "GT Bold" }}
                        className="mt-3 bg-[#0B253F] text-white px-4 py-2 rounded-lg text-md w-full"
                      >
                        Book A Viewing
                      </button>
                    </a>

                    <a href={`https://wa.me/${house?.agentPhone}`}>
                      <button
                        style={{ fontFamily: "GT Bold" }}
                        className="bg-green-500 px-4 py-3 flex items-center gap-3 rounded-md text-white justify-center w-full"
                      >
                        <FaWhatsapp /> Whatsapp Agent
                      </button>
                    </a>

                    <a href={`tel:‎${house?.agentPhone}`}>
                      <button
                        style={{ fontFamily: "GT Bold" }}
                        className="bg-[#FF9800] px-4 py-3 flex items-center gap-3 rounded-md text-white justify-center w-full"
                      >
                        <Phone /> Call Agent
                      </button>
                    </a>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${house?.agentEmail}`}
                      target="_blank"
                    >
                      <button
                        style={{ fontFamily: "GT Bold" }}
                        className="bg-[#EA4335] px-4 py-3 flex items-center gap-3 rounded-md text-white justify-center w-full"
                      >
                        <Mail /> Email Agent
                      </button>
                    </a>
                  </div>
                  <Typography
                    fontFamily="IT Light"
                    className="text-xs text-gray-500 text-center"
                  >
                    No obligation. Agent will contact you within 1h.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Browse More Properties */}
        {/* <div className="py-0">
          <div className="flex justify-between items-center py-10 flex-col sm:flex-row gap-4 sm:gap-0">
            <Typography
              fontFamily={"IT Medium"}
              fontSize={{ xs: "28px", lg: "35px" }}
            >
              Similar Properties
            </Typography>
            <button
              className="bg-[#0B253F] px-4 py-2 sm:px-5 sm:py-3 rounded-xl w-full sm:w-auto"
              onClick={handleProperties}
            >
              <span
                className="text-white text-base sm:text-[16px]"
                style={{ fontFamily: "MT Medium" }}
              >
                All Properties
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {randomProperties?.map((item, index) => (
              <PropertyCard
                key={index}
                item={item}
                onClick={() => handleDetails(item.propertyId)}
              />
            ))}
          </div>
        </div> */}

        {/* Contact Form */}
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20">
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
            propertyId={house?.propertyId || ""}
            extraData={{ property_name: house?.communityName || house?.name }}
            formType="default"
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyOverview;
