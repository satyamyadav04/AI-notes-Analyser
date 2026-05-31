import fs from "fs/promises";

import mammoth from "mammoth";
import pdfParse from "pdf-parse";

const cleanExtractedText = (input) =>
  input.replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();

const extractTextFromFile = async (filePath, fileType) => {
  if (fileType === "pdf") {
    const buffer = await fs.readFile(filePath);
    const { text } = await pdfParse(buffer);
    return cleanExtractedText(text);
  }

  if (fileType === "txt") {
    const content = await fs.readFile(filePath, "utf-8");
    return cleanExtractedText(content);
  }

  if (fileType === "docx") {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return cleanExtractedText(value);
  }

  throw new Error("Unsupported file type for extraction.");
};

export { cleanExtractedText, extractTextFromFile };
