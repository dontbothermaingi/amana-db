function PropertyMap({ position }: any) {
  if (!position) return null;

  const [lat, lng] = position
    .split(",")
    .map((coord: any) => parseFloat(coord.trim()));

  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`;

  return (
    <div className="relative w-full h-[300px] rounded-2xl overflow-hidden">
      <iframe
        src={mapUrl}
        height="300"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        className="w-full h-full rounded-2xl"
      ></iframe>
    </div>
  );
}
export default PropertyMap;
