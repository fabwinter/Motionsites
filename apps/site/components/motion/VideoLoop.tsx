"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type VideoLoopProps = {
  src?: string;
  poster: string;
  className?: string;
};

export function VideoLoop({ src, poster, className = "" }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!videoRef.current || reduceMotion || !src) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [reduceMotion, src]);

  useEffect(() => {
    if (!videoRef.current || reduceMotion || !src) {
      return;
    }

    if (active) {
      void videoRef.current.play().catch(() => undefined);
    } else {
      videoRef.current.pause();
    }
  }, [active, reduceMotion, src]);

  if (!src || reduceMotion) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={poster} alt="" fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

