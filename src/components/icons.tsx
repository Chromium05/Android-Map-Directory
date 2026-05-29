import Svg, { Circle, Path, Rect } from 'react-native-svg';

// ─────────────────────────────────────────────────────────────
// Icon + Glyph sets — ported from the design's atoms.jsx to
// react-native-svg. `Icon` = UI glyphs, `Glyph` = campus categories.
// ─────────────────────────────────────────────────────────────

export type IconProps = {
  size?: number;
  color?: string;
};

const INK = '#1c2520';

type IconComponent = (props: IconProps) => React.ReactElement;

const stroke = (
  node: React.ReactNode,
  { strokeWidth = 1.8 }: { strokeWidth?: number } = {}
): IconComponent =>
  function StrokeIcon({ size = 24, color = INK }: IconProps) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round">
        {node}
      </Svg>
    );
  };

export const Icon: Record<string, IconComponent> = {
  search: stroke(
    <>
      <Circle cx="11" cy="11" r="6.5" />
      <Path d="m20 20-3.5-3.5" />
    </>
  ),
  pin: stroke(
    <>
      <Path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <Circle cx="12" cy="10" r="2.6" />
    </>
  ),
  pinFill: function PinFill({ size = 24, color = INK }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M12 22s7.5-6.6 7.5-11.6A7.5 7.5 0 1 0 4.5 10.4C4.5 15.4 12 22 12 22Z" />
        <Circle cx="12" cy="10" r="2.6" fill="#fff" />
      </Svg>
    );
  },
  home: stroke(
    <>
      <Path d="M4 11 12 4l8 7" />
      <Path d="M5.5 10v9.5h13V10" />
    </>
  ),
  homeFill: function HomeFill({ size = 24, color = INK }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M12 3.2 3.6 10.6V20a1 1 0 0 0 1 1H10v-6h4v6h5.4a1 1 0 0 0 1-1v-9.4Z" />
      </Svg>
    );
  },
  map: stroke(
    <>
      <Path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z" />
      <Path d="M9 4v16M15 6v16" />
    </>
  ),
  info: stroke(
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  chev: stroke(<Path d="m9 6 6 6-6 6" />, { strokeWidth: 2 }),
  arrow: stroke(<Path d="M5 12h14M13 6l6 6-6 6" />, { strokeWidth: 2 }),
  star: function Star({ size = 24, color = INK }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="m12 3.5 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8L6.7 20l1-6-4.4-4.2 6-.9Z" />
      </Svg>
    );
  },
  sliders: stroke(
    <>
      <Path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <Circle cx="16" cy="7" r="2" />
      <Circle cx="10" cy="17" r="2" />
    </>
  ),
  locate: stroke(
    <>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  plus: stroke(<Path d="M12 5v14M5 12h14" />, { strokeWidth: 2 }),
  minus: stroke(<Path d="M5 12h14" />, { strokeWidth: 2 }),
  check: stroke(<Path d="m5 12 5 5 9-11" />, { strokeWidth: 2.2 }),
  x: stroke(<Path d="M6 6l12 12M18 6 6 18" />, { strokeWidth: 2 }),
};

export const Glyph: Record<string, IconComponent> = {
  all: stroke(
    <>
      <Circle cx="6" cy="6" r="2" />
      <Circle cx="6" cy="18" r="2" />
      <Circle cx="18" cy="6" r="2" />
      <Circle cx="18" cy="18" r="2" />
    </>,
    { strokeWidth: 1.7 }
  ),
  dept: stroke(
    <>
      <Path d="M3 9 12 4l9 5" />
      <Path d="M5 10v8M19 10v8M3 19h18" />
      <Path d="M9 11v6M15 11v6" />
    </>,
    { strokeWidth: 1.7 }
  ),
  kesehatan: stroke(
    <>
      <Rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <Path d="M12 8v8M8 12h8" />
    </>,
    { strokeWidth: 1.7 }
  ),
  vokasi: stroke(
    <>
      <Path d="M14.5 6a3.5 3.5 0 1 0 3.5 4l2.5 2.5-3 3L15 13a3.5 3.5 0 1 1-.5-7Z" />
      <Path d="M11 11 4 18l2 2 7-7" />
    </>,
    { strokeWidth: 1.7 }
  ),
  paa: stroke(
    <>
      <Path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <Path d="M14 3v5h5" />
      <Path d="M8 12h8M8 15h8M8 18h5" />
    </>,
    { strokeWidth: 1.7 }
  ),
  kemahasiswaan: stroke(
    <>
      <Circle cx="9" cy="9" r="3" />
      <Path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
      <Circle cx="17" cy="8" r="2.4" />
      <Path d="M14.5 14.5c1 0 6 0 6.5 5.5" />
    </>,
    { strokeWidth: 1.7 }
  ),
  lab: stroke(
    <>
      <Path d="M10 3h4" />
      <Path d="M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3" />
      <Path d="M7.5 14h9" />
    </>,
    { strokeWidth: 1.7 }
  ),
};
