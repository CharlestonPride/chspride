import { Header, Page } from "@/sanity/lib/sanity.types";
import BlockHeader from "./blockHeader";
import ObliqueHeader from "./obliqueHeader";
import WaveHeader from "./waveHeader";
export default function HeaderBuilder(props: {
  header: Header | undefined;
  content: JSX.Element[] | undefined;
}) {
  return (
    <>
      {props.header?.style == "block" && (
        <BlockHeader {...props.header} key="block"></BlockHeader>
      )}
      {props.header?.style == "oblique" && (
        <ObliqueHeader {...props.header} key="oblique"></ObliqueHeader>
      )}
      {props.header?.style == "wave" ? (
        <WaveHeader header={props.header} key="wave">
          {props.content}
        </WaveHeader>
      ) : (
        props.content
      )}
    </>
  );
}
