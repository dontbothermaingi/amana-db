import { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";
import { Image } from "lucide-react";

const ImageGalleryPreview = ({ images = [] }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) return null;

  const mainImage = images[0];
  const sideImages = images.slice(1, 3);
  const remainingCount = images.length - 3;

  const openPreview = (index: any) => {
    setCurrentIndex(index);
    setPreviewOpen(true);
  };

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* --- Main Layout --- */}
      <div className="flex gap-2 w-full h-64">
        {/* Left large image */}
        <div
          className="flex-1 relative lg:h-126 cursor-pointer"
          onClick={() => openPreview(0)}
        >
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-full lg:h-126 object-cover rounded-2xl shadow"
          />

          {/* Overlay for remaining count */}
          {remainingCount > 0 && (
            <div
              onClick={() => openPreview(3)}
              className="absolute bottom-3 right-3 flex items-center justify-center gap-1.5 
               bg-white/20 backdrop-blur-md border border-white/30 text-white 
               font-medium text-sm px-3 py-1.5 rounded-full cursor-pointer 
               hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-md"
            >
              <Image className="h-4 w-4 lg:h-5 lg:w-5 opacity-90" />
              <span>+{remainingCount}</span>
            </div>
          )}
        </div>

        {/* Right stacked images */}
        <div className="flex flex-col gap-2 w-1/3 relative">
          {sideImages.map((img, index) => (
            <div
              key={index}
              className="relative cursor-pointer"
              onClick={() => openPreview(index + 1)}
            >
              <img
                src={img || img}
                alt={`Preview ${index}`}
                className="w-full lg:h-62 h-31 object-cover rounded-2xl shadow"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Full Image Preview Dialog --- */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullScreen
        PaperProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
      >
        <div className="flex flex-col items-center justify-center h-full relative">
          {/* Close button */}
          <IconButton
            onClick={() => setPreviewOpen(false)}
            className="!absolute top-4 right-4 text-white"
          >
            <Close className="text-white" fontSize="large" />
          </IconButton>

          {/* Image navigation */}
          <IconButton
            onClick={prevImage}
            className="!absolute left-6 text-white hover:scale-110 transition-transform"
          >
            <ArrowBack fontSize="large" className="text-white" />
          </IconButton>

          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-lg transition-transform"
          />

          <IconButton
            onClick={nextImage}
            className="!absolute right-6 text-white hover:scale-110 transition-transform"
          >
            <ArrowForward fontSize="large" className="text-white" />
          </IconButton>

          {/* Counter */}
          <div className="absolute bottom-6 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ImageGalleryPreview;
