import { Offcanvas } from "react-bootstrap";
import "./SidebarHeader.css";

export default function SidebarHeader() {
  return (
    <Offcanvas.Header closeButton className="sidebar-header">
      <Offcanvas.Title>Photo Bogotá</Offcanvas.Title>
    </Offcanvas.Header>
  );
}