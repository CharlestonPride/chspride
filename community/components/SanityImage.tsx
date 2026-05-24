import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

interface Props {
  source: SanityImageSource;
  alt: string;
  width: number;
  height?: number;
  className?: string;
  fit?: "crop" | "fill" | "max";
}

export default function SanityImage({ source, alt, width, height, className, fit = "crop" }: Props) {
  const builder = urlFor(source).width(width * 2);
  const src = height ? builder.height(height * 2).fit(fit).url() : builder.url();
  return <img src={src} alt={alt} width={width} height={height} className={className} loading="lazy" />;
}
