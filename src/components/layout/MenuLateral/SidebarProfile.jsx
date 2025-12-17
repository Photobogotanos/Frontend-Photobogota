import "./SidebarProfile.css";

export default function SidebarProfile({ usuario }) {
  return (
    <div className="sidebar-profile">
      <div className="profile-avatar">
        {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
      </div>
      <div className="profile-info">
        <div className="profile-name">
          {usuario?.nombre || "Usuario"}
        </div>
        <div className="profile-username">
          {usuario?.username || "@usuario"}
        </div>
      </div>
    </div>
  );
}