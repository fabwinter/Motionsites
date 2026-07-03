"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

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

  if (reduceMotion) {
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

