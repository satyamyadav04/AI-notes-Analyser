import { ChromaClient } from "chromadb";

import { getEmbeddingsModel, getGeminiChatModel } from "./geminiService.js";

let collectionPromise;

const getCollection = async () => {
  if (!collectionPromise) {
    const client = new ChromaClient({
      path: process.env.CHROMA_URL,
    });

    collectionPromise = client.getOrCreateCollection({
      name: "ai-notes-analyzer",
    });
  }

  return collectionPromise;
};

const indexDocumentChunks = async (documentRecord) => {
  const collection = await getCollection();
  const embeddings = await getEmbeddingsModel().embedDocuments(
    documentRecord.chunks.map((chunk) => chunk.content),
  );

  if (documentRecord.chunks.length) {
    await collection.add({
      ids: documentRecord.chunks.map((chunk) => chunk.chunkId),
      documents: documentRecord.chunks.map((chunk) => chunk.content),
      embeddings,
      metadatas: documentRecord.chunks.map((chunk) => ({
        documentId: documentRecord._id.toString(),
        userId: documentRecord.userId.toString(),
        chunkId: chunk.chunkId,
        index: chunk.index,
        title: documentRecord.title,
      })),
    });
  }
};

const deleteDocumentVectors = async (documentRecord) => {
  const collection = await getCollection();
  if (!documentRecord?.chunks?.length) {
    return;
  }

  await collection.delete({
    ids: documentRecord.chunks.map((chunk) => chunk.chunkId),
  });
};

const semanticSearch = async ({ documentId, query, limit = 4 }) => {
  const collection = await getCollection();
  const queryEmbedding = await getEmbeddingsModel().embedQuery(query);
  const result = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: limit,
    where: { documentId },
  });

  return (result.documents?.[0] || []).map((content, index) => ({
    content,
    score: result.distances?.[0]?.[index] || 0,
    metadata: result.metadatas?.[0]?.[index] || {},
  }));
};

const answerQuestionFromNotes = async ({ documentRecord, question }) => {
  const matches = await semanticSearch({
    documentId: documentRecord._id.toString(),
    query: question,
    limit: 5,
  });

  const context = matches.map((match, index) => `Chunk ${index + 1}:\n${match.content}`).join("\n\n");
  const model = getGeminiChatModel();
  const response = await model.invoke(`
You are the "Chat With Notes" assistant.
Answer only from the retrieved note context.
If the answer is not supported by the context, say:
"I could not find that in the uploaded notes."
Keep the answer concise but clear.

Question:
${question}

Retrieved Context:
${context}
`);

  return {
    answer: response.content,
    citations: matches.map((match) => ({
      chunkId: match.metadata.chunkId,
      score: match.score,
      excerpt: `${match.content.slice(0, 180)}...`,
    })),
  };
};

export { indexDocumentChunks, deleteDocumentVectors, semanticSearch, answerQuestionFromNotes };
