import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatMessage from "../components/ChatMessage";
import Loader from "../components/Loader";
import { chatWithNotes } from "../services/aiService";
import { getDocument } from "../services/documentService";

const ChatWithNotesPage = () => {
  const { id } = useParams();
  const [documentData, setDocumentData] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await getDocument(id);
      setDocumentData(data.document);
      setMessages(
        data.chats
          .slice()
          .reverse()
          .flatMap((chat) => [
            { role: "user", content: chat.question },
            { role: "assistant", content: chat.answer, citations: chat.citations },
          ]),
      );
      setLoading(false);
    };

    load();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }

    const currentQuestion = question;
    setQuestion("");
    setMessages((current) => [...current, { role: "user", content: currentQuestion }]);
    setSending(true);

    try {
      const { data } = await chatWithNotes(id, currentQuestion);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.chat.answer,
          citations: data.chat.citations,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Loader label="Loading chat workspace" />;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Chat With Notes</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-white">{documentData.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-400">
          Ask direct questions about the uploaded content. Responses are grounded in retrieved note chunks only.
        </p>
      </section>

      <section className="glass-panel flex min-h-[60vh] flex-col p-6">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}`} message={message} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row">
          <input
            className="input-field"
            placeholder='Ask: "What is React?" or "Explain Virtual DOM"'
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <button type="submit" className="primary-button md:min-w-40" disabled={sending}>
            {sending ? "Thinking..." : "Send"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChatWithNotesPage;
