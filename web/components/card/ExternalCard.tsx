import { EmbeddedForm } from "@/sanity/lib/sanity.types";

export default function ExternalCard(props: EmbeddedForm) {
  return (
    <div className="card card-frame mt-2">
      <div className="card-body">
        {props.enabled && (
          <iframe
            title={props.title}
            src={props.url}
            width="100%"
            height={props.height ?? "1000px"}
          ></iframe>
        )}
        {!props.enabled && props.disabledMessage && (
          <h4 className="text-center">{props.disabledMessage}</h4>
        )}
      </div>
    </div>
  );
}
