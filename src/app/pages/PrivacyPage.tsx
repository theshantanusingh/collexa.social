import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import Lenis from "lenis";

export function PrivacyPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-title",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );

      gsap.fromTo(
        ".content-section",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.6,
        }
      );
    }, pageRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-white">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl tracking-tighter font-light">
            COLLEXA
          </Link>
          <Link
            to="/"
            className="text-sm tracking-wide hover:opacity-60 transition-opacity"
          >
            BACK TO HOME
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="page-title mb-20">
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] tracking-tighter font-light leading-[0.9] mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-neutral-500">
              Last updated: March 20, 2026
            </p>
          </div>

          <div className="space-y-16">
            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Introduction</h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Collexa ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website or use our services.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Information We Collect
              </h2>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="space-y-3 pl-6">
                  <li>• Name and contact information</li>
                  <li>• Company details and business information</li>
                  <li>• Project requirements and budget details</li>
                  <li>• Communication preferences</li>
                  <li>• Payment and billing information</li>
                </ul>
              </div>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                How We Use Your Information
              </h2>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="space-y-3 pl-6">
                  <li>• Provide, maintain, and improve our services</li>
                  <li>• Process your requests and transactions</li>
                  <li>• Send you technical notices and support messages</li>
                  <li>• Communicate about products, services, and events</li>
                  <li>• Monitor and analyze trends and usage</li>
                  <li>• Detect, prevent, and address technical issues</li>
                </ul>
              </div>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Data Security</h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We implement appropriate technical and organizational measures to
                protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Information Sharing
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third
                parties. We may share your information with trusted service
                providers who assist us in operating our business, provided they
                agree to keep this information confidential.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Your Rights</h2>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="space-y-3 pl-6">
                  <li>• Access your personal information</li>
                  <li>• Correct inaccurate data</li>
                  <li>• Request deletion of your information</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Lodge a complaint with a supervisory authority</li>
                </ul>
              </div>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Cookies and Tracking
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity
                on our website and hold certain information. You can instruct your
                browser to refuse all cookies or to indicate when a cookie is
                being sent.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Changes to This Policy
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="content-section border-t border-neutral-200 pt-16">
              <h2 className="text-3xl tracking-tight mb-6">Contact Us</h2>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <div className="space-y-3 text-lg text-neutral-700">
                <p>Email: privacy@collexa.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Mumbai, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
