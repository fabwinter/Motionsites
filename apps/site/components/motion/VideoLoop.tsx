"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type VideoLoopProps = {
  src?: string;
  webmSrc?: string;
  poster: string;
  className?: string;
};

export function VideoLoop({ src, webmSrc, poster, className = "" }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();
  const hasVideo = !!(src ?? webmSrc);

  useEffect(() => {
    if (!videoRef.current || reduceMotion || !hasVideo) {
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
  }, [reduceMotion, hasVideo]);

  useEffect(() => {
    if (!videoRef.current || reduceMotion || !hasVideo) {
      return;
    }

    if (active) {
      void videoRef.current.play().catch(() => undefined);
    } else {
      videoRef.current.pause();
    }
  }, [active, reduceMotion, hasVideo]);

  if (!hasVideo || reduceMotion) {
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
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {src && <source src={src} type="video/mp4" />}
      </video>
    </div>
  );
}

