import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-title",
        { y: 100, opacity: 0 },
        {
          y: 0,
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
        ".contact-info",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen py-40 px-8 bg-white text-black flex items-center"
    >
      <div className="max-w-[1800px] mx-auto w-full">
        <div className="contact-title mb-20">
          <h2 className="text-[clamp(2.5rem,8vw,8rem)] tracking-tighter font-light leading-[0.9]">
            Let's Talk
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="contact-info mb-12">
              <div className="text-sm text-neutral-500 mb-2">Email</div>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:business@collexa.social"
                  className="text-3xl hover:opacity-60 transition-opacity"
                >
                  business@collexa.social
                </a>
                <a
                  href="mailto:contact@collexa.social"
                  className="text-3xl hover:opacity-60 transition-opacity"
                >
                  contact@collexa.social
                </a>
              </div>
            </div>

            <div className="contact-info mb-12">
              <div className="text-sm text-neutral-500 mb-2">Phone</div>
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+918630616359"
                  className="text-3xl hover:opacity-60 transition-opacity"
                >
                  +91 86306 16359
                </a>
                <a
                  href="tel:+919792182280"
                  className="text-3xl hover:opacity-60 transition-opacity"
                >
                  +91 97921 82280
                </a>
                <a
                  href="tel:+917091823115"
                  className="text-3xl hover:opacity-60 transition-opacity"
                >
                  +91 70918 23115
                </a>
              </div>
            </div>

            <div className="contact-info">
              <div className="text-sm text-neutral-500 mb-2">Location</div>
              <div className="text-3xl">Greater Noida, Uttar Pradesh</div>
            </div>
          </div>

          <div className="contact-info">
            <div className="text-sm text-neutral-500 mb-6">Follow</div>
            <div className="space-y-4 text-xl">
              <a
                href="https://www.instagram.com/collexa_/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-60 transition-opacity"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-neutral-200 flex justify-between items-center text-sm text-neutral-500">
          <div>© 2026 Collexa. All rights reserved.</div>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:opacity-60 transition-opacity">
              Privacy
            </Link>
            <Link to="/terms" className="hover:opacity-60 transition-opacity">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}