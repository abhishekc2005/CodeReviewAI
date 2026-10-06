function ReviewPreview() {
  return (
    <section id="preview" className="landing-section landing-preview">
      <div className="landing-section-inner">
        <div className="landing-section-header">
          <p className="landing-section-label">✦ Product Preview</p>
          <h2 className="landing-section-title">
            See CodeReviewAI in action
          </h2>
          <p className="landing-section-desc">
            Get a glimpse of what your AI-powered code review looks like.
          </p>
        </div>

        <div className="landing-preview-card">
          <div className="landing-preview-header">
            <div className="landing-preview-header-left">
              <div className="landing-preview-header-dots">
                <span className="landing-preview-header-dot"></span>
                <span className="landing-preview-header-dot"></span>
                <span className="landing-preview-header-dot"></span>
              </div>
              <span className="landing-preview-header-title">CodeReviewAI</span>
            </div>
            <span className="landing-preview-header-badge">✓ Analyzed</span>
          </div>

          <div className="landing-preview-body">
            <div className="landing-preview-code-panel">
              <div className="landing-preview-panel-label">
                <span className="landing-preview-panel-label-dot"></span>
                Code Editor
              </div>
              <div className="landing-preview-code">
                <pre>
                  <span className="code-keyword">const</span>{" "}
                  <span className="code-param">users</span>{" "}
                  <span className="code-operator">=</span>{" "}
                  <span className="code-param">users</span>
                  <span className="code-operator">.</span>
                  <span className="code-function">filter</span>
                  <span className="code-operator">(</span>
                  <span className="code-param">user</span>{" "}
                  <span className="code-operator">{"=>"}</span>{" "}
                  <span className="code-param">user</span>
                  <span className="code-operator">.</span>
                  <span className="code-param">active</span>
                  <span className="code-operator">)</span>
                  <span className="code-operator">;</span>
                </pre>
              </div>
            </div>

            <div className="landing-preview-review-panel">
              <div className="landing-preview-panel-label">
                <span className="landing-preview-panel-label-dot"></span>
                AI Review
              </div>

              <div className="landing-preview-review-items">
                <div className="landing-preview-review-item">
                  <div className="landing-preview-review-item-label perf">
                    ⚡ Performance
                  </div>
                  <p>
                    Consider filtering only when necessary for large datasets
                    to avoid unnecessary iterations.
                  </p>
                </div>

                <div className="landing-preview-review-item">
                  <div className="landing-preview-review-item-label quality">
                    ✓ Code Quality
                  </div>
                  <p>
                    The implementation is readable and concise. Good use of
                    array methods.
                  </p>
                </div>

                <div className="landing-preview-review-item">
                  <div className="landing-preview-review-item-label best">
                    💡 Best Practice
                  </div>
                  <p>
                    Consider extracting this logic into a reusable function
                    for better maintainability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewPreview;
