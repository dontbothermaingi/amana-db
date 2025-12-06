// components/SmoothScroll.tsx
import { ReactLenis } from "lenis/react";

function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    // "root" tells Lenis to take over the main window scroll
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;
