import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoPin } from "react-icons/io5";
import { LazyMotion, m, domAnimation } from "framer-motion";

import FotoInspo1 from "/images/img-home/inspo1.webp?url";
import FotoInspo3 from "/images/img-home/inspo3.webp?url";
import FotoCentro from "/images/img-home/centro.webp?url";

const inspo1 = FotoInspo1;
const inspo3 = FotoInspo3;
const centro = FotoCentro;

const INSPOS = [
  { id: "inspo-1", img: inspo1, loc: "Cl. 24 #69a-59, Torre Colpatria" },
  { id: "inspo-2", img: centro, loc: "Cra. 4 #13-19, Museo del oro" },
  { id: "inspo-3", img: inspo3, loc: "Cl. 19 #2a-10, Las aguas" },
];

export default function InspoSection({ onImageClick }) {
  return (
    <section
      id="inspo-section"
      className="pg-section"
      aria-labelledby="inspo-title"
    >
      <h2 id="inspo-title" className="section-title">
        Inspiración
      </h2>
      <LazyMotion features={domAnimation}>
        <Row className="g-4">
          {INSPOS.map((item, i) => (
            <Col xs={12} md={6} lg={4} key={item.id}>
              <m.article
                initial={{ y: 48, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="card-inspo"
              >
                <button
                  type="button"
                  className="card-inspo-media"
                  onClick={() =>
                    onImageClick(item.img, "Ubicación: " + item.loc)
                  }
                  aria-label={`Ver foto en ${item.loc}`}
                >
                  <img
                    src={item.img}
                    alt={`Fotografía en ${item.loc}`}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={420}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable={false}
                  />

                  <span className="card-inspo-credits">
                    Sebastián Sotomayor
                  </span>

                  <div className="card-inspo-protect" aria-hidden="true" />

                  <span className="card-inspo-zoom" aria-hidden="true" />
                </button>

                <div className="card-info">
                  <div className="location">
                    <IoPin aria-hidden="true" />
                    <span>{item.loc}</span>
                  </div>
                </div>
              </m.article>
            </Col>
          ))}
        </Row>
      </LazyMotion>
    </section>
  );
}
