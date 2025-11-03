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
      data.append("name", formData.name);
      data.append("work_experience", formData.work_experience);
      data.append("specialization", formData.specialization);
      data.append("broker_license_number", formData.broker_license_number);
      data.append("phone_number", formData.phone_number);
      data.append("email", formData.email);
      data.append("profile", formData.profile);
      data.append("about", formData.about);

      if (formData.img != null) {
        data.append("photo", formData.img);
      }

      fetch("/localhost:9000", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        credentials: "include",
        body: JSON.stringify(data),
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
          type="text"
          onChange={handleChange}
          name="name"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.work_experience}
          type="number"
          onChange={handleChange}
          name="work_experience"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.specialization}
          type="text"
          onChange={handleChange}
          name="specialization"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.broker_license_number}
          type="text"
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
              phone: "+" + value,
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
          onChange={handleChange}
          name="phone_number"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.email}
          type="text"
          onChange={handleChange}
          name="email"
          sx={{ mb: 2 }}
        />

        <TextField
          value={formData.profile}
          type="text"
          onChange={handleChange}
          name="profile"
          sx={{ mb: 2 }}
        />

        <Button type="submit">Upload</Button>
      </form>
    </div>
  );
}

export default AgentUpload;
