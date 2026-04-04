import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: string;
  niche: string;
  about: string;
  imageUrl: string;
  displayOrder: number;
}

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  return (
    <div className="creator-card border-t border-neutral-200 pt-10 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Index + Avatar */}
      <div className="lg:col-span-1 flex flex-row lg:flex-col items-center lg:items-start gap-4">
        <span className="text-sm text-neutral-400">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="w-14 h-14 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
          {creator.imageUrl ? (
            <img
              src={creator.imageUrl}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Name + Handle */}
      <div className="lg:col-span-3">
        <h3 className="text-3xl tracking-tight font-light mb-1">
          {creator.name}
        </h3>
        <a
          href={`https://instagram.com/${creator.handle.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 text-sm tracking-wide hover:text-black transition-colors"
        >
          {creator.handle.startsWith("@") ? creator.handle : `@${creator.handle}`}
        </a>
      </div>

      {/* Followers + Niche */}
      <div className="lg:col-span-2">
        <div className="text-3xl font-light tracking-tighter mb-1">
          {creator.followers}
        </div>
        <div className="text-xs text-neutral-500 uppercase tracking-widest">
          Followers
        </div>
        {creator.niche && (
          <div className="mt-4 text-sm text-neutral-500 uppercase tracking-widest">
            {creator.niche}
          </div>
        )}
      </div>

      {/* About */}
      <div className="lg:col-span-6">
        <p className="text-lg text-neutral-600 leading-relaxed">
          {creator.about || "—"}
        </p>
      </div>
    </div>
  );
}

export function Creators() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/creators")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCreators(data);
      })
      .catch((err) => console.error("Failed to fetch creators", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || creators.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".creators-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".creator-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, creators]);

  // Don't render the section at all if there are no creators
  if (!loading && creators.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-40 px-8 bg-white text-black">
      <div className="max-w-[1800px] mx-auto">
        <div className="creators-title mb-32">
          <div className="text-sm text-neutral-500 uppercase tracking-widest mb-6">
            Our Network
          </div>
          <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tighter font-light leading-tight">
            Top Creators
          </h2>
        </div>

        <div className="space-y-0">
          {loading
            ? // Skeleton placeholders while loading
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border-t border-neutral-200 pt-10 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse"
                >
                  <div className="lg:col-span-1">
                    <div className="w-14 h-14 rounded-full bg-neutral-100" />
                  </div>
                  <div className="lg:col-span-3 space-y-3">
                    <div className="h-8 bg-neutral-100 rounded w-3/4" />
                    <div className="h-4 bg-neutral-100 rounded w-1/3" />
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                    <div className="h-8 bg-neutral-100 rounded w-1/2" />
                    <div className="h-4 bg-neutral-100 rounded w-2/3" />
                  </div>
                  <div className="lg:col-span-6 space-y-2">
                    <div className="h-4 bg-neutral-100 rounded" />
                    <div className="h-4 bg-neutral-100 rounded w-5/6" />
                  </div>
                </div>
              ))
            : creators.map((creator, index) => (
                <CreatorCard key={creator.id} creator={creator} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
