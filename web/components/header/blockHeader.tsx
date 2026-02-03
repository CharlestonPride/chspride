import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import { Container } from "react-bootstrap";
import { LinkButton } from "../button";
import { getStyle } from "./headerUtil";

export default function BlockHeader(props: HeaderProps) {
  return (
    <header className="mb-7">
      <div className="page-header section-height-75">
        <div
          className={
            " position-absolute fixed-top ms-auto w-100 w-lg-75 h-100 z-index-0 d-block"
          }
          style={getStyle(props)}
        ></div>
        <Container>
          <div className="row">
            <div className="col-lg-7 d-flex justify-content-center flex-column">
              <div className="card card-body blur d-flex justify-content-center shadow-lg p-5 mt-5">
                <h1 className={`text-${props.theme}`}>{props.title}</h1>
                {props.subtitle && <h2>{props.subtitle}</h2>}
                {props.buttons?.map((button) => {
                  return (
                    <LinkButton
                      reference={button.reference}
                      label={button.label!}
                      url={button.url}
                      theme={props.theme!}
                      style="gradient"
                      key={button.label}
                    ></LinkButton>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
