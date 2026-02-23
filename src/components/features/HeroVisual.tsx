'use client';

export function HeroVisual() {
  return (
    <div className="relative w-full aspect-square max-w-lg xl:max-w-xl flex items-center justify-center">
      {/* Outer glow - pulsed */}
      <div className="absolute inset-0 rounded-full bg-victoria-gold-500/15 blur-[60px] scale-90 animate-glow-pulse" />
      <div className="absolute inset-0 rounded-full bg-victoria-gold-400/10 blur-[80px] scale-75 animate-glow-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Bold ring - subtle pulse */}
      <div className="absolute inset-0 rounded-full border-2 border-victoria-gold-400/30 animate-ring-pulse" />
      <div className="absolute inset-[15%] rounded-full border border-victoria-gold-400/20 animate-ring-pulse" style={{ animationDelay: '0.3s' }} />

      {/* Motion lines - flowing speed effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-victoria-gold-400/60 to-transparent animate-speed-flow"
            style={{
              width: '160%',
              top: `${18 + i * 10}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Car silhouette - bold, centered with float + drive */}
      <div className="relative w-[55%] xl:w-[60%] animate-car-float">
        <svg
          viewBox="0 0 200 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_0_30px_rgba(251,204,21,0.25)]"
        >
          {/* Body - sleek side profile with gradient */}
          <defs>
            <linearGradient id="car-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
              <stop offset="50%" stopColor="#e5a50d" stopOpacity="1" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="1" />
            </linearGradient>
            <filter id="car-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Main body */}
          <path
            d="M20 52 L28 48 L35 48 L45 42 L75 42 L95 38 L130 38 L150 42 L165 45 L180 48 L185 52 L182 58 L175 60 L25 60 L18 56 Z"
            fill="url(#car-gold)"
            filter="url(#car-glow)"
          />
          {/* Roof/cabin */}
          <path
            d="M55 42 L62 32 L95 28 L125 32 L135 42"
            fill="url(#car-gold)"
            fillOpacity="0.9"
          />
          {/* Windshield */}
          <path
            d="M58 40 L64 34 L92 32 L118 34 L132 40"
            fill="white"
            fillOpacity="0.15"
          />
          {/* Wheels */}
          <circle cx="45" cy="58" r="10" fill="#1e2a3d" stroke="#facc15" strokeWidth="2" strokeOpacity="0.6" />
          <circle cx="45" cy="58" r="5" fill="#334360" />
          <circle cx="155" cy="58" r="10" fill="#1e2a3d" stroke="#facc15" strokeWidth="2" strokeOpacity="0.6" />
          <circle cx="155" cy="58" r="5" fill="#334360" />
          {/* Headlight */}
          <ellipse cx="185" cy="50" rx="4" ry="3" fill="#fef08a" opacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
