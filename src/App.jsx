
// ============================================================
// BURGER HOUSE — Landing Page Premium
// Stack: React + Tailwind (via CDN) + GSAP ScrollTrigger + Lucide
// Arquitectura: Componentes separados en el mismo archivo (artifact)
// Decisión: Single-file para artifact de Claude; en producción Vite
// separaría cada export a su propio .jsx bajo /src/components/
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

// ─── PALETA Y TOKENS DE DISEÑO ──────────────────────────────
// Estos valores se mapearían a tailwind.config.js en producción:
// theme.extend.colors.brand = { orange: '#E8500A', red: '#C0392B', ... }
const TOKENS = {
  orange: "#E8500A",
  orangeLight: "#FF6B2B",
  orangeDark: "#B34000",
  cream: "#FAF7F2",
  dark: "#0F0E0C",
  darkCard: "#1A1917",
  muted: "#6B6560",
};

// ─── DATOS DE MENÚ ──────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: 1,
    name: "The Classic",
    category: "clasicas",
    price: 12.9,
    desc: "Carne Angus 180g, lechuga, tomate, pepinillo y nuestra salsa secreta.",
    rating: 4.8,
    badge: null,
    emoji: "🍔",
    kcal: 620,
  },
  {
    id: 2,
    name: "Smoky BBQ",
    category: "clasicas",
    price: 14.5,
    desc: "Doble carne, cheddar ahumado, cebolla caramelizada y salsa BBQ artesanal.",
    rating: 4.9,
    badge: "Favorita",
    emoji: "🥩",
    kcal: 820,
  },
  {
    id: 3,
    name: "Black Truffle",
    category: "premium",
    price: 22.9,
    desc: "Wagyu A5, mayonesa de trufa negra, rúcula y queso brie fundido.",
    rating: 5.0,
    badge: "Premium",
    emoji: "🫱",
    kcal: 780,
  },
  {
    id: 4,
    name: "Lobster Smash",
    category: "premium",
    price: 28.5,
    desc: "Smash patty con langosta, mantequilla de hierbas y caviar de limón.",
    rating: 4.9,
    badge: "Chef's Pick",
    emoji: "🦞",
    kcal: 710,
  },
  {
    id: 5,
    name: "Crispy Chicken",
    category: "clasicas",
    price: 13.5,
    desc: "Pollo crujiente marinado 24h, coleslaw casero y jalapeños encurtidos.",
    rating: 4.7,
    badge: null,
    emoji: "🍗",
    kcal: 680,
  },
  {
    id: 6,
    name: "Gold Rush",
    category: "premium",
    price: 31.0,
    desc: "Carne de res y foie gras, láminas de oro comestible y reducción de Borgoña.",
    rating: 5.0,
    badge: "Signature",
    emoji: "✨",
    kcal: 950,
  },
];

const TESTIMONIALS = [
  {
    name: "Valentina Ríos",
    role: "Food Blogger",
    text: "La Black Truffle cambió mi definición de hamburguesa para siempre. Cada mordida es una experiencia gastronómica.",
    avatar: "VR",
    stars: 5,
  },
  {
    name: "Marco Delgado",
    role: "Chef Ejecutivo",
    text: "Ingredientes de primera, técnica impecable. Burger House entiende que la simplicidad bien ejecutada es el lujo máximo.",
    avatar: "MD",
    stars: 5,
  },
  {
    name: "Sofia Chen",
    role: "Crítica Gastronómica",
    text: "Difícil encontrar una propuesta tan honesta y trabajada en Lima. El Lobster Smash es imperdible.",
    avatar: "SC",
    stars: 5,
  },
  {
    name: "Andrés Mora",
    role: "Emprendedor",
    text: "El ambiente, la música, el servicio. Todo sincronizado. Es el lugar donde traes a alguien para impresionar.",
    avatar: "AM",
    stars: 5,
  },
];

// ─── UTILIDADES ─────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return [dark, setDark];
};

const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

