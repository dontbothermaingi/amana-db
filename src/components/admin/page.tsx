import { Box, Typography, Grid, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  Bed,
  MapPin,
  Ruler,
  ShowerHead,
  Users,
  Building2,
  DollarSign,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AgentUpload from "../agents/agentupload";
import AgentSoldProperties from "../agents/agentsoldproperties";
import { Button } from "../ui/button";
import AgentEdit from "../agents/agentedit";
import AgentPropertyEdit from "../agents/agentpropertyedit";

/* ======================================================
   MAIN ADMIN DASHBOARD
====================================================== */
function AdminPage() {
  const navigate = useNavigate();
  const auth_token = localStorage.getItem("auth_token");

  // Inline form visibility states
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<number | null>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(
    null
  );

  /* ========== AUTH CHECK ========== */
  useEffect(() => {
    if (auth_token) {
      const token = JSON.parse(auth_token);
      const now = Date.now();

      if (now > token.expiry) {
        localStorage.removeItem("auth_token");
        navigate("/login");
      } else {
        const timeout = token.expiry - now;
        setTimeout(() => {
          localStorage.removeItem("auth_token");
          navigate("/login");
        }, timeout);
      }
    }
  }, []);

  /* ========== DATA FETCHING ========== */
  const { data: soldproperties, isLoading: loadingProperties } = useQuery({
    queryKey: ["property_sold"],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/properties`).then((res) =>
        res.json()
      ),
  });

  const { data: agents, isLoading: loadingAgents } = useQuery({
    queryKey: ["agent_new"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents")
        .then((res) => res.json())
        .catch((err) => console.error("Error fetching agents:", err)),
    staleTime: 1000 * 60 * 10,
  });

  const handleDetails = useCallback(
    (agentId: any) => navigate(`/agent-details/${agentId}`),
    []
  );

  /* ========== CRUD ACTIONS ========== */
  function handleDeleteAgent(agentId: number) {
    fetch(`https://db-amana.onrender.com/agents/${agentId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Delete successful", data);
      });
  }

  function handleDeleteProperty(propId: number) {
    fetch(`https://db-amana.onrender.com/properties/${propId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Delete successful", data);
      });
  }

  /* ========== DASHBOARD METRICS ========== */
  const totalAgents = agents?.length || 0;
  const totalProperties = soldproperties?.length || 0;
  const avgPrice =
    soldproperties?.length > 0
      ? Math.round(
          soldproperties.reduce(
            (sum: number, item: any) => sum + (item.price || 0),
            0
          ) / soldproperties.length
        )
      : 0;

  /* ======================================================
     UI RENDER
  ====================================================== */
  return (
    <div>
      {auth_token ? (
        <div className="min-h-screen bg-gray-50 py-10">
          <Box className="mx-auto w-[90%] lg:w-[80%]">
            {/* ===== PAGE TITLE ===== */}
            <Typography
              fontFamily="DM Medium"
              fontSize={{ xs: 28, lg: 36 }}
              color="#0B253F"
              mb={5}
            >
              Admin Dashboard
            </Typography>

            {/* ===== SUMMARY CARDS ===== */}
            <Grid container spacing={3} mb={8}>
              <DashboardStat
                icon={<Building2 className="text-[#BA7F55]" size={32} />}
                label="Sold Properties"
                value={totalProperties}
              />
              <DashboardStat
                icon={<Users className="text-[#BA7F55]" size={32} />}
                label="Registered Agents"
                value={totalAgents}
              />
              <DashboardStat
                icon={<DollarSign className="text-[#BA7F55]" size={32} />}
                label="Average Property Price"
                value={`AED ${new Intl.NumberFormat("en-AE").format(avgPrice)}`}
              />
            </Grid>

            {/* ===== PROPERTIES SECTION ===== */}
            <Section
              title="Properties Sold"
              color="#0B253F"
              action={
                <Button
                  onClick={() => setShowAddProperty(!showAddProperty)}
                  className="bg-[#0B253F] hover:bg-[#16385d]"
                >
                  {showAddProperty ? "Close" : "Add Sold Property"}
                </Button>
              }
            >
              {showAddProperty && (
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                  <AgentSoldProperties />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingProperties ? (
                  [...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[300px] rounded-xl" />
                  ))
                ) : soldproperties?.length ? (
                  soldproperties.map((item: any) => (
                    <div key={item.id} className="flex flex-col gap-5">
                      <PropertyCard item={item} />
                      <div className="flex gap-3">
                        <Button
                          className="bg-red-600 w-1/2"
                          onClick={() => handleDeleteProperty(item.id)}
                        >
                          DELETE
                        </Button>
                        <Button
                          className="bg-green-600 w-1/2"
                          onClick={() =>
                            setEditingPropertyId(
                              editingPropertyId === item.id ? null : item.id
                            )
                          }
                        >
                          {editingPropertyId === item.id
                            ? "Close Edit"
                            : "Edit"}
                        </Button>
                      </div>
                      {editingPropertyId === item.id && (
                        <div className="p-6 mt-3 bg-white rounded-2xl shadow-inner border border-gray-100">
                          <AgentPropertyEdit property={item} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <Typography>No sold properties found.</Typography>
                )}
              </div>
            </Section>

            {/* ===== AGENTS SECTION ===== */}
            <Section
              title="Our Agents"
              color="#0B253F"
              action={
                <Button
                  onClick={() => setShowAddAgent(!showAddAgent)}
                  className="bg-[#BA7F55] hover:bg-[#a46d47]"
                >
                  {showAddAgent ? "Close" : "Add Agent"}
                </Button>
              }
            >
              {showAddAgent && (
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                  <AgentUpload />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingAgents ? (
                  [...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] rounded-xl" />
                  ))
                ) : agents?.length ? (
                  agents.map((item: any) => (
                    <div key={item.id} className="flex flex-col gap-5">
                      <AgentCard
                        item={item}
                        onClick={() => handleDetails(item.id)}
                      />
                      <div className="flex gap-3">
                        <Button
                          className="bg-red-600 w-1/2"
                          onClick={() => handleDeleteAgent(item.id)}
                        >
                          DELETE
                        </Button>
                        <Button
                          className="bg-green-600 w-1/2"
                          onClick={() =>
                            setEditingAgentId(
                              editingAgentId === item.id ? null : item.id
                            )
                          }
                        >
                          {editingAgentId === item.id ? "Close Edit" : "Edit"}
                        </Button>
                      </div>
                      {editingAgentId === item.id && (
                        <div className="p-6 mt-3 bg-white rounded-2xl shadow-inner border border-gray-100">
                          <AgentEdit agent={item} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <Typography>No agents found.</Typography>
                )}
              </div>
            </Section>
          </Box>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default AdminPage;

/* ======================================================
   SUBCOMPONENTS
====================================================== */

const Section = ({
  title,
  color,
  children,
  action,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <Box mb={14}>
    <div className="flex justify-between items-center mb-5">
      <Typography
        fontFamily="DM Medium"
        fontSize={{ xs: 26, lg: 30 }}
        color={color}
      >
        {title}
      </Typography>
      {action && <div>{action}</div>}
    </div>
    {children}
  </Box>
);

const DashboardStat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => (
  <div>
    <Paper className="p-6 rounded-2xl shadow-sm bg-white flex items-center gap-4 hover:shadow-md transition">
      <div className="bg-[#F8F4F1] p-3 rounded-xl">{icon}</div>
      <div>
        <Typography fontFamily="IT Medium" className="text-gray-700 text-sm">
          {label}
        </Typography>
        <Typography fontFamily="IT Bold" className="text-2xl text-[#0B253F]">
          {value}
        </Typography>
      </div>
    </Paper>
  </div>
);

const PropertyCard = ({ item }: { item: any }) => (
  <div className="relative group flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white">
    <div className="relative h-48 sm:h-60 w-full overflow-hidden">
      <img
        src={item.photo}
        alt="Property"
        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 z-50 flex pt-10 justify-center rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/10 rounded-2xl" />
        <Typography
          fontFamily="IT Bold"
          className="text-white font-extrabold tracking-widest opacity-90 select-none"
          style={{
            textShadow: "0 4px 15px rgba(0,0,0,0.3)",
            letterSpacing: "0.1em",
            position: "absolute",
          }}
          fontSize={"100px"}
        >
          SOLD
        </Typography>
      </div>
    </div>
    <div className="p-4 flex flex-col gap-2">
      <Typography fontFamily="IT Bold" className="text-[#BA7F55] text-lg">
        {new Intl.NumberFormat("en-AE", {
          style: "currency",
          currency: "AED",
          minimumFractionDigits: 0,
        }).format(item.price)}
      </Typography>
      <Typography fontFamily="IT Medium" className="text-gray-800 text-lg">
        {item.property_type}
      </Typography>
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <MapPin className="w-4 h-4 text-slate-400" /> {item.community},{" "}
        {item.city}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-gray-600 text-sm">
        <div className="flex items-center gap-1">
          <Bed size={16} /> {item.beds} Beds
        </div>
        <div className="flex items-center gap-1">
          <ShowerHead size={16} /> {item.baths} Baths
        </div>
        <div className="flex items-center gap-1">
          <Ruler size={16} /> {item.sqft} Sqft
        </div>
      </div>
    </div>
  </div>
);

const AgentCard = ({ item, onClick }: { item: any; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="relative h-[220px] bg-cover bg-center rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
    style={{ backgroundImage: `url(${item.img})` }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="absolute bottom-4 left-4">
      <Typography fontFamily="IT Medium" className="text-white text-lg">
        {item.name}
      </Typography>
      <Typography
        fontFamily="IT Light"
        className="text-white text-sm opacity-80"
      >
        {item.specialization}
      </Typography>
    </div>
  </div>
);
