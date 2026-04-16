export default function DashboardLoading() {
  return (
    <div className="demo-shell">
      <div className="demo-nav" aria-hidden>
        <div className="container demo-nav-inner">
          <div className="skeleton skeleton-logo" />
          <div className="skeleton-row">
            <div className="skeleton skeleton-link" />
            <div className="skeleton skeleton-link" />
          </div>
          <div className="skeleton skeleton-avatar" />
        </div>
      </div>

      <main className="demo-main">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <div className="skeleton skeleton-heading" />
              <div className="skeleton skeleton-subheading" />
            </div>
            <div className="skeleton skeleton-btn" />
          </div>

          <div className="note-list">
            {[0, 1, 2].map((i) => (
              <div key={i} className="note-card-skeleton" aria-hidden>
                <div className="skeleton skeleton-meta" />
                <div className="skeleton skeleton-preview" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
