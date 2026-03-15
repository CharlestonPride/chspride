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

type LinkButtonProps =
  | { reference: any; url?: never; target?: never; children: React.ReactNode }
  | {
      url: string;
      reference?: never;
      target?: string;
      children: React.ReactNode;
    };

const LinkButton = (props: LinkButtonProps) => {
  if (props.reference) {
    return (
      <Link href={"/" + props.reference.slug.current}>{props.children}</Link>
    );
  }
  if (props.url) {
    return (
      <Link href={{ pathname: props.url }} target={props.target ?? "_blank"}>
        {props.children}
      </Link>
    );
  }
  if (process.env.NODE_ENV !== "production") {
    console.error("LinkButton requires either a `reference` or a `url` prop.");
  }
  return <>{props.children}</>;
};

export { GradientButton, SolidButton, OutlineButton, LinkButton };
