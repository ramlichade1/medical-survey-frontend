
// src/components/Header.jsx

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80&auto=format&fit=crop";

const Header = () => {
  return (
    <header role="banner" className="relative overflow-hidden min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] flex flex-col">

      {/* ── Background: real photo on mobile, gradient overlay always ── */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* Photo layer — visible on all sizes, adds warmth on mobile */}
        <img
          src={HERO_IMAGE}
          alt=""
          role="presentation"
          fetchpriority="high"
          className="animate-fade-in h-full w-full object-cover object-center scale-105"
          style={{ animationDuration: "0.9s" }}
        />
        {/* Dark gradient overlay for legibility */}
        <div className="hero-image-overlay absolute inset-0" />
        {/* Extra navy base so text is always readable without photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,37,64,0.55) 0%, rgba(12,58,94,0.42) 50%, rgba(10,74,74,0.50) 100%)",
          }}
        />
      </div>

      {/* ── Decorative blobs (subtle on mobile, more visible on desktop) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-15 sm:h-56 sm:w-56 md:-top-24 md:-right-24 md:h-80 md:w-80 lg:h-96 lg:w-96 lg:opacity-20"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full opacity-10 sm:h-48 sm:w-48 md:-bottom-20 md:-left-16 md:h-72 md:w-72 lg:h-80 lg:w-80 lg:opacity-15"
          style={{ background: "radial-gradient(circle, #0d9488 0%, transparent 70%)" }}
        />
        {/* Subtle grid - hidden on very small devices */}
        <div
          className="absolute inset-0 opacity-5 hidden sm:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* ── Nav bar ── */}
      <nav
        aria-label="Site navigation"
        className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 md:px-10"
      >
        {/* Logo */}
        <a href="/" aria-label="MedPulse Survey home" className="flex items-center gap-2 sm:gap-2.5">
          <span
            className="pulse-ring flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl"
            style={{ background: "rgba(13, 148, 136, 0.38)" }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 sm:h-5 sm:w-5 text-teal-300"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span
            className="text-base sm:text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Survey<span className="text-teal-300">Form</span>
          </span>
        </a>

        {/* Trust badges – show two on mobile (compact), full list on desktop */}
        <ul aria-label="Trust indicators" className="flex items-center gap-2 sm:gap-3 md:gap-6">
          {[
            {
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              label: "IRB Approved",
              mobileLabel: "IRB",
            },
            {
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              label: "Secure & Anonymous",
              mobileLabel: "Secure",
            },
          ].map(({ icon, label, mobileLabel }) => (
            <li key={label} className="flex items-center gap-1 sm:gap-1.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-teal-400"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
                <span className="md:hidden">{mobileLabel}</span>
                <span className="hidden md:inline">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-3xl px-4 pb-10 pt-4 sm:px-5 sm:pb-12 sm:pt-6 md:px-10 md:pb-16 md:pt-8 lg:pb-20 lg:pt-10 text-center">

        {/* Pill badge */}
        <div
          className="animate-fade-up animate-fade-up-1 mb-4 sm:mb-5 md:mb-6 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 py-1.5 sm:px-3.5"
          style={{
            borderColor: "rgba(45,212,191,0.35)",
            background: "rgba(45,212,191,0.12)",
          }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" aria-hidden="true" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-teal-300">
            Covid Survey Form · 2026
          </span>
        </div>

        {/* Headline — tighter on mobile */}
        <h1
          className="animate-fade-up animate-fade-up-2 mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your Voice Shapes{" "}
          <span className="text-gradient block sm:inline">Medical Education</span>
        </h1>

        {/* Sub-headline */}
        <p className="animate-fade-up animate-fade-up-3 mb-6 sm:mb-7 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-slate-300 px-2 sm:px-4 md:px-6 max-w-2xl mx-auto">
          A research survey for{" "}
          <strong className="font-semibold text-white">MBBS</strong> and{" "}
          <strong className="font-semibold text-white">B.Pharm</strong> students across India.
          Takes about{" "}
          <em className="not-italic font-semibold text-teal-300">2 minutes</em>.
          All responses are completely anonymous.
        </p>

        {/* Stat pills */}
        <ul
          aria-label="Survey statistics"
          className="animate-fade-up animate-fade-up-4 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2"
        >
          {[
            { value: "3,200+", label: "Responses" },
            { value: "42",     label: "Colleges"  },
            { value: "100%",   label: "Anonymous" },
          ].map(({ value, label }) => (
            <li
              key={label}
              className="glass-card rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-center flex-1 min-w-[70px] sm:min-w-[80px] max-w-[90px] sm:max-w-[100px] md:max-w-[120px]"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
            >
              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </p>
              <p className="mt-0.5 text-[10px] sm:text-xs font-medium text-slate-300 md:text-slate-400">{label}</p>
            </li>
          ))}
        </ul>

        {/* Mobile-only: scroll cue */}
        <p className="animate-fade-up animate-fade-up-5 mt-5 sm:mt-6 text-xs font-medium text-slate-400 md:hidden">
          Scroll down to begin ↓
        </p>
      </div>

      {/* ── Wave divider ── */}
      <div aria-hidden="true" className="relative -mb-px mt-auto">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          preserveAspectRatio="none"
          className="h-8 w-full sm:h-10 md:h-14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 56L48 48C96 40 192 24 288 18.7C384 13 480 17 576 22.3C672 27 768 35 864 36C960 37 1056 31 1152 26.3C1248 21 1344 17 1392 15L1440 13V56H0Z"
            fill="#f0f9ff"
          />
        </svg>
      </div>
    </header>
  );
};

export default Header;