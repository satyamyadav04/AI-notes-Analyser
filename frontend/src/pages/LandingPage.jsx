import { Link } from "react-router-dom";

const features = [
  "AI summaries, key points, definitions, formulas, and chapter breakdowns",
  "MCQs, flashcards, interview questions, and difficulty analysis",
  "RAG-powered chat that answers only from your uploaded notes",
];

const LandingPage = () => (
  <div className="space-y-10">
    <section className="glass-panel overflow-hidden p-8 lg:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Modern study intelligence</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-tight text-white md:text-6xl">
            Turn scattered notes into a searchable AI study system.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Upload PDF, DOCX, or TXT files and get summaries, quizzes, flashcards, topic analysis, and a document-grounded AI chat workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="primary-button">
              Create Account
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {features.map((feature) => (
            <div key={feature} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-slate-200">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="grid gap-6 md:grid-cols-3">
      {[
        { title: "Upload", text: "Drag in a note, extract clean text, and index it into semantic chunks." },
        { title: "Analyze", text: "Generate summaries, key concepts, interview prep, and assessment content." },
        { title: "Chat", text: "Ask questions against your notes with RAG retrieval and source-grounded answers." },
      ].map((item) => (
        <div key={item.title} className="glass-panel p-6">
          <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
          <p className="mt-3 text-slate-400">{item.text}</p>
        </div>
      ))}
    </section>
  </div>
);

export default LandingPage;
