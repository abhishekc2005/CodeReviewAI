const steps = [
  {
    number: "1",
    title: "Paste Your Code",
    desc: "Write or paste any code snippet into the editor. JavaScript, Python, and more.",
  },
  {
    number: "2",
    title: "AI Analyzes It",
    desc: "Our AI engine reviews your code for bugs, security, performance, and best practices.",
  },
  {
    number: "3",
    title: "Improve Your Code",
    desc: "Get actionable, structured feedback to write better, cleaner, safer code.",
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

        <div className="landing-how-steps">
          {steps.map((step, i) => (
            <div key={i} className="landing-how-step">
              <div className="landing-how-step-number">{step.number}</div>
              <h3 className="landing-how-step-title">{step.title}</h3>
              <p className="landing-how-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
