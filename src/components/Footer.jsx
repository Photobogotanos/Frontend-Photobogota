import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Footer(){

    return(
        <footer className="footer-principal pt-5 pb-5 p0">
            <Row>
                <Col className="footer-columna-izquierda ">
                    <h3 className="footer-titulo ">Photo Bogota</h3>
                    <h6 className="footer-texto">Todos los derechos reservados</h6>
                    <div className="footer-contenedor-icons pt-5" >
                        <FaFacebook className="footer-icono" size={40}/> <FaYoutube className="footer-icono" size={40} /> <FaInstagram className="footer-icono" size={40} />
                    </div>
                </Col>
                <Col>
                    <Row>
                        <h5>Sergiño</h5>
                        <h5>SotoProgramador</h5>
                        <h5>Sebastacho</h5>
                        <h5>Yanpol</h5>
                        <h5>Danfel</h5>
                    </Row>
                </Col>
            </Row>
            
        </footer>
    )

}