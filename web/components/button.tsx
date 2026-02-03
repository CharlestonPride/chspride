import { Theme } from "@/sanity/lib/sanity.types";
import Link from "next/link";

const GradientButton = (props: { label: string; theme: Theme }) => (
  <button type="button" className={"me-1 btn bg-gradient-" + props.theme}>
    {props.label}
  </button>
);
const SolidButton = (props: { label: string; theme: Theme }) => (
  <button type="button" className={"me-1 btn btn-" + props.theme}>
    {props.label}
  </button>
);
const OutlineButton = (props: { label: string; theme: Theme }) => (
  <button type="button" className={"me-1 btn btn-outline-" + props.theme}>
    {props.label}
  </button>
);

const LinkButton = (props: {
  reference: any | undefined;
  url: string | undefined;
  label: string;
  theme: Theme;
  style: "gradient" | "solid" | "outline";
  target?: string;
}) => {
  let button = null;
  switch (props.style) {
    case "gradient":
      button = (
        <GradientButton
          label={props.label}
          theme={props.theme}
        ></GradientButton>
      );
      break;
    case "outline":
      button = (
        <OutlineButton label={props.label} theme={props.theme}></OutlineButton>
      );
      break;
    default:
      button = (
        <SolidButton label={props.label} theme={props.theme}></SolidButton>
      );
  }

  return props?.reference ? (
    <Link href={"/" + (props.reference as any).slug.current}>{button}</Link>
  ) : (
    <Link href={{ pathname: props.url }} target={props.target ?? "_blank"}>
      {button}
    </Link>
  );
};

export { GradientButton, SolidButton, LinkButton };
