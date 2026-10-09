import React from "react";

// Illustrated arcade player avatars matching the reference screenshot

export function GamerBoyAvatar({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#FEF08A" stroke="#18181B" strokeWidth="3" />
      {/* Cyan Headphones Band */}
      <path d="M22 36C22 24 30 16 40 16C50 16 58 24 58 36" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" />
      {/* Hair */}
      <path
        d="M26 34C26 22 32 18 40 18C48 18 54 22 54 34C54 35 50 32 46 32C42 32 42 34 38 34C34 34 32 32 26 34Z"
        fill="#18181B"
      />
      {/* Face */}
      <ellipse cx="40" cy="42" rx="14" ry="15" fill="#FED7AA" stroke="#18181B" strokeWidth="2.5" />
      {/* Hair bangs */}
      <path d="M30 30L36 36L42 30L46 35L50 30" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Eyes */}
      <ellipse cx="35" cy="40" rx="2" ry="3" fill="#18181B" />
      <ellipse cx="45" cy="40" rx="2" ry="3" fill="#18181B" />
      <circle cx="34.5" cy="39" r="0.8" fill="white" />
      <circle cx="44.5" cy="39" r="0.8" fill="white" />
      {/* Smile */}
      <path d="M36 46C38 49 42 49 44 46" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="#EF4444" />
      {/* Headphone Earcups */}
      <rect x="18" y="32" width="7" height="12" rx="3.5" fill="#FACC15" stroke="#18181B" strokeWidth="2" />
      <rect x="55" y="32" width="7" height="12" rx="3.5" fill="#FACC15" stroke="#18181B" strokeWidth="2" />
      {/* Yellow Hoodie collar */}
      <path d="M28 56C32 53 48 53 52 56L56 70H24L28 56Z" fill="#FACC15" stroke="#18181B" strokeWidth="2.5" />
      <path d="M36 56L38 64" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 56L42 64" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GamerGirlAvatar({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#DDD6FE" stroke="#18181B" strokeWidth="3" />
      {/* Dark Hair base */}
      <path d="M24 38C22 26 30 16 40 16C50 16 58 26 56 38C58 48 58 56 56 60H24C22 56 22 48 24 38Z" fill="#1E1B4B" />
      {/* Pink Headphone Band with cat ears */}
      <path d="M22 36C22 24 30 17 40 17C50 17 58 24 58 36" stroke="#EC4899" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M27 24L31 16L36 21" stroke="#EC4899" strokeWidth="3" strokeLinejoin="round" fill="#F472B6" />
      <path d="M53 24L49 16L44 21" stroke="#EC4899" strokeWidth="3" strokeLinejoin="round" fill="#F472B6" />
      {/* Face */}
      <ellipse cx="40" cy="42" rx="14" ry="14" fill="#FED7AA" stroke="#18181B" strokeWidth="2.5" />
      {/* Hair bangs */}
      <path d="M28 32C34 32 37 36 40 34C43 36 46 32 52 32" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
      {/* Eyes (winking) */}
      <ellipse cx="35" cy="41" rx="2" ry="2.5" fill="#18181B" />
      <circle cx="34.5" cy="40" r="0.8" fill="white" />
      <path d="M43 41C44 39.5 47 39.5 48 41" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="31" cy="44" rx="2" ry="1" fill="#F472B6" />
      <ellipse cx="49" cy="44" rx="2" ry="1" fill="#F472B6" />
      {/* Smile */}
      <path d="M37 46C38.5 48.5 41.5 48.5 43 46" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="#EF4444" />
      {/* Pink Earcups */}
      <rect x="18" y="32" width="7" height="12" rx="3.5" fill="#F472B6" stroke="#18181B" strokeWidth="2" />
      <rect x="55" y="32" width="7" height="12" rx="3.5" fill="#F472B6" stroke="#18181B" strokeWidth="2" />
      {/* Purple Hoodie */}
      <path d="M28 56C32 52 48 52 52 56L56 70H24L28 56Z" fill="#A855F7" stroke="#18181B" strokeWidth="2.5" />
    </svg>
  );
}

export function GamerCapAvatar({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#A7F3D0" stroke="#18181B" strokeWidth="3" />
      {/* Face */}
      <ellipse cx="40" cy="43" rx="14" ry="15" fill="#FED7AA" stroke="#18181B" strokeWidth="2.5" />
      {/* Cap Dome */}
      <path d="M26 34C26 23 32 18 40 18C48 18 54 23 54 34H26Z" fill="#3B82F6" stroke="#18181B" strokeWidth="3" strokeLinejoin="round" />
      {/* Cap Visor */}
      <path d="M22 34C30 32 50 32 58 34C60 36 56 38 48 38C32 38 24 36 22 34Z" fill="#1D4ED8" stroke="#18181B" strokeWidth="2.5" />
      <polygon points="40,22 42,26 46,26 43,29 44,33 40,30 36,33 37,29 34,26 38,26" fill="#FACC15" />
      {/* Eyes */}
      <ellipse cx="35" cy="42" rx="2" ry="2.5" fill="#18181B" />
      <ellipse cx="45" cy="42" rx="2" ry="2.5" fill="#18181B" />
      <circle cx="34.5" cy="41" r="0.8" fill="white" />
      <circle cx="44.5" cy="41" r="0.8" fill="white" />
      {/* Smile */}
      <path d="M37 48C39 50 41 50 43 48" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
      {/* Cyan Shirt */}
      <path d="M28 58C32 54 48 54 52 58L56 70H24L28 58Z" fill="#06B6D4" stroke="#18181B" strokeWidth="2.5" />
    </svg>
  );
}

export function GamerOrangeAvatar({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#FBCFE8" stroke="#18181B" strokeWidth="3" />
      {/* Orange Hair */}
      <path d="M24 36C22 24 30 16 40 16C50 16 58 24 56 36C58 46 58 52 56 58H24C22 52 22 46 24 36Z" fill="#EA580C" />
      {/* Face */}
      <ellipse cx="40" cy="42" rx="14" ry="14" fill="#FED7AA" stroke="#18181B" strokeWidth="2.5" />
      {/* Hair Bangs & Ponytail */}
      <path d="M28 32L34 36L40 32L46 36L52 32" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="28" r="6" fill="#EA580C" stroke="#18181B" strokeWidth="2.5" />
      {/* Eyes */}
      <ellipse cx="35" cy="41" rx="2" ry="2.5" fill="#18181B" />
      <ellipse cx="45" cy="41" rx="2" ry="2.5" fill="#18181B" />
      <circle cx="34.5" cy="40" r="0.8" fill="white" />
      <circle cx="44.5" cy="40" r="0.8" fill="white" />
      {/* Blush */}
      <ellipse cx="31" cy="44" rx="2" ry="1" fill="#FB7185" />
      <ellipse cx="49" cy="44" rx="2" ry="1" fill="#FB7185" />
      {/* Smile */}
      <path d="M37 47C38.5 49 41.5 49 43 47" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="#EF4444" />
      {/* Pink Shirt */}
      <path d="M28 56C32 52 48 52 52 56L56 70H24L28 56Z" fill="#F43F5E" stroke="#18181B" strokeWidth="2.5" />
    </svg>
  );
}
