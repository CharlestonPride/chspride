import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import { Container } from "react-bootstrap";
import { LinkButton, GradientButton } from "../button";
import { getStyle } from "./headerUtil";

export default function FullHeader(props: HeaderProps) {
  return (
    <header className="mb-7">
      <div className="page-header section-height-75">
        <div
          className={
            " position-absolute fixed-top ms-auto w-100 h-100 z-index-0 d-block"
          }
          style={getStyle(props)}
        ></div>
        <Container>
          <div className="row">
            <div className="col-lg-7 d-flex justify-content-center flex-column">
              <div className="card card-body blur d-flex justify-content-center shadow-lg p-5 mt-5">
                <h1 className={`text-${props.theme}`}>{props.title}</h1>
                {props.subtitle && <h2>{props.subtitle}</h2>}
                {props.buttons?.map((button) =>
                  button.reference ? (
                    <LinkButton reference={button.reference} key={button.label}>
                      <GradientButton
                        label={button.label!}
                        theme={props.theme!}
                      />
                    </LinkButton>
                  ) : (
                    <LinkButton url={button.url ?? ""} key={button.label}>
                      <GradientButton
                        label={button.label!}
                        theme={props.theme!}
                      />
                    </LinkButton>
                  ),
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
