import React from "react";

// Illustrated vector graphics specifically designed to match the Quizzy Results page comic arcade theme

/**
 * Cheerful gamer boy illustration celebrating with fist pumped in the air,
 * yellow hoodie with 'Q' logo, cyan headphones, and spiky dark hair.
 */
export function CelebrationBoyIllustration({ className = "w-40 h-44" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Energy Sparks */}
      <path
        d="M18 70L8 85L22 88L14 105L32 95L24 88L35 82L18 70Z"
        fill="#FFE600"
        stroke="#000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="40" r="3" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
      <polygon points="135,18 138,28 148,29 140,36 142,46 135,40 128,46 130,36 122,29 132,28" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
      <path d="M142 55L148 65L140 68L146 78" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

      {/* Raised Fist (Left Arm / Viewer Left-Center) */}
      <g>
        {/* Arm Sleeve */}
        <path
          d="M62 82L52 48C50 42 54 36 60 34L68 32C74 30 80 34 82 40L86 70"
          fill="#FFE600"
          stroke="#000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Fist Hand */}
        <ellipse cx="64" cy="30" rx="11" ry="10" fill="#FED7AA" stroke="#000" strokeWidth="3" />
        {/* Clenched Fingers */}
        <path d="M56 26C58 22 64 22 67 26" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M62 28C65 24 71 24 73 28" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 32C71 28 75 29 76 34" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        {/* Thumb */}
        <path d="M56 31C58 35 64 36 66 33" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Torso & Yellow Hoodie */}
      <path
        d="M48 116C45 102 54 90 70 88L98 88C114 90 124 102 120 116L126 170H42L48 116Z"
        fill="#FFE600"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Hoodie Collar & Strings */}
      <path
        d="M66 90C72 98 94 98 100 90"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M74 94V112" stroke="#000" strokeWidth="3" strokeLinecap="round" />
      <path d="M92 94V112" stroke="#000" strokeWidth="3" strokeLinecap="round" />
      <circle cx="74" cy="113" r="2.5" fill="#000" />
      <circle cx="92" cy="113" r="2.5" fill="#000" />

      {/* 'Q' Emblem on Hoodie */}
      <g transform="translate(83, 134)">
        <circle cx="0" cy="0" r="10" fill="#18181B" stroke="#000" strokeWidth="2" />
        <text
          x="0"
          y="4.5"
          fill="#FFE600"
          fontSize="13"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          Q
        </text>
      </g>

      {/* Right Arm (bent in cheer, right side) */}
      <path
        d="M112 95L132 108C136 111 137 117 134 122L128 132"
        fill="#FFE600"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="132" cy="126" r="8" fill="#FED7AA" stroke="#000" strokeWidth="3" />

      {/* Head / Face */}
      <ellipse cx="84" cy="68" rx="23" ry="24" fill="#FED7AA" stroke="#000" strokeWidth="3.5" />

      {/* Headphone Band (Cyan) */}
      <path
        d="M57 60C57 42 69 32 84 32C99 32 111 42 111 60"
        stroke="#0D9488"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Headphone Earcups */}
      <rect x="52" y="54" width="10" height="20" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
      <rect x="106" y="54" width="10" height="20" rx="5" fill="#FFE600" stroke="#000" strokeWidth="3" />
      <circle cx="57" cy="64" r="2.5" fill="#0D9488" />
      <circle cx="111" cy="64" r="2.5" fill="#0D9488" />

      {/* Spiky Black Hair */}
      <path
        d="M62 55C60 40 70 34 84 34C98 34 108 40 106 55C106 58 100 52 94 52C88 52 86 55 82 55C78 55 74 51 68 52C64 53 62 55 62 55Z"
        fill="#18181B"
      />
      <path
        d="M68 46L76 56L84 46L90 56L98 48L104 56"
        stroke="#18181B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Eyes (Cheerful Excited Anime Eyes) */}
      <ellipse cx="76" cy="66" rx="3.5" ry="5" fill="#18181B" />
      <ellipse cx="92" cy="66" rx="3.5" ry="5" fill="#18181B" />
      <circle cx="75" cy="64" r="1.5" fill="white" />
      <circle cx="91" cy="64" r="1.5" fill="white" />
      {/* Eyebrows */}
      <path d="M72 58C75 56 79 57 80 59" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M88 59C89 57 93 56 96 58" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Rosy Cheeks */}
      <ellipse cx="70" cy="74" rx="3.5" ry="2" fill="#FB7185" />
      <ellipse cx="98" cy="74" rx="3.5" ry="2" fill="#FB7185" />

      {/* Wide Cheerful Smile */}
      <path
        d="M77 75C79 83 89 83 91 75Z"
        fill="#EF4444"
        stroke="#18181B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M80 75C82 78 86 78 88 75" fill="white" />
    </svg>
  );
}

/**
 * Large golden celebration trophy with star emblem, two handles,
 * dark pedestal base, and hovering crown.
 */
