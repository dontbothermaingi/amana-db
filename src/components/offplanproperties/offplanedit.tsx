import React, { useState, type FormEvent } from "react";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Video,
  Save,
  ArrowLeft,
} from "lucide-react";
import imageCompression from "browser-image-compression";

// Placeholder image URL
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=No+Floor+Plan";

interface OffplanUnitData {
  unit_type: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  unit_Id: string;
  starting_price: number;
  // In Edit mode, this can be a URL (string) or a new File, or null
  floor_plan_img: File | string | null;
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

// Props: expecting the property object to edit
interface OffPlanEditProps {
  property: any;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const OffPlanEdit: React.FC<OffPlanEditProps> = ({
  property,
  onCancel,
  onSuccess,
}) => {
  const API_URL = `https://db-amana.onrender.com/offplans/${property.offplan_Id}`;

  // --- 1. INITIALIZE STATE WITH EXISTING DATA ---
  const [formData, setFormData] = useState<OffplanFormData>({
    project_name: property.project_name || "",
    developer: property.developer || "",
    location: property.location || "",
    starting_price: property.starting_price || "",
    handover: property.handover || "",
    offplan_Id: property.offplan_Id || "",
    payment_plan: property.payment_plan || "",
    location_map: property.location_map || "",
    video_url: property.video_url || "",
    description: property.description || "",
    status: property.status || "Available",
  });

  // Separate Existing URLs from New Uploads
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    property.photos || []
  );
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  // Amenities
  const [amenitiesList, setAmenitiesList] = useState<string[]>(
    Array.isArray(property.amenities) ? property.amenities : []
  );
  const [amenityInput, setAmenityInput] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  // Initialize Units
  const [units, setUnits] = useState<OffplanUnitData[]>(() => {
    if (property.units && property.units.length > 0) {
      return property.units.map((u: any) => ({
        ...u,
        // Ensure floor_plan_img is treated as string if it exists from DB
        floor_plan_img: u.floor_plan_img || null,
        floor_plan_preview: u.floor_plan_img || null,
      }));
    }
    return [];
  });

  // --- 2. COMPRESSION HELPER ---
  async function compressFile(file: File): Promise<File> {
    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Compression failed:", error);
      return file;
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

  // --- PHOTO HANDLERS (New vs Existing) ---

  // Add NEW Photo
  const handleAddNewPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      const compressedFile = await compressFile(originalFile);

      setNewPhotos([...newPhotos, compressedFile]);
      setNewPhotoPreviews([
        ...newPhotoPreviews,
        URL.createObjectURL(compressedFile),
      ]);
    }
    e.target.value = "";
  };

  // Remove NEW Photo
  const removeNewPhoto = (index: number) => {
    const _photos = [...newPhotos];
    const _previews = [...newPhotoPreviews];
    _photos.splice(index, 1);
    _previews.splice(index, 1);
    setNewPhotos(_photos);
    setNewPhotoPreviews(_previews);
  };

  // Remove EXISTING Photo
  const removeExistingPhoto = (index: number) => {
    const _photos = [...existingPhotos];
    _photos.splice(index, 1);
    setExistingPhotos(_photos);
  };

