import { TextField, Typography, Box } from "@mui/material";
import { useState } from "react";
import { Button } from "../ui/button";
import { nanoid } from "nanoid";

function AgentSoldProperties() {
  const [formData, setFormData] = useState({
    photo: null,
    price: "",
    property_type: "",
    beds: "",
    baths: "",
    sqft: "",
    community: "",
    city: "",
    country: "",
    agent_Id: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("price", formData.price);
      data.append("property_type", formData.property_type);
      data.append("beds", formData.beds);
      data.append("baths", formData.baths);
      data.append("sqft", formData.sqft);
      data.append("agent_id", formData.agent_Id);
      data.append("city", formData.city);
      data.append("community", formData.community);
      data.append("country", formData.country);
      data.append("property_Id", nanoid());

      if (formData.photo != null) {
        data.append("photo", formData.photo);
      }

      fetch("https://db-amana.onrender.com/properties", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Upload successful", data);
        });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    }
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
      <Typography
        fontFamily="DM Medium"
        fontSize={{ xs: 24, lg: 28 }}
        color="#0B253F"
        mb={3}
        className="text-center"
      >
        Upload New Property
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Image Upload with Preview */}
        <Box className="flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl shadow-md border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
              No Photo
            </div>
          )}

          <label
            htmlFor="photo"
            className="cursor-pointer text-sm text-[#BA7F55] hover:text-[#a06d49] font-semibold"
          >
            Upload Property Photo
          </label>
          <input
            id="photo"
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </Box>

        {/* Property Info */}
        <TextField
          value={formData.price}
          type="number"
          label="Price (AED)"
          variant="outlined"
          onChange={handleChange}
          name="price"
          fullWidth
        />

        <TextField
          value={formData.property_type}
          type="text"
          label="Property Type (e.g. Apartment, Villa)"
          variant="outlined"
          onChange={handleChange}
          name="property_type"
          fullWidth
        />

        <Box className="grid grid-cols-2 gap-4">
          <TextField
            value={formData.beds}
            label="Beds"
            variant="outlined"
            type="number"
            onChange={handleChange}
            name="beds"
            fullWidth
          />

          <TextField
            value={formData.baths}
            type="number"
            label="Baths"
            variant="outlined"
            onChange={handleChange}
            name="baths"
            fullWidth
          />
        </Box>

        <TextField
          value={formData.sqft}
          type="number"
          label="Square Feet"
          variant="outlined"
          onChange={handleChange}
          name="sqft"
          fullWidth
        />

        <TextField
          value={formData.agent_Id}
          label="Agent ID"
          variant="outlined"
          type="number"
          onChange={handleChange}
          name="agent_Id"
          fullWidth
        />

        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            value={formData.community}
            type="text"
            label="Community"
            variant="outlined"
            onChange={handleChange}
            name="community"
            fullWidth
          />

          <TextField
            value={formData.city}
            type="text"
            label="City"
            variant="outlined"
            onChange={handleChange}
            name="city"
            fullWidth
          />
        </Box>

        <TextField
          value={formData.country}
          type="text"
          label="Country"
          variant="outlined"
          onChange={handleChange}
          name="country"
          fullWidth
        />

        <Button
          type="submit"
          className="bg-[#BA7F55] hover:bg-[#a06d49] text-white py-2 rounded-lg transition"
        >
          Upload Property
        </Button>
      </form>
    </div>
  );
}

export default AgentSoldProperties;
