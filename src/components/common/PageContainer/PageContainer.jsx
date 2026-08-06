import Container from "react-bootstrap/Container";
import "./PageContainer.css";

const PageContainer = ({
  children,
  className = "",
  containerClassName = "p-0",
  fluid = true,
  content = false,
}) => {
  const wrapperClass = content ? `page-container ${className}`.trim() : className;
  return (
    <div className={wrapperClass}>
      <Container fluid={fluid} className={containerClassName}>
        {children}
      </Container>
    </div>
  );
};

export default PageContainer;
