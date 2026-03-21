import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>(".process-step");

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 75%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      phase: "Discovery",
      description:
        "Deep dive into your brand DNA, target audience, and campaign objectives to establish a solid foundation.",
    },
    {
      phase: "Research",
      description:
        "Comprehensive market and creator analysis using proprietary tools to identify optimal partnerships.",
    },
    {
      phase: "Execution",
      description:
        "Seamless campaign deployment with continuous oversight, ensuring flawless execution across all touchpoints.",
    },
    {
      phase: "Optimization",
      description:
        "Real-time performance monitoring and iterative refinement to maximize engagement and conversion metrics.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-40 px-8 bg-white text-black">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-32">
          <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tighter font-light leading-tight">
            Process
          </h2>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className="process-step grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-neutral-200 pt-12"
            >
              <div className="lg:col-span-3">
                <div className="text-sm text-neutral-500 mb-2">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-4xl tracking-tight">{step.phase}</h3>
              </div>
              <div className="lg:col-span-9">
                <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
