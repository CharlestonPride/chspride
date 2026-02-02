import { urlFor } from "@/sanity/lib/image";
import { ImageAsset } from "@sanity/lib/types.ext";

type Props = ImageAsset & { imgClass: string };

export default function SanityImage(props: Props) {
  const image = props?.asset?._ref as string;
  const imageUrl = urlFor(image).url();
  return <img className={props.imgClass} src={imageUrl}></img>;
}
