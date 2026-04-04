import { useEffect } from "react";
import Lenis from "lenis";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Approach } from "../components/Approach";
import { Capabilities } from "../components/Capabilities";
import { Process } from "../components/Process";
import { Creators } from "../components/Creators";
import { Work } from "../components/Work";
import { Metrics } from "../components/Metrics";
import { Contact } from "../components/Contact";

export function HomePage() {
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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white">
      <Navbar />
      <Hero />
      <Services />
      <Approach />
      <Capabilities />
      <Process />
      <Creators />
      <Work />
      <Metrics />
      <Contact />
    </div>
  );
}
