import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Form from "@/leads/form";
import { Skeleton } from "../ui/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OffPlanItem {
  id: string;
  title: string;
  developer: string;
  img: string;
  startingPrice: number;
  pp: string;
  handover: string;
}

function OffPlan() {
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // const scrollToForm = useCallback(() => {
  //   formRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, []);

  const { data: stats } = useQuery<OffPlanItem[]>({
    queryKey: ["project"],
    queryFn: () =>
      fetch(`https://68e7771910e3f82fbf3f4033.mockapi.io/offplan/offplan`).then(
        (resp) => resp.json()
      ),
  });

  const [search, setSearch] = useState("");
  const [filterDeveloper, setFilterDeveloper] = useState("");
  const [mapView, setMapView] = useState(false);

  const developers = useMemo(
    () => [...new Set(stats?.map((item) => item.developer) || [])],
    [stats]
  );

  const filteredProperties = useMemo(() => {
    if (!stats) return [];

    return stats.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.developer.toLowerCase().includes(search.toLowerCase());

      const matchesDev = filterDeveloper
        ? item.developer === filterDeveloper
        : true;

      return matchesSearch && matchesDev;
    });
  }, [stats, search, filterDeveloper]);

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const currentData = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDetails = useCallback(
    (propertyId: String) => {
      navigate(`/off-plan/${propertyId}`);
    },
    [navigate]
  );

  const pageTitle = "Dubai Off-Plan Projects";

  return (
    <div className="w-full flex flex-col gap-3 py-10 animate-fadeIn">
      <div className="lg:px-20 px-3 py-3 h-fit flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-start">
          {/* Title Section */}
          <div className="flex flex-col gap-3">
            <Typography
              fontFamily="DM Medium"
              fontSize={{ lg: "40px", xs: "30px" }}
              className="leading-tight"
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
            <Typography fontFamily="IT Bold" color="#BA7F55">
              {mapView ? "Exit Map View" : "Map View"}
            </Typography>
          </Button>
        </div>

        <Divider className="my-3" />

        {/* Search & Filter Bar */}
        {!mapView && (
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <TextField
              label="Search Projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Developer"
              value={filterDeveloper}
              onChange={(e) => setFilterDeveloper(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Developers</MenuItem>
              {developers.map((dev) => (
                <MenuItem key={dev} value={dev}>
                  {dev}
                </MenuItem>
              ))}
            </TextField>
          </div>
        )}

        {/* MAP OR GRID */}
        <div className="flex flex-col gap-5">
          {mapView ? (
            <div className="h-full w-full animate-fadeIn">
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                {/* Map Component goes here */}
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
                {currentData.length
                  ? currentData.map((item: OffPlanItem) => (
                      <div
                        key={item.id}
                        className={`group relative rounded-xl overflow-hidden shadow-md transition-all duration-500 cursor-pointer`}
                        onClick={() => handleDetails(item.id)}
                      >
                        {/* --- Image --- */}
                        <img
                          src={item.img}
                          alt="Property"
                          loading="lazy"
                          className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* --- Full Card Gradient Overlay --- */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80  to-transparent z-10" />

                        {/* --- Top Info Overlay (on top of gradient) --- */}
                        <div className="absolute top-2 right-2 text-base opacity-90">
                          <div
                            style={{ fontFamily: "IT Medium" }}
                            className="bg-white px-2 py-1 rounded-md text-sm"
                          >
                            {item?.developer}
                          </div>
                        </div>

                        {/* --- Bottom Info Overlay (on top of gradient) --- */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20">
                          <div
                            style={{ fontFamily: "IT Medium" }}
                            className="font-bold text-2xl"
                          >
                            {item?.title}
                          </div>
                          {/* <div
                            style={{ fontFamily: "IT Medium" }}
                            className="text-sm opacity-80"
                          >
                            <MapPin className="inline-block w-4 h-4 mr-1 mb-0.5" />
                            {item?.community || item?.location}
                          </div> */}
                        </div>

                        {/* --- Hover Extra Info --- */}
                        <div className="absolute inset-0 z-20 bg-black/100 opacity-0 group-hover:opacity-100 transition duration-500 p-6 text-white flex flex-col justify-end gap-4">
                          <div className="flex items-center gap-3 text-lg">
                            Starting Price:{"  "}
                            {new Intl.NumberFormat("en-AE", {
                              style: "currency",
                              currency: "AED",
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            }).format(item?.startingPrice)}
                          </div>

                          <div className="flex items-center gap-3 text-lg">
                            Payment Plan : {item?.pp}
                          </div>

                          <div className="flex items-center gap-3 text-lg">
                            Handover: {item?.handover}
                          </div>

                          {/* {item?.portalAgent && (
                            <div className="flex items-center gap-4 border-t border-white/30 pt-4 mt-2">
                              <img
                                src={item.portalAgent.photo}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="text-sm">
                                <div className="font-semibold text-base">
                                  {item.portalAgent.name}
                                </div>
                                <div className="opacity-70">Verified Agent</div>
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>
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
                      className={`border px-3 py-1 rounded-lg transition
                        hover:bg-gray-200 shadow-sm
                        ${
                          currentPage === index + 1
                            ? "bg-gray-300 shadow-md"
                            : ""
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

      {/* FORM SECTION */}
      <div
        ref={formRef}
        className="bg-white shadow-lg border border-gray-200 rounded-3xl px-4 sm:px-8 py-10 flex flex-col items-center max-w-3xl mx-auto mb-1 lg:mt-10"
      >
        <Typography
          fontFamily="RM Medium"
          color="#BA7F55"
          className="uppercase tracking-wide text-sm mb-2"
        >
          [Get In Touch]
        </Typography>

        <Typography
          fontFamily="DM Medium"
          fontSize={{ xs: "24px", lg: "30px" }}
          className="text-center mb-4"
        >
          Let’s Make Your Property Journey Effortless
        </Typography>

        <Typography
          fontFamily="IT Light"
          className="text-center text-gray-600 leading-relaxed max-w-xl"
        >
          Whether you're buying, renting, or investing, our expert team is here
          to guide you every step of the way. Let's turn your property goals
          into reality—together.
        </Typography>

        <Form
          propertyId={""}
          extraData={{ location: "Submitted from the offplan page" }}
          formType="default"
        />
      </div>
    </div>
  );
}

export default OffPlan;
