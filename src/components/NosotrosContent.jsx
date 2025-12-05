import "./NosotrosContent.css"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const fotoNosotros = "images/img-home/img-nosotros/nosotros.png"
import {motion} from "framer-motion";
import { div } from "framer-motion/client";

export default function NosotrosContent(){
    return(
    <div className="d">
        <Row>
            <Col>
                <h2>Quien coño somos?</h2>
            </Col>
            <Col>
                    <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="pg-nosotros-hero"
              >
                <img src={fotoNosotros} alt="Los parceros" />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    Nosotros
                  </motion.h1>
                  <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    Conozca un poquito de lo que hay detrás de esta ideales
                  </motion.p>
                </div>
              </motion.div>
            </Col>
        </Row>
            </div>
    )
}