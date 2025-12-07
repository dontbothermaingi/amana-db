import { Box, Typography, TextField, MenuItem, Divider } from "@mui/material";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Form from "@/leads/form";
import { Skeleton } from "../ui/skeleton";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

// Update Interface to match Backend Response
interface OffPlanItem {
  id: number;
  offplan_Id: string;
  project_name: string;
  developer: string;
  photos: string[];
  starting_price: number;
  payment_plan: string;
  handover: string;
  location: string;
}

const FALLBACK_IMAGE = "/placeholder-image.png"; // Add a valid path

function OffPlan() {
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch from your Render Backend
  const { data: stats, isLoading } = useQuery<OffPlanItem[]>({
    queryKey: ["offplan_list"],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/offplans`).then((resp) =>
        resp.json()
      ),
  });

  const [search, setSearch] = useState("");
  const [filterDeveloper, setFilterDeveloper] = useState("");

  // Extract unique developers
  const developers = useMemo(
    () => [...new Set(stats?.map((item) => item.developer) || [])].sort(),
    [stats]
  );

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    if (!stats) return [];

    // 1. Filter the items first
    const filtered = stats.filter((item) => {
      const searchLower = search.toLowerCase();
      // Safe check for undefined fields
      const titleMatch = item.project_name?.toLowerCase().includes(searchLower);
      const devMatch = item.developer?.toLowerCase().includes(searchLower);
      const locMatch = item.location?.toLowerCase().includes(searchLower);

      const matchesSearch = titleMatch || devMatch || locMatch;

      const matchesDev = filterDeveloper
        ? item.developer === filterDeveloper
        : true;

      return matchesSearch && matchesDev;
    });

    // 2. Sort alphabetically by project_name
    return filtered.sort((a, b) =>
      (a.project_name || "").localeCompare(b.project_name || "")
    );
  }, [stats, search, filterDeveloper]);

  // Pagination Logic
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const currentData = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDetails = useCallback(
    (offplanId: string) => {
      // Use the specific ID needed for the detail page query
      navigate(`/off-plan/${offplanId}`);
    },
    [navigate]
  );

  const pageTitle = "Dubai Off-Plan Projects";

  return (
    <div className="w-full flex flex-col gap-3 py-10 animate-fadeIn bg-gray-50/50">
      <div className="lg:px-20 px-3 py-3 h-fit flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-start">
          {/* Title Section */}
          <div className="flex flex-col gap-3">
            <Typography
              fontFamily="DM Medium"
              fontSize={{ lg: "40px", xs: "30px" }}
              className="leading-tight text-[#0B253F]"
            >
              {pageTitle}
            </Typography>

            <Typography
              fontFamily="IT Light"
              fontSize={{ lg: "16px", xs: "13px" }}
              className="text-gray-600 max-w-2xl leading-relaxed"
            >
              Explore premium Dubai off-plan investment opportunities. Browse
              the latest new developments and secure your next property avenue.
            </Typography>

            <Typography
              fontFamily="IT Medium"
              className="text-[#BA7F55] text-lg"
            >
              {filteredProperties?.length} Properties Found
            </Typography>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Search & Filter Bar */}

        <div className="flex flex-col lg:flex-row gap-4 w-full p-4">
          <TextField
            label="Search Projects or Locations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            size="medium"
          />

          <TextField
            select
            label="Developer"
            value={filterDeveloper}
            onChange={(e) => setFilterDeveloper(e.target.value)}
            fullWidth
            variant="outlined"
            size="medium"
          >
            <MenuItem value="">All Developers</MenuItem>
            {developers.map((dev) => (
              <MenuItem key={dev} value={dev}>
                {dev}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* MAP OR GRID */}
        <div className="flex flex-col gap-5 mt-4">
          {false ? (
            <div className="h-full w-full animate-fadeIn">
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                {/* <OffPlanMap properties={filteredProperties} /> */}
                <div className="h-[500px] w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  Map Component Placeholder
                </div>
              </Suspense>
            </div>
          ) : (
            <div className="h-full gap-3 justify-between">
              {/* Grid */}
              <Box
                display="grid"
                gridTemplateColumns={{
                  md: "repeat(2,1fr)",
                  xs: "repeat(1,1fr)",
                  lg: "repeat(4,1fr)",
                }}
                gap="30px"
                className="animate-slideUp"
              >
                {isLoading
                  ? [...Array(itemsPerPage)].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[400px] w-full rounded-2xl"
                      />
                    ))
                  : currentData.map((item: OffPlanItem) => (
                      <div
                        key={item.id}
                        className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-black h-[500px]`}
                        onClick={() => handleDetails(item.offplan_Id)}
                      >
                        {/* --- Image --- */}
                        <img
                          src={
                            item.photos && item.photos.length > 0
                              ? item.photos[0]
                              : FALLBACK_IMAGE
                          }
                          alt={item.project_name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />

                        {/* --- Gradient Overlays --- */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" /> */}

                        {/* --- Top Info --- */}
                        <div className="absolute top-4 right-4 z-20">
                          <div
                            style={{ fontFamily: "IT Medium" }}
                            className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-[#0B253F] shadow-lg"
                          >
                            {item.developer}
                          </div>
                        </div>

                        {/* --- Bottom Info (Always Visible) --- */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white transition-transform duration-500 transform translate-y-2 group-hover:translate-y-[-10px]">
                          <div
                            style={{ fontFamily: "GT Bold" }}
                            className="text-2xl mb-1 leading-none shadow-black drop-shadow-md"
                          >
                            {item.project_name}
                          </div>

                          <div
                            style={{ fontFamily: "IT Regular" }}
                            className="text-md opacity-90 flex items-center gap-1 mb-2"
                          >
                            <MapPin size={14} className="text-[#BA7F55]" />
                            {item.location}
                          </div>

                          {/* Hidden Info (Slides up on Hover) */}
                          <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                            <div className="w-12 h-0.5 bg-[#BA7F55] mb-3 mt-1"></div>

                            <div className="space-y-1 text-md">
                              <div className="flex justify-between">
                                <span
                                  style={{ fontFamily: "IT Medium" }}
                                  className="opacity-70"
                                >
                                  Starting From:
                                </span>
                                <span style={{ fontFamily: "IT Medium" }}>
                                  AED{" "}
                                  {new Intl.NumberFormat("en-AE", {
                                    maximumFractionDigits: 0,
                                  }).format(item.starting_price)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  style={{ fontFamily: "IT Medium" }}
                                  className="opacity-70"
                                >
                                  Payment Plan:
                                </span>
                                <span style={{ fontFamily: "IT Medium" }}>
                                  {item.payment_plan}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  style={{ fontFamily: "IT Medium" }}
                                  className="opacity-70"
                                >
                                  Handover:
                                </span>
                                <span style={{ fontFamily: "IT Medium" }}>
                                  {item.handover}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </Box>

              {/* No Results State */}
              {!isLoading && currentData.length === 0 && (
                <div className="py-20 text-center text-gray-500 w-full flex flex-col items-center">
                  <Typography fontSize={20} fontFamily="DM Medium">
                    No properties found
                  </Typography>
                  <Typography fontSize={14}>
                    Try adjusting your search filters
                  </Typography>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-5 mt-16 overflow-x-auto animate-fadeIn">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div className="flex flex-wrap gap-2 items-center cursor-pointer">
                    {[...Array(totalPages)].map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all font-medium text-sm
                          ${
                            currentPage === index + 1
                              ? "bg-[#0B253F] text-white shadow-md transform scale-105"
                              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-all"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FORM SECTION */}
      <div
        ref={formRef}
        className="bg-white shadow-xl shadow-gray-200/50 border border-gray-100 rounded-3xl px-4 sm:px-8 py-12 flex flex-col items-center max-w-4xl mx-auto mb-10 mt-10 relative overflow-hidden"
      >
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
          Whether you're buying, renting, or investing, our expert team is here
          to guide you every step of the way. Let's turn your property goals
          into reality—together.
        </Typography>

        <Form
          propertyId={""}
          extraData={{ location: "Submitted from the offplan listing page" }}
          formType="default"
        />
      </div>
    </div>
  );
}

export default OffPlan;
