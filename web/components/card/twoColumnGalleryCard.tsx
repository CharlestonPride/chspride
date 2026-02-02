import { urlFor } from "@sanity/lib/image";
import { TwoColumnGalleryCard as TwoColumnGalleryCardProps } from "@sanity/lib/sanity.types";
import { Container, Row, Col } from "react-bootstrap";
import { LinkButton } from "../button";
import RoundShadowIcon from "../icon";
import { ImageAsset } from "@sanity/lib/types.ext";

export type Props = TwoColumnGalleryCardProps & {
  orientation: "left" | "right";
};

const CardContent = (props: TwoColumnGalleryCardProps) => {
  let buttonElems = props.buttons?.map((button, index) => {
    return (
      <LinkButton
        reference={button.reference}
        label={button.label!}
        url={button.url}
        theme={props.theme!}
        style={index === 0 ? "gradient" : "solid"}
        key={index}
      ></LinkButton>
    );
  });

  return (
    <>
      {props.icon && props.theme && (
        <RoundShadowIcon theme={props.theme} icon={props.icon} />
      )}
      <h3 className={"text-gradient mb-0 text-" + props.theme}>
        {props.title}
      </h3>
      {props.subtitle && <h3>{props.subtitle}</h3>}
      {buttonElems}
    </>
  );
};

const getImage = (props: ImageAsset, imgClass: string) => {
  const image = props?.asset?._ref as string;
  if (!image) return <></>;
  const imageUrl = urlFor(image).url();
  return <img className={imgClass} src={imageUrl}></img>;
};

export default function TwoColumnGalleryCard(props: Props) {
  if (props.orientation === "left") {
    return (
      <Container>
        <Row>
          <Col xs="6" lg="4" className="my-auto">
            <CardContent {...props}></CardContent>
          </Col>
          <Col xs="6" className="d-block d-lg-none">
            {props.images && getImage(props?.images[0], "img-fluid shadow")}
          </Col>
          <Col lg="8" className="ps-5 pe-0 d-none d-lg-block">
            <Row className={"p-2 border-radius-xl bg-gradient-" + props.theme}>
              <Col xs="6" lg="3">
                {props.images &&
                  getImage(
                    props?.images[0],
                    "w-100 border-radius-lg shadow mt-0 mt-lg-7"
                  )}
              </Col>
              <Col xs="6" lg="3">
                {props.images &&
                  getImage(props?.images[1], "w-100 border-radius-lg shadow")}
                {props.images &&
                  getImage(
                    props?.images[2],
                    "w-100 border-radius-lg shadow mt-4"
                  )}
              </Col>
              <Col xs="6" lg="3">
                {props.images &&
                  getImage(
                    props?.images[3],
                    "w-100 border-radius-lg shadow mt-0 mt-lg-5"
                  )}
                {props.images &&
                  getImage(
                    props?.images[4],
                    "w-100 border-radius-lg shadow mt-4"
                  )}
              </Col>
              <Col xs="6" lg="3">
                {props.images &&
                  getImage(
                    props?.images[5],
                    "w-100 border-radius-lg shadow mt-3"
                  )}
                {props.images &&
                  getImage(
                    props?.images[6],
                    "w-100 border-radius-lg shadow mt-4"
                  )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        <Col xs="6" className="d-block d-lg-none">
          {props.images && getImage(props?.images[0], "img-fluid shadow")}
        </Col>
        <Col lg="8" className="pe-5 ps-0 d-none d-lg-block">
          <Row className={"p-2 border-radius-xl bg-gradient-" + props.theme}>
            <Col xs="6" lg="3">
              {props.images &&
                getImage(
                  props?.images[0],
                  "w-100 border-radius-lg shadow mt-0 mt-lg-7"
                )}
            </Col>
            <Col xs="6" lg="3">
              {props.images &&
                getImage(props?.images[1], "w-100 border-radius-lg shadow")}
              {props.images &&
                getImage(
                  props?.images[2],
                  "w-100 border-radius-lg shadow mt-4"
                )}
            </Col>
            <Col xs="6" lg="3">
              {props.images &&
                getImage(
                  props?.images[3],
                  "w-100 border-radius-lg shadow mt-0 mt-lg-5"
                )}
              {props.images &&
                getImage(
                  props?.images[4],
                  "w-100 border-radius-lg shadow mt-4"
                )}
            </Col>
            <Col xs="6" lg="3">
              {props.images &&
                getImage(
                  props?.images[5],
                  "w-100 border-radius-lg shadow mt-3"
                )}
              {props.images &&
                getImage(
                  props?.images[6],
                  "w-100 border-radius-lg shadow mt-4"
                )}
            </Col>
          </Row>
        </Col>
        <Col xs="6" lg="4" className="my-auto">
          <CardContent {...props}></CardContent>
        </Col>
      </Row>
    </Container>
  );
}
