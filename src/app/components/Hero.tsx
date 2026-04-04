import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current?.querySelectorAll(".line") || [],
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.5,
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.2 }
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.8 }
      );

      gsap.to(imageRef.current, {
        y: -150,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-8 pt-48 pb-32">
        <div ref={titleRef} className="mb-8 overflow-hidden">
          <div className="line text-[clamp(3rem,10vw,12rem)] leading-[0.9] tracking-tighter font-light">
            Connecting Brands
          </div>
          <div className="line text-[clamp(3rem,10vw,12rem)] leading-[0.9] tracking-tighter font-light">
            With Collexa
          </div>
        </div>

        <div
          ref={subtitleRef}
          className="max-w-xl text-lg text-neutral-400 leading-relaxed mb-20"
        >
          We architect authentic partnerships between brands and creators,
          delivering campaigns that resonate and convert.
        </div>

        <div
          ref={imageRef}
          className="relative h-[60vh] rounded-sm overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Professional collaboration"
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </div>

      <div className="absolute bottom-12 left-8 text-sm tracking-wide text-neutral-500">
        SCROLL TO EXPLORE
      </div>
    </section>
  );
}

