const items = [
  {
    icon: "🚀",
    title: "Faster Code Reviews",
    desc: "Get AI feedback in seconds instead of waiting for manual reviews.",
  },
  {
    icon: "✨",
    title: "Better Code Quality",
    desc: "Improve readability, structure, and best practices across your codebase.",
  },
  {
    icon: "🛡️",
    title: "Security-Focused Feedback",
    desc: "Catch security vulnerabilities and risky patterns early in development.",
  },
  {
    icon: "💬",
    title: "Developer-Friendly Explanations",
    desc: "Clear, actionable suggestions that developers can understand and apply.",
  },
];

function TrustSection() {
  return (
    <section className="landing-section landing-trust">
      <div className="landing-section-inner">
        <div className="landing-section-header">
          <p className="landing-section-label">✦ Built for Developers</p>
          <h2 className="landing-section-title">
            Built for developers who care about code quality
          </h2>
          <p className="landing-section-desc">
            CodeReviewAI fits into your development workflow to help you write better code.
          </p>
        </div>

        <div className="landing-trust-grid">
          {items.map((item, i) => (
            <div key={i} className="landing-trust-item">
              <div className="landing-trust-icon">{item.icon}</div>
              <div className="landing-trust-text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
