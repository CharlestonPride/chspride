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
  reference?: any;
  url?: string;
  target?: string;
  children: React.ReactNode;
}) => {
  return props?.reference ? (
    <Link href={"/" + (props.reference as any).slug.current}>
      {props.children}
    </Link>
  ) : (
    <Link href={{ pathname: props.url }} target={props.target ?? "_blank"}>
      {props.children}
    </Link>
  );
};

export { GradientButton, SolidButton, OutlineButton, LinkButton };
