import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ContactInfo {
  id: string;
  category: string;
  value: string;
  label: string;
}

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);

  useEffect(() => {
    fetch("/api/contact-info")
      .then((res) => res.json())
      .then((data) => setContactInfo(data))
      .catch((err) => console.error("Failed to fetch contact info", err));
  }, []);

  useEffect(() => {
    if (contactInfo.length === 0) return;

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
  }, [contactInfo]);

  const emails = contactInfo.filter((i) => i.category === "email");
  const phones = contactInfo.filter((i) => i.category === "phone");
  const locations = contactInfo.filter((i) => i.category === "location");
  const follows = contactInfo.filter((i) => i.category === "follow");

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
            {emails.length > 0 && (
              <div className="contact-info mb-12">
                <div className="text-sm text-neutral-500 mb-2">Email</div>
                <div className="flex flex-col gap-2">
                  {emails.map((email) => (
                    <a
                      key={email.id}
                      href={`mailto:${email.value}`}
                      className="text-3xl hover:opacity-60 transition-opacity"
                    >
                      {email.value}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {phones.length > 0 && (
              <div className="contact-info mb-12">
                <div className="text-sm text-neutral-500 mb-2">Phone</div>
                <div className="flex flex-col gap-2">
                  {phones.map((phone) => (
                    <a
                      key={phone.id}
                      href={`tel:${phone.value.replace(/\s+/g, "")}`}
                      className="text-3xl hover:opacity-60 transition-opacity"
                    >
                      {phone.value}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {locations.length > 0 && (
              <div className="contact-info">
                <div className="text-sm text-neutral-500 mb-2">Location</div>
                <div className="flex flex-col gap-2">
                  {locations.map((loc) => (
                    <div key={loc.id} className="text-3xl">
                      {loc.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="contact-info">
            <div className="text-sm text-neutral-500 mb-6">Follow</div>
            <div className="space-y-4 text-xl">
              {follows.map((follow) => (
                <a
                  key={follow.id}
                  href={follow.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-60 transition-opacity"
                >
                  {follow.label || "Link"}
                </a>
              ))}
              {follows.length === 0 && (
                <div className="text-neutral-400 italic">No links added</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-neutral-200 flex justify-between items-center text-sm text-neutral-500">
          <div>© {new Date().getFullYear()} Collexa. All rights reserved.</div>
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