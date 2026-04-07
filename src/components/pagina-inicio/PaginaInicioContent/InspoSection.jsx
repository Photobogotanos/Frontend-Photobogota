import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoPin } from "react-icons/io5";
import { LazyMotion, m, domAnimation } from "framer-motion";

import FotoInspo1 from "/images/img-home/inspo1.jpg?url";
import FotoInspo3 from "/images/img-home/inspo3.jpg?url";
import FotoCentro from "/images/img-home/centro.jpg?url";

const inspo1 = FotoInspo1;
const inspo3 = FotoInspo3;
const centro = FotoCentro;

const INSPOS = [
  { id: "inspo-1", img: inspo1,  user: "@sebass.ye", loc: "Cl. 24 #69a-59, Torre Colpatria" },
  { id: "inspo-2", img: centro,  user: "@vxc_xerg",  loc: "Cra. 4 #13-19, Museo del oro" },
  { id: "inspo-3", img: inspo3,  user: "@void0bits",  loc: "Cl. 19 #2a-10, Las aguas" },
];

export default function InspoSection({ onImageClick }) {
  return (
    <>
      <h2 className="section-title">Inspiración del día</h2>
      <LazyMotion features={domAnimation}>
        <Row className="g-4">
          {INSPOS.map((item, i) => (
            <Col xs={12} md={6} lg={4} key={item.id}>
              <m.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="card-inspo"
              >
                <img
                  src={item.img}
                  alt={`Inspiración ${i + 1}`}
                  onClick={() => onImageClick(item.img, `Foto de ${item.user}`)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onImageClick(item.img, `Foto de ${item.user}`)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver foto de ${item.user}`}
                  style={{ cursor: "pointer" }}
                />
                <div className="card-info">
                  <h5>{item.user}</h5>
                  <div className="location">
                    <IoPin /> {item.loc}
                  </div>
                </div>
              </m.div>
            </Col>
          ))}
        </Row>
      </LazyMotion>
    </>
  );
}