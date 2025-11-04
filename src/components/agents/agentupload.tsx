import { TextField } from "@mui/material";
import { useState } from "react";
import { Button } from "../ui/button";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

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

  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name === "languages") {
      const languagesArray = value
        .split(",") // split on commas
        .map((lang: any) => lang.trim()) // remove spaces
        .filter((lang: any) => lang); // remove empty strings

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      img: e.target.files[0],
    }));
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

      if (formData.img != null) {
        data.append("img", formData.img);
      }

      console.log("DATA TO BACK", data);

      fetch("https://db-amana.onrender.com/agents", {
        method: "POST",
        body: data, // just pass FormData directly
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
      <form onSubmit={handleSubmit}>
        <input type="file" name="img" onChange={handleFileChange} />

        <TextField
          value={formData.name}
          label="Agent Name"
          variant="outlined"
          type="text"
          onChange={handleChange}
          name="name"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.work_experience}
          type="number"
          label="Agent Work Experience"
          variant="outlined"
          onChange={handleChange}
          name="work_experience"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.specialization}
          type="text"
          label="Agent Specialization"
          variant="outlined"
          onChange={handleChange}
          name="specialization"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.broker_license_number}
          type="text"
          label="Agent Broker Lisence Number"
          variant="outlined"
          onChange={handleChange}
          name="broker_license_number"
          sx={{ mb: 2 }}
        />

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
            height: "40px",
            // borderRadius: "8px",
            border: "1px solid #ccc",
            paddingLeft: "48px",
          }}
        />

        <TextField
          value={formData.about}
          type="text"
          label="Agent Description"
          variant="outlined"
          onChange={handleChange}
          name="about"
          sx={{ mb: 2 }}
          multiline
          minRows={4}
          maxRows={20}
        />

        <TextField
          value={formData.email}
          type="text"
          label="Agent Email"
          variant="outlined"
          onChange={handleChange}
          name="email"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.profile}
          type="text"
          label="Agent Profile"
          variant="outlined"
          onChange={handleChange}
          name="profile"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Languages"
          name="languages"
          variant="outlined"
          type="text"
          value={formData.languages.join(", ")}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Button type="submit">Upload</Button>
      </form>
    </div>
  );
}

export default AgentUpload;
