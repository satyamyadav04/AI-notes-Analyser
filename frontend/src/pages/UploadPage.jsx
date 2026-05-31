import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadDocument } from "../services/documentService";

const UploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const { data } = await uploadDocument(formData);
      navigate(`/notes/${data.document._id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-panel p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Upload Notes</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">Index a new study document</h1>
        <p className="mt-3 text-slate-400">
          We’ll extract text, chunk it into 1000-token windows with overlap, and push embeddings to your vector store for RAG retrieval.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            className="input-field"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Optional custom title"
          />
          <label className="glass-panel block cursor-pointer border border-dashed border-white/15 p-8 text-center">
            <span className="text-lg font-semibold text-white">
              {file ? file.name : "Choose PDF, TXT, or DOCX"}
            </span>
            <p className="mt-2 text-sm text-slate-400">Maximum size is controlled by the backend environment.</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.txt,.docx"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className="primary-button w-full" disabled={loading}>
            {loading ? "Uploading and indexing..." : "Upload and Analyze"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
