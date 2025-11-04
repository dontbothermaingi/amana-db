import { TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Button } from "../ui/button";

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

  function handleChange(e: any) {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleFileChange(e: any) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: e.target.files[0],
    }));
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

      if (formData.photo != null) {
        data.append("photo", formData.photo);
      }

      fetch("https://db-amana.onrender.com/properties", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Upload successfull", data);
        });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Typography
          fontFamily={"IT Medium"}
          fontSize={{ lg: "25px" }}
          textAlign={"center"}
          mb={2}
        >
          Upload New Property
        </Typography>
        <div className=" border border-[gray] mb-2 py-2 px-2">
          <input type="file" name="photo" onChange={handleFileChange} />
        </div>

        <TextField
          value={formData.price}
          type="number"
          label="Price"
          variant="outlined"
          onChange={handleChange}
          name="price"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.property_type}
          type="text"
          label="Property Type"
          variant="outlined"
          onChange={handleChange}
          name="property_type"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.beds}
          label="Beds"
          variant="outlined"
          type="number"
          onChange={handleChange}
          name="beds"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.agent_Id}
          label="Agent Id"
          variant="outlined"
          type="number"
          onChange={handleChange}
          name="agent_Id"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.baths}
          type="number"
          label="Baths"
          variant="outlined"
          onChange={handleChange}
          name="baths"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.sqft}
          type="number"
          label="Sqft"
          variant="outlined"
          onChange={handleChange}
          name="sqft"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.community}
          type="text"
          label="Community"
          variant="outlined"
          onChange={handleChange}
          name="community"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.city}
          type="text"
          label="City"
          variant="outlined"
          onChange={handleChange}
          name="city"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.country}
          type="text"
          label="Country"
          variant="outlined"
          onChange={handleChange}
          name="country"
          sx={{ mb: 2 }}
        />

        <Button type="submit">Upload</Button>
      </form>
    </div>
  );
}

export default AgentSoldProperties;
