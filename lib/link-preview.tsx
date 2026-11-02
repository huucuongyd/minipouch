import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const linkPreviewSize = { width: 1200, height: 630 };
export const linkPreviewAlt = `${site.name} — ${site.tagline}`;

const fontDir = join(process.cwd(), "assets/fonts");

const [serif, serifItalic, sans, sansBold] = await Promise.all([
  readFile(join(fontDir, "CormorantGaramond-SemiBold.ttf")),
  readFile(join(fontDir, "CormorantGaramond-SemiBoldItalic.ttf")),
  readFile(join(fontDir, "BeVietnamPro-Medium.ttf")),
  readFile(join(fontDir, "BeVietnamPro-SemiBold.ttf")),
]);

function Bag({
  body,
  accent,
  width,
  height,
}: {
  body: string;
  accent: string;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        background: body,
        borderRadius: 36,
        border: `4px solid ${accent}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 28,
      }}
    >
      <div
        style={{
          width: width * 0.55,
          height: 8,
          borderRadius: 99,
          background: accent,
        }}
      />
      <div style={{ display: "flex", marginTop: 36, gap: 16 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 99,
            background: accent,
          }}
        />
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 99,
            background: "#FFFBF7",
          }}
        />
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 99,
            background: accent,
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  );
}

export function createLinkPreview() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F7F0E8",
          color: "#2C2420",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -60,
            width: 460,
            height: 460,
            borderRadius: 999,
            background: "#E8B4A8",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -90,
            width: 380,
            height: 380,
            borderRadius: 999,
            background: "#6F8B74",
            opacity: 0.16,
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "68px 76px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              maxWidth: 740,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: "#C4726A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 26,
                    borderRadius: 7,
                    border: "2px solid #FFFBF7",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 6,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 2,
                      borderRadius: 2,
                      background: "#FFFBF7",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  marginLeft: 18,
                  fontFamily: "BeVietnam",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 4,
                  color: "#6F8B74",
                }}
              >
                TÚI VẢI MAY TAY
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: "Cormorant",
                  fontSize: 96,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {site.name}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "Cormorant",
                  fontSize: 68,
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: "#9A534C",
                  lineHeight: 1,
                }}
              >
                {site.tagline}
              </div>
            </div>

            <div
              style={{
                fontFamily: "BeVietnam",
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.45,
                color: "#6E615A",
              }}
            >
              {site.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 420,
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 36, display: "flex" }}>
              <Bag body="#D5E0D3" accent="#6F8B74" width={168} height={196} />
            </div>
            <div style={{ position: "absolute", right: 0, bottom: 20, display: "flex" }}>
              <Bag body="#F3D5C8" accent="#C4726A" width={190} height={220} />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...linkPreviewSize,
      fonts: [
        { name: "Cormorant", data: serif, style: "normal", weight: 600 },
        { name: "Cormorant", data: serifItalic, style: "italic", weight: 600 },
        { name: "BeVietnam", data: sans, style: "normal", weight: 500 },
        { name: "BeVietnam", data: sansBold, style: "normal", weight: 600 },
      ],
    },
  );
}
