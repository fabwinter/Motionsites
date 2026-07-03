import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let ready = false;

export function ensureGsap() {
  if (!ready && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({
      duration: 1,
      ease: "power3.out"
    });
    ready = true;
  }

  return { gsap, ScrollTrigger };
}

