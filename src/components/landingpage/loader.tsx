// src/components/Loader.jsx

export default function Loader() {
  return (
    <div className="fixed z-[9999] inset-0 flex flex-col items-center justify-center bg-slate-900 text-white transition-opacity duration-700">
      {/* <h1 className="text-4xl font-bold tracking-widest mb-4 animate-pulse">
        AMANA HOMES
      </h1>
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-400">Loading...</p> */}
      <video
        src="/loader.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      ></video>
    </div>
  );
}
