import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import { Col, Container, Row } from "react-bootstrap";
import { CSSProperties } from "styled-components";
import { LinkButton } from "./button";
import { urlFor } from "@/sanity/lib/image";

export default function Header(props: HeaderProps) {
    if (!props) {
        return <></>
    }

    if (props.style == 'block') {
        return BlockHeader(props);
    }
    else {
        return ObliqueHeader(props);
    }
}

function getStyle(props: HeaderProps): CSSProperties {
    const backgroundImage = urlFor(props.image?.asset?._ref as string).url()
    const style: CSSProperties = {
        backgroundImage: `url(${backgroundImage})`,
    };
    if (props.size) {
        style.backgroundSize = props.size
    }
    if (props.position) {
        style.backgroundPosition = props.position
    }
    return style;
}

function BlockHeader(props: HeaderProps) {
    return (
        <header className="mb-7">
            <div className="page-header section-height-100">
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
                                {props.buttons?.map(button => {
                                    return <LinkButton reference={button.reference} label={button.label!} url={button.url} theme={props.theme!} style="gradient"></LinkButton>
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </header>)
}

function ObliqueHeader(props: HeaderProps) {
    return (
        <header>
            <div className="page-header section-height-75">
                <div className="oblique position-absolute top-0 h-100 d-md-block d-none">
                    <div
                        className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                        style={getStyle(props)}
                    ></div>
                </div>
                <Container>
                    <Row>
                        <Col
                            md="7"
                            lg="5"
                            className="d-flex justify-content-center flex-column"
                        >
                            <h1 className={`text-${props.theme}`}>{props.title}</h1>
                            {props.subtitle && <h2>{props.subtitle}</h2>}
                            {props.buttons?.map(button => {
                                return <LinkButton reference={button.reference} label={button.label!} url={button.url} theme={props.theme!} style="gradient"></LinkButton>
                            })}
                        </Col>
                    </Row>
                </Container>
            </div>
        </header>)
}