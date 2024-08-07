import { Theme } from "@/sanity/lib/sanity.types";

const GradientButton = (props: { label: string, theme: Theme }) => (
    <button type="button" className={"btn bg-gradient-" + props.theme}>
        {props.label}
    </button>
);

const ExternalGradientButton = (props: { label: string, theme: Theme, url: string }) => (
    <a href={props.url} target="_blank" type="button" className={"btn bg-gradient-" + props.theme}>
        {props.label}
    </a>
);

export { GradientButton, ExternalGradientButton }