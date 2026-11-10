import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link-preview card for WhatsApp, X, LinkedIn, Discord, iMessage and search.
export const alt = "Unideals: the campus marketplace to buy and sell with verified students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo-u-blue.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #2B2BDB 0%, #3838EC 55%, #6366F1 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={41} height={60} alt="" />
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>Unideals</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>You have something to sell.</div>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, color: "#C7CBFF" }}>Someone&apos;s looking for it.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28 }}>
          <div style={{ display: "flex", opacity: 0.9 }}>The campus marketplace · Verified students · Zero commission</div>
          <div style={{ display: "flex", fontWeight: 700 }}>unideals.in</div>
        </div>
      </div>
    ),
    size,
  );
}
