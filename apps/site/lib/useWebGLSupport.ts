"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when WebGL2/WebGL1 is available, `false` when not,
 * and `null` while the check is still running (SSR / first paint).
 *
 * On iPad Safari the check fails early rather than triggering an
 * out-of-memory crash mid-render.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");

    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);

    const ok = gl !== null;

    if (ok) {
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    }

    setSupported(ok);
  }, []);

  return supported;
}
