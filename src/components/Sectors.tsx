import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Sectors.css";

gsap.registerPlugin(ScrollTrigger);

const SECTORS = [
  {
    num: "01",
    title: "RESIDENTIAL & COMMERCIAL BUILDINGS",
    subtitle: "HIGH-RISE TOWERS, TECH PARKS & MIXED-USE HUBS",
    desc: "From iconic high-rise residential towers and luxury villa enclaves to multi-acre commercial IT parks and hotels. We engineer sophisticated deep basement retention systems, high-efficiency RCC post-tensioned floor plates, and seismically resilient superstructures tailored to architectural aesthetics.",
    tags: ["High-Rise Towers", "Post-Tensioned Slabs", "Deep Basements", "Seismic Engineering", "Mixed-Use Enclaves"],
    visual: "building",
  },
  {
    num: "02",
    title: "WATER & SEWAGE TREATMENT PLANTS",
    subtitle: "ENVIRONMENTAL INFRASTRUCTURE & HYDRAULIC RETAINING",
    desc: "Robust hydraulic civil and structural engineering for water treatment plants (WTP), sewage treatment facilities (STP), clarifiers, aeration basins, and underground reservoirs. Designed to meet stringent crack-width limits, hydrostatic pressures, and aggressive chemical corrosion environments.",
    tags: ["Liquid Retaining Structures", "IS 3370 Compliance", "WTP & STP Facilities", "Hydrodynamic Resistance", "Pumping Stations"],
    visual: "water",
  },
  {
    num: "03",
    title: "INDUSTRIAL STRUCTURES & INSTITUTIONS",
    subtitle: "HEAVY MANUFACTURING, LARGE-SPAN WAREHOUSES & CAMPUSES",
    desc: "Heavy-duty civil and structural engineering for manufacturing plants, automated logistics hubs, university campuses, and civic facilities. We deliver expansive column-free structural steel spans, heavy gantry crane girder designs, dynamic equipment foundations, and rapid-erection PEB systems.",
    tags: ["Pre-Engineered Buildings (PEB)", "Heavy Machine Foundations", "Long-Span Steel Trusses", "Institutional Campuses", "Industrial Flooring"],
    visual: "industrial",
  },
  {
    num: "04",
    title: "SOLAR & RENEWABLE ENERGY",
    subtitle: "UTILITY-SCALE FARMS & ROOFTOP MOUNTING STRUCTURES",
    desc: "Specialized structural engineering for solar photovoltaic mounting systems (MMS), rooftop solar arrays, wind-load resistant tracker frames, and substation infrastructure. Engineered with high-strength lightweight cold-formed steel for rapid site assembly and maximum lifecycle yield.",
    tags: ["Solar MMS Design", "Wind Dynamic Analysis", "Rooftop Load Audits", "Utility-Scale Arrays", "Cold-Formed Steel"],
    visual: "solar",
  },
];

