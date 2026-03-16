import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./RequiredMark.css";

export default function RequiredMark() {
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>Campo obligatorio</Tooltip>}
    >
      <span className="required-mark">*</span>
    </OverlayTrigger>
  );
}
