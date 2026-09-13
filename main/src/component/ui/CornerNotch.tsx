import type { ReactNode } from "react";

type Props = {
  /** Colour of the surface the notch is cut into (the card). */
  surface: string;
  /** Colour visible inside the notch (whatever sits behind the card). */
  behind: string;
  /** Corner radius, in px, of the concave curves. */
  radius?: number;
  /** Which bottom corner to cut. */
  side?: "left" | "right";
  children: ReactNode;
};

/**
 * Cuts a rounded notch into a bottom corner of a `relative` parent and
 * places its children (usually a pill button) inside it.
 */
const CornerNotch = ({
  surface,
  behind,
  radius = 16,
  side = "right",
  children,
}: Props) => {
  const r = `${radius}px`;
  const isLeft = side === "left";
  return (
    <div
      className={`absolute bottom-0 ${isLeft ? "left-0" : "right-0"}`}
      style={{
        background: behind,
        ...(isLeft
          ? { borderTopRightRadius: r, paddingRight: radius * 0.75 }
          : { borderTopLeftRadius: r, paddingLeft: radius * 0.75 }),
        paddingTop: radius * 0.75,
      }}
    >
      {/* Concave corners so the surface curves smoothly into the notch */}
      <span
        aria-hidden
        className={`absolute ${isLeft ? "left-0" : "right-0"}`}
        style={{ top: -radius, width: radius, height: radius, background: behind }}
      >
        <span
          className="block h-full w-full"
          style={{
            background: surface,
            ...(isLeft
              ? { borderBottomLeftRadius: r }
              : { borderBottomRightRadius: r }),
          }}
        />
      </span>
      <span
        aria-hidden
        className="absolute bottom-0"
        style={{
          ...(isLeft ? { right: -radius } : { left: -radius }),
          width: radius,
          height: radius,
          background: behind,
        }}
      >
        <span
          className="block h-full w-full"
          style={{
            background: surface,
            ...(isLeft
              ? { borderBottomLeftRadius: r }
              : { borderBottomRightRadius: r }),
          }}
        />
      </span>
      <div className="relative">{children}</div>
    </div>
  );
};

export default CornerNotch;
