import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LazyMotion, m, domAnimation } from "framer-motion";

const RESENAS = [
  {
    id: "r1",
    user: "@sebaas.jsx",
    text: "Me encanta vivir en Bogotá, la percepción entre la vida y la muerte es casi imperceptible",
  },
  {
    id: "r2",
    user: "@void0bits",
    text: "Parchese, QUE RIIICOO",
  },
  {
    id: "r3",
    user: "@danfel_fr",
    text: "Que bacanería de app para descubrir lugares pa parchar",
  },
];

const inicialUsuario = (user) => {
  const limpio = user.replace(/^@/, "").trim();
  return (limpio[0] || "?").toUpperCase();
};

export default function ReviewsSection() {
  return (
    <section
      className="pg-section pg-section-reviews"
      aria-labelledby="reviews-title"
    >
      <h2 id="reviews-title" className="section-title">
        Esto dicen los parceros
      </h2>
      <LazyMotion features={domAnimation}>
        <Row className="g-4">
          {RESENAS.map((review, i) => (
            <Col md={4} key={review.id}>
              <m.blockquote
                initial={{ scale: 0.94, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-review"
              >
                <div className="card-review-quote" aria-hidden="true">
                  “
                </div>
                <p className="card-review-text">{review.text}</p>
                <footer className="card-review-footer">
                  <span className="card-review-avatar" aria-hidden="true">
                    {inicialUsuario(review.user)}
                  </span>
                  <span className="user-name">{review.user}</span>
                </footer>
              </m.blockquote>
            </Col>
          ))}
        </Row>
      </LazyMotion>
    </section>
  );
}
