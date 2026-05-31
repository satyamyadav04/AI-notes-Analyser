import { v4 as uuidv4 } from "uuid";

const chunkText = (text, chunkSize = 1000, overlap = 200) => {
  const chunks = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const content = text.slice(start, end).trim();

    if (content) {
      chunks.push({
        chunkId: uuidv4(),
        index,
        content,
      });
      index += 1;
    }

    start += chunkSize - overlap;
  }

  return chunks;
};

export default chunkText;
