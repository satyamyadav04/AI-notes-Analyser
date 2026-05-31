import { Link } from "react-router-dom";

const DocumentCard = ({ document, onDelete }) => (
  <div className="glass-panel p-5 transition hover:border-brand-400/40">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-300">{document.fileType}</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{document.title}</h3>
        <p className="mt-2 text-sm text-slate-400">
          {document.chunkCount} chunks indexed • {(document.fileSize / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <button type="button" onClick={() => onDelete(document._id)} className="text-sm text-rose-300">
        Delete
      </button>
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      <Link to={`/notes/${document._id}`} className="primary-button !py-2 !text-sm">
        Analyze
      </Link>
      <Link to={`/notes/${document._id}/chat`} className="secondary-button !py-2 !text-sm">
        Chat With Notes
      </Link>
    </div>
  </div>
);

export default DocumentCard;
