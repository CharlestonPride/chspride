import { urlFor } from "@sanity/lib/image";
import { TwoColumnCard as TwoColumnCardProps } from "@sanity/lib/sanity.types";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { Col, Container, Row } from "react-bootstrap";
import { LinkButton } from "../button";
import RoundShadowIcon from "../icon";
import LinkMark from "../portableText/link";

export type Props = TwoColumnCardProps & { orientation: "left" | "right" };

const components: Partial<PortableTextReactComponents> = {
  marks: {
    link: LinkMark,
  },
};
const CardContent = (props: TwoColumnCardProps) => {
  let imagesElems = undefined;
  if (props?.secondary?.length) {
    imagesElems = props.secondary.map((ref, index) => {
      const image = ref?.asset?._ref as string;
      if (!image) return <></>;
      const imageUrl = urlFor(image).url();
      return <img src={imageUrl} key={index} className="w-100 mb-2" />;
    });
  }

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
      <div className="mt-4 lead">
        {props.content?.map((text, index) => {
          return (
            <PortableText
              key={index}
              value={text}
              components={components}
            ></PortableText>
          );
        })}
      </div>
      {buttonElems}
      {imagesElems}
    </>
  );
};

const leftStacked = (props: TwoColumnCardProps, imageUrl: string) => {
  let imgClass = "w-100 border-radius-xl mt-6 ms-5 position-absolute";
  if (props.shadow) {
    imgClass += " shadow-card";
  }
  return (
    <Container className="my-5 mb-lg-10">
      <Row>
        <Col
          xs={{ span: 12, order: 2 }}
          md={{ span: 8, order: 2 }}
          lg={{ span: 6, order: 1 }}
        >
          <div className="position-relative ms-md-5 mb-0 mb-md-7 mb-lg-0 d-none d-lg-block h-75">
            <div
              className={
                "w-100 h-100 border-radius-xl position-absolute bg-gradient-" +
                props.theme
              }
            ></div>

            {imageUrl && <img className={imgClass} src={imageUrl}></img>}
          </div>
        </Col>
        <Col
          xs={{ span: 12, order: 1 }}
          md={{ span: 12, order: 1 }}
          lg={{ span: 5, order: 1 }}
          className="ms-auto"
        >
          <div className="p-3 pt-0">
            <CardContent {...props}></CardContent>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const rightStacked = (props: TwoColumnCardProps, imageUrl: string) => {
  let imgClass = "w-100 border-radius-xl mt-6 ms-n5 position-absolute";
  if (props.shadow) {
    imgClass += " shadow-card";
  }
  return (
    <Container className="my-5 mb-lg-7">
      <Row>
        <Col md="12" lg="5" className="me-auto">
          <div className="p-3 pt-0">
            <CardContent {...props}></CardContent>
          </div>
        </Col>
        <Col md="8" lg="6">
          <div className="position-relative ms-md-5 d-none d-lg-block h-75">
            <div
              className={
                "w-100 h-100 border-radius-xl position-absolute bg-gradient-" +
                props.theme
              }
            ></div>
            {imageUrl && <img className={imgClass} src={imageUrl}></img>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const left = (
  props: TwoColumnCardProps,
  imageUrl: string,
  imgClass: string
) => {
  return (
    <Container className="my-5">
      <Row>
        <Col
          xs="10"
          lg={props.focus ? 6 : 4}
          className="mx-auto py-5 text-lg-left text-center"
        >
          <CardContent {...props}></CardContent>
        </Col>
        <Col
          xs="10"
          lg={props.focus ? 4 : 6}
          className="mx-lg-0 mx-auto px-lg-0 px-md-0 my-auto"
        >
          {imageUrl && <img className={imgClass} src={imageUrl}></img>}
        </Col>
      </Row>
    </Container>
  );
};
const right = (
  props: TwoColumnCardProps,
  imageUrl: string,
  imgClass: string
) => {
  return (
    <Container className="my-5">
      <Row>
        <Col
          xs="10"
          lg={props.focus ? 4 : 6}
          className="mx-lg-0 mx-auto px-lg-0 px-md-0 my-auto"
        >
          {imageUrl && <img className={imgClass} src={imageUrl}></img>}
        </Col>
        <Col
          xs="10"
          lg={props.focus ? 6 : 4}
          className="mx-auto py-5 text-lg-left text-center"
        >
          <CardContent {...props}></CardContent>
        </Col>
      </Row>
    </Container>
  );
};
export default function TwoColumnCard(props: Props) {
  const image = props.primary?.asset?._ref as string;
  const imageUrl = image ? urlFor(image)?.url() : "";

  if (props.stack) {
    return props.orientation === "left"
      ? leftStacked(props, imageUrl)
      : rightStacked(props, imageUrl);
  }

  let imgClass = props.shadow
    ? "w-100  border-radius-lg shadow-card"
    : "w-100 border-radius-lg";
  return props.orientation == "left"
    ? left(props, imageUrl, imgClass)
    : right(props, imageUrl, imgClass);
}
