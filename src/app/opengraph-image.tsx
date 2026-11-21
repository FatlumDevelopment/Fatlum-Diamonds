import { ImageResponse } from "next/og";

export const alt = "Fatlum Diamonds — lose Diamanten, Preis auf Anfrage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f4f0",
          color: "#1c1b19",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8 }}>MÜNCHEN</div>
        <div style={{ fontSize: 92, marginTop: 18, lineHeight: 1 }}>Fatlum</div>
        <div style={{ fontSize: 22, letterSpacing: 10, marginTop: 12 }}>DIAMONDS</div>
        <div style={{ width: 96, height: 1, background: "#1c1b19", marginTop: 32 }} />
        <div style={{ fontSize: 26, marginTop: 28 }}>Lose Diamanten · Preis auf Anfrage</div>
      </div>
    ),
    { ...size },
  );
}
