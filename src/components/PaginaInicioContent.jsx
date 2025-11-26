import "./PaginaInicioContent.css";
import main from "../assets/images/pagina-inicio-main.png";
import inspo1 from "../assets/images/inspo1.png";
import inspo2 from "../assets/images/inspo2.png";
import inspo3 from "../assets/images/inspo3.png";

export default function PaginaInicioContent (){
    return(
        <div className="pg-inicio-header">
            <h1 className="pg-inicio-titulo">PhotoBogota</h1>
            <p className="pg-inicio-parrafo mt-5">Un espacio para compartir miradas fotográficas y redescubrir Bogotá desde diferentes perspectivas</p>
            <img src={main} alt="Imagen principal" className="pg-inicio-imagen-main"/>
            <h2 className="pg-inicio-titulo">Inspiración</h2>
            <img src={inspo1} alt="Colpatria" className="pg-inicio-img-inspo"/>
            <img src={inspo2} alt="Jimenez" className="pg-inicio-img-inspo"/>
            <img src={inspo3} alt="Torres" className="pg-inicio-img-inspo"/>
        </div>
        
    )
}