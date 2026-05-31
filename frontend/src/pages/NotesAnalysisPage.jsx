import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AnalysisPanel from "../components/AnalysisPanel";
import Loader from "../components/Loader";
import SearchPanel from "../components/SearchPanel";
import {
  generateDifficulty,
  generateFlashcards,
  generateInterview,
  generateKeypoints,
  generateMcqs,
  generateSummary,
} from "../services/aiService";
import { getDocument, searchNotes } from "../services/documentService";
import exportToPdf from "../utils/exportToPdf";
import parsePayload from "../utils/parsePayload";

const actions = [
  { key: "summary", label: "Generate Summary", run: generateSummary },
  { key: "keypoints", label: "Generate Key Points", run: generateKeypoints },
  { key: "mcq10", label: "Generate 10 MCQs", run: (id) => generateMcqs(id, 10) },
  { key: "mcq20", label: "Generate 20 MCQs", run: (id) => generateMcqs(id, 20) },
  { key: "flashcards", label: "Generate Flashcards", run: generateFlashcards },
  { key: "interview", label: "Interview Questions", run: generateInterview },
  { key: "difficulty", label: "Difficulty Analysis", run: generateDifficulty },
];

const NotesAnalysisPage = () => {
  const { id } = useParams();
  const [documentData, setDocumentData] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const loadDocument = async () => {
    const { data } = await getDocument(id);
    setDocumentData(data);
    setSelectedAnalysis(data.analyses[0] || null);
    setLoading(false);
  };

  useEffect(() => {
    loadDocument();
  }, [id]);

  const handleAction = async (action) => {
    setBusyAction(action.key);
    try {
      const { data } = await action.run(id);
      setSelectedAnalysis(data.analysis);
      await loadDocument();
    } finally {
      setBusyAction("");
    }
  };

  const handleSearch = async () => {
    const { data } = await searchNotes({ q: searchQuery, documentId: id });
    setSearchResults(data);
  };

  if (loading) {
    return <Loader label="Loading document analysis workspace" />;
  }

  const latestPayload = parsePayload(selectedAnalysis?.payload);

  return (
    <div className="space-y-8">
      <section className="glass-panel p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Analysis Workspace</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white">{documentData.document.title}</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Run AI transformations on the extracted note text, then export useful outputs as PDF.
            </p>
          </div>
          <Link to={`/notes/${id}/chat`} className="primary-button">
            Open Chat With Notes
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => handleAction(action)}
              className="secondary-button !py-2 !text-sm"
              disabled={busyAction === action.key}
            >
              {busyAction === action.key ? "Generating..." : action.label}
            </button>
          ))}
          {selectedAnalysis ? (
            <button
              type="button"
              onClick={() => exportToPdf(`${documentData.document.title}-${selectedAnalysis.type}`, JSON.stringify(latestPayload, null, 2))}
              className="primary-button !py-2 !text-sm"
            >
              Export Latest PDF
            </button>
          ) : null}
        </div>
      </section>

      <SearchPanel
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={handleSearch}
        results={searchResults}
      />

      {selectedAnalysis ? <AnalysisPanel analysis={selectedAnalysis} /> : null}

      <section className="glass-panel p-6">
        <h2 className="text-2xl font-semibold text-white">History</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {documentData.analyses.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setSelectedAnalysis(item)}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left transition hover:border-brand-400/40"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-brand-300">{item.type}</p>
              <p className="mt-2 text-sm text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NotesAnalysisPage;
