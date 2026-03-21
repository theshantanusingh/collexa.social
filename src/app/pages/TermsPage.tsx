import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import Lenis from "lenis";

export function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-lg text-neutral-500">
              Last updated: March 20, 2026
            </p>
          </div>

          <div className="space-y-16">
            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Agreement to Terms
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                By accessing or using Collexa's services, you agree to be bound
                by these Terms of Service. If you disagree with any part of these
                terms, you may not access our services.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Services</h2>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                Collexa provides influencer marketing and brand partnership
                services, including but not limited to:
              </p>
              <ul className="space-y-3 pl-6 text-lg text-neutral-700">
                <li>• Influencer identification and vetting</li>
                <li>• Campaign strategy and planning</li>
                <li>• Content creation and management</li>
                <li>• Performance tracking and analytics</li>
                <li>• Partnership negotiation and coordination</li>
              </ul>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Client Obligations</h2>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>As a client, you agree to:</p>
                <ul className="space-y-3 pl-6">
                  <li>
                    • Provide accurate and complete information about your brand
                    and campaign objectives
                  </li>
                  <li>
                    • Make timely payments according to agreed-upon terms
                  </li>
                  <li>
                    • Respond to communications and requests in a timely manner
                  </li>
                  <li>• Comply with all applicable laws and regulations</li>
                  <li>
                    • Respect intellectual property rights of influencers and
                    third parties
                  </li>
                </ul>
              </div>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Payment Terms</h2>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>
                  All fees are quoted in Indian Rupees (INR) unless otherwise
                  specified. Payment terms include:
                </p>
                <ul className="space-y-3 pl-6">
                  <li>• 50% deposit required to initiate projects</li>
                  <li>• Remaining balance due upon campaign completion</li>
                  <li>• Invoices payable within 15 days of receipt</li>
                  <li>• Late payments may incur additional charges</li>
                  <li>• All fees exclude applicable taxes</li>
                </ul>
              </div>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Intellectual Property
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                All content created during campaigns, including strategies,
                reports, and creative materials, remains the intellectual property
                of the respective parties. License and usage rights will be
                defined in individual project agreements.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Confidentiality</h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Both parties agree to maintain confidentiality of proprietary
                information shared during the course of the engagement. This
                includes business strategies, campaign details, performance data,
                and any other sensitive information.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Limitation of Liability
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Collexa shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use or inability to use our services. Our total liability shall
                not exceed the amount paid by you for the specific service giving
                rise to the claim.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Termination</h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Either party may terminate an engagement with 30 days written
                notice. Upon termination, you are responsible for payment of all
                services rendered up to the termination date.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">Governing Law</h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with
                the laws of India. Any disputes arising from these terms shall be
                subject to the exclusive jurisdiction of courts in Mumbai, India.
              </p>
            </section>

            <section className="content-section">
              <h2 className="text-3xl tracking-tight mb-6">
                Changes to Terms
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify clients of any material changes via email or through our
                website. Continued use of our services after changes constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section className="content-section border-t border-neutral-200 pt-16">
              <h2 className="text-3xl tracking-tight mb-6">Contact Us</h2>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-3 text-lg text-neutral-700">
                <p>Email: legal@collexa.com</p>
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
