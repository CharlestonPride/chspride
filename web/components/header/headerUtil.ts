import { urlFor } from "@/sanity/lib/image";
import { Header as HeaderProps } from "@sanity/lib/sanity.types";
import { CSSProperties } from "react";

function getStyle(props: HeaderProps): CSSProperties {
  const ref = props.image?.asset?._ref as string;
  const backgroundImage = ref ? urlFor(ref).url() : "";
  const style: CSSProperties = {
    backgroundImage: `url(${backgroundImage})`,
  };
  if (props.size) {
    style.backgroundSize = props.size;
  }
  if (props.position) {
    style.backgroundPosition = props.position;
  }
  return style;
}

export { getStyle };
