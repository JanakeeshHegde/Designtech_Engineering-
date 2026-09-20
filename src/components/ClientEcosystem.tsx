import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ClientEcosystem.css";

gsap.registerPlugin(ScrollTrigger);

const CLIENTS = [
  { name: "Shree Raghupathi Bhat", project: "Hotel Country Inn", angle: 0 },
  { name: "Country Inn, Udupi", project: "Hotel Country Inn", angle: 45 },
  { name: "St. Joseph's Group", project: "Multi Activity Centre", angle: 90 },
  { name: "CMR Group", project: "CMR PU College", angle: 135 },
  { name: "KSCA", project: "Alur Facilities", angle: 180 },
  { name: "Sagittarius Metals", project: "Factory, Peenya", angle: 225 },
  { name: "Taurus JCB", project: "Industrial Structure", angle: 270 },
];

export default function ClientEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ce-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".ce-header", start: "top 80%" },
      });

      gsap.fromTo(".ce-orbit", { opacity: 0, scale: 0.9 }, {
        opacity: 1, scale: 1, duration: 1.0,
        scrollTrigger: { trigger: ".ce-orbit", start: "top 70%" },
      });

      // Slow orbit rotation
      gsap.to(".ce-orbit-ring-outer", {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      gsap.to(".ce-orbit-ring-mid", {
        rotation: -360,
        duration: 40,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="clients" ref={sectionRef} className="client-eco section" aria-labelledby="ce-heading">
      <div className="container">
        <div className="ce-header section-header">
          <div className="section-number">CLIENTS</div>
          <h2 id="ce-heading" className="t-display-md">CLIENT ECOSYSTEM</h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "440px" }}>
            A network of institutions, developers, and organizations that trust Designtech Engineering for their structural challenges.
          </p>
        </div>

        <div className="ce-layout">
          {/* Orbit visual */}
          <div ref={orbitRef} className="ce-orbit" aria-hidden="true">
            <svg viewBox="0 0 500 500" className="ce-orbit-svg">
              {/* Orbit rings */}
              <circle className="ce-orbit-ring-outer" cx="250" cy="250" r="190" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.15" fill="none" strokeDasharray="4,8" />
              <circle className="ce-orbit-ring-mid" cx="250" cy="250" r="130" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.2" fill="none" strokeDasharray="2,6" />
              <circle cx="250" cy="250" r="60" stroke="#A87524" strokeWidth="1" strokeOpacity="0.3" fill="none" />

              {/* Center */}
              <circle cx="250" cy="250" r="40" fill="rgba(168, 117, 36,0.08)" stroke="#A87524" strokeWidth="1" />
              <text x="250" y="245" textAnchor="middle" fill="#A87524" fontSize="9" fontFamily="DM Mono,monospace" letterSpacing="2">DESIGN</text>
              <text x="250" y="258" textAnchor="middle" fill="#A87524" fontSize="9" fontFamily="DM Mono,monospace" letterSpacing="2">TECH</text>

              {/* Client nodes */}
              {CLIENTS.map((c, i) => {
                const angle = (c.angle * Math.PI) / 180;
                const r = i % 2 === 0 ? 190 : 130;
                const cx = 250 + r * Math.cos(angle);
                const cy = 250 + r * Math.sin(angle);
                return (
                  <g key={c.name}>
                    <line x1="250" y1="250" x2={cx} y2={cy} stroke="#A87524" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="2,4" />
                    <circle cx={cx} cy={cy} r="8" fill="rgba(168, 117, 36,0.12)" stroke="#A87524" strokeWidth="0.75" />
                    <circle cx={cx} cy={cy} r="2" fill="#A87524" fillOpacity="0.6" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Client list */}
          <div className="ce-list" role="list">
            {CLIENTS.map((c) => (
              <div key={c.name} className="ce-client" role="listitem">
                <div className="ce-client-dot" aria-hidden="true" />
                <div className="ce-client-info">
                  <div className="ce-client-name">{c.name}</div>
                  <div className="ce-client-project t-label">{c.project}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
