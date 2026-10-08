function GithubPreview() {
  return (
    <section id="github-preview" className="landing-section landing-preview" style={{ background: 'rgba(15, 23, 42, 0.3)' }}>
      <div className="landing-section-inner">
        <div className="landing-section-header">
          <p className="landing-section-label">✦ GitHub Review</p>
          <h2 className="landing-section-title">
            Understand an Entire Repository, Not Just One File.
          </h2>
          <p className="landing-section-desc">
            Paste a public GitHub repository URL and get an AI-assisted analysis of its structure, technology stack, architecture, code quality, security, performance, and maintainability.
          </p>
        </div>

        <div className="landing-preview-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="landing-preview-header">
            <div className="landing-preview-header-left">
              <div className="landing-preview-header-dots">
                <span className="landing-preview-header-dot"></span>
                <span className="landing-preview-header-dot"></span>
                <span className="landing-preview-header-dot"></span>
              </div>
              <span className="landing-preview-header-title">GitHub Repository Review</span>
            </div>
            <span className="landing-preview-header-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              Public repositories only
            </span>
          </div>

          <div className="landing-preview-body" style={{ padding: '24px' }}>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-bg-editor)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔗</span>
                <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>https://github.com/example/project</span>
              </div>
              <button className="landing-btn-primary" style={{ padding: '0 24px', whiteSpace: 'nowrap' }}>
                📦 Review Repository
              </button>
            </div>

            <div style={{ background: 'var(--color-bg-editor)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>Repository Analysis</h3>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>example / project</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>8.4<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/10</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Overall Score</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🏗️</span> Architecture
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Well-structured React frontend with a scalable Node.js/Express backend. Good separation of concerns.</p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔒</span> Security
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Secure JWT implementation, but consider rotating secrets more frequently.</p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚡</span> Performance
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>Efficient database queries, but frontend bundle size could be optimized using code splitting.</p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🛠️</span> Tech Stack
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>React</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Node.js</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>MongoDB</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default GithubPreview;
