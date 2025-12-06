import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

type FilterProps = {
  onFilterChange: any;
  type: string;
};

function PropertyFilterBar({ onFilterChange, type }: FilterProps) {
  const initialFilters = {
    community: "",
    propertyType: "",
    location: "Dubai",
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
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      onFilterChange(updated);
      return updated;
    });
  };

  useEffect(() => {
    const reason = type === "NEW" ? "OFF-PLAN" : type;
    setActiveReason(reason);
    setFilters((prev) => ({ ...prev, reason: type }));
    onFilterChange((prev: any) => ({ ...prev, reason: type }));
  }, [type]);

  const handleReasonClick = (reason: any) => {
    const reasonMapped = reason === "OFF-PLAN" ? "NEW" : reason;
    setActiveReason(reason);
    const updatedFilters = { ...filters, reason };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    navigate(`/${reasonMapped}/public-listings`);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const PROPERTY_TYPES = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Penthouse",
    "Hotel Apartment",
    "Duplex",
    "Residential Floor",
    "Residential Land",
    "Residential Building",
    "Bulk Units",
    "Compound",
    "Twin House",
    "Triplex",
    "Loft",
    "Loft Apartment",
    "Duplex Apartment",
    "Duplex Villa",
    "Office",
    "Shop",
    "Commercial Building",
    "Commercial Floor",
    "Commercial Land",
    "Labor Camp",
    "Retail",
    "Showroom",
    "Staff accommodation",
    "Commercial Villa",
    "Warehouse",
    "Farm",
    "Factory",
    "Hotel",
    "Hospital",
    "Garage",
    "Restaurant",
    "Business Centre",
    "Co-Working Space",
    "Other Commercial",
  ];

  const FilterForm = (
    <form
      className="bg-[#0B253F] flex flex-wrap gap-4 items-end"
      onSubmit={(e) => e.preventDefault()}
    >
      <SelectField
        label="Emirate"
        name="location"
        value={filters.location}
        onChange={handleChange}
        options={[
          "Abu Dhabi",
          "Ajman",
          "Dubai",
          "Sharjah",
          "Umm Al Quwain",
          "Ras Al Khaimah",
          "Fujairah",
        ]}
        flex="1"
      />

      {/* <div className={`flex flex-col min-w-[120px]`}>
        <label className="mb-1 font-medium text-white">Emirate</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="rounded-md px-3 py-2 text-[#BA7F55] bg-[#152D4A] border border-[#274B7D] focus:outline-none focus:ring-2 focus:ring-[#BA7F55]"
        />
      </div> */}

      {/* Community Search - biggest */}
      <div className={`flex flex-col min-w-[120px]`}>
        <label className="mb-1 font-medium text-white">Area</label>
        <input
          type="text"
          name="community"
          value={filters.community}
          onChange={handleChange}
          className="rounded-md px-3 py-2 text-[#BA7F55] bg-[#152D4A] border border-[#274B7D] focus:outline-none focus:ring-2 focus:ring-[#BA7F55]"
        />
      </div>

      {/* Listing Type */}
      <SelectField
        label="Listing Type"
        name="reason"
        value={activeReason}
        onChange={(e: any) => handleReasonClick(e.target.value)}
        options={["sale", "rent"]}
        flex="1"
      />

      {/* Property Type */}
      <SelectField
        label="Property Type"
        name="propertyType"
        value={filters.propertyType}
        onChange={handleChange}
        options={PROPERTY_TYPES}
        flex="1"
      />

      {/* Beds */}
      <SelectField
        label="Beds"
        name="beds"
        value={filters.beds}
        onChange={handleChange}
        options={["1", "2", "3", "4+"]}
        flex="1"
      />

      {/* Bathrooms */}
      <SelectField
        label="Bathrooms"
        name="bathrooms"
        value={filters.bathrooms}
        onChange={handleChange}
        options={["1", "2", "3", "4+"]}
        flex="1"
      />

      {/* SqFt Min & Max - smaller */}
      <InputField
        type="number"
        label="Min SqFt"
        name="sqftMin"
        value={filters.sqftMin}
        onChange={handleChange}
        flex="1"
      />

      {/* Price Min & Max - smaller */}
      <InputField
        type="number"
        label="Min Price"
        name="priceMin"
        value={filters.priceMin}
        onChange={handleChange}
        flex="1"
      />

      {/* Reset Button */}
      <button
        type="button"
        onClick={handleReset}
        className="bg-transparent border border-[#BA7F55] text-[#BA7F55] hover:bg-[#BA7F55] hover:text-white transition-colors rounded-md py-2 px-4 font-semibold"
      >
        Reset
      </button>
    </form>
  );

  return (
    <>
      {isMobile ? (
        <>
          <div className="sticky top-0 bg-[#0B253F] border-b border-[#274B7D]">
            <button
              className="w-full py-3 font-semibold text-white"
              onClick={() => setOpenMobileFilters(true)}
            >
              Open Filters
            </button>
          </div>

          {openMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
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
        <div
          style={{ fontFamily: "IT Medium" }}
          className="z-40 w-full bg-[#0B253F] p-5 rounded-2xl"
        >
          <div className="w-full">{FilterForm}</div>
        </div>
      )}
    </>
  );
}

// Select Field with flexible width
type SelectProps = {
  label: string;
  name: string;
  value: any;
  onChange: any;
  options: any;
  flex?: string;
};
function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  flex = "1",
}: SelectProps) {
  return (
    <div className={`flex flex-col flex-[${flex}] min-w-[120px]`}>
      <label className="mb-1 font-medium text-white">{label}</label>
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

// Input Field with flexible width
type InputProps = {
  label: string;
  name: string;
  value: any;
  onChange: any;
  type: string;
  flex?: string;
};
function InputField({
  label,
  name,
  value,
  onChange,
  type,
  flex = "1",
}: InputProps) {
  return (
    <div className={`flex flex-col flex-[${flex}] max-w-[120px]`}>
      <label className="mb-1 font-medium text-white">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-md px-3 py-2 text-[#BA7F55] bg-[#152D4A] border border-[#274B7D] focus:outline-none focus:ring-2 focus:ring-[#BA7F55]"
      />
    </div>
  );
}

export default PropertyFilterBar;
