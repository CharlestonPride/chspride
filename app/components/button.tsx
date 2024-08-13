import { Theme } from "@/sanity/lib/sanity.types";
import Link from "next/link";

const GradientButton = (props: { label: string, theme: Theme }) => (
    <button type="button" className={"btn bg-gradient-" + props.theme}>
        {props.label}
    </button>
);
const SolidButton = (props: { label: string, theme: Theme }) => (
    <button type="button" className={"btn bg-" + props.theme}>
        {props.label}
    </button>
);

const LinkButton = (props: { reference: any | undefined, url: string | undefined, label: string, theme: Theme, style: 'gradient' | 'solid' }) => {
    let button = props.style === 'gradient' ? <GradientButton label={props.label!} theme={props.theme!}></GradientButton> : <SolidButton label={props.label} theme={props.theme}></SolidButton>
    return props?.reference ?
        <Link href={'/' + (props.reference as any).slug.current}>{button}</Link>
        : <Link href={{ pathname: props.url }} target="_blank" >{button}</Link>
}

export { GradientButton, SolidButton, LinkButton }