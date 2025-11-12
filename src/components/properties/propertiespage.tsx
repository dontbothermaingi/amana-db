import { Box, Typography } from "@mui/material";
import {
  useCallback,
  useMemo,
  useState,
  lazy,
  Suspense,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import PropertyFilterBar from "./propertyfilterbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import PropertyCard from "./propertycard";

// Lazy-loaded heavy components
const MapView = lazy(() => import("./mapview"));
const Form = lazy(() => import("@/leads/form"));

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

function PropertiesPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const itemsPerPage = 12;
  const location = useLocation();

  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);

  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setCurrentPage(location.state.currentPage);
    }
  }, [location.state]);

  // Fetch properties with caching
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
            size: 100,
            sort: "ID",
            sortType: "DESC",
          }),
        }
      );
      const json = await res.json();
      // console.log("Raw API response", json);
      return json?.list || json?.data || json || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const properties = houses?.list || [];

  // Memoized filtered properties (one pass)
  const filteredProperties = useMemo(() => {
    if (!properties.length) return [];

    return properties.filter((p: any) => {
      if (filters.reason && p.listingType !== filters.reason) return false;
      if (
        filters.community &&
        !p.region.toLowerCase().includes(filters.community.trim().toLowerCase())
      )
        return false; // hide non-matching ones

      if (
        filters.location &&
        !p.cityName
          .toLowerCase()
          .includes(filters.location.trim().toLowerCase())
      )
        return false; // hide non-matching ones

      if (
        filters.propertyType &&
        p.propertyType[0].toLowerCase() !== filters.propertyType.toLowerCase()
      )
        return false;

      if (filters.beds) {
        const beds = filters.beds === "4+" ? 4 : Number(filters.beds);
        if (p.bedRooms < beds) return false;
      }

      if (filters.bathrooms) {
        const baths =
          filters.bathrooms === "4+" ? 4 : Number(filters.bathrooms);
        if (p.bathRooms < baths) return false;
      }

      if (filters.sqftMin && p.size < Number(filters.sqftMin)) return false;
      if (filters.sqftMax && p.size > Number(filters.sqftMax)) return false;
      if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && p.price > Number(filters.priceMax)) return false;

      return true;
    });
  }, [filters, properties]);

  // Memoized page title
  const pageTitle = useMemo(() => {
    const { propertyType, location, community, reason } = filters;

    if (!location && !community && !propertyType && !reason)
      return "Properties for Sale in the UAE";

    let title =
      reason === "RENT"
        ? propertyType
          ? `${propertyType}s for Rent`
          : "Properties for Rent"
        : propertyType
        ? `${propertyType}s for Sale`
        : "Properties for Sale";

    if (location) title += ` in ${location}`;
    else title += ` in Dubai`;

    if (community) title += `, ${community}`;

    return title;
  }, [filters]);

  const totalPages = Math.ceil(
    (filteredProperties?.length || 0) / itemsPerPage
  );
  const startingIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProperties?.slice(
    startingIndex,
    startingIndex + itemsPerPage
  );

  // In PropertiesPage
  const handleDetails = useCallback(
    (propertyId: string) => {
      navigate(`/public-listings/${propertyId}`, {
        state: { filters, currentPage },
      });
    },
    [navigate, filters, currentPage]
  );

  return (
    <div className="pb-20">
      <div className="w-full flex flex-col gap-3 py-10">
        <div className="lg:px-10 px-3 py-3 h-fit flex flex-col gap-10">
          {/* Title */}
          <div className="flex justify-center">
            <div className="w-fit lg:w-200">
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "40px", xs: "30px" }}
                textAlign="center"
              >
                {pageTitle}
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

          {/* Filter Bar */}
          <div className="z-9991">
            <PropertyFilterBar onFilterChange={setFilters} type={type ?? ""} />
          </div>

          {/* Property Count */}
          <div className="px-1">
            <Typography fontFamily={"IT Medium"} fontSize={{ lg: "20px" }}>
              {filteredProperties?.length} Properties of {properties?.length}
            </Typography>
          </div>

          {/* Properties + Map */}
          <div className="xl:flex-row flex flex-col gap-5 relative">
            {/* Map */}
            <div className="lg:h-[95vh] xl:w-1/2 xl:sticky xl:top-5 w-full">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <MapView listings={filteredProperties} />
              </Suspense>
            </div>

            {/* Property Cards */}
            <div className="h-full border-black gap-3 justify-between lg:px-1 xl:w-1/2 w-full">
              <Box
                display={"grid"}
                gridTemplateColumns={{
                  md: "repeat(2,1fr)",
                  xs: "repeat(1,1fr)",
                  lg: "repeat(1,1fr)",
                }}
                gap={"30px"}
              >
                {properties.length
                  ? currentData.map((item: any) => (
                      <PropertyCard
                        key={item.id}
                        item={item}
                        onClick={() => handleDetails(item.propertyId)}
                      />
                    ))
                  : [...Array(itemsPerPage)].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[300px] w-full rounded-xl"
                      />
                    ))}
              </Box>

              {/* Pagination */}
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

      {/* Contact Form */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20">
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
          Whether you're buying, renting, or investing, our expert team is here
          to guide you every step of the way. Let's turn your property goals
          into reality—together.
        </Typography>

        <Suspense fallback={<Skeleton className="h-96 w-full mt-5" />}>
          <Form
            propertyId={""}
            extraData={{ property_name: "" }}
            formType="default"
          />
        </Suspense>
      </div>
    </div>
  );
}

export default PropertiesPage;
