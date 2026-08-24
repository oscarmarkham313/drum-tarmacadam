/**
 * StatCard — animated stat card for social (1080×1350, 4:5).
 * Mirrors the site's load-in language: word rises from a baseline mask,
 * the numeral springs up on a count, the accent full stop lands last,
 * hairline rule draws. All values from shared design tokens.
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";
import { colors } from "./tokens";

const { fontFamily } = loadFont();

export interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  client: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  prefix = "",
  suffix = "",
  client,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // label rises out of a baseline mask
  const labelRise = spring({ frame, fps, config: { damping: 22, mass: 0.8 }, durationInFrames: 30 });

  // numeral counts on an expo-out curve
  const countT = interpolate(frame, [12, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = countT === 1 ? 1 : 1 - Math.pow(2, -10 * countT);
  const display = Math.round(value * eased).toLocaleString("en-IE");

  // accent stop pops with overshoot after the count settles
  const stop = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 180 },
    durationInFrames: 25,
  });

  // hairline rule draws
  const rule = spring({ frame: frame - 40, fps, config: { damping: 30 }, durationInFrames: 35 });

  // client line settles
  const clientIn = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // quiet exit
  const exit = interpolate(frame, [durationInFrames - 20, durationInFrames - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily,
        justifyContent: "center",
        padding: 110,
        opacity: exit,
      }}
    >
      <div style={{ overflow: "hidden", paddingBottom: 8 }}>
        <div
          style={{
            transform: `translateY(${(1 - labelRise) * 110}%)`,
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: colors.text3,
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: 240,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          color: colors.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {prefix}
        {display}
        {suffix}
        <span
          style={{
            display: "inline-block",
            color: colors.accent,
            transform: `scale(${stop})`,
            transformOrigin: "40% 85%",
          }}
        >
          .
        </span>
      </div>

      <div
        style={{
          marginTop: 70,
          height: 2,
          width: "100%",
          backgroundColor: colors.hairlineDk,
          transform: `scaleX(${rule})`,
          transformOrigin: "left center",
        }}
      />

      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          opacity: clientIn,
          transform: `translateY(${(1 - clientIn) * 14}px)`,
        }}
      >
        <span style={{ fontSize: 42, fontWeight: 700, color: colors.ink }}>
          {client}
        </span>
        <span style={{ fontSize: 34, fontWeight: 600, color: colors.text3 }}>
          Dublin Growth Digital
          <span style={{ color: colors.accent }}>.</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
