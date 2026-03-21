import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".capability-item");

      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const capabilities = [
    "Influencer Sourcing",
    "Campaign Strategy",
    "Content Creation",
    "Performance Marketing",
    "Brand Partnerships",
    "Social Media Management",
    "Analytics & Reporting",
    "Contract Negotiation",
    "Creative Direction",
    "Platform Optimization",
    "Audience Analysis",
    "ROI Tracking",
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-6 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-12 md:mb-20">
          <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tighter font-light leading-tight">
            Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-4 md:gap-y-8">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="capability-item text-lg md:text-xl text-neutral-400 hover:text-white transition-colors cursor-default py-3 border-b border-neutral-800 md:border-none md:py-0"
            >
              {capability}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
