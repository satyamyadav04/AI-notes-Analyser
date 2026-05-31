const ChatMessage = ({ message }) => (
  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-3xl rounded-3xl px-5 py-4 text-sm ${
        message.role === "user" ? "bg-brand-500 text-white" : "glass-panel text-slate-200"
      }`}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>
      {message.citations?.length ? (
        <div className="mt-3 border-t border-white/10 pt-3 text-xs text-slate-400">
          {message.citations.map((citation) => (
            <p key={citation.chunkId}>{citation.excerpt}</p>
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

export default ChatMessage;
