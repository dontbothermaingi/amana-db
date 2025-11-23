import { nanoid } from "nanoid";
import React, { useState, type FormEvent } from "react";

// Define the shape for a single Offplan Unit
interface OffplanUnitData {
  unit_type: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  unit_Id: string;
  starting_price: string;
}

// Define the shape for the main form state
interface OffplanFormData {
  project_name: string;
  developer: string;
  location: string;
  starting_price: string;
  handover: string;
  offplan_Id: string;
  payment_plan: string;
  location_map: string;
  description: string;
  status: string;
}

const API_URL = "https://db-amana.onrender.com/offplans";

const OffplanUpload: React.FC = () => {
  const [formData, setFormData] = useState<OffplanFormData>({
    project_name: "",
    developer: "",
    location: "",
    starting_price: "",
    handover: "",
    offplan_Id: nanoid(6),
    payment_plan: "",
    location_map: "",
    description: "",
    status: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState<string>("");

  const [units, setUnits] = useState<OffplanUnitData[]>([
    {
      unit_type: "Apartment",
      price: "",
      beds: "",
      baths: "",
      sqft: "",
      unit_Id: "",
      starting_price: "",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotos([...photos, file]);
      setPhotoPreviews([...photoPreviews, URL.createObjectURL(file)]);
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

  const handleAmenityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmenityInput(e.target.value);
  };

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenitiesList.includes(trimmed)) {
      setAmenitiesList([...amenitiesList, trimmed]);
    }
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
    newUnits[index] = { ...newUnits[index], [name]: value };
    setUnits(newUnits);
  };

  const addUnit = () => {
    setUnits([
      ...units,
      {
        unit_type: "Apartment",
        price: "",
        beds: "",
        baths: "",
        sqft: "",
        unit_Id: "",
        starting_price: "",
      },
    ]);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const data = new FormData();

    data.append("project_name", formData.project_name);
    data.append("developer", formData.developer);
    data.append("location", formData.location);
    data.append("starting_price", formData.starting_price);
    data.append("handover", formData.handover);
    data.append("offplan_Id", formData.offplan_Id);
    data.append("payment_plan", formData.payment_plan);
    data.append("location_map", formData.location_map);
    data.append("description", formData.description);
    data.append("status", formData.status);
    photos.forEach((photo) => data.append("photos", photo));
    data.append("units", JSON.stringify(units));
    data.append("amenities", JSON.stringify(amenitiesList));

    console.log(
      "Submitting Offplan Data:",
      formData,
      units,
      amenitiesList,
      photos
    );

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
      <h2 className="text-2xl font-bold mb-6">🏠 Post New Offplan Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Details */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              placeholder="Project Name"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleInputChange}
              placeholder="Developer"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              name="offplan_Id"
              value={formData.offplan_Id}
              onChange={handleInputChange}
              placeholder="OFFPLAN ID"
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full"
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
              className="border rounded-lg px-3 py-2 w-full md:col-span-2"
              rows={4}
              required
            />
          </div>
        </section>

        {/* Pricing & Location */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Pricing & Location</h3>
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
              placeholder="Starting Price"
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

        {/* Amenities & Photos */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Features & Media</h3>
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <input
              type="file"
              onChange={handleAddPhoto}
              accept="image/*"
              className="mb-2"
            />
            <div className="flex flex-wrap gap-4 mt-2">
              {photoPreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Units */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Unit Types</h3>
          {units.map((unit, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg space-y-2 relative bg-gray-50"
            >
              <h4 className="font-semibold">Unit #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  name="unit_Id"
                  value={unit.unit_Id}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="Unit ID"
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="unit_type"
                  value={unit.unit_type}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="Type"
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  name="beds"
                  value={unit.beds}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="Beds"
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  name="baths"
                  value={unit.baths}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="Baths"
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  name="sqft"
                  value={unit.sqft}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="SQFT"
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={unit.price}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="Price"
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  name="starting_price"
                  value={unit.starting_price}
                  onChange={(e) => handleUnitChange(index, e)}
                  placeholder="Starting Price (Optional)"
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              {units.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUnit(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addUnit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Unit Type
          </button>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