const visuals: Record<string, React.ReactNode> = {
  building: (
    <svg viewBox="0 0 240 220" fill="none" className="sector-svg" aria-hidden="true">
      <line x1="30" y1="195" x2="210" y2="195" stroke="#A87524" strokeWidth="2" />
      <rect x="55" y="60" width="130" height="135" stroke="#202124" strokeWidth="1.8" fill="rgba(255,255,255,0.8)" />
      {[85, 110, 135, 160].map((y) => (
        <line key={y} x1="55" y1={y} x2="185" y2={y} stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.5" />
      ))}
      {[75, 100, 125, 150].map((x) => (
        <rect key={x} x={x} y="92" width="14" height="14" stroke="#A87524" strokeWidth="0.8" fill="rgba(168, 117, 36, 0.08)" />
      ))}
      {[75, 100, 125, 150].map((x) => (
        <rect key={x} x={x} y="117" width="14" height="14" stroke="#A87524" strokeWidth="0.8" fill="rgba(168, 117, 36, 0.08)" />
      ))}
      <rect x="105" y="150" width="30" height="45" stroke="#A87524" strokeWidth="1.2" fill="rgba(168, 117, 36, 0.12)" />
      <path d="M 50 60 L 120 30 L 190 60" stroke="#A87524" strokeWidth="2" fill="none" />
      <text x="15" y="198" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">GL</text>
    </svg>
  ),
  water: (
    <svg viewBox="0 0 240 220" fill="none" className="sector-svg" aria-hidden="true">
      <ellipse cx="120" cy="145" rx="85" ry="35" stroke="#A87524" strokeWidth="1.8" fill="rgba(168, 117, 36, 0.06)" />
      <ellipse cx="120" cy="115" rx="85" ry="25" stroke="#202124" strokeWidth="1.5" fill="rgba(255, 255, 255, 0.8)" />
      <rect x="35" y="115" width="170" height="45" stroke="#A87524" strokeWidth="1.2" fill="rgba(168, 117, 36, 0.03)" />
      {[125, 140, 155].map((y) => (
        <path key={y} d={`M 50 ${y} Q 85 ${y-8} 120 ${y} Q 155 ${y+8} 190 ${y}`} stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.6" fill="none" />
      ))}
      <rect x="105" y="55" width="30" height="60" stroke="#202124" strokeWidth="1.5" fill="#FFFFFF" />
      <line x1="120" y1="35" x2="120" y2="55" stroke="#A87524" strokeWidth="1.2" strokeDasharray="3,3" />
      <text x="75" y="200" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.8">IS 3370 LIQUID RETAINING</text>
    </svg>
  ),
  industrial: (
    <svg viewBox="0 0 240 220" fill="none" className="sector-svg" aria-hidden="true">
      <line x1="20" y1="185" x2="220" y2="185" stroke="#A87524" strokeWidth="2" />
      <rect x="30" y="100" width="180" height="85" stroke="#202124" strokeWidth="1.8" fill="rgba(255, 255, 255, 0.8)" />
      <path d="M 30 100 L 60 65 L 110 65 L 110 100" stroke="#A87524" strokeWidth="1.5" fill="rgba(168, 117, 36, 0.08)" />
      <path d="M 110 65 L 170 35 L 210 65 L 210 100" stroke="#A87524" strokeWidth="1.5" fill="rgba(168, 117, 36, 0.08)" />
      {[60, 95, 130, 165].map((x) => (
        <line key={x} x1={x} y1="100" x2={x} y2="185" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.5" />
      ))}
      <rect x="160" y="125" width="35" height="60" stroke="#A87524" strokeWidth="1.2" fill="rgba(168, 117, 36, 0.12)" />
      <text x="35" y="205" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.8">LARGE SPAN PEB / HEAVY GANTRY</text>
    </svg>
  ),
  solar: (
    <svg viewBox="0 0 240 220" fill="none" className="sector-svg" aria-hidden="true">
      {[[25,45],[65,35],[105,45],[145,35],[185,45],[25,95],[65,85],[105,95],[145,85],[185,95]].map(([x,y], i) => (
        <rect key={i} x={x} y={y} width="30" height="24"
          stroke="#A87524" strokeWidth="0.8"
          fill="rgba(168, 117, 36, 0.08)"
        />
      ))}
      {[[25,45],[105,45],[185,45]].map(([x,y], i) => (
        <line key={i} x1={x+15} y1={y+24} x2={x+15} y2={y+50} stroke="#202124" strokeWidth="1" strokeOpacity="0.6" />
      ))}
      <line x1="20" y1="165" x2="220" y2="165" stroke="#A87524" strokeWidth="2" />
      <circle cx="120" cy="190" r="14" stroke="#A87524" strokeWidth="1.2" fill="rgba(168, 117, 36, 0.12)" />
      <text x="45" y="210" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.8">WIND LOAD STRENGTH TESTED</text>
    </svg>
  ),
};

export default function Sectors() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".sectors-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".sectors-header", start: "top 90%", once: true },
      });

      const chapters = gsap.utils.toArray<HTMLElement>(".sector-chapter");
      chapters.forEach((ch) => {
        gsap.fromTo(ch, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: ch, start: "top 90%", once: true },
        });
      });
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section id="sectors" ref={sectionRef} className="sectors section" aria-labelledby="sectors-heading">
      <div className="container">
        {/* Header */}
        <div className="sectors-header">
          <div className="sectors-header-left">
            <span className="sectors-eyebrow">SPECIALIZED SECTORS</span>
            <h2 id="sectors-heading" className="sectors-headline">
              FIELDS OF OPERATION
            </h2>
          </div>
          <div className="sectors-header-rule" aria-hidden="true" />
        </div>

        {/* Alternating Editorial Chapters */}
        <div className="sectors-chapters">
          {SECTORS.map((s, idx) => {
            const isReverse = idx % 2 !== 0;
            return (
              <article
                key={s.num}
                className={`sector-chapter ${isReverse ? "sector-chapter--reverse" : ""}`}
              >
                {/* Content Side */}
                <div className="sector-ch-content">
                  <div className="sector-ch-meta">
                    <span className="sector-ch-num">{s.num}</span>
                    <span className="sector-ch-sub">{s.subtitle}</span>
                  </div>

                  <h3 className="sector-ch-title">{s.title}</h3>
                  <p className="sector-ch-desc">{s.desc}</p>

                  <div className="sector-ch-tags" role="list">
                    {s.tags.map((tag) => (
                      <span key={tag} className="sector-ch-tag" role="listitem">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Architectural Blueprint Side */}
                <div className="sector-ch-visual" aria-hidden="true">
                  <div className="sector-visual-card">
                    <div className="sector-card-topbar">
                      <span className="sector-card-id">SECTOR-CHAPTER // {s.num}</span>
                      <span className="sector-card-status">DESIGN SPECIFICATION</span>
                    </div>
                    <div className="sector-card-viewport">
                      {visuals[s.visual]}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
