import { Box, Divider, Typography } from "@mui/material";
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
import { Button } from "../ui/button";

// Lazy-loaded heavy components
// const MapView = lazy(() => import("./mapview"));
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

interface Listing {
  listingType?: string;
  community: string;
  location: string;
  propertyType: string;
  region: string;
  title: string;
  photos: any;
  portalAgent?: string | null;
  id?: string;
  newParam?: string;
  sellParam?: string;
  rentParam?: string;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  price: number;
  propertyId: string;
}

const transformProperties = (items: any[]): Listing[] => {
  if (!items?.length) return [];

  const safeNumber = (val: any) => Number(val) || 0;
  const safeString = (val: any) => String(val || "");

  return items.map((item: any) => ({
    listingType: safeString(item.offering_type || item.listing_type),
    community: safeString(item.community || item.sub_community),
    location: safeString(item.city),
    propertyType: safeString(item.property_type),
    region: safeString(item.community),
    title: item.title_en || "High Rental Yield | Smart Investment",
    photos: Array.isArray(item.images) ? item.images : item.photo || [],
    portalAgent: item.agent || null,
    propertyId: item.reference_number || item.property_Id,
    newParam: safeString(item.newParam),
    sellParam: safeString(item.sellParam),
    rentParam: safeString(item.rentParam),
    bedrooms: safeNumber(item.bedroom || item.beds),
    bathrooms: safeNumber(item.bathroom || item.baths),
    size: safeNumber(item.size || item.sqft),
    price: safeNumber(item.price),
  }));
};

function PropertiesPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const itemsPerPage = 15;
  const location = useLocation();

  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [mapView, setMapView] = useState(false);

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setCurrentPage(location.state.currentPage);
    }
  }, [location.state]);

  const { data: combinedArray = [] } = useQuery({
    queryKey: ["combinedProperties", type],
    queryFn: async () => {
      const [crmRes, soldRes] = await Promise.all([
        fetch("https://db-amana.onrender.com/crm-data"),
        fetch("https://db-amana.onrender.com/properties"),
      ]);

      const crmData = (await crmRes.json())?.properties || [];
      const soldData = await soldRes.json();

      const crmArray = transformProperties(crmData);
      const flaskArray = transformProperties(
        soldData.filter(
          (item: any) => item.listing_type.toLowerCase() === type?.toLowerCase()
        )
      );

      return [...crmArray, ...flaskArray].sort((a, b) => a.price - b.price);
    },
    staleTime: 1000 * 60 * 30, // cache 30 min
  });

  // Memoized filtered properties (one pass)
  const filteredProperties = useMemo(() => {
    if (!combinedArray.length) return [];

    return combinedArray.filter((p: any) => {
      if (
        filters.reason &&
        p.listingType.toLowerCase() !== filters.reason.toLowerCase()
      )
        return false;
      if (
        filters.community &&
        !String(p.region)
          .toLowerCase()
          .includes(filters.community.trim().toLowerCase())
      )
        return false; // hide non-matching ones

      if (
        filters.location &&
        !p.location
          .toLowerCase()
          .includes(filters.location.trim().toLowerCase())
      )
        return false; // hide non-matching ones

      if (
        filters.propertyType &&
        String(p.propertyType).toLowerCase() !==
          filters.propertyType.toLowerCase()
      )
        return false;

      if (filters.beds) {
        const beds = filters.beds === "4+" ? 4 : Number(filters.beds);
        if (p.bedrooms < beds) return false;
      }

      if (filters.bathrooms) {
        const baths =
          filters.bathrooms === "4+" ? 4 : Number(filters.bathrooms);
        if (p.bathrooms < baths) return false;
      }

      if (filters.sqftMin && p.size < Number(filters.sqftMin)) return false;
      if (filters.sqftMax && p.size > Number(filters.sqftMax)) return false;
      if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && p.price > Number(filters.priceMax)) return false;

      return true;
    });
  }, [filters, combinedArray]);

  // Memoized page title
  const pageTitle = useMemo(() => {
    const { propertyType, location, community, reason } = filters;

    if (!location && !community && !propertyType && !reason)
      return "Properties for Sale in the UAE";

    let title =
      reason == "rent"
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
    <div className="relative pb-20 pt-6">
      {/* Header + Title */}
      <div className="w-full flex flex-col gap-3 py-10 animate-fadeIn">
        <div className="lg:px-20 px-3 py-3 h-fit flex flex-col gap-5">
          <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-start">
            {/* Title Section */}
            <div className="flex flex-col gap-3">
              <Typography
                fontFamily={"DM Medium"}
                fontSize={{ lg: "40px", xs: "30px" }}
                className="leading-tight"
              >
                {pageTitle}
              </Typography>

              <Typography
                fontFamily={"IT Light"}
                fontSize={{ lg: "16px", xs: "13px" }}
                className="text-gray-600 max-w-2xl leading-relaxed"
              >
                Explore premium Dubai properties—from luxurious villas and
                contemporary apartments to the latest off-plan investments.
                Browse curated selections tailored for buying, renting, or
                investing.
              </Typography>

              <Typography
                fontFamily={"IT Medium"}
                className="text-[#0B253F] text-lg"
              >
                {filteredProperties?.length} Properties Found
              </Typography>
            </div>

            {/* Map Button */}
            <Button
              onClick={() => setMapView(!mapView)}
              className="bg-[#0B253F] shadow-md shadow-black/10 hover:scale-105 transition-transform duration-200 hidden"
            >
              <Typography fontFamily={"IT Bold"} color="#BA7F55">
                {mapView ? "Exit Map View" : "Map View"}
              </Typography>
            </Button>
          </div>

          <Divider className="my-3" />

          {/* Sticky Filter Bar */}
          <div className="shadow-md shadow-black/10">
            <PropertyFilterBar onFilterChange={setFilters} type={type ?? ""} />
          </div>

          {/* Properties or Map */}
          <div className="flex flex-col gap-5">
            {mapView ? (
              <div className="h-full w-full animate-fadeIn">
                <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                  {/* <MapView listings={filteredProperties} /> */}
                </Suspense>
              </div>
            ) : (
              <div className="h-full gap-3 justify-between">
                <Box
                  display={"grid"}
                  gridTemplateColumns={{
                    md: "repeat(2,1fr)",
                    xs: "repeat(1,1fr)",
                    lg: "repeat(5,1fr)",
                  }}
                  gap={"30px"}
                  className="animate-slideUp"
                >
                  {filteredProperties.length
                    ? currentData.map((item: any) => (
                        <PropertyCard
                          key={item.id}
                          item={item}
                          onClick={() => {
                            // Only execute handleDetails if the condition is met
                            if (Array.isArray(item.photos)) {
                              handleDetails(item.propertyId);
                            }
                          }}
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
                <div className="flex justify-center items-center gap-5 mt-10 overflow-x-auto animate-fadeIn">
                  <div
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <ArrowLeft />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center cursor-pointer">
                    {[...Array(totalPages)].map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`border border-gray-300 px-3 py-1 rounded-lg transition
                      hover:bg-gray-200 shadow-sm
                      ${
                        currentPage === index + 1 ? "bg-gray-300 shadow-md" : ""
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
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <ArrowRight />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white shadow-xl border border-gray-200 rounded-3xl px-6 sm:px-10 py-12 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mb-20 animate-fadeIn">
        <Typography
          fontFamily={"RM Medium"}
          color="#BA7F55"
          className="uppercase tracking-widest text-sm mb-3"
        >
          Get In Touch
        </Typography>

        <Typography
          fontFamily={"DM Medium"}
          fontSize={{ xs: "25px", lg: "32px" }}
          className="text-center mb-4 leading-tight"
        >
          Let’s Make Your Property Journey Effortless
        </Typography>

        <Typography
          fontFamily={"IT Light"}
          className="text-center text-gray-600 leading-relaxed max-w-xl"
        >
          Whether you're buying, renting, or investing, our specialists are here
          to assist you at every stage. Your ideal property experience begins
          here.
        </Typography>

        <Suspense fallback={<Skeleton className="h-96 w-full mt-8" />}>
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
