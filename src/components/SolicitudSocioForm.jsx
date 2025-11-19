const SolicitudSocioForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    //Logica enviar datos
  };

  return (
    <form className="card shadow-sm p-4 border-0" onSubmit={handleSubmit}>
      
      {/* 
      <div className="mb-3">
        <label className="form-label">Nombre completo *</label>
        <input type="text" className="form-control" />
      </div> 
      */}

      <div className="d-grid mt-4">
        <button type="submit" className="btn btn-primary">
          Enviar solicitud
        </button>
      </div>
    </form>
  );
};

export default SolicitudSocioForm;