  // --- AMENITIES ---
  const handleAmenityInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmenityInput(e.target.value);
  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenitiesList.includes(trimmed))
      setAmenitiesList([...amenitiesList, trimmed]);
    setAmenityInput("");
  };
  const removeAmenity = (index: number) => {
    const list = [...amenitiesList];
    list.splice(index, 1);
    setAmenitiesList(list);
  };

  // --- UNIT HANDLERS ---

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

  const handleUnitFloorPlanChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      const compressedFile = await compressFile(originalFile);

      const newUnits = [...units];
      newUnits[index] = {
        ...newUnits[index],
        floor_plan_img: compressedFile, // This is now a File
        floor_plan_preview: URL.createObjectURL(compressedFile),
      };
      setUnits(newUnits);
    }
  };

  const addUnit = () => {
    // Generate a temporary random ID for new units
    const tempId = Math.random().toString(36).substr(2, 9);
    setUnits([
      ...units,
      {
        unit_type: "",
        price: "",
        beds: 0,
        baths: 0,
        sqft: "",
        unit_Id: tempId,
        starting_price: 0,
        floor_plan_img: null,
        floor_plan_preview: null,
      },
    ]);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const data = new FormData();

    // 1. Append Text Data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("amenities", JSON.stringify(amenitiesList));
    data.append("existing_photos", JSON.stringify(existingPhotos));

    // 2. Append NEW Project Photos
    newPhotos.forEach((photo) => data.append("photos", photo));

    // 3. Prepare Units Payload (JSON part)
    // If it's a File/Blob, we send null in JSON so the backend looks in request.files
    // If it's a String (URL), we send the URL so the backend keeps it
    const unitsPayload = units.map((u) => ({
      unit_type: u.unit_type,
      price: u.price,
      beds: u.beds,
      baths: u.baths,
      sqft: u.sqft,
      unit_Id: u.unit_Id,
      starting_price: u.starting_price,
      floor_plan_img:
        typeof u.floor_plan_img === "string" ? u.floor_plan_img : null,
    }));

    data.append("units", JSON.stringify(unitsPayload));

    // 4. Append Unit Floor Plan FILES
    // FIX: Checked for 'object' instead of 'instanceof File' to catch Blobs too
    units.forEach((unit) => {
      if (unit.floor_plan_img && typeof unit.floor_plan_img !== "string") {
        const fileKey = `floor_plan_${unit.unit_Id}`;
        data.append(fileKey, unit.floor_plan_img);
        console.log(
          `Attached file for unit ${unit.unit_Id} with key: ${fileKey}`
        );
      }
    });

    // Debug: Print what we are sending
    console.log("Submitting Units Payload:", unitsPayload);

    try {
      const response = await fetch(API_URL, {
        method: "PATCH",
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Updated Successfully!");
        if (onSuccess) onSuccess();
      } else {
        setMessage(result.error || "Failed to update.");
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
    <div className="w-full mx-auto bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0B253F]">
          ✏️ Edit Offplan Project
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- 1. DETAILS --- */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
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
              disabled
              className="border rounded-lg px-3 py-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
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

        {/* --- 2. PRICING & LOCATION --- */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
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
              placeholder="Handover Date"
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

        {/* --- 3. FEATURES & MEDIA --- */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
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
                    className="text-red-500 font-bold hover:text-red-700 ml-1"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Video className="text-gray-400" size={18} />
            </div>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
              placeholder="Promo Video URL"
              className="border rounded-lg pl-10 pr-3 py-2 w-full"
            />
          </div>

          {/* PHOTOS MANAGEMENT */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 text-center">
              Manage Photos
            </h4>

            {/* Display Mixed List (Existing + New) */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {/* Existing */}
              {existingPhotos.map((src, index) => (
                <div key={`exist-${index}`} className="relative group">
                  <img
                    src={src}
                    alt="Existing"
                    className="w-24 h-24 object-cover rounded-lg border border-blue-200"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] text-center py-0.5">
                    Existing
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {/* New */}
              {newPhotoPreviews.map((src, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={src}
                    alt="New"
                    className="w-24 h-24 object-cover rounded-lg border border-green-200"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-[10px] text-center py-0.5">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <label className="cursor-pointer flex flex-col items-center justify-center w-full py-4 border border-gray-300 rounded-lg hover:bg-white transition bg-white/50">
              <UploadCloud size={24} className="text-[#BA7F55] mb-1" />
              <span className="text-sm font-semibold text-gray-600">
                Add More Photos
              </span>
              <input
                type="file"
                onChange={handleAddNewPhoto}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* --- 4. UNITS SECTION --- */}
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
              key={index}
              className="border border-gray-200 p-6 rounded-xl space-y-4 relative bg-gray-50 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-[#0B253F] text-lg">
                  Unit Type #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeUnit(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <X size={16} /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    name="unit_type"
                    value={unit.unit_type}
                    onChange={(e) => handleUnitChange(index, e)}
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Total Sq.ft
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={unit.sqft}
                    onChange={(e) => handleUnitChange(index, e)}
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Price (AED)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={unit.price}
                    onChange={(e) => handleUnitChange(index, e)}
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                  Floor Plan Image
                </label>
                <div className="flex flex-col items-center gap-4">
                  {/* Preview Logic: Handle both URL strings and File Blobs */}
                  <div className="relative w-full h-48 border rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={unit.floor_plan_preview || PLACEHOLDER_IMAGE}
                      alt="Floor Plan"
                      className={`w-full h-full object-cover ${
                        !unit.floor_plan_preview ? "opacity-50" : ""
                      }`}
                    />
                  </div>
                  <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 w-full justify-center">
                    <ImageIcon size={18} />
                    {unit.floor_plan_img ? "Change Image" : "Upload Floor Plan"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUnitFloorPlanChange(index, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0B253F] text-white px-4 py-4 rounded-xl hover:bg-[#16385d] disabled:opacity-50 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? "Saving Changes..." : "Update Project"}
          </button>
        </div>

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

export default OffPlanEdit;
