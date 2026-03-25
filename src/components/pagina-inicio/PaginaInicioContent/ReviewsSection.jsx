import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LazyMotion, m, domAnimation } from "framer-motion";

const RESENAS = [
  { id: "r1", user: "@sxbxxs.r",  text: "La mejor app para descubrir spots fotográficos en Bogotá. ¡Insuperable!" },
  { id: "r2", user: "@dieg.oamt", text: "Gracias a PhotoBogotá encontré lugares que ni sabía que existían. 100% recomendada." },
  { id: "r3", user: "@danfel_fr", text: "Ahora entiendo por qué Bogotá es tan fotogénica. Esta app me abrió los ojos." },
];

export default function ReviewsSection() {
  return (
    <>
      <h2 className="section-title">Esto dicen nuestros usuarios</h2>
      <LazyMotion features={domAnimation}>
        <Row className="g-4">
          {RESENAS.map((review, i) => (
            <Col md={4} key={review.id}>
              <m.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-review"
              >
                <p className="user-name">{review.user}</p>
                <p>"{review.text}"</p>
              </m.div>
            </Col>
          ))}
        </Row>
      </LazyMotion>
    </>
  );
}