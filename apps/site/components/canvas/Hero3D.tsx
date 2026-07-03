"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useWebGLSupport } from "@/lib/useWebGLSupport";

const Scene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="panel-card flex h-full min-h-[420px] items-center justify-center rounded-[2rem]">
      <span className="eyebrow">Loading WebGL</span>
    </div>
  )
});

type Hero3DProps = {
  poster: string;
};

export function Hero3D({ poster }: Hero3DProps) {
  const reduceMotion = useReducedMotion();
  const webglSupported = useWebGLSupport();

  // Show poster immediately during SSR, while the WebGL check runs (null),
  // when the user prefers reduced motion, or when WebGL is unavailable.
  if (reduceMotion || webglSupported === false) {
    return (
      <div className="panel-card relative min-h-[420px] overflow-hidden rounded-[2rem]">
        <Image src={poster} alt="" fill className="object-cover" priority />
      </div>
    );
  }

  // While the check is still running (null) show the poster so there is no
  // flash of the empty loading state on capable devices.
  if (webglSupported === null) {
    return (
      <div className="panel-card relative min-h-[420px] overflow-hidden rounded-[2rem]">
        <Image src={poster} alt="" fill className="object-cover" priority />
      </div>
    );
  }

  return (
    <div className="panel-card relative min-h-[420px] overflow-hidden rounded-[2rem]">
      <Scene />
    </div>
  );
}

