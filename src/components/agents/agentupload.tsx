import { TextField, Typography, Box, Divider } from "@mui/material";
import { useState } from "react";
import { Button } from "../ui/button";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { nanoid } from "nanoid";

function AgentUpload() {
  const [formData, setFormData] = useState({
    name: "",
    img: null,
    work_experience: "",
    specialization: "",
    broker_license_number: "",
    phone_number: "",
    email: "",
    profile: "",
    about: "",
    languages: [],
  });

  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name === "languages") {
      const languagesArray = value
        .split(",")
        .map((lang: any) => lang.trim())
        .filter((lang: any) => lang);

      setFormData((prev) => ({
        ...prev,
        languages: languagesArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleFileChange(e: any) {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      img: file,
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
      data.append("name", formData.name);
      data.append("work_experience", formData.work_experience);
      data.append("specialization", formData.specialization);
      data.append("broker_license_number", formData.broker_license_number);
      data.append("phone_number", formData.phone_number);
      data.append("email", formData.email);
      data.append("profile", formData.profile);
      data.append("about", formData.about);
      data.append("languages", JSON.stringify(formData.languages));
      data.append("agent_Id", nanoid());

      if (formData.img != null) {
        data.append("img", formData.img);
      }

      fetch("https://db-amana.onrender.com/agents", {
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
        Add New Agent
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Image Upload Section */}
        <Box className="flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full shadow-md border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full border border-dashed border-gray-300 text-gray-500 text-sm">
              No Image
            </div>
          )}

          <label
            htmlFor="img"
            className="cursor-pointer text-sm text-[#BA7F55] hover:text-[#a06d49] font-semibold"
          >
            Upload Agent Photo
          </label>
          <input
            id="img"
            type="file"
            name="img"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </Box>

        <Divider />

        {/* Agent Details */}
        <TextField
          value={formData.name}
          label="Agent Name"
          variant="outlined"
          type="text"
          onChange={handleChange}
          name="name"
          fullWidth
        />

        <TextField
          value={formData.work_experience}
          type="number"
          label="Agent Work Experience (years)"
          variant="outlined"
          onChange={handleChange}
          name="work_experience"
          fullWidth
        />

        <TextField
          value={formData.specialization}
          type="text"
          label="Agent Specialization"
          variant="outlined"
          onChange={handleChange}
          name="specialization"
          fullWidth
        />

        <TextField
          value={formData.broker_license_number}
          type="text"
          label="Broker License Number"
          variant="outlined"
          onChange={handleChange}
          name="broker_license_number"
          fullWidth
        />

        {/* Phone Input */}
        <Box>
          <Typography className="text-sm mb-1 text-gray-600">
            Agent Phone Number
          </Typography>
          <PhoneInput
            country={"ae"}
            value={formData?.phone_number || ""}
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                phone_number: "+" + value,
              }))
            }
            inputStyle={{
              width: "100%",
              height: "45px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              paddingLeft: "48px",
            }}
          />
        </Box>

        <TextField
          value={formData.email}
          type="email"
          label="Agent Email"
          variant="outlined"
          onChange={handleChange}
          name="email"
          fullWidth
        />

        <TextField
          value={formData.profile}
          type="text"
          label="Agent Profile (e.g. Senior Consultant)"
          variant="outlined"
          onChange={handleChange}
          name="profile"
          fullWidth
        />

        <TextField
          value={formData.about}
          type="text"
          label="Agent Description"
          variant="outlined"
          onChange={handleChange}
          name="about"
          fullWidth
          multiline
          minRows={4}
          maxRows={20}
        />

        <TextField
          label="Languages (comma separated)"
          name="languages"
          variant="outlined"
          type="text"
          value={formData.languages.join(", ")}
          onChange={handleChange}
          fullWidth
        />

        <Button
          type="submit"
          className="bg-[#BA7F55] hover:bg-[#a06d49] text-white py-2 rounded-lg transition"
        >
          Upload Agent
        </Button>
      </form>
    </div>
  );
}

export default AgentUpload;
