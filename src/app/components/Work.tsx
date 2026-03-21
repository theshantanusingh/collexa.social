import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".work-item");

      items.forEach((item) => {
        const textContent = item.querySelector(".work-text");
        const imageWrapper = item.querySelector(".work-image-wrapper");
        const image = imageWrapper?.querySelector("img");

        // Use a timeline for staggered, complex staggered reveals
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%", // Trigger slightly earlier for a much smoother lead-in
          },
        });

        // 1. Text fades and slides up smoothly
        if (textContent) {
          tl.fromTo(
            textContent,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
          );
        }

        // 2. Image wrapper reveals with a sleek cinematic clip-path wipe from the bottom
        if (imageWrapper) {
          tl.fromTo(
            imageWrapper,
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.4,
              ease: "power4.inOut",
            },
            "-=0.8" // Start revealing the image while the text is still finishing
          );
        }

        // 3. The actual image subtly scales down (parallax effect) inside the wrapper
        if (image) {
          tl.fromTo(
            image,
            { scale: 1.25 },
            { scale: 1, duration: 1.8, ease: "power3.out" },
            "-=1.4" // Sync the scale perfectly with the clip-path unmasking
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      client: "Tech Startup",
      campaign: "Product Launch",
      reach: "5M+",
      image:
        "https://images.unsplash.com/photo-1647892842753-01ee3cafd42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsYWNrJTIwd2hpdGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc0MDM5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      client: "Fashion Brand",
      campaign: "Seasonal Collection",
      reach: "8M+",
      image:
        "https://images.pexels.com/photos/6894282/pexels-photo-6894282.jpeg",
    },
  ];

  return (
    <section id="work" ref={sectionRef} className="py-40 px-8 bg-neutral-900">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-32">
          <h2 className="text-[clamp(2rem,6vw,5rem)] tracking-tighter font-light leading-tight">
            Selected Work
          </h2>
        </div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div
              key={index}
              className="work-item grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Added work-text class and transform-gpu for hardware acceleration */}
              <div className="work-text lg:col-span-5 transform-gpu opacity-0">
                <div className="text-sm text-neutral-500 mb-4">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-4xl mb-4 tracking-tight">
                  {project.client}
                </h3>
                <p className="text-xl text-neutral-400 mb-6">
                  {project.campaign}
                </p>
                <div className="text-3xl font-light">{project.reach}</div>
                <div className="text-sm text-neutral-500">Total Reach</div>
              </div>

              {/* Added work-image-wrapper class and clip-path hiding by default */}
              <div 
                className="work-image-wrapper lg:col-span-7 h-[500px] overflow-hidden rounded-sm transform-gpu"
                style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
              >
                <img
                  src={project.image}
                  alt={project.client}
                  loading="lazy"
                  /* will-change tells the browser to assign a dedicated rendering layer before the animation plays */
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 [will-change:transform]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
