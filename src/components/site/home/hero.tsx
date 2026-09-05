"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppImage } from "@/components/site/app-image";
import type { HeroSettings } from "@/lib/types";

export function Hero({ hero }: { hero: HeroSettings }) {
  const hasVideos = (hero.videos ?? []).length > 0;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {hasVideos ? (
        <VideoBackground
          videos={hero.videos}
          active={active}
          onActiveChange={setActive}
          onPlayingChange={setPlaying}
        />
      ) : (
        <AppImage
          src={hero.image}
          alt=""
          className="absolute inset-0 h-full w-full opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/10" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="container-site relative flex min-h-[560px] flex-col justify-center py-24 lg:min-h-[620px]">
        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
          Design • Construction • Consultancy
        </span>
        <h1 className="max-w-3xl animate-fade-up text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/90">
          {hero.subtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-4 animate-fade-up">
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-colors hover:bg-accent-600"
          >
            {hero.primaryCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            {hero.secondaryCtaLabel}
          </Link>
        </div>
      </div>

      {hasVideos ? (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
          {hero.videos.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show clip ${index + 1}`}
              className={
                index === active
                  ? "h-2 w-6 rounded-full bg-accent-400 transition-all"
                  : "h-2 w-2 rounded-full bg-white/50 transition-all hover:bg-white"
              }
            />
          ))}
        </div>
      ) : null}

      {hasVideos && playing ? (
        <button
          type="button"
          onClick={() => setActive((a) => (a + 1) % hero.videos.length)}
          className="absolute bottom-6 left-6 z-10 hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10 sm:inline-flex"
        >
          Next clip
        </button>
      ) : null}
    </section>
  );
}

function VideoBackground({
  videos,
  active,
  onActiveChange,
  onPlayingChange,
}: {
  videos: { url: string; poster?: string }[];
  active: number;
  onActiveChange: (index: number) => void;
  onPlayingChange: (playing: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setTimeout(() => {
      onActiveChange((active + 1) % videos.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [active, videos.length, onActiveChange]);

  return (
    <video
      key={videos[active]?.url ?? active}
      ref={videoRef}
      src={videos[active]?.url}
      poster={videos[active]?.poster ?? undefined}
      className="absolute inset-0 h-full w-full object-cover opacity-70"
      autoPlay
      muted
      loop
      playsInline
      onPlaying={() => onPlayingChange(true)}
      onEnded={() => onPlayingChange(false)}
    />
  );
}
