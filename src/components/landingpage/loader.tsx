// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="fixed z-[9999] inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
      <video
        src="/loader.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover zoom-animation"
      ></video>
      <style>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          70% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.2);
          }
        }

        .zoom-animation {
          animation: zoomIn 7s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
