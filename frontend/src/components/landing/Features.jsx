const features = [
  {
    icon: "🧠",
    title: "AI Code Review",
    desc: "Get actionable feedback on bugs, security, performance, code quality, and best practices.",
  },
  {
    icon: "🌐",
    title: "Multi-Language Support",
    desc: "Review code across JavaScript, TypeScript, Python, Java, C++, C, Go, Rust and more.",
  },
  {
    icon: "📦",
    title: "GitHub Repository Review",
    desc: "Analyze a public GitHub repository and get an AI-assisted overview of its architecture, security, and performance.",
  },
  {
    icon: "🔧",
    title: "Fix This Code",
    desc: "Turn review findings into improved code with a dedicated AI fix action.",
  },
  {
    icon: "⚖️",
    title: "Before vs After",
    desc: "Compare your original code with the AI-generated improved version side by side.",
  },
  {
    icon: "📋",
    title: "Copy Fixed Code",
    desc: "Copy the improved code instantly and continue developing.",
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
