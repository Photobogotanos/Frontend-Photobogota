import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";


export default function Footer(){

    return(
        <footer className="footer-principal pt-5 pb-5">
            <h3 className="footer-titulo  ">Photo Bogota</h3>
            <h6 className="footer-texto">Todos los derechos reservados</h6>
            <FaFacebook /> <FaYoutube /> <FaInstagram />
        </footer>
    )

}