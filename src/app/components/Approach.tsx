import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Approach() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".approach-text",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="py-40 px-8 bg-white text-black"
    >
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="approach-text">
            <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tighter font-light leading-tight mb-12">
              Our Approach
            </h2>
            <div className="space-y-8 text-lg text-neutral-700 leading-relaxed">
              <p>
                We believe in quality over quantity. Every partnership is
                carefully curated to ensure authentic alignment between brand
                values and creator ethos.
              </p>
              <p>
                Our methodology combines data intelligence with human intuition,
                resulting in campaigns that feel organic rather than
                transactional.
              </p>
              <p>
                From micro-influencers to industry leaders, we navigate the
                entire creator ecosystem to find the perfect match for your
                objectives.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-12">
              <div>
                <div className="text-5xl font-light mb-2">500+</div>
                <div className="text-sm text-neutral-500">
                  Creator Partnerships
                </div>
              </div>
              <div>
                <div className="text-5xl font-light mb-2">₹25L+</div>
                <div className="text-sm text-neutral-500">Campaign Value</div>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="h-[600px] overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1666618207644-4de0226a3f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbW9kZXJuJTIwd29ya3NwYWNlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3NDAzOTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Modern workspace"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
