"use client";

/**
 * Hero background video.
 * - Never blocks first paint: mounts after window load + idle callback.
 * - Desktop, fine-pointer, motion-permitting contexts only.
 * - Mobile gets the static poster as a background image.
 * - Muted, looping, autoplaying, poster fallback; hides itself on error
 *   (so the hero degrades to the plain ground if no files are supplied).
 * - Treated mono + dimmed so the type stays sovereign.
 */
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  webm: string;
  mp4: string;
  poster: string;
}

export default function HeroVideo({ webm, mp4, poster }: Props) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"none" | "video" | "poster">("none");
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop) {
      setMode("poster");
      return;
    }
    if (reduced) {
      setMode("poster");
      return;
    }
    let cancelled = false;
    const start = () => {
      const idle =
        typeof window.requestIdleCallback === "function"
          ? (cb: () => void) => window.requestIdleCallback(cb)
          : (cb: () => void) => window.setTimeout(cb, 1200);
      idle(() => {
        if (!cancelled) setMode("video");
      });
    };
    if (document.readyState === "complete") start();
    else {
      window.addEventListener("load", start, { once: true });
    }
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, [reduced]);

  if (failed) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {mode === "poster" && (
        <div
          className="h-full w-full bg-cover bg-center opacity-[0.08] grayscale"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      {mode === "video" && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          onLoadedData={() => setVisible(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover grayscale transition-opacity duration-[1500ms] ease-out ${
            visible ? "opacity-[0.12]" : "opacity-0"
          }`}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
