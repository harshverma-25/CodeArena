import React from "react";

// Crisp Neo-Brutalist Arcade Vector Icons matching the screenshot aesthetic

export function ArcadeBrainIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Brain shadow/base */}
      <path
        d="M20 18C16 18 12 22 12 27C12 30 13.5 32.5 15 34C13 36 12 39 12 42C12 47 16 51 21 51C24 51 27 49.5 29 47C30 48.5 31 49 32 49C33 49 34 48.5 35 47C37 49.5 40 51 43 51C48 51 52 47 52 42C52 39 51 36 49 34C50.5 32.5 52 30 52 27C52 22 48 18 44 18C41 18 38.5 19.5 37 21.5C35.5 19.5 33.5 18 31 18C28.5 18 26.5 19.5 25 21.5C23.5 19.5 21 18 20 18Z"
        fill="#F472B6"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Brain folds & creases */}
      <path
        d="M24 28C22 30 22 34 25 36C28 38 29 42 27 45"
        stroke="#18181B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 28C42 30 42 34 39 36C36 38 35 42 37 45"
        stroke="#18181B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Center fissure */}
      <path
        d="M32 23V46"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Glossy highlights */}
      <ellipse cx="20" cy="24" rx="3" ry="2" fill="white" fillOpacity="0.8" transform="rotate(-20 20 24)" />
      <ellipse cx="44" cy="24" rx="3" ry="2" fill="white" fillOpacity="0.8" transform="rotate(20 44 24)" />
    </svg>
  );
}

export function ArcadeLightbulbIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rays */}
      <path d="M32 8V12" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 15L18 18" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      <path d="M49 15L46 18" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 32H12" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 32H56" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      {/* Glass Bulb */}
      <path
        d="M20 28C20 21.3726 25.3726 16 32 16C38.6274 16 44 21.3726 44 28C44 32.5 41.5 36.5 39.5 39C38.5 40.2 38 41.8 38 43.5V45H26V43.5C26 41.8 25.5 40.2 24.5 39C22.5 36.5 20 32.5 20 28Z"
        fill="#FACC15"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Filament */}
      <path
        d="M28 32L32 26L36 32"
        stroke="#18181B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Screw Base */}
      <path
        d="M26 45H38V49C38 50 37 51 36 51H28C27 51 26 50 26 49V45Z"
        fill="#E4E4E7"
        stroke="#18181B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="29" y="51" width="6" height="3" rx="1.5" fill="#71717A" stroke="#18181B" strokeWidth="2" />
      {/* Highlight */}
      <ellipse cx="25" cy="23" rx="2.5" ry="4" fill="white" fillOpacity="0.8" transform="rotate(-30 25 23)" />
    </svg>
  );
}

export function ArcadeCodeIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Circle or badge */}
      <circle cx="32" cy="32" r="24" fill="#C4B5FD" stroke="#18181B" strokeWidth="3.5" />
      {/* Left bracket < */}
      <path
        d="M25 24L17 32L25 40"
        stroke="#18181B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Slash / */}
      <path
        d="M36 21L28 43"
        stroke="#7C3AED"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Right bracket > */}
      <path
        d="M39 24L47 32L39 40"
        stroke="#18181B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArcadeFlaskIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Flask Body */}
      <path
        d="M28 12H36V22L47 43C49 47 46 52 41 52H23C18 52 15 47 17 43L28 22V12Z"
        fill="#FFFFFF"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Liquid inside */}
      <path
        d="M20 45C22 41 27 38 32 38C37 38 42 41 44 45L45 47C45.5 48.5 44 50 42 50H22C20 50 18.5 48.5 19 47L20 45Z"
        fill="#FB7185"
        stroke="#18181B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Flask Top Lip */}
      <rect x="25" y="10" width="14" height="4" rx="2" fill="#E4E4E7" stroke="#18181B" strokeWidth="3" />
      {/* Bubbles */}
      <circle cx="28" cy="44" r="2" fill="white" stroke="#18181B" strokeWidth="1.5" />
      <circle cx="36" cy="42" r="2.5" fill="white" stroke="#18181B" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="1.5" fill="#FB7185" stroke="#18181B" strokeWidth="1.5" />
      {/* Gloss */}
      <path d="M22 43L29 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.8" />
    </svg>
  );
}

export function ArcadeGlobeIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Globe base */}
      <circle cx="32" cy="32" r="22" fill="#67E8F9" stroke="#18181B" strokeWidth="3.5" />
      {/* Latitude horizontal ellipse */}
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#18181B" strokeWidth="3" fill="none" />
      {/* Longitude vertical ellipse */}
      <ellipse cx="32" cy="32" rx="9" ry="22" stroke="#18181B" strokeWidth="3" fill="none" />
      {/* Equator line */}
      <line x1="10" y1="32" x2="54" y2="32" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      {/* Prime Meridian */}
      <line x1="32" y1="10" x2="32" y2="54" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      {/* Gloss */}
      <ellipse cx="23" cy="22" rx="4" ry="2" fill="white" fillOpacity="0.7" transform="rotate(-35 23 22)" />
    </svg>
  );
}

export function ArcadeNewsIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Folded paper */}
      <rect x="14" y="14" width="36" height="36" rx="4" fill="#F4F4F5" stroke="#18181B" strokeWidth="3.5" />
      {/* Header banner */}
      <rect x="18" y="19" width="28" height="6" rx="1.5" fill="#38BDF8" stroke="#18181B" strokeWidth="2" />
      {/* Image frame */}
      <rect x="18" y="29" width="12" height="10" rx="1.5" fill="#CBD5E1" stroke="#18181B" strokeWidth="2" />
      {/* Text lines */}
      <line x1="34" y1="30" x2="45" y2="30" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1="34" x2="44" y2="34" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1="38" x2="42" y2="38" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="43" x2="46" y2="43" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArcadeCrownIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Crown base */}
      <path
        d="M8 38L12 16L24 26L32 8L40 26L52 16L56 38H8Z"
        fill="#FACC15"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Bottom rim */}
      <rect x="7" y="38" width="50" height="6" rx="3" fill="#F59E0B" stroke="#18181B" strokeWidth="3" />
      {/* Jewels */}
      <circle cx="32" cy="8" r="3" fill="#EF4444" stroke="#18181B" strokeWidth="2" />
      <circle cx="12" cy="16" r="2.5" fill="#3B82F6" stroke="#18181B" strokeWidth="2" />
      <circle cx="52" cy="16" r="2.5" fill="#10B981" stroke="#18181B" strokeWidth="2" />
      <circle cx="32" cy="26" r="2" fill="#8B5CF6" />
    </svg>
  );
}

export function ArcadeLightningIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M26 4L10 26H24L20 44L38 20H24L26 4Z"
        fill="#FACC15"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArcadeFlameIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M24 4C24 4 14 16 14 28C14 36 18.5 42 24 42C29.5 42 34 36 34 28C34 20 28 14 28 14C28 14 30 20 28 22C26 24 24 22 24 20C24 16 26 10 24 4Z"
        fill="#F97316"
        stroke="#18181B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 24C24 24 19 28 19 33C19 37 21 39 24 39C27 39 29 37 29 33C29 29 27 27 27 27C27 27 26 29 24 29C22 29 22 27 24 24Z"
        fill="#FACC15"
      />
    </svg>
  );
}

export function ArcadeStarIcon({ className = "w-6 h-6", color = "#FACC15" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M16 2L20.2 11.8L30.5 12.8L22.7 19.8L25 30L16 24.5L7 30L9.3 19.8L1.5 12.8L11.8 11.8L16 2Z"
        fill={color}
        stroke="#18181B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
