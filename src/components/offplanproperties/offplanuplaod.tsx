import { nanoid } from "nanoid";
import React, { useState, type FormEvent } from "react";
import { X, UploadCloud, Image as ImageIcon, Video } from "lucide-react";
// 1. IMPORT THE LIBRARY
import imageCompression from "browser-image-compression";

interface OffplanUnitData {
  unit_type: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  unit_Id: string;
  starting_price: number;
  floor_plan_img: File | null;
  floor_plan_preview: string | null;
}

interface OffplanFormData {
  project_name: string;
  developer: string;
  location: string;
  starting_price: string;
  handover: string;
  offplan_Id: string;
  payment_plan: string;
  location_map: string;
  video_url: string;
  description: string;
  status: string;
}

const API_URL = "https://db-amana.onrender.com/offplans";

const OffplanUpload: React.FC = () => {
  // ... (State definitions remain the same)
  const [formData, setFormData] = useState<OffplanFormData>({
    project_name: "",
    developer: "",
    location: "",
    starting_price: "",
    handover: "",
    offplan_Id: nanoid(6),
    payment_plan: "",
    location_map: "",
    video_url: "",
    description: "",
    status: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const [units, setUnits] = useState<OffplanUnitData[]>([
    {
      unit_type: "",
      price: "",
      beds: 0,
      baths: 0,
      sqft: "",
      unit_Id: nanoid(),
      starting_price: 0,
      floor_plan_img: null,
      floor_plan_preview: null,
    },
  ]);

  // --- 2. COMPRESSION HELPER FUNCTION ---
  async function compressFile(file: File): Promise<File> {
    const options = {
      maxSizeMB: 5, // Compress to ~5MB (Safe buffer under 10MB)
      maxWidthOrHeight: 1920, // Resize to max 1920px (Good for web)
      useWebWorker: true, // Runs in background, doesn't freeze UI
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression failed:", error);
      return file; // If compression fails, return original
    }
  }

  // --- Handlers ---

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 3. UPDATED PHOTO HANDLER ---
  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];

      // Compress immediately
      const compressedFile = await compressFile(originalFile);

      // Save the COMPRESSED file to state
      setPhotos([...photos, compressedFile]);
      setPhotoPreviews([...photoPreviews, URL.createObjectURL(compressedFile)]);
    }
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  // ... (Amenities handlers remain the same) ...
  const handleAmenityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmenityInput(e.target.value);
  };
  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenitiesList.includes(trimmed))
      setAmenitiesList([...amenitiesList, trimmed]);
    setAmenityInput("");
  };
  const removeAmenity = (index: number) => {
    const newList = [...amenitiesList];
    newList.splice(index, 1);
    setAmenitiesList(newList);
  };

  const handleUnitChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newUnits = [...units];
    // @ts-ignore
    newUnits[index] = { ...newUnits[index], [name]: value };
    setUnits(newUnits);
  };

  // --- 4. UPDATED FLOOR PLAN HANDLER ---
  const handleUnitFloorPlanChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];

      // Compress immediately
      const compressedFile = await compressFile(originalFile);

      const newUnits = [...units];
      newUnits[index] = {
        ...newUnits[index],
        floor_plan_img: compressedFile, // Store compressed file
        floor_plan_preview: URL.createObjectURL(compressedFile),
      };
      setUnits(newUnits);
    }
  };

  const addUnit = () => {
    setUnits([
      ...units,
      {
        unit_type: "",
        price: "",
        beds: 0,
        baths: 0,
        sqft: "",
        unit_Id: nanoid(),
        starting_price: 0,
        floor_plan_img: null,
        floor_plan_preview: null,
      },
    ]);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  // ... (handleSubmit and JSX remain exactly the same) ...

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const data = new FormData();
    // ... append all fields ...
    data.append("project_name", formData.project_name);
    data.append("developer", formData.developer);
    data.append("location", formData.location);
    data.append("starting_price", formData.starting_price);
    data.append("handover", formData.handover);
    data.append("offplan_Id", formData.offplan_Id);
    data.append("payment_plan", formData.payment_plan);
    data.append("location_map", formData.location_map);
    data.append("video_url", formData.video_url);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("amenities", JSON.stringify(amenitiesList));

    photos.forEach((photo) => data.append("photos", photo));

    const unitsPayload = units.map((u) => ({
      unit_type: u.unit_type,
      price: u.price,
      beds: u.beds,
      baths: u.baths,
      sqft: u.sqft,
      unit_Id: u.unit_Id,
      starting_price: u.starting_price,
    }));

    data.append("units", JSON.stringify(unitsPayload));

    units.forEach((unit) => {
      if (unit.floor_plan_img) {
        data.append(`floor_plan_${unit.unit_Id}`, unit.floor_plan_img);
      }
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "Offplan Posted Successfully!");
      } else {
        setMessage(result.error || "Failed to post offplan data.");
        setIsError(true);
      }
    } catch (error) {
      setMessage(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h2 className="text-2xl font-bold mb-6 text-[#0B253F]">
        🏠 Post New Offplan Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Details */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              placeholder="Project Name"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleInputChange}
              placeholder="Developer"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              name="offplan_Id"
              value={formData.offplan_Id}
              onChange={handleInputChange}
              placeholder="OFFPLAN ID"
              className="border rounded-lg px-3 py-2 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Sold Out">Sold Out</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="border rounded-lg px-3 py-2 w-full md:col-span-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              required
            />
          </div>
        </section>

        {/* Pricing & Location */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Pricing & Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <input
              type="number"
              name="starting_price"
              value={formData.starting_price}
              onChange={handleInputChange}
              placeholder="Starting Price (AED)"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="handover"
              value={formData.handover}
              onChange={handleInputChange}
              placeholder="Handover Date (e.g., Q4 2025)"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="payment_plan"
              value={formData.payment_plan}
              onChange={handleInputChange}
              placeholder="Payment Plan (e.g., 60/40)"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <input
              type="url"
              name="location_map"
              value={formData.location_map}
              onChange={handleInputChange}
              placeholder="Location Map URL"
              className="border rounded-lg px-3 py-2 w-full md:col-span-2"
              required
            />
          </div>
        </section>

        {/* Features & Media */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Features & Media
          </h3>

          {/* Amenities */}
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={handleAmenityInput}
                placeholder="Type an amenity"
                className="border rounded-lg px-3 py-2 flex-1"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="bg-[#0B253F] text-white px-4 py-2 rounded-lg hover:bg-[#16385d]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {amenitiesList.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-[#0B253F] px-3 py-1 rounded-full flex items-center gap-2 border border-gray-200"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* New Video Link Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Video className="text-gray-400" size={18} />
            </div>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
              placeholder="Promo Video URL (YouTube/Vimeo)"
              className="border rounded-lg pl-10 pr-3 py-2 w-full"
            />
          </div>

          {/* Photos */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50">
            <label className="cursor-pointer flex flex-col items-center">
              <UploadCloud size={32} className="text-gray-400 mb-2" />
              <span className="text-sm font-semibold text-[#BA7F55]">
                Upload Project Photos
              </span>
              <input
                type="file"
                onChange={handleAddPhoto}
                accept="image/*"
                className="hidden"
              />
            </label>
            <div className="flex flex-wrap gap-4 mt-4 w-full justify-center">
              {photoPreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Units Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Unit Types</h3>
            <button
              type="button"
              onClick={addUnit}
              className="bg-[#BA7F55] text-white px-4 py-2 rounded-lg hover:bg-[#a46d47] text-sm font-bold"
            >
              + Add Unit Type
            </button>
          </div>

          {units.map((unit, index) => (
            <div
              key={unit.unit_Id}
              className="border border-gray-200 p-6 rounded-xl space-y-4 relative bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-[#0B253F] text-lg">
                  Unit Type #{index + 1}
                </h4>
                {units.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUnit(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <X size={16} /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Unit Type (e.g. 2 Bedroom Apartment)
                  </label>
                  <input
                    type="text"
                    name="unit_type"
                    value={unit.unit_type}
                    onChange={(e) => handleUnitChange(index, e)}
                    placeholder="e.g. 2 Bedroom Apartment"
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Total Sq.ft
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={unit.sqft}
                    onChange={(e) => handleUnitChange(index, e)}
                    placeholder="e.g. 1250"
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Price (AED)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={unit.price}
                    onChange={(e) => handleUnitChange(index, e)}
                    placeholder="e.g. 1500000"
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                  Floor Plan Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2">
                    <ImageIcon size={18} />
                    {unit.floor_plan_img ? "Change Image" : "Upload Floor Plan"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUnitFloorPlanChange(index, e)}
                      className="hidden"
                    />
                  </label>
                  {unit.floor_plan_preview && (
                    <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                      <img
                        src={unit.floor_plan_preview}
                        alt="Floor Plan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {unit.floor_plan_img && (
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {unit.floor_plan_img.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B253F] text-white px-4 py-4 rounded-xl hover:bg-[#16385d] disabled:opacity-50 font-bold text-lg shadow-lg transition-all"
        >
          {loading ? "Posting..." : "🚀 Post Offplan Data"}
        </button>

        {message && (
          <p
            className={`text-center mt-2 font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default OffplanUpload;