// ─── SVG ICONS (mínimos, para no depender de lucide en artifact) ─
const IconMoon = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IconSun = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IconCart = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const IconStar = ({ size = 16, filled = false, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconPlus = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMinus = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMenu = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconFlame = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const IconAward = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const IconLeaf = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const IconMapPin = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = ({ size = 20, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

// ═══════════════════════════════════════════════════════════
// MÓDULO 1: NAVBAR.JSX
// Decisión: posición fixed con backdrop-blur, toggle de tema,
// carrito con badge dinámico y menú mobile con slide-in overlay.
// ═══════════════════════════════════════════════════════════
const Navbar = ({ dark, setDark, cartCount, onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Inicio", "Menú", "Historia", "Testimonios", "Contacto"];
  const scroll = (id) => {
    const el = document.getElementById(id.toLowerCase().replace("ú", "u").replace("í", "i"));
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          background: scrolled
            ? dark ? "rgba(15,14,12,0.95)" : "rgba(250,247,242,0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` : "none",
          padding: "0 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🍔</div>
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 20, color: dark ? "#FAF7F2" : "#0F0E0C", letterSpacing: "-0.5px" }}>
              Burger<span style={{ color: TOKENS.orange }}>House</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {links.map((l) => (
              <button key={l} onClick={() => scroll(l)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 500, letterSpacing: "0.3px",
                  color: dark ? "rgba(250,247,242,0.75)" : "rgba(15,14,12,0.65)",
                  transition: "color 0.2s",
                  padding: "4px 0",
                }}
                onMouseEnter={e => e.target.style.color = TOKENS.orange}
                onMouseLeave={e => e.target.style.color = dark ? "rgba(250,247,242,0.75)" : "rgba(15,14,12,0.65)"}
              >{l}</button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Theme toggle */}
            <button onClick={() => setDark(!dark)}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: dark ? "#FAF7F2" : "#0F0E0C",
                transition: "all 0.2s",
              }}
            >
              {dark ? <IconSun size={17} /> : <IconMoon size={17} />}
            </button>

            {/* Cart */}
            <button onClick={onCartClick}
              style={{
                position: "relative", width: 38, height: 38, borderRadius: 10,
                background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white",
              }}
            >
              <IconCart size={17} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  background: "#E8500A",
                  border: "2px solid " + (dark ? "#0F0E0C" : "#FAF7F2"),
                  color: "white", borderRadius: "50%",
                  width: 20, height: 20,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                }}>{cartCount}</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(true)}
              className="mobile-menu-btn"
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: "none", cursor: "pointer",
                display: "none", alignItems: "center", justifyContent: "center",
                color: dark ? "#FAF7F2" : "#0F0E0C",
              }}
            >
              <IconMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: dark ? "rgba(15,14,12,0.97)" : "rgba(250,247,242,0.97)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s ease",
        }}>
          <button onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute", top: 20, right: 24,
              background: "none", border: "none", cursor: "pointer",
              color: dark ? "#FAF7F2" : "#0F0E0C",
            }}>
            <IconX size={28} />
          </button>
          {links.map((l, i) => (
            <button key={l} onClick={() => scroll(l)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 36, fontWeight: 700,
                fontFamily: "'Georgia', serif",
                color: dark ? "rgba(250,247,242,0.9)" : "#0F0E0C",
                marginBottom: 16, padding: "8px 24px",
                animation: `slideUp 0.3s ease ${i * 0.07}s both`,
              }}
              onMouseEnter={e => e.target.style.color = TOKENS.orange}
              onMouseLeave={e => e.target.style.color = dark ? "rgba(250,247,242,0.9)" : "#0F0E0C"}
            >{l}</button>
          ))}
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 2: HERO.JSX
// Decisión: Animaciones CSS stagger (animation-delay) para máximo
// rendimiento sin JS adicional. Texto editorial serif en el headline.
// Partículas decorativas SVG absolutas para profundidad visual.
// ═══════════════════════════════════════════════════════════
const Hero = ({ dark, onMenuClick }) => {
  return (
    <section id="inicio" style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      background: dark
        ? `radial-gradient(ellipse at 70% 50%, rgba(232,80,10,0.12) 0%, transparent 60%), ${TOKENS.dark}`
        : `radial-gradient(ellipse at 70% 50%, rgba(232,80,10,0.08) 0%, transparent 60%), ${TOKENS.cream}`,
      paddingTop: 68,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", right: "-5%", top: "10%",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(232,80,10,0.15) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "-10%", bottom: "5%",
        width: 350, height: 350, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Floating text labels */}
      <div style={{ position: "absolute", top: "18%", right: "8%", opacity: 0.4, transform: "rotate(12deg)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: TOKENS.orange }}>
        EST. 2019
      </div>
      <div style={{ position: "absolute", bottom: "22%", right: "12%", opacity: 0.3, transform: "rotate(-8deg)", fontSize: 10, letterSpacing: "2px", color: dark ? "#FAF7F2" : "#0F0E0C" }}>
        LIMA, PERÚ
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", width: "100%" }}>
        {/* Left: Copy */}
        <div style={{ animation: "heroLeft 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: dark ? "rgba(232,80,10,0.15)" : "rgba(232,80,10,0.1)",
            border: `1px solid rgba(232,80,10,0.3)`,
            borderRadius: 24, padding: "6px 14px", marginBottom: 28,
          }}>
            <span style={{ color: TOKENS.orange, fontSize: 11, fontWeight: 700, letterSpacing: "2px" }}>
              🔥 NUEVA TEMPORADA 2025
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-3px",
            color: dark ? "#FAF7F2" : "#0F0E0C",
            marginBottom: 28,
          }}>
            El Arte de la{" "}
            <span style={{
              display: "block",
              background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Hamburguesa
            </span>
            <span style={{ display: "block" }}>Perfecta.</span>
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.7,
            color: dark ? "rgba(250,247,242,0.6)" : "rgba(15,14,12,0.55)",
            maxWidth: 440, marginBottom: 40,
          }}>
            Ingredientes premium seleccionados a mano. Técnica artesanal.
            Una obsesión por el sabor que comenzó en Lima y conquistó paladares.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={onMenuClick}
              style={{
                background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
                color: "white", border: "none", cursor: "pointer",
                padding: "16px 36px", borderRadius: 12,
                fontSize: 15, fontWeight: 700, letterSpacing: "0.5px",
                boxShadow: `0 8px 32px rgba(232,80,10,0.4)`,
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px rgba(232,80,10,0.55)`; }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = `0 8px 32px rgba(232,80,10,0.4)`; }}
            >
              Ver el Menú
            </button>
            <button
              onClick={() => document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent",
                color: dark ? "#FAF7F2" : "#0F0E0C",
                border: `1.5px solid ${dark ? "rgba(250,247,242,0.2)" : "rgba(15,14,12,0.2)"}`,
                cursor: "pointer",
                padding: "16px 36px", borderRadius: 12,
                fontSize: 15, fontWeight: 600,
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.target.style.borderColor = TOKENS.orange; e.target.style.color = TOKENS.orange; }}
              onMouseLeave={e => { e.target.style.borderColor = dark ? "rgba(250,247,242,0.2)" : "rgba(15,14,12,0.2)"; e.target.style.color = dark ? "#FAF7F2" : "#0F0E0C"; }}
            >
              Nuestra Historia
            </button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex" }}>
              {["🧑‍🍳", "👩", "🧔", "👱"].map((e, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: dark ? "#2A2926" : "#E8E4DE",
                  border: `2px solid ${dark ? "#0F0E0C" : "#FAF7F2"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginLeft: i > 0 ? -10 : 0, fontSize: 14, zIndex: 4 - i,
                }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: TOKENS.orange, fontSize: 13 }}>★</span>)}
              </div>
              <p style={{ fontSize: 12, color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.45)", margin: "2px 0 0" }}>
                +3,200 clientes satisfechos
              </p>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative", animation: "heroRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}>
          {/* Hero burger visual */}
          <div style={{
            width: 400, height: 400,
            borderRadius: "50%",
            background: dark
              ? "radial-gradient(circle at 40% 40%, rgba(232,80,10,0.2), rgba(15,14,12,0.8))"
              : "radial-gradient(circle at 40% 40%, rgba(232,80,10,0.15), rgba(250,247,242,0.8))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 160,
            boxShadow: `0 40px 120px rgba(232,80,10,0.25), 0 0 0 1px rgba(232,80,10,0.1)`,
            position: "relative",
            animation: "float 4s ease-in-out infinite",
          }}>
            🍔
            {/* Badge */}
            <div style={{
              position: "absolute", top: 30, right: 20,
              background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
              color: "white", borderRadius: 16,
              padding: "8px 16px", fontSize: 12, fontWeight: 700,
              boxShadow: `0 4px 16px rgba(232,80,10,0.4)`,
              whiteSpace: "nowrap",
            }}>
              ✨ Premium
            </div>
            <div style={{
              position: "absolute", bottom: 60, left: 10,
              background: dark ? "#1A1917" : "white",
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 14, padding: "10px 14px",
              fontSize: 12, fontWeight: 600,
              color: dark ? "#FAF7F2" : "#0F0E0C",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ color: TOKENS.orange, fontSize: 16 }}>🔥</span> Recién preparado
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "bounce 2s ease-in-out infinite",
        opacity: 0.5,
      }}>
        <span style={{ fontSize: 11, letterSpacing: "2px", color: dark ? "#FAF7F2" : "#0F0E0C" }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: TOKENS.orange }} />
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 3: FEATURES.JSX
// ═══════════════════════════════════════════════════════════
const Features = ({ dark }) => {
  const features = [
    { icon: <IconFlame size={28} />, title: "Carne Angus Premium", desc: "Seleccionamos cada corte directamente con ganaderos certificados. Sin aditivos, sin conservantes." },
    { icon: <IconAward size={28} />, title: "Técnica Artesanal", desc: "Cada hamburguesa se forma a mano y se cocina a la temperatura exacta para un sabor incomparable." },
    { icon: <IconLeaf size={28} />, title: "Ingredientes Frescos", desc: "Verduras de temporada de mercados locales. Freshness en cada capa, cada día." },
  ];

  return (
    <section style={{
      padding: "100px 24px",
      background: dark ? "#141312" : "#F5F1EB",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: TOKENS.orange, display: "block", marginBottom: 16 }}>POR QUÉ ELEGIRNOS</span>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16,
            color: dark ? "#FAF7F2" : "#0F0E0C",
          }}>
            Calidad que se siente en cada mordida
          </h2>
          <p style={{ fontSize: 16, color: dark ? "rgba(250,247,242,0.55)" : "rgba(15,14,12,0.5)", maxWidth: 500, margin: "0 auto" }}>
            No vendemos comida rápida. Vendemos una experiencia que vale tu tiempo.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i}
              style={{
                background: dark ? TOKENS.darkCard : "white",
                border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
                borderRadius: 20, padding: "36px 32px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 24px 64px rgba(232,80,10,0.15)`;
                e.currentTarget.style.borderColor = `rgba(232,80,10,0.3)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `linear-gradient(135deg, rgba(232,80,10,0.15), rgba(232,80,10,0.05))`,
                border: `1px solid rgba(232,80,10,0.2)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: TOKENS.orange, marginBottom: 24,
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700,
                color: dark ? "#FAF7F2" : "#0F0E0C", marginBottom: 12, letterSpacing: "-0.5px",
              }}>{f.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: dark ? "rgba(250,247,242,0.55)" : "rgba(15,14,12,0.5)", margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 4: PRODUCTCARD.JSX
// Componente reutilizable. Recibe props, maneja su propio
// estado de cantidad local. Comunica add-to-cart al padre.
// Efectos hover con CSS transitions nativas (sin GSAP overhead).
// ═══════════════════════════════════════════════════════════
const ProductCard = ({ item, dark, onAddToCart }) => {
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const newQty = qty + 1;
    setQty(newQty);
    onAddToCart(item.id, newQty);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  const handleRemove = () => {
    if (qty === 0) return;
    const newQty = qty - 1;
    setQty(newQty);
    onAddToCart(item.id, newQty);
  };

  const badgeColors = {
    "Premium": { bg: "rgba(232,80,10,0.9)", text: "white" },
    "Favorita": { bg: "rgba(16,185,129,0.9)", text: "white" },
    "Chef's Pick": { bg: "rgba(139,92,246,0.9)", text: "white" },
    "Signature": { bg: "rgba(245,158,11,0.9)", text: "white" },
  };

  return (
    <div
      style={{
        background: dark ? TOKENS.darkCard : "white",
        border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 20, overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
        e.currentTarget.style.boxShadow = `0 32px 80px rgba(0,0,0,${dark ? 0.4 : 0.15})`;
        e.currentTarget.style.borderColor = `rgba(232,80,10,0.25)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
      }}
    >
      {/* Image area */}
      <div style={{
        height: 180,
        background: dark
          ? `radial-gradient(circle at 50% 50%, rgba(232,80,10,0.12), rgba(26,25,23,1))`
          : `radial-gradient(circle at 50% 50%, rgba(232,80,10,0.08), rgba(245,241,235,1))`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 80, position: "relative",
        transition: "transform 0.35s ease",
      }}>
        {item.emoji}
        {item.badge && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: badgeColors[item.badge]?.bg || TOKENS.orange,
            color: badgeColors[item.badge]?.text || "white",
            borderRadius: 8, padding: "4px 10px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.5px",
          }}>
            {item.badge}
          </div>
        )}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          background: "rgba(0,0,0,0.5)",
          borderRadius: 8, padding: "3px 8px",
          fontSize: 11, color: "rgba(255,255,255,0.8)",
        }}>
          {item.kcal} kcal
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{
            fontFamily: "'Georgia', serif", fontSize: 19, fontWeight: 700,
            color: dark ? "#FAF7F2" : "#0F0E0C", margin: 0, letterSpacing: "-0.3px",
          }}>{item.name}</h3>
          <span style={{ fontSize: 20, fontWeight: 800, color: TOKENS.orange, whiteSpace: "nowrap", marginLeft: 8 }}>
            S/ {item.price.toFixed(2)}
          </span>
        </div>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ color: s <= Math.round(item.rating) ? TOKENS.orange : (dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"), fontSize: 12 }}>★</span>
          ))}
          <span style={{ fontSize: 12, color: dark ? "rgba(250,247,242,0.4)" : "rgba(15,14,12,0.4)", marginLeft: 4 }}>{item.rating}</span>
        </div>

        <p style={{
          fontSize: 13.5, lineHeight: 1.6, flex: 1,
          color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.5)", margin: "0 0 20px",
        }}>{item.desc}</p>

        {/* Cart controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {qty === 0 ? (
            <button onClick={handleAdd}
              style={{
                flex: 1, padding: "11px",
                background: added
                  ? "rgba(16,185,129,0.9)"
                  : `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
                color: "white", border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s", letterSpacing: "0.3px",
                boxShadow: `0 4px 16px rgba(232,80,10,0.35)`,
              }}
            >
              {added ? "✓ Añadido" : "Añadir al carrito"}
            </button>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={handleRemove}
                style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  border: "none", cursor: "pointer", color: dark ? "#FAF7F2" : "#0F0E0C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              ><IconMinus size={14} /></button>
              <span style={{ fontWeight: 700, fontSize: 16, color: TOKENS.orange }}>{qty}</span>
              <button onClick={handleAdd}
                style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
                  border: "none", cursor: "pointer", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              ><IconPlus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 5: MENUSECTION.JSX
// Estado React para filtrado por tabs. Array de productos
// filtrado con useMemo implícito. Animación de fade en el
// cambio de tab via CSS keyframe.
// ═══════════════════════════════════════════════════════════
const MenuSection = ({ dark, onAddToCart }) => {
  const [filter, setFilter] = useState("todas");
  const [animKey, setAnimKey] = useState(0);

  const tabs = [
    { id: "todas", label: "Todas" },
    { id: "clasicas", label: "Clásicas" },
    { id: "premium", label: "Premium" },
  ];

  const filtered = filter === "todas" ? MENU_ITEMS : MENU_ITEMS.filter(m => m.category === filter);

  const handleTab = (id) => {
    setFilter(id);
    setAnimKey(k => k + 1);
  };

  return (
    <section id="menu" style={{
      padding: "100px 24px",
      background: dark ? TOKENS.dark : TOKENS.cream,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: TOKENS.orange, display: "block", marginBottom: 16 }}>NUESTRO MENÚ</span>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16,
            color: dark ? "#FAF7F2" : "#0F0E0C",
          }}>
            Elige tu próxima obsesión
          </h2>
        </div>

        {/* Tab filter */}
        <div style={{
          display: "flex", justifyContent: "center",
          background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          borderRadius: 14, padding: 5, marginBottom: 52,
          width: "fit-content", margin: "0 auto 52px",
          gap: 4,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => handleTab(t.id)}
              style={{
                padding: "10px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 600,
                transition: "all 0.25s ease",
                background: filter === t.id
                  ? `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`
                  : "transparent",
                color: filter === t.id ? "white" : (dark ? "rgba(250,247,242,0.6)" : "rgba(15,14,12,0.55)"),
                boxShadow: filter === t.id ? `0 4px 16px rgba(232,80,10,0.35)` : "none",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Grid */}
        <div key={animKey} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
          animation: "fadeIn 0.35s ease both",
        }}>
          {filtered.map(item => (
            <ProductCard key={item.id} item={item} dark={dark} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 6: HISTORIA + STATS (ScrollTrigger simulado con
// IntersectionObserver nativo — zero dependencias externas,
// misma performance que GSAP ScrollTrigger para este caso.)
// ═══════════════════════════════════════════════════════════
const Historia = ({ dark }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const c1 = useCounter(3200, 2000, inView);
  const c2 = useCounter(6, 1800, inView);
  const c3 = useCounter(98, 2200, inView);
  const c4 = useCounter(48, 1600, inView);

  const stats = [
    { value: c1, suffix: "+", label: "Clientes felices" },
    { value: c2, suffix: "", label: "Años de experiencia" },
    { value: c3, suffix: "%", label: "Satisfacción garantizada" },
    { value: c4, suffix: "", label: "Ingredientes únicos" },
  ];

  return (
    <section id="historia" style={{
      padding: "100px 24px",
      background: dark ? "#141312" : "#F5F1EB",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left visual */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: "100%", aspectRatio: "4/3",
              background: dark
                ? "linear-gradient(135deg, #2A2018, #1A1512)"
                : "linear-gradient(135deg, #F0E8DC, #E0D4C4)",
              borderRadius: 24, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 120,
              border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              position: "relative",
            }}>
              👨‍🍳
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(circle at 30% 70%, rgba(232,80,10,0.2), transparent 60%)`,
              }} />
              <div style={{
                position: "absolute", bottom: 24, left: 24, right: 24,
                background: dark ? "rgba(15,14,12,0.85)" : "rgba(250,247,242,0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: 14, padding: "16px 20px",
                border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: dark ? "#FAF7F2" : "#0F0E0C" }}>
                  "La perfección no es un accidente — es el resultado de obsesión y práctica."
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: TOKENS.orange, fontWeight: 700 }}>
                  — Carlos Herrera, Fundador
                </p>
              </div>
            </div>
            {/* Floating stat card */}
            <div style={{
              position: "absolute", top: -16, right: -16,
              background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
              borderRadius: 16, padding: "20px 24px", color: "white",
              boxShadow: `0 16px 48px rgba(232,80,10,0.4)`,
            }}>
              <p style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>2019</p>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.85, letterSpacing: "1px" }}>EST. EN LIMA</p>
            </div>
          </div>

          {/* Right copy */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: TOKENS.orange, display: "block", marginBottom: 20 }}>NUESTRA HISTORIA</span>
            <h2 style={{
              fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700, letterSpacing: "-1px", marginBottom: 24,
              color: dark ? "#FAF7F2" : "#0F0E0C", lineHeight: 1.15,
            }}>
              Comenzó con una receta y un sueño imposible
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: dark ? "rgba(250,247,242,0.55)" : "rgba(15,14,12,0.5)", marginBottom: 16 }}>
              Carlos Herrera dejó su trabajo en banca en 2019 con una idea clara: que Lima merecía una hamburguesa que compitiera con las mejores del mundo. Sin franquicia, sin atajos.
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: dark ? "rgba(250,247,242,0.55)" : "rgba(15,14,12,0.5)", marginBottom: 40 }}>
              Hoy, Burger House es sinónimo de excelencia en Miraflores. Cada hamburguesa lleva la misma obsesión del primer día.
            </p>

            {/* Stats */}
            <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  padding: "20px", borderRadius: 14,
                  background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                }}>
                  <p style={{ margin: 0, fontSize: 36, fontWeight: 800, color: TOKENS.orange, lineHeight: 1 }}>
                    {s.value}{s.suffix}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: dark ? "rgba(250,247,242,0.45)" : "rgba(15,14,12,0.45)", fontWeight: 500 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 7: TESTIMONIOS — Grid estético con tarjetas glassmorphism
// ═══════════════════════════════════════════════════════════
const Testimonios = ({ dark }) => {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonios" style={{
      padding: "100px 24px",
      background: dark ? TOKENS.dark : TOKENS.cream,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: TOKENS.orange, display: "block", marginBottom: 16 }}>TESTIMONIOS</span>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700, letterSpacing: "-1.5px",
            color: dark ? "#FAF7F2" : "#0F0E0C",
          }}>
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i}
              onClick={() => setActive(i)}
              style={{
                padding: "28px", borderRadius: 20,
                background: active === i
                  ? `linear-gradient(135deg, rgba(232,80,10,0.12), rgba(232,80,10,0.04))`
                  : (dark ? TOKENS.darkCard : "white"),
                border: `1px solid ${active === i ? "rgba(232,80,10,0.35)" : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)")}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { if (active !== i) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.15)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: TOKENS.orange, fontSize: 13 }}>★</span>)}
              </div>
              <p style={{
                fontSize: 14.5, lineHeight: 1.7, fontStyle: "italic",
                color: dark ? "rgba(250,247,242,0.75)" : "rgba(15,14,12,0.7)",
                marginBottom: 20,
              }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 12, fontWeight: 700,
                }}>{t.avatar}</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: dark ? "#FAF7F2" : "#0F0E0C" }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: dark ? "rgba(250,247,242,0.4)" : "rgba(15,14,12,0.4)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 8: CONTACTO — Formulario optimizado para conversión
// ═══════════════════════════════════════════════════════════
const Contacto = ({ dark }) => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.nombre || !form.email || !form.mensaje) return;
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ nombre: "", email: "", mensaje: "" }); }, 3000);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 10,
    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
    color: dark ? "#FAF7F2" : "#0F0E0C",
    fontSize: 15, outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <section id="contacto" style={{
      padding: "100px 24px",
      background: dark ? "#141312" : "#F5F1EB",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3px", color: TOKENS.orange, display: "block", marginBottom: 16 }}>CONTACTO</span>
          <h2 style={{
            fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16,
            color: dark ? "#FAF7F2" : "#0F0E0C",
          }}>
            Hablemos de tu próxima visita
          </h2>
          <p style={{ fontSize: 15, color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.45)" }}>
            Reservas, eventos privados o simplemente decirnos hola — estamos aquí.
          </p>
        </div>

        {/* Contact info strip */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 44 }}>
          {[
            { icon: <IconMapPin size={16} />, text: "Av. Larco 1280, Miraflores" },
            { icon: <IconPhone size={16} />, text: "+51 998 765 432" },
            { icon: <IconMail size={16} />, text: "hola@burgerhouse.pe" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: dark ? "rgba(250,247,242,0.6)" : "rgba(15,14,12,0.55)", fontSize: 13 }}>
              <span style={{ color: TOKENS.orange }}>{c.icon}</span>
              {c.text}
            </div>
          ))}
        </div>

        {sent ? (
          <div style={{
            textAlign: "center", padding: "60px 40px",
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 24, color: dark ? "#FAF7F2" : "#0F0E0C", marginBottom: 8 }}>¡Mensaje enviado!</h3>
            <p style={{ color: dark ? "rgba(250,247,242,0.55)" : "rgba(15,14,12,0.5)", fontSize: 15 }}>Te responderemos en menos de 24 horas.</p>
          </div>
        ) : (
          <div style={{
            background: dark ? TOKENS.darkCard : "white",
            border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            borderRadius: 24, padding: "40px 40px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.45)", marginBottom: 8, letterSpacing: "0.5px" }}>NOMBRE</label>
                <input style={inputStyle} placeholder="Tu nombre" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  onFocus={e => e.target.style.borderColor = TOKENS.orange}
                  onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.45)", marginBottom: 8, letterSpacing: "0.5px" }}>EMAIL</label>
                <input style={inputStyle} placeholder="tu@email.com" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={e => e.target.style.borderColor = TOKENS.orange}
                  onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}
                />
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.45)", marginBottom: 8, letterSpacing: "0.5px" }}>MENSAJE</label>
              <textarea style={{ ...inputStyle, height: 120, resize: "vertical" }}
                placeholder="¿En qué podemos ayudarte?"
                value={form.mensaje}
                onChange={e => setForm({ ...form, mensaje: e.target.value })}
                onFocus={e => e.target.style.borderColor = TOKENS.orange}
                onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}
              />
            </div>
            <button onClick={handleSubmit}
              style={{
                width: "100%", padding: "16px",
                background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
                color: "white", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 8px 32px rgba(232,80,10,0.4)`,
                transition: "all 0.25s", letterSpacing: "0.5px",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px rgba(232,80,10,0.55)`; }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = `0 8px 32px rgba(232,80,10,0.4)`; }}
            >
              Enviar mensaje →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════
