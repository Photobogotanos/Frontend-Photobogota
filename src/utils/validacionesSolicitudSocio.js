export default function validateForm(formData) {
  if (!formData.nombres.trim()) {
    return { valido: false, mensaje: "El nombre es obligatorio" };
  }

  if (!formData.apellidos.trim()) {
    return { valido: false, mensaje: "Los apellidos son obligatorios" };
  }

  if (!formData.email.trim()) {
    return { valido: false, mensaje: "El email es obligatorio" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return { valido: false, mensaje: "El correo electrónico no es válido" };
  }

  if (!formData.telefono.trim()) {
    return { valido: false, mensaje: "El teléfono es obligatorio" };
  }

  const phoneRegex = /^[0-9]{7,10}$/;
  if (!phoneRegex.test(formData.telefono)) {
    return { valido: false, mensaje: "El teléfono debe contener solo números (7-10 dígitos)" };
  }

  if (!formData.fechaNacimiento) {
    return { valido: false, mensaje: "La fecha de nacimiento es obligatoria" };
  }

  const birthDate = new Date(formData.fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) {
    return { valido: false, mensaje: "Debes tener al menos 18 años para registrarte" };
  }

  if (!formData.razonSocial.trim()) {
    return { valido: false, mensaje: "La razón social es obligatoria" };
  }

  if (!formData.localidad.trim()) {
    return { valido: false, mensaje: "La localidad es obligatoria" };
  }

  if (!formData.direccion.trim()) {
    return { valido: false, mensaje: "La dirección es obligatoria" };
  }

  if (!formData.nit.trim()) {
    return { valido: false, mensaje: "El NIT es obligatorio" };
  }

  if (!formData.propietario.trim()) {
    return { valido: false, mensaje: "El nombre del propietario es obligatorio" };
  }

  if (!formData.categoria.trim()) {
    return { valido: false, mensaje: "Debe seleccionar una categoría" };
  }

  if (!formData.rutDocumento) {
    return { valido: false, mensaje: "Debes subir tu archivo RUT (PDF o imagen)" };
  }

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(formData.rutDocumento.type)) {
    return { valido: false, mensaje: "El archivo debe ser PDF, JPG o PNG" };
  }

  if (!formData.autorizoUsoDatos) {
    return { valido: false, mensaje: "Debes autorizar el uso de tus datos personales" };
  }

  if (!formData.aceptaTerminos) {
    return { valido: false, mensaje: "Debes aceptar los términos y condiciones" };
  }

  return { valido: true };
};