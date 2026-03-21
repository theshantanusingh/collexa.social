import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Metrics() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const metrics = gsap.utils.toArray<HTMLElement>(".metric-item");

      metrics.forEach((metric) => {
        gsap.fromTo(
          metric,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: metric,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const metrics = [
    { value: "500+", label: "Active Creators" },
    { value: "₹25L+", label: "Campaign Value" },
    { value: "100+", label: "Brand Partnerships" },
    { value: "4.2X", label: "Avg ROI" },
  ];

  return (
    <section ref={sectionRef} className="py-40 px-8 bg-neutral-900">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-item">
              <div className="text-[clamp(2.5rem,6vw,6rem)] font-light mb-2 tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm text-neutral-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
