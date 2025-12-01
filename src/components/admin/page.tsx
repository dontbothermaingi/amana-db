import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Building2,
  Users,
  Plus,
  LogOut,
  Bed,
  ShowerHead,
  Ruler,
  DollarSign,
  Trash2,
  Edit,
  X,
  FileText,
  CalendarClock,
  MapPin,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

// Import Components
import AgentUpload from "../agents/agentupload";
import AgentSoldProperties from "../agents/agentsoldproperties";
import AgentEdit from "../agents/agentedit";
import AgentPropertyEdit from "../agents/agentpropertyedit";
import OffPlanUpload from "../offplanproperties/offplanuplaod";
import OffPlanEdit from "../offplanproperties/offplanedit"; // <--- 1. IMPORT THIS

/* ================= TYPES & CONSTANTS ================= */
const DRAWER_WIDTH = 260;
const MENU_ITEMS = [
  { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
  { id: "properties", label: "Sold Properties", icon: <Building2 size={20} /> },
  { id: "offplan", label: "Off-Plan Projects", icon: <FileText size={20} /> },
  { id: "agents", label: "Agents", icon: <Users size={20} /> },
];

function AdminPage() {
  const navigate = useNavigate();
  const auth_token = localStorage.getItem("auth_token");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Global Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<
    | "add_agent"
    | "add_property"
    | "add_offplan"
    | "edit_agent"
    | "edit_property"
    | "edit_offplan"
    | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  /* ========== AUTH CHECK ========== */
  useEffect(() => {
    if (auth_token) {
      const token = JSON.parse(auth_token);
      if (Date.now() > token.expiry) handleLogout();
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  /* ========== DATA FETCHING ========== */
  const {
    data: soldproperties,
    isLoading: loadingProperties,
    refetch: refetchProps,
  } = useQuery({
    queryKey: ["property_sold"],
    queryFn: () =>
      fetch(`https://db-amana.onrender.com/properties`).then((res) =>
        res.json()
      ),
  });

  const {
    data: agents,
    isLoading: loadingAgents,
    refetch: refetchAgents,
  } = useQuery({
    queryKey: ["agent_new"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/agents").then((res) => res.json()),
  });

  const {
    data: offplanProjects,
    isLoading: loadingOffplan,
    refetch: refetchOffplan,
  } = useQuery({
    queryKey: ["offplan_projects"],
    queryFn: () =>
      fetch("https://db-amana.onrender.com/offplans").then((res) => res.json()),
  });

  /* ========== HANDLERS ========== */
  const handleDelete = (
    id: number | string,
    endpoint: string,
    refetch: () => void
  ) => {
    // Note: Use offplan_Id for offplans if that is your DB primary key logic
    if (
      window.confirm(
        "Are you sure you want to delete this item? This cannot be undone."
      )
    ) {
      fetch(`https://db-amana.onrender.com/${endpoint}/${id}`, {
        method: "DELETE",
      })
        .then(() => refetch())
        .catch((err) => console.error(err));
    }
  };

  const openAddModal = (type: "add_agent" | "add_property" | "add_offplan") => {
    setSelectedItem(null);
    setDialogContent(type);
    setIsDialogOpen(true);
  };

  const openEditModal = (
    item: any,
    type: "edit_agent" | "edit_property" | "edit_offplan"
  ) => {
    setSelectedItem(item);
    setDialogContent(type);
    setIsDialogOpen(true);
  };

  // Helper to close modal and refresh data
  const handleSuccess = () => {
    setIsDialogOpen(false);
    refetchProps();
    refetchAgents();
    refetchOffplan();
  };

  /* ========== RENDER CONTENT ========== */
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            agents={agents}
            properties={soldproperties}
            offplan={offplanProjects}
            setTab={setActiveTab}
          />
        );
      case "properties":
        return (
          <GenericListSection
            title="Sold Properties"
            loading={loadingProperties}
            data={soldproperties}
            type="property"
            onAdd={() => openAddModal("add_property")}
            onDelete={(id: any) => handleDelete(id, "properties", refetchProps)}
            onEdit={(item: any) => openEditModal(item, "edit_property")}
          />
        );
      case "offplan":
        return (
          <GenericListSection
            title="Off-Plan Projects"
            loading={loadingOffplan}
            data={offplanProjects}
            type="offplan"
            onAdd={() => openAddModal("add_offplan")}
            // Ensure you pass item.offplan_Id to delete if that's the key
            onDelete={(id: any) => handleDelete(id, "offplans", refetchOffplan)}
            onEdit={(item: any) => openEditModal(item, "edit_offplan")}
          />
        );
      case "agents":
        return (
          <GenericListSection
            title="Registered Agents"
            loading={loadingAgents}
            data={agents}
            type="agent"
            onAdd={() => openAddModal("add_agent")}
            onDelete={(id: any) => handleDelete(id, "agents", refetchAgents)}
            onEdit={(item: any) => openEditModal(item, "edit_agent")}
            onViewDetails={(id: any) => navigate(`/agent-details/${id}`)}
          />
        );
      default:
        return null;
    }
  };

  if (!auth_token) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#0B253F",
            color: "white",
            border: "none",
          },
        }}
      >
        <div className="p-8">
          <Typography
            fontFamily="DM Medium"
            variant="h5"
            className="tracking-tight text-white"
          >
            Amana Admin
          </Typography>
        </div>
        <List className="px-4">
          {MENU_ITEMS.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "#BA7F55",
                    "&:hover": { bgcolor: "#a46d47" },
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontFamily: "IT Medium" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <div className="mt-auto p-6">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-300 hover:text-red-400 hover:bg-red-900/20"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, overflowX: "hidden" }}>
        {renderContent()}
      </Box>

      {/* MODAL */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center bg-gray-50 border-b">
          <span className="font-bold text-[#0B253F]">
            {dialogContent === "add_agent" && "Add New Agent"}
            {dialogContent === "add_property" && "Add Sold Property"}
            {dialogContent === "add_offplan" && "Add Off-Plan Project"}
            {dialogContent === "edit_agent" && "Edit Agent"}
            {dialogContent === "edit_property" && "Edit Property"}
            {dialogContent === "edit_offplan" && "Edit Off-Plan Project"}
          </span>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-6 bg-white">
          <div className="mt-4">
            {/* ADD FORMS */}
            {dialogContent === "add_agent" && <AgentUpload />}
            {dialogContent === "add_property" && <AgentSoldProperties />}
            {dialogContent === "add_offplan" && <OffPlanUpload />}

            {/* EDIT FORMS */}
            {dialogContent === "edit_agent" && selectedItem && (
              <AgentEdit agent={selectedItem} />
            )}
            {dialogContent === "edit_property" && selectedItem && (
              <AgentPropertyEdit property={selectedItem} />
            )}
            {/* 2. RENDER OFFPLAN EDIT COMPONENT */}
            {dialogContent === "edit_offplan" && selectedItem && (
              <OffPlanEdit
                property={selectedItem}
                onSuccess={handleSuccess}
                onCancel={() => setIsDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AdminPage;

/* ================= SUB-COMPONENTS ================= */

const DashboardOverview = ({ agents, properties, offplan, setTab }: any) => {
  return (
    <div className="animate-in fade-in duration-500">
      <Typography variant="h4" fontFamily="DM Medium" color="#0B253F" mb={4}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} mb={6}>
        <StatCard
          icon={<Building2 className="text-white" />}
          label="Sold Properties"
          value={properties?.length || 0}
          color="bg-blue-600"
          onClick={() => setTab("properties")}
        />
        <StatCard
          icon={<FileText className="text-white" />}
          label="Off-Plan Projects"
          value={offplan?.length || 0}
          color="bg-purple-600"
          onClick={() => setTab("offplan")}
        />
        <StatCard
          icon={<Users className="text-white" />}
          label="Active Agents"
          value={agents?.length || 0}
          color="bg-orange-500"
          onClick={() => setTab("agents")}
        />
      </Grid>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, onClick }: any) => (
  <Paper
    onClick={onClick}
    className="p-6 rounded-2xl shadow-sm bg-white flex items-center gap-4 hover:shadow-md transition cursor-pointer border border-gray-100"
  >
    <div className={`p-4 rounded-xl shadow-lg ${color}`}>{icon}</div>
    <div>
      <Typography className="text-gray-500 text-sm font-medium">
        {label}
      </Typography>
      <Typography className="text-3xl font-bold text-gray-800">
        {value}
      </Typography>
    </div>
  </Paper>
);

const GenericListSection = ({
  title,
  loading,
  data,
  onAdd,
  onDelete,
  onEdit,
  type,
  onViewDetails,
}: any) => {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" fontFamily="DM Medium" color="#0B253F">
          {title}
        </Typography>
        <Button
          onClick={onAdd}
          className="bg-[#0B253F] hover:bg-[#16385d] text-white gap-2 pl-3 pr-4 py-6 rounded-xl shadow-lg shadow-blue-900/20"
        >
          <div className="bg-white/20 p-1 rounded-full">
            <Plus size={16} />
          </div>
          Add New{" "}
          {type === "agent"
            ? "Agent"
            : type === "offplan"
            ? "Project"
            : "Property"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-2xl" />
          ))
        ) : data?.length ? (
          data.map((item: any) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* IMAGE LOGIC */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => onViewDetails && onViewDetails(item.id)}
              >
                <img
                  // Handle different image field names
                  src={
                    type === "agent"
                      ? item.img
                      : type === "offplan"
                      ? item.photos?.[0] || "/placeholder-image.png" // Fix: Offplan usually has 'photos' array
                      : item.photo
                  }
                  alt="Item"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {type === "property" && (
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold">
                    {item.listing_type}
                  </div>
                )}
                {type === "offplan" && (
                  <div className="absolute top-3 right-3 bg-[#0B253F] text-white px-3 py-1 rounded-full text-xs font-bold">
                    Off-Plan
                  </div>
                )}
              </div>

              {/* CONTENT LOGIC */}
              <div className="p-5 flex flex-col gap-2 flex-grow">
                <div>
                  <Typography
                    fontFamily="IT Bold"
                    className="text-lg text-gray-900 leading-tight"
                  >
                    {/* Title Logic */}
                    {type === "agent"
                      ? item.name
                      : type === "offplan"
                      ? item.project_name
                      : `AED ${new Intl.NumberFormat("en-AE").format(
                          item.price
                        )}`}
                  </Typography>

                  <Typography className="text-sm text-gray-500 mt-1">
                    {/* Subtitle Logic */}
                    {type === "agent" && item.specialization}
                    {type === "property" &&
                      `${item.property_type} in ${item.community}`}
                    {type === "offplan" && `by ${item.developer}`}
                  </Typography>
                </div>

                {/* Off-Plan Specific Details */}
                {type === "offplan" && (
                  <div className="flex flex-col gap-1 mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#BA7F55]" />{" "}
                      {item.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarClock size={14} className="text-[#BA7F55]" />{" "}
                      Handover: {item.handover}
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      <DollarSign size={14} className="text-[#BA7F55]" /> From
                      AED{" "}
                      {new Intl.NumberFormat("en-AE").format(
                        item.starting_price
                      )}
                    </div>
                  </div>
                )}

                {/* Sold Property Details */}
                {type === "property" && (
                  <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Bed size={14} /> {item.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShowerHead size={14} /> {item.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler size={14} /> {item.sqft}
                    </span>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="bg-gray-50 p-3 flex gap-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="flex-1 bg-white border-gray-200 hover:bg-gray-100 text-gray-700"
                  onClick={() => onEdit(item)}
                >
                  <Edit size={14} className="mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-12 px-0 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                  // Ensure you delete using the correct ID (offplan_Id for offplans if key is different)
                  onClick={() =>
                    onDelete(type === "offplan" ? item.offplan_Id : item.id)
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            <Typography>No records found. Click "Add New" to start.</Typography>
          </div>
        )}
      </div>
    </div>
  );
};
