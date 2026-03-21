import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const services = gsap.utils.toArray<HTMLElement>(".service-item");

      services.forEach((service) => {
        gsap.fromTo(
          service,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: service,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      number: "01",
      title: "Strategy & Positioning",
      description:
        "Data-driven influencer identification and campaign architecture tailored to your brand objectives.",
    },
    {
      number: "02",
      title: "Partnership Management",
      description:
        "End-to-end relationship orchestration from vetting to contract negotiation and ongoing coordination.",
    },
    {
      number: "03",
      title: "Content Production",
      description:
        "Creative direction and production oversight ensuring brand consistency and authentic storytelling.",
    },
    {
      number: "04",
      title: "Performance Analytics",
      description:
        "Comprehensive tracking and reporting with actionable insights to optimize campaign performance.",
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-40 px-8 bg-[#0a0a0a]"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-32">
          <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tighter font-light leading-tight">
            Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {services.map((service) => (
            <div
              key={service.number}
              className="service-item border-t border-neutral-800 pt-8"
            >
              <div className="text-sm text-neutral-500 mb-6">
                {service.number}
              </div>
              <h3 className="text-3xl mb-6 tracking-tight">{service.title}</h3>
              <p className="text-neutral-400 leading-relaxed max-w-md">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
