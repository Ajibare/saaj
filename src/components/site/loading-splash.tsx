"use client";

import { useEffect, useState } from "react";

export function LoadingSplash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const doneTimer = setTimeout(() => setVisible(false), 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo asset needs <img> */}
      <img
        src="/images/logo-mark.svg"
        alt=""
        className="h-100 w-100 animate-pulse object-contain"
      />
      <p className="mt-6 text-xl font-extrabold tracking-[0.2em] text-white">SAAJ</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-300">
        Partners &amp; Consult
      </p>
      <div className="mt-8 h-1 w-44 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-accent-500 animate-splashbar" />
      </div>
    </div>
  );
}
