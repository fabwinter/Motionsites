"use client";

import { motion } from "framer-motion";

type ShaderBackgroundProps = {
  className?: string;
};

export function ShaderBackground({ className = "" }: ShaderBackgroundProps) {
  return (
    <motion.div
      aria-hidden
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(126,231,255,0.18), transparent 28%), radial-gradient(circle at 80% 20%, rgba(255,138,122,0.16), transparent 26%), linear-gradient(135deg, rgba(6,12,28,0.4), rgba(15,21,48,0.1), rgba(126,231,255,0.1))",
        backgroundSize: "220% 220%"
      }}
    />
  );
}

