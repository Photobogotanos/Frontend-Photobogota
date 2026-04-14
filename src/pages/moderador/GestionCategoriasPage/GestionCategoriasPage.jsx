import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { FaTags, FaMapMarkerAlt } from "react-icons/fa";
import CategoriaList from "@/components/moderador/GestionCategorias/CategoriaList";
import LocalidadList from "@/components/moderador/GestionCategorias/LocalidadList";
import "./GestionCategoriasPage.css";
import Container from 'react-bootstrap/Container';

const GestionCategoriasPage = () => {
  const [key, setKey] = useState("categorias");

  return (
    <div className="gestion-categorias-page">
      <Container className='mt-3'>
        <div className="page-header">
          <h1 className="page-title">Gestión de Categorías y Localidades</h1>
          <p className="page-subtitle">
            Administra las categorías de establecimiento y las localidades disponibles
          </p>
        </div>

        <div className="tabs-container">
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="custom-tabs">
            <Tab eventKey="categorias" title={<><FaTags /> Categorías de Establecimiento</>}>
              <div className="tab-content-categorias">
                <CategoriaList />
              </div>
            </Tab>

            <Tab eventKey="localidades" title={<><FaMapMarkerAlt /> Localidades</>}>
              <div className="tab-content-categorias">
                <LocalidadList />
              </div>
            </Tab>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default GestionCategoriasPage;