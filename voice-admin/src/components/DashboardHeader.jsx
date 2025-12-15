export default function DashboardHeader({ onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center gap-3">
        <div className="user-info d-flex align-items-center gap-2">
          <div className="user-avatar">
            <img src="https://ui-avatars.com/api/?name=Leo+Forger&background=1a2942&color=fff" alt="User" />
          </div>
          <div className="user-details d-none d-md-block">
            <h6 className="mb-0">Hi, Leo Forger!</h6>
            <small className="text-muted">Call Center Manager</small>
          </div>
        </div>
      </div>

      <div className="header-actions d-flex align-items-center gap-2">
        <button className="btn btn-icon" title="Settings">
          <i className="bi bi-gear"></i>
        </button>
        <button className="btn btn-icon" title="Support">
          <i className="bi bi-headset"></i>
        </button>
        <button className="btn btn-icon" onClick={onLogout} title="Logout">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </header>
  );
}
