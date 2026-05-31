import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DocumentCard from "../components/DocumentCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { deleteDocument, getDocuments } from "../services/documentService";

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const { data } = await getDocuments();
      setDocuments(data.documents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    await deleteDocument(id);
    setDocuments((current) => current.filter((item) => item._id !== id));
  };

  if (loading) {
    return <Loader label="Loading your document workspace" />;
  }

  const totalChunks = documents.reduce((sum, item) => sum + item.chunkCount, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Documents" value={documents.length} hint="Uploaded and ready for AI analysis" />
        <StatCard label="Semantic Chunks" value={totalChunks} hint="Indexed for RAG-based retrieval" />
        <StatCard label="Formats" value="PDF / TXT / DOCX" hint="Flexible ingestion pipeline" />
      </section>

      <section className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Your Notes Dashboard</h1>
          <p className="mt-2 text-slate-400">Manage uploads, open analyses, and launch chat sessions.</p>
        </div>
        <Link to="/upload" className="primary-button">
          Upload Notes
        </Link>
      </section>

      {documents.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {documents.map((document) => (
            <DocumentCard key={document._id} document={document} onDelete={handleDelete} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No notes uploaded yet"
          description="Upload your first PDF, DOCX, or TXT file to unlock AI summaries, quizzes, and note-grounded chat."
          action={
            <Link to="/upload" className="primary-button">
              Upload First Note
            </Link>
          }
        />
      )}
    </div>
  );
};

export default DashboardPage;