export function CelebrationTrophyIllustration({ className = "w-32 h-40" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Floating Crown above Trophy */}
      <g transform="translate(38, 4)">
        <path
          d="M4 22L7 9L18 15L27 4L36 15L47 9L50 22H4Z"
          fill="#FFE600"
          stroke="#000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x="3" y="21" width="48" height="5" rx="2" fill="#EAB308" stroke="#000" strokeWidth="2" />
        <circle cx="27" cy="4" r="2" fill="#EF4444" stroke="#000" strokeWidth="1.2" />
        <circle cx="7" cy="9" r="1.8" fill="#3B82F6" stroke="#000" strokeWidth="1.2" />
        <circle cx="47" cy="9" r="1.8" fill="#10B981" stroke="#000" strokeWidth="1.2" />
      </g>

      {/* Trophy Handles */}
      <path
        d="M32 50C16 50 14 74 30 84L36 85"
        stroke="#000"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M32 50C16 50 14 74 30 84L36 85"
        stroke="#FACC15"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M98 50C114 50 116 74 100 84L94 85"
        stroke="#000"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M98 50C114 50 116 74 100 84L94 85"
        stroke="#FACC15"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Trophy Cup Body */}
      <path
        d="M32 36H98V72C98 88 84 102 65 102C46 102 32 88 32 72V36Z"
        fill="#FFE600"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Trophy Cup Rim */}
      <path
        d="M28 34C28 31 30 30 34 30H96C100 30 102 31 102 34C102 37 100 38 96 38H34C30 38 28 37 28 34Z"
        fill="#FACC15"
        stroke="#000"
        strokeWidth="3"
      />

      {/* Inner Cup Shading */}
      <path
        d="M84 40C84 72 74 94 65 98C76 94 88 80 88 40H84Z"
        fill="#F59E0B"
        fillOpacity="0.4"
      />

      {/* Star Emblem on Trophy Cup */}
      <polygon
        points="65,52 69,61 79,62 72,69 74,79 65,74 56,79 58,69 51,62 61,61"
        fill="#FFF"
        stroke="#000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Trophy Stem */}
      <path
        d="M57 102H73V120H57V102Z"
        fill="#F59E0B"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Stem Collar Ring */}
      <rect x="52" y="116" width="26" height="6" rx="3" fill="#FFE600" stroke="#000" strokeWidth="2.5" />

      {/* Trophy Pedestal Base */}
      <path
        d="M38 126H92L98 152H32L38 126Z"
        fill="#18181B"
        stroke="#000"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Base Gold Plate */}
      <rect x="44" y="132" width="42" height="14" rx="3" fill="#FFE600" stroke="#000" strokeWidth="2" />
      <line x1="50" y1="139" x2="80" y2="139" stroke="#000" strokeWidth="2" strokeLinecap="round" />

      {/* Sparkles around trophy */}
      <polygon points="112,32 114,38 120,39 115,44 117,50 112,47 107,50 109,44 104,39 110,38" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
      <polygon points="18,102 20,107 25,108 21,112 22,117 18,114 14,117 15,112 11,108 16,107" fill="#FFE600" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Comic Action Background Burst rays (Pastel pink, mint, stars)
 */
export function ComicBackgroundBurst({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Pink comic explosion rays */}
      <path
        d="M300 150L220 30L260 50L300 10L340 50L380 30L300 150Z"
        fill="#FBCFE8"
        fillOpacity="0.7"
      />
      <path
        d="M300 150L460 70L450 110L520 130L450 160L490 200L300 150Z"
        fill="#DDD6FE"
        fillOpacity="0.6"
      />
      <path
        d="M300 150L140 70L150 110L80 130L150 160L110 200L300 150Z"
        fill="#A7F3D0"
        fillOpacity="0.6"
      />
      <path
        d="M300 150L240 260L280 250L300 290L320 250L360 260L300 150Z"
        fill="#FEF08A"
        fillOpacity="0.7"
      />

      {/* Decorative Dots and Crosses */}
      <circle cx="120" cy="40" r="4" fill="#F43F5E" />
      <circle cx="480" cy="40" r="4" fill="#8B5CF6" />
      <circle cx="530" cy="240" r="5" fill="#10B981" />
      <circle cx="70" cy="240" r="5" fill="#F59E0B" />
      <path d="M190 20L198 28M198 20L190 28" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      <path d="M410 20L418 28M418 20L410 28" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Arcade bullseye target icon for Accuracy stat card
 */
export function ArcadeTargetIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#A7F3D0" stroke="#000" strokeWidth="2.5" />
      <circle cx="18" cy="18" r="11" fill="#C084FC" stroke="#000" strokeWidth="2" />
      <circle cx="18" cy="18" r="6" fill="#F43F5E" stroke="#000" strokeWidth="2" />
      <circle cx="18" cy="18" r="2.5" fill="white" />
      <path
        d="M27 9L33 3M33 3H28M33 3V8"
        stroke="#000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Leaderboard Rank Badge (#1 Crown, #2 Scallop Purple, #3 Scallop Mint, #4 Scallop Pink)
 */
export function LeaderboardRankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 44 44" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 33L10 16L18 22L22 10L26 22L34 16L36 33H8Z"
            fill="#FFE600"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="7" y="32" width="30" height="5" rx="2" fill="#EAB308" stroke="#000" strokeWidth="2.5" />
        </svg>
        <span className="absolute bottom-1.5 font-black text-xs text-black">#1</span>
      </div>
    );
  }

  const badgeConfigs: Record<number, { bg: string; fill: string }> = {
    2: { bg: "#DDD6FE", fill: "#C4B5FD" }, // Purple
    3: { bg: "#A7F3D0", fill: "#6EE7B7" }, // Mint
    4: { bg: "#FBCFE8", fill: "#F472B6" }, // Pink
  };
  const config = badgeConfigs[rank] || { bg: "#FEF08A", fill: "#FDE047" };

  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 3L23.8 8.5L30.3 7.8L32.3 14L38 18L35.5 24.5L38 31L32.3 33L30.3 39.2L23.8 38.5L20 43L16.2 38.5L9.7 39.2L7.7 33L2 31L4.5 24.5L2 18L7.7 14L9.7 7.8L16.2 8.5L20 3Z"
          transform="scale(0.85) translate(3.5, 3)"
          fill={config.bg}
          stroke="#000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute font-black text-xs text-black">#{rank}</span>
    </div>
  );
}
