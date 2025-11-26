import "./PaginaInicioContent.css";
import main from "../assets/images/pagina-inicio-main.png";
import inspo1 from "../assets/images/inspo1.png";
import inspo2 from "../assets/images/inspo2.png";
import inspo3 from "../assets/images/inspo3.png";
import monserrate from "../assets/images/monserrate.png";
import jardin from "../assets/images/jardin-botanico.png"
import calera from "../assets/images/calera.png";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { IoPin } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";

export default function PaginaInicioContent (){
    return(
        <div className="pg-inicio-header">
            <h1 className="pg-inicio-titulo">PhotoBogota</h1>
            <p className="pg-inicio-parrafo mt-3 mb-5">Un espacio para compartir miradas fotográficas y redescubrir Bogotá desde diferentes perspectivas</p>
            <img src={main} alt="Imagen principal" className="pg-inicio-imagen-main"/>
            <h2 className="pg-inicio-titulo pb-5">Inspiración</h2>
            <Row>   
                <Col>
                    <img src={inspo1} alt="Colpatria" className="pg-inicio-img-inspo"/>
                    <h5 className="inspo-user"> @sebass.ye</h5>  
                    <IoPin /> Cl. 24 # 69a - 59
                </Col>
                <Col>
                    <img src={inspo2} alt="Jimenez" className="pg-inicio-img-inspo"/>
                    <h5 className="inspo-user">@vxc_xerg</h5> 
                    <IoPin /> Cra. 4 #13-19 a 13-1
                </Col>
                <Col>
                    <img src={inspo3} alt="Torres" className="pg-inicio-img-inspo"/> 
                    <h5 className="inspo-user">@void0bits</h5> 
                    <IoPin /> Cl. 19 #2a - 10, Bogotá
                </Col> 
            </Row>
            <h2 className="pg-inicio-titulo mt-5 pb-5">Esto dicen nuestros usuarios </h2>
            <Row>
                <Col>
                    <div className="pg-inicio-contenedor"></div>

                </Col>
                <Col>
                    <div className="pg-inicio-contenedor"></div>

                </Col>
                <Col>
                    <div className="pg-inicio-contenedor"></div>

                </Col>
            </Row>
            <h2 className="pg-inicio-titulo mt-5 pb-5">Top Spots Mas Visitados </h2>
            <Row>
                <Col>
                    <img src={monserrate} alt="Colpatria" className="pg-inicio-img-inspo"/>
                    <h5 className="inspo-user"> Monserrate</h5>
                    <FaRegHeart /> 1795
                </Col>
                <Col>
                    <img src={jardin} alt="Colpatria" className="pg-inicio-img-inspo"/>
                    <h5 className="inspo-user"> Jardín Botánico</h5>
                    <FaRegHeart /> 1247
                </Col>
                <Col>
                    <img src={calera} alt="Colpatria" className="pg-inicio-img-inspo"/>
                    <h5 className="inspo-user"> La Calera</h5>
                    <FaRegHeart /> 1386
                </Col>
            </Row>
            <h2 className="pg-inicio-titulo mt-5 pb-5">Como encontrar Spots</h2>
            <Row>
                <Col>
                
                </Col>
                <Col>
                
                </Col>
            </Row>
        </div>   
    )
}