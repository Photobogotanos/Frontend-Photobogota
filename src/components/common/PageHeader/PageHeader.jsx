import "./PageHeader.css";

/**
 * Encabezado de página reutilizable: subtítulo, título (Playfair Display),
 * línea degradada animada (shimmer) y descripción opcional.
 *
 * Ejemplo:
 *   <PageHeader
 *     subtitle="Administración"
 *     icon={<FaBullhorn />}
 *     title="Enviar notificación"
 *     description="Texto opcional..."
 *   />
 */
const PageHeader = ({ subtitle, icon, title, description, className = "" }) => {
  return (
    <div className={`page-header mt-5 ${className}`.trim()}>
      <div className="page-header-title-wrap">
        {subtitle && <span className="page-header-subtitle">{subtitle}</span>}
        <h2 className="page-header-title">
          {icon && <span className="page-header-icon">{icon}</span>}
          {title}
        </h2>
        <span className="page-header-line" aria-hidden="true" />
      </div>
      {description && <p className="page-header-descripcion">{description}</p>}
    </div>
  );
};

export default PageHeader;
