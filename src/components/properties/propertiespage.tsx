import { Box, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PropertyFilterBar from "./propertyfilterbar";
import { useNavigate, useParams } from "react-router-dom";
import PropertyCard from "./propertycard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MapView from "./mapview";
import Form from "@/leads/form";

function PropertiesPage() {
  const navigate = useNavigate();
  type Filters = {
    reason?: string;
    location?: string;
    propertyType?: string;
    beds?: string;
    bathrooms?: string;
    sqftMin?: string;
    sqftMax?: string;
    priceMin?: string;
    priceMax?: string;
    community?: string;
  };

  const [filters, setFilters] = useState<Filters>({});
  const { type } = useParams();
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";

  const { data: houses = [] } = useQuery({
    queryKey: ["house", access_token, type],
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
            listingType: type,
            size: 500,
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

  const properties = houses?.list;

  const handleDetails = useCallback((propertyId: any) => {
    navigate(`/public-listings/${propertyId}`);
  }, []);

  const filteredProperties = useMemo(() => {
    let filtered = properties || [];

    if (filters.reason)
      filtered = filtered.filter((p: any) => p.listingType === filters.reason);

    if (filters.community)
      filtered = filtered.filter((p: any) => p.region === filters.community);

    if (filters.location)
      filtered = filtered.filter((p: any) => p.cityName === filters.location);

    if (filters.propertyType)
      filtered = filtered.filter(
        (p: any) => p.propertyType[0] === filters.propertyType
      );

    if (filters.beds) {
      filtered =
        filters.beds === "4+"
          ? filtered.filter((p: any) => p.bedRooms >= 4)
          : filtered.filter((p: any) => p.bedRooms === Number(filters.beds));
    }

    if (filters.bathrooms) {
      filtered =
        filters.bathrooms === "4+"
          ? filtered.filter((p: any) => p.bedRooms >= 4)
          : filtered.filter(
              (p: any) => p.bedRooms === Number(filters.bathrooms)
            );
    }

    if (filters.sqftMin)
      filtered = filtered.filter((p: any) => p.size >= Number(filters.sqftMin));

    if (filters.sqftMax)
      filtered = filtered.filter((p: any) => p.size <= Number(filters.sqftMax));

    if (filters.priceMin)
      filtered = filtered.filter(
        (p: any) => p.price >= Number(filters.priceMin)
      );

    if (filters.priceMax)
      filtered = filtered.filter(
        (p: any) => p.price <= Number(filters.priceMax)
      );

    return filtered;
  }, [filters, properties]);

  const totalPages = Math.ceil(
    (filteredProperties?.length || 0) / itemsPerPage
  );

  const startingIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProperties?.slice(
    startingIndex,
    startingIndex + itemsPerPage
  );

  return (
    <div className="pb-20">
      <div className="w-full flex flex-col gap-3 py-10">
        <div className="lg:px-10 px-3 py-3 h-fit flex flex-col gap-10">
          <div className="flex justify-center">
            <div className="w-fit lg:w-200">
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "40px", xs: "30px" }}
                textAlign="center"
              >
                {(() => {
                  const { propertyType, location, community, reason } = filters;

                  // Case 1: Default title
                  if (!location && !community && !propertyType && !reason) {
                    return "Properties for Sale in the UAE";
                  }

                  // Start building base title
                  // let title = propertyType
                  // ? `${propertyType}s for Sale`
                  // : "Properties for Sale";

                  let title =
                    reason === "RENT"
                      ? propertyType
                        ? `${propertyType}s for Rent`
                        : "Properties for Rent"
                      : propertyType
                      ? `${propertyType}s for Sale`
                      : "Properties for Sale";

                  if (location) {
                    title += ` in ${location}`;
                  } else {
                    title += ` in Dubai`;
                  }

                  if (community) {
                    title += `, ${community}`;
                  }

                  return title;
                })()}
              </Typography>

              <Typography
                fontFamily={"IT Light"}
                textAlign={"center"}
                fontSize={{ lg: "16px", xs: "13px" }}
              >
                Explore our curated selection of Dubai real estate, from modern
                apartments and luxury villas to off-plan developments. Whether
                you’re looking to buy, rent, or invest in Dubai.
              </Typography>
            </div>
          </div>

          <div className="z-9991">
            <PropertyFilterBar onFilterChange={setFilters} type={type ?? ""} />
          </div>

          <div className="px-1">
            <Typography fontFamily={"IT Medium"} fontSize={{ lg: "20px" }}>
              {filteredProperties?.length} Properties of {properties?.length}{" "}
            </Typography>
          </div>

          <div className="lg:flex-row flex flex-col gap-5 relative">
            <div className="lg:h-[95vh] lg:w-1/2 lg:sticky lg:top-5 w-full">
              <MapView listings={filteredProperties} />
            </div>
            <div className="h-full border-black gap-3 justify-between lg:px-1 lg:w-1/2 w-full">
              {/* <Divider orientation="vertical"/> */}

              <div className="h-full border-black overflow-x-hidden">
                <Box
                  display={"grid"}
                  gridTemplateColumns={{
                    md: "repeat(2,1fr)",
                    xs: "repeat(1,1fr)",
                    lg: "repeat(1,1fr)",
                  }}
                  gap={"30px"}
                >
                  {currentData?.map((item: any) => (
                    <PropertyCard
                      key={item.id}
                      item={item}
                      onClick={() => handleDetails(item.propertyId)}
                    />
                  ))}
                </Box>

                <div className="flex justify-center items-center gap-5 mt-10 overflow-x-auto">
                  <div
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    <ArrowLeft />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center cursor-pointer">
                    {[...Array(totalPages)].map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`border border-gray-400 px-3 py-1 rounded-lg hover:bg-gray-200 ${
                          currentPage === index + 1 ? "bg-gray-300" : ""
                        }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <div
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    <ArrowRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          Whether you're buying, renting, or investing, our expert team is here
          to guide you every step of the way. Let's turn your property goals
          into reality—together.
        </Typography>

        {/* Form */}
        <Form
          propertyId={""}
          extraData={{ property_name: "" }}
          formType="default"
        />
      </div>
    </div>
  );
}

export default PropertiesPage;