// MÓDULO 9: FOOTER
// ═══════════════════════════════════════════════════════════
const Footer = ({ dark }) => (
  <footer style={{
    padding: "60px 24px 40px",
    background: dark ? "#0A0908" : "#0F0E0C",
    color: "rgba(250,247,242,0.5)",
  }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🍔</div>
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: 18, color: "#FAF7F2" }}>Burger<span style={{ color: TOKENS.orange }}>House</span></span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 260, margin: "0 0 20px" }}>
            El arte de la hamburguesa perfecta. Ingredientes premium, técnica artesanal, Lima.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {["IG", "FB", "TW", "YT"].map(s => (
              <div key={s} style={{
                width: 34, height: 34, borderRadius: 8,
                background: "rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "rgba(250,247,242,0.6)",
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = TOKENS.orange; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(250,247,242,0.6)"; }}
              >{s}</div>
            ))}
          </div>
        </div>
        {[
          { title: "Menú", links: ["Clásicas", "Premium", "Bebidas", "Postres", "Combos"] },
          { title: "Empresa", links: ["Historia", "Equipo", "Sostenibilidad", "Prensa"] },
          { title: "Contacto", links: ["Reservas", "Franquicias", "Catering", "Soporte"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ color: "#FAF7F2", fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 20, textTransform: "uppercase" }}>{col.title}</h4>
            {col.links.map(l => (
              <p key={l} style={{ margin: "0 0 10px", fontSize: 13.5, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = TOKENS.orange}
                onMouseLeave={e => e.target.style.color = "rgba(250,247,242,0.5)"}
              >{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ margin: 0, fontSize: 13 }}>© 2025 Burger House. Todos los derechos reservados.</p>
        <p style={{ margin: 0, fontSize: 13 }}>Miraflores, Lima — Perú 🇵🇪</p>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════
// MÓDULO 10: CARRITO SIDEBAR
// ═══════════════════════════════════════════════════════════
const CartSidebar = ({ dark, cart, onClose }) => {
  const total = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === Number(id));
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => ({
    item: MENU_ITEMS.find(m => m.id === Number(id)),
    qty,
  })).filter(({ item }) => item);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 380,
        background: dark ? "#1A1917" : "white",
        boxShadow: "-16px 0 64px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        {/* Header */}
        <div style={{ padding: "24px", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 700, color: dark ? "#FAF7F2" : "#0F0E0C" }}>Tu pedido</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(250,247,242,0.5)" : "rgba(15,14,12,0.4)", padding: 4 }}>
            <IconX size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <p style={{ color: dark ? "rgba(250,247,242,0.4)" : "rgba(15,14,12,0.35)", fontSize: 15 }}>Tu carrito está vacío</p>
            </div>
          ) : cartItems.map(({ item, qty }) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 0",
              borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, fontSize: 26,
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: dark ? "#FAF7F2" : "#0F0E0C" }}>{item.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: dark ? "rgba(250,247,242,0.4)" : "rgba(15,14,12,0.4)" }}>x{qty} · S/ {(item.price * qty).toFixed(2)}</p>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: TOKENS.orange }}>S/ {(item.price * qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Footer total */}
        {cartItems.length > 0 && (
          <div style={{ padding: "24px", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 16, color: dark ? "rgba(250,247,242,0.6)" : "rgba(15,14,12,0.55)" }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: TOKENS.orange }}>S/ {total.toFixed(2)}</span>
            </div>
            <button style={{
              width: "100%", padding: "16px",
              background: `linear-gradient(135deg, ${TOKENS.orange}, ${TOKENS.orangeDark})`,
              color: "white", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 8px 32px rgba(232,80,10,0.4)`,
            }}>
              Confirmar pedido →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APP ROOT — Orquesta estado global y renderiza secciones
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [dark, setDark] = useTheme();
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleAddToCart = useCallback((id, qty) => {
    setCart(prev => ({ ...prev, [id]: qty }));
  }, []);

  return (
    <>
      {/* ── ANIMACIÓN GLOBAL CSS (en prod esto va a index.css) ─── */}
      <style>{`
        @keyframes heroLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes heroRight {
          from { opacity: 0; transform: translateX(40px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(232,80,10,0.4); border-radius: 3px; }

        /* Responsive nav */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        /* Responsive grids */
        @media (max-width: 900px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{
        background: dark ? TOKENS.dark : TOKENS.cream,
        minHeight: "100vh",
        transition: "background 0.3s ease",
      }}>
        <Navbar dark={dark} setDark={setDark} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

        <Hero dark={dark} onMenuClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })} />
        <Features dark={dark} />
        <MenuSection dark={dark} onAddToCart={handleAddToCart} />
        <Historia dark={dark} />
        <Testimonios dark={dark} />
        <Contacto dark={dark} />
        <Footer dark={dark} />

        {cartOpen && <CartSidebar dark={dark} cart={cart} onClose={() => setCartOpen(false)} />}
      </div>
    </>
  );
}
