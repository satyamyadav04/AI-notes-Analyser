import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const getGeminiChatModel = () =>
  new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    temperature: 0.2,
  });

const getEmbeddingsModel = () =>
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004",
  });

const createJsonPrompt = ({ task, notesContent, outputSpec }) => `
You are an academic AI assistant for the product "AI Notes Analyzer".
Only use the content from the uploaded notes below.
If the notes do not contain enough information, clearly state what is missing instead of inventing facts.

Task:
${task}

Output requirements:
${outputSpec}

Notes:
${notesContent}
`;

const generateStructuredContent = async ({ task, notesContent, outputSpec }) => {
  const model = getGeminiChatModel();
  const response = await model.invoke(
    createJsonPrompt({
      task,
      notesContent,
      outputSpec,
    }),
  );

  return response.content;
};

export { getGeminiChatModel, getEmbeddingsModel, generateStructuredContent };
