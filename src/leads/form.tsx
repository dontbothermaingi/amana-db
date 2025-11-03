import { Button } from "@/components/ui/button";
import {
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import React from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      formId: "32612aca-087c-4b4c-b754-9cd7d8d83fd0",
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
      });
  }

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

        <FormControl fullWidth>
          <InputLabel id="property-type-label">Property Type</InputLabel>
          <Select
            labelId="property-type-label"
            name="propertyType"
            value={formData?.propertyType || ""}
            label="Property Type"
            onChange={handleChange}
            displayEmpty
            sx={{ mb: 2 }}
          >
            {PROPERTY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="interest-label">Referral’s Interest</InputLabel>
              <Select
                labelId="interest-label"
                label="Referral’s Interest"
                value={formData.extraData.referalls_interest}
                onChange={(e) =>
                  handleExtraDataChange("referalls_interest", e.target.value)
                }
              >
                <MenuItem value="Buying a house">Buying a house</MenuItem>
                <MenuItem value="Selling a house">Selling a house</MenuItem>
                <MenuItem value="Renting a property">
                  Renting a property
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-[#BA7F55] w-full" type="submit">
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
        </AlertDialog>
      </form>
    </div>
  );
}

export default Form;
