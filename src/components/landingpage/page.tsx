import { Typography } from "@mui/material";

function Page() {
  return (
    <div className="relative h-screen bg-[url(/la.jpg)] bg-cover bg-center">
      <div className="absolute bg-gradient-to-b from-black/30 to-black/30 h-full w-full" />

      <div className="h-screen relative mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-sm lg:max-w-4xl">
          <Typography
            fontFamily={"IT Bold"}
            color="white"
            fontSize={{ lg: "70px", xs: "32px" }}
          >
            Open Doors, Open Arms
          </Typography>

          <Typography
            color="white"
            fontFamily={"IT Regular"}
            fontSize={{ lg: "18px", xs: "15px" }}
            textAlign={"center"}
          >
            We listen to you so we understand your needs. Only then can we be
            your knowledgeable guide to add value in your search for property in
            the UAE of endless possibilities, AMANA opens doors to your perfect
            home. More than just properties, we offer a vision of tomorrow in
            UAE.
          </Typography>
          {/* <Button className="mt-6">Explore Properties</Button> */}
        </div>
      </div>
    </div>
  );
}

export default Page;
