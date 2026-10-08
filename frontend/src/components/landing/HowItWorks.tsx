const steps = [
  {
    number: "01",
    title: "Paste or write your code",
    desc: "Write or paste any code snippet into the editor.",
  },
  {
    number: "02",
    title: "Get an AI-powered review",
    desc: "Our AI engine reviews your code for bugs and best practices.",
  },
  {
    number: "03",
    title: "Fix issues with AI",
    desc: "Click 'Fix This Code' to generate an improved version.",
  },
  {
    number: "04",
    title: "Compare and copy",
    desc: "Compare the before/after and copy the improved code.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section landing-how">
      <div className="landing-section-inner">
        <div className="landing-section-header">
          <p className="landing-section-label">✦ How It Works</p>
          <h2 className="landing-section-title">
            How CodeReviewAI Works
          </h2>
          <p className="landing-section-desc">
            Three simple steps to better code — no setup required.
          </p>
        </div>

        <div className="landing-how-steps" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {steps.map((step, i) => (
            <div key={i} className="landing-how-step">
              <div className="landing-how-step-number">{step.number}</div>
              <h3 className="landing-how-step-title">{step.title}</h3>
              <p className="landing-how-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <h3 className="landing-section-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>GitHub Repository Workflow</h3>
          <div className="landing-how-steps" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="landing-how-step">
              <div className="landing-how-step-number">01</div>
              <h3 className="landing-how-step-title">GitHub URL</h3>
              <p className="landing-how-step-desc">Paste a public GitHub repository link.</p>
            </div>
            <div className="landing-how-step">
              <div className="landing-how-step-number">02</div>
              <h3 className="landing-how-step-title">Repository Analysis</h3>
              <p className="landing-how-step-desc">AI scans the structure and important files.</p>
            </div>
            <div className="landing-how-step">
              <div className="landing-how-step-number">03</div>
              <h3 className="landing-how-step-title">AI Insights</h3>
              <p className="landing-how-step-desc">Receive a comprehensive repository review.</p>
            </div>
            <div className="landing-how-step">
              <div className="landing-how-step-number">04</div>
              <h3 className="landing-how-step-title">Actionable Findings</h3>
              <p className="landing-how-step-desc">Understand architecture, security, and performance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
