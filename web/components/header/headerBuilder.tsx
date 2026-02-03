import { Header, Page } from "@/sanity/lib/sanity.types";
import BlockHeader from "./blockHeader";
import ObliqueHeader from "./obliqueHeader";
import WaveHeader from "./waveHeader";
import FullHeader from "./fullHeader";
export default function HeaderBuilder(props: {
  header: Header | undefined;
  content: React.ReactNode | undefined;
  id: string;
}) {
  return (
    <>
      {props.header?.style == "block" && (
        <BlockHeader {...props.header} key={props.id + "-block"}></BlockHeader>
      )}
      {props.header?.style == "oblique" && (
        <ObliqueHeader
          {...props.header}
          key={props.id + "-oblique"}
        ></ObliqueHeader>
      )}
      {props.header?.style == "full" && (
        <FullHeader {...props.header} key={props.id + "-full"}></FullHeader>
      )}
      {props.header?.style == "wave" ? (
        <WaveHeader header={props.header} key={props.id + "-wave"}>
          {props.content}
        </WaveHeader>
      ) : (
        props.content
      )}
    </>
  );
}
