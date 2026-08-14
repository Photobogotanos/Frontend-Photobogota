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
  { id: "inspo-1", img: inspo1, user: "@sebass.ye", loc: "Cl. 24 #69a-59, Torre Colpatria" },
  { id: "inspo-2", img: centro, user: "@vxc_xerg", loc: "Cra. 4 #13-19, Museo del oro" },
  { id: "inspo-3", img: inspo3, user: "@void0bits", loc: "Cl. 19 #2a-10, Las aguas" },
];

export default function InspoSection({ onImageClick }) {
  return (
    <section id="inspo-section" className="pg-section" aria-labelledby="inspo-title">
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
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="card-inspo"
              >
                <button
                  type="button"
                  className="card-inspo-media"
                  onClick={() => onImageClick(item.img, `Foto de ${item.user}`)}
                  aria-label={`Ver foto de ${item.user}`}
                >
                  <img
                    src={item.img}
                    alt={`Inspiración fotográfica de ${item.user} en ${item.loc}`}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={420}
                  />
                  <span className="card-inspo-zoom" aria-hidden="true" />
                </button>
                <div className="card-info">
                  <h3 className="card-info-title">{item.user}</h3>
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
