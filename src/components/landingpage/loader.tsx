export default function Loader({ onVideoStart }: any) {
  return (
    <div className="fixed z-[9999] inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
      <video
        src="/loadvide.mp4"
        autoPlay
        muted
        playsInline
        // THIS IS KEY: Trigger the timer only when video actually begins playing
        onPlaying={onVideoStart}
        className="absolute w-full h-full object-cover"
      ></video>
    </div>
  );
}
