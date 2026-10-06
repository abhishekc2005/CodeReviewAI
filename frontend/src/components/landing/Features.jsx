const features = [
  {
    icon: "🧠",
    title: "AI-Powered Code Analysis",
    desc: "Analyze source code using LLM-powered contextual review that understands your code's intent and structure.",
  },
  {
    icon: "🐛",
    title: "Bug Detection",
    desc: "Identify potential bugs, incorrect logic, and edge cases before they reach production.",
  },
  {
    icon: "🔒",
    title: "Security Analysis",
    desc: "Highlight potential security vulnerabilities and risky patterns in your codebase.",
  },
  {
    icon: "⚡",
    title: "Performance Insights",
    desc: "Identify inefficient code patterns and get suggestions for performance improvements.",
  },
  {
    icon: "🏗️",
    title: "Maintainable Code",
    desc: "Get suggestions for readability, structure, and maintainability to keep your codebase clean.",
  },
  {
    icon: "📋",
    title: "Actionable Feedback",
    desc: "Receive structured, developer-friendly feedback that you can immediately apply to improve your code.",
  },
];

function Features() {
  return (
    <section id="features" className="landing-section landing-features">
      <div className="landing-section-inner">
        <div className="landing-section-header">
          <p className="landing-section-label">✦ Features</p>
          <h2 className="landing-section-title">
            Everything you need for better code
          </h2>
          <p className="landing-section-desc">
            Comprehensive AI-powered analysis that covers every aspect of your code quality.
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((feature, i) => (
            <div key={i} className="landing-feature-card">
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
