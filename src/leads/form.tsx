import { Button } from "@/components/ui/button";
import { TextField, Typography, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type FormProps = {
  formId: string; //Required
  propertyReference: string;
  name: string; //Required
  email: string; // Required
  phone: string; // Required
  nationality: string;
  budget: string;
  preferredSize: string;
  propertyType: string;
  furnishing: string;
  projectType: string;
  bedrooms: string;
  paymentMethod: string;
  buyerType: string;
  gender: string;
  preferredDeveloper: string;
  extraData: {
    [key: string]: string;
  };
};

type childProps = {
  propertyId: string;
  extraData: { [key: string]: string };
  formType: string;
};

function Form({ propertyId, extraData, formType = "default" }: childProps) {
  const [formData, setFormData] = React.useState<FormProps>({
    formId: "",
    propertyReference: "",
    name: "",
    email: "",
    phone: "",
    nationality: "",
    budget: "",
    preferredSize: "",
    propertyType: "",
    furnishing: "",
    projectType: "",
    bedrooms: "",
    paymentMethod: "",
    buyerType: "",
    gender: "",
    preferredDeveloper: "",
    extraData: {
      referalls_name: "",
      referalls_email: "",
      referalls_phone: "",
      referalls_interest: "",
    },
  });
  const access_token = "gUD5QIKlscK-vPRxPZfDBOfnGuSEyrZl";
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event: any) {
    const target = event && event.target ? event.target : {};
    const name = (target.name as string) || "";
    const value = target.value as string | undefined;

    setFormData((prevData) => ({
      ...prevData!,
      [name]: value ?? "",
    }));
  }

  function handleExtraDataChange(field: string, value: string) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      extraData: {
        ...prevFormData.extraData,
        [field]: value,
      },
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // const form_id = crypto.randomUUID();

    const dataForm = {
      formId: "4042ac1b-921f-4098-8bf4-01f2f24dc3fa",
      propertyReference: propertyId || "No property reference",
      name: formData?.name || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      extraData:
        extraData && Object.keys(extraData).length > 0
          ? extraData
          : formData.extraData,
    };

    console.log("Submitting form data:", dataForm);

    fetch("https://dataapi.pixxicrm.ae/pixxiapi/webhook/v1/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PIXXI-TOKEN": access_token,
      },
      // body: JSON.stringify(dataForm),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setOpenSnackBar(true);
        setErrorMessage("Form Submitted Successfully!");
        setFormData({
          formId: "",
          propertyReference: "",
          name: "",
          email: "",
          phone: "",
          nationality: "",
          budget: "",
          preferredSize: "",
          propertyType: "",
          furnishing: "",
          projectType: "",
          bedrooms: "",
          paymentMethod: "",
          buyerType: "",
          gender: "",
          preferredDeveloper: "",
          extraData: {
            referalls_name: "",
            referalls_email: "",
            referalls_phone: "",
            referalls_interest: "",
          },
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setOpenSnackBar(true);
        setErrorMessage("Failed to submit the form. Please try again!");
      });
  }

  const handleClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
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

  return (
    <div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={errorMessage.includes("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formType === "referral" && (
          <Typography fontFamily={"IT Medium"}>Your Information</Typography>
        )}
        <TextField
          fullWidth
          type="text"
          value={formData?.name || ""}
          onChange={handleChange}
          name="name"
          placeholder="Name"
          variant="outlined"
          required
          sx={{ mb: 2, mt: 2 }}
        />

        <TextField
          fullWidth
          type="text"
          value={formData?.email || ""}
          onChange={handleChange}
          name="email"
          placeholder="Email"
          variant="outlined"
          required
          sx={{ mb: 2 }}
        />

        <PhoneInput
          country={"ae"}
          value={formData?.phone || ""}
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

        <Select
          value={formData.propertyType || ""}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, propertyType: val }))
          }
        >
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Property Types</SelectLabel>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {formType === "referral" && (
          <div style={{ marginTop: "1.5rem" }}>
            <Typography
              style={{ marginBottom: "20px" }}
              fontFamily={"IT Medium"}
            >
              Referral Information
            </Typography>

            <TextField
              fullWidth
              type="text"
              label="Referral's Name"
              value={formData.extraData.referalls_name}
              onChange={(e) =>
                handleExtraDataChange("referalls_name", e.target.value)
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="email"
              label="Referral's Email"
              value={formData.extraData.referalls_email}
              onChange={(e) =>
                handleExtraDataChange("referalls_email", e.target.value)
              }
              sx={{ mb: 2 }}
            />

            <PhoneInput
              country={"us"}
              value={formData.extraData.referalls_phone}
              onChange={(value) =>
                handleExtraDataChange("referalls_phone", "+" + value)
              }
              inputStyle={{
                width: "100%",
                height: "40px",
                // border: "1px solid #ccc",
                // paddingLeft: "48px",
                // marginBottom: "16px",
              }}
              containerStyle={{ marginBottom: "16px" }}
            />

            <Select
              value={formData.extraData.referalls_interest || ""}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  extraData: {
                    ...prev.extraData,
                    referalls_interest: val,
                  },
                }))
              }
            >
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Referral’s Interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Interest</SelectLabel>
                  <SelectItem value="Buying a house">Buying a house</SelectItem>
                  <SelectItem value="Selling a house">
                    Selling a house
                  </SelectItem>
                  <SelectItem value="Renting a property">
                    Renting a property
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
          className="bg-[#BA7F55] w-full"
          type="submit"
        >
          Confirm
        </Button>

        {/* <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              onClick={() =>
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                })
              }
              className="bg-[#BA7F55] w-full"
              type="submit"
            >
              Submit
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                🎉 Thank You! Your Form Has Been Successfully Submitted
              </AlertDialogTitle>

              <AlertDialogDescription>
                We truly appreciate you taking the time to reach out to us. Your
                message has been received, and our team will get back to you as
                soon as possible. You’ll hear from us shortly — we’re excited to
                assist you!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Ok</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </form>
    </div>
  );
}

export default Form;
