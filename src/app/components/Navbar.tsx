import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { Home } from "lucide-react";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: "-100%" },
      { y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
    ).then(() => {
      isInitialMount.current = false;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isInitialMount.current) return;

      const currentScrollY = window.scrollY;
      
      // Submerge when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;
    
    gsap.to(navRef.current, {
      y: isVisible ? 0 : "-100%",
      duration: 0.3,
      ease: "power2.out"
    });
  }, [isVisible]);

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
        <div className="flex gap-4 md:gap-12 text-xs md:text-sm tracking-wide items-center">
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