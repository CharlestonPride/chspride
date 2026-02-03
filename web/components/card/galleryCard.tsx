import { urlFor } from "@/sanity/lib/image";
import { ImageGalleryCard as GalleryCardProps } from "@/sanity/lib/sanity.types";
import { ImageAsset } from "@/sanity/lib/types.ext";
import { Container, Row, Col, ColProps } from "react-bootstrap";

const getImage = (props: ImageAsset, imgClass: string) => {
  const image = props?.asset?._ref as string;
  if (!image) return <></>;
  const imageUrl = urlFor(image).url();
  return <img className={imgClass} src={imageUrl}></img>;
};

const singleImageCard = (props: GalleryCardProps) => {
  return (
    <Container className="my-5">
      <Row>
        <Col xs={{ span: 10, offset: 1 }}>
          <div className="card ">
            {props.images && getImage(props?.images[0], "card-img")}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const dualImageCard = (props: GalleryCardProps) => {
  return (
    <Container className="my-5">
      <Row className="mt-5">
        <Col md="6" className="position-relative">
          <div className="position-relative ms-md-5 me-md-n5">
            {props.images &&
              getImage(
                props?.images[0],
                "image-left rounded-3 img-fluid position-relative top-0 end-0 bg-cover",
              )}
          </div>
        </Col>
        <Col md="5">
          <div className="position-relative ms-n4 mb-5 mt-8 d-md-block d-none">
            {props.images &&
              getImage(
                props?.images[1],
                "image-right rounded-3 img-fluid position-relative bg-cover",
              )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const triImageCard = (props: GalleryCardProps) => {
  return (
    <Container className="my-5">
      <Row className={"py-2 border-radius-xl bg-gradient-" + props.theme}>
        <Col {...getTriColProps(1)}>
          {props.images && getImage(props?.images[0], getTriImageClass(1))}
        </Col>
        <Col {...getTriColProps(2)}>
          {props.images && getImage(props?.images[1], getTriImageClass(2))}
        </Col>
        <Col {...getTriColProps(3)}>
          {props.images && getImage(props?.images[2], getTriImageClass(3))}
        </Col>
      </Row>
    </Container>
  );
};

function getTriColProps(order: number): ColProps {
  if (order === 1) {
    return { xs: "12", md: "6", lg: "4" };
  } else if (order === 2) {
    return { md: "6", lg: "4" };
  }
  return {
    lg: "4",
  };
}

function getTriImageClass(order: number): string {
  if (order === 1) {
    return "img-fluid border-radius-lg shadow";
  }
  if (order === 2) {
    return "d-md-block d-none img-fluid border-radius-lg shadow";
  }
  return "d-lg-block d-none img-fluid border-radius-lg shadow";
}

const quadImageCard = (props: GalleryCardProps) => {
  return (
    <Container className="my-5">
      <Row>
        <Col md="6" className="position-relative">
          <div className="position-relative ms-md-5 me-md-n5">
            {props.images &&
              getImage(
                props?.images[3],
                "image-left rounded-3 img-fluid position-relative top-0 end-0 bg-cover",
              )}
          </div>
        </Col>
        <Col md="5">
          <div className="position-relative ms-n4 mb-5 mt-7 d-md-block d-none">
            {props.images &&
              getImage(
                props?.images[4],
                "image-right rounded-3 img-fluid position-relative bg-cover",
              )}
          </div>
        </Col>
      </Row>
      <Row className="mt-n6">
        <Col md="6" className="position-relative">
          <div className="position-relative ms-md-5 me-md-n5">
            {props.images &&
              getImage(
                props?.images[0],
                "image-left rounded-3 img-fluid position-relative top-0 end-0 bg-cover",
              )}
          </div>
        </Col>
        <Col md="6">
          <div className="position-relative ms-n6 mb-2 mt-3 d-md-block d-none">
            {props.images &&
              getImage(
                props?.images[1],
                "image-right rounded-3 img-fluid position-relative bg-cover",
              )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const pentaImageCard = (props: GalleryCardProps) => {
  return (
    <Container>
      <Row className="my-5">
        <Col md="7" className="position-relative">
          <div className="position-relative ms-md-5 me-md-n5">
            {props.images &&
              getImage(
                props?.images[0],
                "image-left rounded-3 img-fluid position-relative top-0 end-0 bg-cover",
              )}
          </div>
        </Col>
        <Col md="5">
          <div className="position-relative ms-n6 mb-2 mt-3 d-md-block d-none">
            {props.images &&
              getImage(
                props?.images[1],
                "image-right rounded-3 img-fluid position-relative bg-cover",
              )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 10, offset: 1 }}>
          <div className="card mt-n6">
            {props.images && getImage(props?.images[2], "card-img")}
          </div>
        </Col>
      </Row>
      <Row className="mt-n6">
        <Col md="6" className="position-relative">
          <div className="position-relative ms-md-5 me-md-n5">
            {props.images &&
              getImage(
                props?.images[3],
                "image-left rounded-3 img-fluid position-relative top-0 end-0 bg-cover",
              )}
          </div>
        </Col>
        <Col md="5">
          <div className="position-relative ms-n4 mb-5 mt-8 d-md-block d-none">
            {props.images &&
              getImage(
                props?.images[4],
                "image-right rounded-3 img-fluid position-relative bg-cover",
              )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default function GalleryCard(props: GalleryCardProps) {
  if (!props.images?.length) {
    return <></>;
  }
  switch (props.images.length) {
    case 1:
      return singleImageCard(props);
    case 2:
      return dualImageCard(props);
    case 3:
      return triImageCard(props);
    case 4:
      return quadImageCard(props);
    default:
      return pentaImageCard(props);
  }
}
