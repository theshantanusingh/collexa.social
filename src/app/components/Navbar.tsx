import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { Home } from "lucide-react";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100 },
      { y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference"
    >
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group"
        >
          <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="text-2xl tracking-tighter font-light">COLLEXA</span>
        </Link>
        <div className="hidden md:flex gap-12 text-sm tracking-wide">
          <Link to="/get-in-touch" className="hover:opacity-60 transition-opacity">
            GET IN TOUCH
          </Link>
          <a 
            href="#contact" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:opacity-60 transition-opacity"
          >
            CONTACT
          </a>
        </div>
      </div>
    </nav>
  );
}