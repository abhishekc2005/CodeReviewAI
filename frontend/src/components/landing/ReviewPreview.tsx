function ReviewPreview() {
  return (
    <section id="preview" className="landing-section landing-preview">
      <div className="landing-section-inner">
        <div className="landing-section-header">
          <p className="landing-section-label">✦ Fix This Code</p>
          <h2 className="landing-section-title">
            Don't Just Find Problems. Fix Them.
          </h2>
          <p className="landing-section-desc">
            CodeReviewAI helps you understand what's wrong and gives you an improved version you can use.
          </p>
        </div>

        <div className="landing-preview-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="landing-preview-header">
            <div className="landing-preview-header-left">
              <div className="landing-preview-header-dots">
                <span className="landing-preview-header-dot"></span>
                <span className="landing-preview-header-dot"></span>
                <span className="landing-preview-header-dot"></span>
              </div>
              <span className="landing-preview-header-title">Code Comparison</span>
            </div>
            <button className="landing-btn-ghost" style={{ padding: '4px 12px', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.2)' }}>
              📋 Copy Fixed Code
            </button>
          </div>

          <div className="landing-preview-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--color-border)' }}>
            
            <div className="landing-preview-code-panel" style={{ background: 'var(--color-bg-editor)' }}>
              <div className="landing-preview-panel-label" style={{ color: '#ef4444' }}>
                <span className="landing-preview-panel-label-dot" style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)' }}></span>
                BEFORE
              </div>
              <div className="landing-preview-code" style={{ border: 'none', padding: '24px' }}>
                <pre>
                  <span className="code-keyword">function</span>{" "}
                  <span className="code-function">processUsers</span>
                  <span className="code-operator">(</span>
                  <span className="code-param">users</span>
                  <span className="code-operator">)</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="code-keyword">for</span>{" "}
                  <span className="code-operator">(</span>
                  <span className="code-keyword">var</span>{" "}
                  <span className="code-param">i</span>{" "}
                  <span className="code-operator">=</span>{" "}
                  <span className="code-number">0</span>
                  <span className="code-operator">;</span>{" "}
                  <span className="code-param">i</span>{" "}
                  <span className="code-operator">{"<"}</span>{" "}
                  <span className="code-param">users</span>
                  <span className="code-operator">.</span>
                  <span className="code-param">length</span>
                  <span className="code-operator">;</span>{" "}
                  <span className="code-param">i</span>
                  <span className="code-operator">++</span>
                  <span className="code-operator">)</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"    "}
                  <span className="code-function">setTimeout</span>
                  <span className="code-operator">(</span>
                  <span className="code-keyword">function</span>
                  <span className="code-operator">()</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"      "}
                  <span className="code-param">console</span>
                  <span className="code-operator">.</span>
                  <span className="code-function">log</span>
                  <span className="code-operator">(</span>
                  <span className="code-string">"Processing user: "</span>{" "}
                  <span className="code-operator">+</span>{" "}
                  <span className="code-param">users</span>
                  <span className="code-operator">[</span>
                  <span className="code-param">i</span>
                  <span className="code-operator">]</span>
                  <span className="code-operator">.</span>
                  <span className="code-param">name</span>
                  <span className="code-operator">)</span>
                  <span className="code-operator">;</span>
                  {"\n"}
                  {"    "}
                  <span className="code-operator">{"}"}</span>
                  <span className="code-operator">,</span>{" "}
                  <span className="code-number">1000</span>
                  <span className="code-operator">)</span>
                  <span className="code-operator">;</span>
                  {"\n"}
                  {"  "}
                  <span className="code-operator">{"}"}</span>
                  {"\n"}
                  <span className="code-operator">{"}"}</span>
                </pre>
              </div>
              <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                <button className="landing-btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.85rem' }}>
                  🔧 Fix This Code
                </button>
              </div>
            </div>

            <div className="landing-preview-review-panel" style={{ background: 'var(--color-bg-editor)' }}>
              <div className="landing-preview-panel-label" style={{ color: '#10b981' }}>
                <span className="landing-preview-panel-label-dot" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }}></span>
                AFTER
              </div>
              <div className="landing-preview-code" style={{ border: 'none', padding: '24px' }}>
                <pre>
                  <span className="code-keyword">function</span>{" "}
                  <span className="code-function">processUsers</span>
                  <span className="code-operator">(</span>
                  <span className="code-param">users</span>
                  <span className="code-operator">)</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="code-keyword">for</span>{" "}
                  <span className="code-operator">(</span>
                  <span className="code-keyword">let</span>{" "}
                  <span className="code-param">i</span>{" "}
                  <span className="code-operator">=</span>{" "}
                  <span className="code-number">0</span>
                  <span className="code-operator">;</span>{" "}
                  <span className="code-param">i</span>{" "}
                  <span className="code-operator">{"<"}</span>{" "}
                  <span className="code-param">users</span>
                  <span className="code-operator">.</span>
                  <span className="code-param">length</span>
                  <span className="code-operator">;</span>{" "}
                  <span className="code-param">i</span>
                  <span className="code-operator">++</span>
                  <span className="code-operator">)</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"    "}
                  <span className="code-function">setTimeout</span>
                  <span className="code-operator">(</span>
                  <span className="code-operator">()</span>{" "}
                  <span className="code-operator">{"=>"}</span>{" "}
                  <span className="code-operator">{"{"}</span>
                  {"\n"}
                  {"      "}
                  <span className="code-param">console</span>
                  <span className="code-operator">.</span>
                  <span className="code-function">log</span>
                  <span className="code-operator">(</span>
                  <span className="code-string">`Processing user: </span><span className="code-operator">{"${"}</span><span className="code-param">users</span><span className="code-operator">[</span><span className="code-param">i</span><span className="code-operator">]</span><span className="code-operator">.</span><span className="code-param">name</span><span className="code-operator">{"}"}</span><span className="code-string">`</span>
                  <span className="code-operator">)</span>
                  <span className="code-operator">;</span>
                  {"\n"}
                  {"    "}
                  <span className="code-operator">{"}"}</span>
                  <span className="code-operator">,</span>{" "}
                  <span className="code-number">1000</span>
                  <span className="code-operator">)</span>
                  <span className="code-operator">;</span>
                  {"\n"}
                  {"  "}
                  <span className="code-operator">{"}"}</span>
                  {"\n"}
                  <span className="code-operator">{"}"}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewPreview;
