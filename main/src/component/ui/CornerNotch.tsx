import type { ReactNode } from "react";

type Props = {
  surface: string;
  behind: string;
  radius?: number;
  side?: "left" | "right";
  children: ReactNode;
};

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
