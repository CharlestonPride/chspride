import { Header as HeaderProps } from "@/sanity/lib/sanity.types";
import { Row, Col } from "react-bootstrap";

export default function WaveHeader(props: {
  header: HeaderProps;
  children: JSX.Element | JSX.Element[] | undefined;
}) {
  const headerClass = `card-header p-5 position-relative bg-gradient-${props.header.theme}`;
  return (
    <section className="pt-3 pt-md-5 pt-lg-7 pb-md-5 pb-lg-7">
      <Row>
        <Col lg="10" className="mx-auto">
          <div className="card shadow-lg">
            <div className={`${headerClass}`}>
              <h1 className="text-white mb-0">{props.header.title}</h1>
              <div className="position-absolute w-100 z-index-1 ms-n5">
                <WaveComponent />
              </div>
            </div>
            <div className="card-body p-sm-5 pt-0 opacity-8 d-none d-lg-block">
              <div className="card card-frame mt-4">
                <div className="card-body">{props.children}</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="d-lg-none">
        <Col>{props.children}</Col>
      </Row>
    </section>
  );
}

const WaveComponent = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 40"
      preserveAspectRatio="none"
      style={{
        height: "7vh",
        minHeight: 50,
      }}
      {...props}
    >
      <defs>
        <path
          id="a"
          d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
        />
      </defs>
      <g className="moving-waves">
        <use xlinkHref="#a" x={48} y={-1} fill="rgba(255,255,255,0.40" />
        <use xlinkHref="#a" x={48} y={3} fill="rgba(255,255,255,0.35)" />
        <use xlinkHref="#a" x={48} y={5} fill="rgba(255,255,255,0.25)" />
        <use xlinkHref="#a" x={48} y={8} fill="rgba(255,255,255,0.20)" />
        <use xlinkHref="#a" x={48} y={13} fill="rgba(255,255,255,0.15)" />
        <use xlinkHref="#a" x={48} y={16} fill="rgba(255,255,255,0.95" />
      </g>
    </svg>
  );
};
