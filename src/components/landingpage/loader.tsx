// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="fixed z-[9999] inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
      <video
        src="/loadvide.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      ></video>
    </div>
  );
}
