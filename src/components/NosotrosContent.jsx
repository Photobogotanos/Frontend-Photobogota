import "./NosotrosContent.css"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const fotoNosotros = "../public/images/img-home/nosotros.jpg"
import {motion} from "framer-motion";
import { div } from "framer-motion/client";

export default function NosotrosContent(){
    return(
    <div className="pg-nosotros-total">
        <Row>
            <Col>
              <motion.h3
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                ¿Quienes somos?
              </motion.h3>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <p style={{ fontWeight: "500", fontSize: "20px", margin: "2.5rem 0 1rem" }} >Representando a lo mejor de la programación web y el grupo más duro de la ficha, somos unos aprendices en busca de mostrar a Bogotá con la bella vista que nosotros y muchos más tenemos de la misma por medio de este sitio web hecho con cariño y amor. Además de dejar en alto nuestra ciudad también tratamos de explorar en el desarrollo de software, en el conocimiento continuo y sobre todo en pasar un rato bacano en el proceso. <br/><br/>

                Nuestro mega equipo se compone de: Sebastian Sotomayor, Sebastian Ramon, Daniel Cruz y Juan Marin. Y juntos hacemos realidad el proyecto de PhotoBogota
                </p>
              
              
              </motion.div>

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