// src/pages/SurveyPage.jsx
// ─── ONE component per file rule: SurveyPage only ───────────────────────────

import Header from "../components/Header";
import SurveyForm from "../components/SurveyForm";

const SurveyPage = () => {
  return (
    <div className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Header />

      {/* Main content */}
      <main id="main-content" aria-label="Survey page main content">
        {/* Offset spacer so wave overlap feels natural */}
        <div className="h-4" aria-hidden="true" />
        <SurveyForm />
      </main>

      {/* Footer */}
      <footer
        role="contentinfo"
        className="border-t border-slate-100 bg-white/60 py-8 text-center backdrop-blur-sm"
      >
        <p className="text-xs font-medium text-slate-400">
          © 2026 Final Year Survey ·{" "}
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Conducted in ACP College for research purpose.
        </p>
      </footer>
    </div>
  );
};

export default SurveyPage;
