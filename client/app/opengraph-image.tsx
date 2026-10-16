import { ImageResponse } from "next/og";

export const alt = "QUIZZY — Real-Time Multiplayer Quiz & Interactive Learning Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF7EE",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          border: "16px solid #000000",
        }}
      >
        {/* Top Tag & Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFE600",
              border: "4px solid #000000",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "20px",
              fontWeight: 900,
              color: "#000000",
              boxShadow: "4px 4px 0px #000000",
              letterSpacing: "1px",
            }}
          >
            ⚡ REAL-TIME QUIZ ARENA
          </div>

          <div
            style={{
              display: "flex",
              backgroundColor: "#FFFFFF",
              border: "4px solid #000000",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "18px",
              fontWeight: 900,
              color: "#000000",
              boxShadow: "4px 4px 0px #000000",
            }}
          >
            SOLO & MULTIPLAYER
          </div>
        </div>

        {/* Center Title & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 900,
              color: "#000000",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            QUIZZY
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#1c1917",
              lineHeight: 1.25,
              maxWidth: "1000px",
            }}
          >
            Level Up Your Knowledge in Programming, Aptitude, Science & General Knowledge.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {[
            { label: "💻 Programming & DSA", bg: "#DCFCE7" },
            { label: "🧠 Aptitude & Logic", bg: "#FEF9C3" },
            { label: "🔬 Natural Sciences", bg: "#CFFAFE" },
            { label: "🌍 General Knowledge", bg: "#FFE4E6" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                backgroundColor: item.bg,
                border: "3px solid #000000",
                borderRadius: "16px",
                padding: "12px 20px",
                fontSize: "18px",
                fontWeight: 900,
                color: "#000000",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
