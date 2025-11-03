import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

type filterProps = {
  onFilterChange: any;
  type: string;
};

function PropertyFilterBar({ onFilterChange, type }: filterProps) {
  const initialFilters = {
    location: "",
    community: "",
    propertyType: "",
    beds: "",
    bathrooms: "",
    sqftMin: "",
    sqftMax: "",
    priceMin: "",
    priceMax: "",
    reason: type,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [activeReason, setActiveReason] = useState(type || "SELL");
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let newFilters = { ...filters, [name]: value };

    // If location is reset to "", also reset community
    if (name === "location") {
      newFilters = { ...newFilters, community: "" };
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  useEffect(() => {
    // keep state in sync if URL changes externally
    let reason2 = type;
    if (type === "NEW") {
      reason2 = "OFF-PLAN";
    }

    setActiveReason(reason2);
    setFilters((prev) => ({ ...prev, reason: type }));
    onFilterChange((prev: any) => ({ ...prev, reason: type }));
  }, [type]);

  const handleReasonClick = (reason: any) => {
    let reason2 = reason;
    if (reason === "OFF-PLAN") {
      reason2 = "NEW";
    }
    setActiveReason(reason);
    const updatedFilters = { ...filters, reason };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    navigate(`/${reason2}/public-listings`);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const FilterForm = (
    <div className="px-6 py-8 bg-[#0B253F] rounded-3xl shadow-lg">
      {/* Reason Buttons */}
      <div className="flex justify-center mb-8 space-x-6">
        {["SELL", "RENT", "OFF-PLAN"].map((item) => (
          <button
            key={item}
            onClick={() => handleReasonClick(item)}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300
              ${
                activeReason === item
                  ? "bg-white text-[#BA7F55] shadow-md"
                  : "bg-transparent text-white border border-white hover:bg-white hover:text-[#BA7F55]"
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Filters Grid */}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-white"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Location */}
        <SelectField
          label="Location"
          name="location"
          value={filters.location}
          onChange={handleChange}
          options={["Dubai", "Sharjah", "Al Ras Khaimah"]}
        />
        {/* Community */}
        {filters.location === "Dubai" && (
          <SelectField
            label="Community"
            name="community"
            value={filters.community}
            onChange={handleChange}
            options={[
              "Jumeirah Village Circle",
              "Dubai Land",
              "Business Bay",
              "Dubai Science Park",
              "Jumeirah Village Triangle",
              "Arjan",
              "DownTown Dubai",
              "Dubai Creek Harbour",
            ]}
          />
        )}
        {filters.location === "Sharjah" && (
          <SelectField
            label="Community"
            name="community"
            value={filters.community}
            onChange={handleChange}
            options={["Masaar Forest Community"]}
          />
        )}
        {filters.location === "Al Ras Khaimah" && (
          <SelectField
            label="Community"
            name="community"
            value={filters.community}
            onChange={handleChange}
            options={["Marjan Island"]}
          />
        )}

        {/* Property Type */}
        <SelectField
          label="Property Type"
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
          options={["APARTMENT", "VILLA", "TOWNHOUSE", "STUDIO", "SHOP"]}
        />
        {/* Beds */}
        <SelectField
          label="Beds"
          name="beds"
          value={filters.beds}
          onChange={handleChange}
          options={["1", "2", "3", "4+"]}
        />
        {/* Bathrooms */}
        <SelectField
          label="Bathrooms"
          name="bathrooms"
          value={filters.bathrooms}
          onChange={handleChange}
          options={["1", "2", "3", "4+"]}
        />
        {/* SqFt Min */}
        <InputField
          label="SqFt (Min)"
          name="sqftMin"
          value={filters.sqftMin}
          onChange={handleChange}
        />
        {/* SqFt Max */}
        <InputField
          label="SqFt (Max)"
          name="sqftMax"
          value={filters.sqftMax}
          onChange={handleChange}
        />
        {/* Price Min */}
        <InputField
          label="Price (Min)"
          name="priceMin"
          value={filters.priceMin}
          onChange={handleChange}
        />
        {/* Price Max */}
        <InputField
          label="Price (Max)"
          name="priceMax"
          value={filters.priceMax}
          onChange={handleChange}
        />

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-transparent border border-[#BA7F55] text-[#BA7F55] hover:bg-[#BA7F55] hover:text-white transition-colors duration-300 rounded-md py-2 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <button
            className="w-full bg-[#0B253F] text-white py-3 rounded-xl font-semibold"
            onClick={() => setOpenMobileFilters(true)}
          >
            Open Filters
          </button>

          {openMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col">
              <div className="bg-[#0B253F] overflow-auto h-full p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-semibold">Filters</h2>
                  <button
                    className="text-white font-bold"
                    onClick={() => setOpenMobileFilters(false)}
                  >
                    ✕
                  </button>
                </div>
                {FilterForm}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-7xl mx-auto">{FilterForm}</div>
      )}
    </>
  );
}

type selectProps = {
  label: string;
  name: string;
  value: any;
  onChange: any;
  options: any;
};
function SelectField({ label, name, value, onChange, options }: selectProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-md px-3 py-2 text-[#BA7F55] bg-[#152D4A] border border-[#274B7D] focus:outline-none focus:ring-2 focus:ring-[#BA7F55]"
      >
        <option value="">Any</option>
        {options.map((opt: any) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

type inputProps = {
  label: string;
  name: string;
  value: any;
  onChange: any;
};
function InputField({ label, name, value, onChange }: inputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Min"
        className="rounded-md px-3 py-2 text-[#BA7F55] bg-[#152D4A] border border-[#274B7D] focus:outline-none focus:ring-2 focus:ring-[#BA7F55]"
      />
    </div>
  );
}

export default PropertyFilterBar;
