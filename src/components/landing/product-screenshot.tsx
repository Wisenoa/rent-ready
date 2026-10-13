import { getImageProps } from "next/image";
import type { CSSProperties } from "react";

type Screenshot = { src: string; width: number; height: number };
type ScreenshotStyle = CSSProperties & {
  "--mobile-ratio": string;
  "--desktop-ratio": string;
};

/** Art direction uses actual mobile captures, rather than shrinking desktop text. */
export function ProductScreenshot({
  desktop,
  mobile,
  alt,
  eager = false,
  sizes = "(min-width: 1024px) 65vw, 390px",
}: {
  desktop: Screenshot;
  mobile: Screenshot;
  alt: string;
  eager?: boolean;
  sizes?: string;
}) {
  const common = {
    alt,
    sizes,
    quality: 85,
    loading: eager ? "eager" as const : "lazy" as const,
    fetchPriority: eager ? "high" as const : "auto" as const,
  };
  const { props: desktopProps } = getImageProps({ ...common, ...desktop });
  const { props: mobileProps } = getImageProps({ ...common, ...mobile });
  const style: ScreenshotStyle = {
    "--mobile-ratio": `${mobile.width} / ${mobile.height}`,
    "--desktop-ratio": `${desktop.width} / ${desktop.height}`,
  };

  return (
    <picture
      className="block aspect-[var(--mobile-ratio)] lg:aspect-[var(--desktop-ratio)]"
      style={style}
    >
      <source
        media="(min-width: 1024px)"
        srcSet={desktopProps.srcSet}
        sizes={sizes}
        width={desktop.width}
        height={desktop.height}
      />
      {/* getImageProps supplies Next optimization and responsive srcset for picture. */}
      <img {...mobileProps} alt={alt} className="h-full w-full object-contain" />
    </picture>
  );
}
