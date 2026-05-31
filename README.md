# AI Notes Analyzer

AI Notes Analyzer is a production-style full stack web application for uploading study notes and turning them into an AI-powered learning workspace. Users can register, upload `PDF`, `TXT`, and `DOCX` documents, generate study assets with Google Gemini, and chat with notes through a RAG pipeline powered by LangChain and ChromaDB.

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router
- Axios
- jsPDF for export

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- `pdf-parse` and `mammoth` for text extraction

### AI / RAG
- Google Gemini API
- LangChain
- ChromaDB
- Gemini Embeddings

## Features

- User registration and login with JWT auth
- Protected dashboard and profile pages
- Upload and index `PDF`, `TXT`, and `DOCX` notes
- Extract and clean text from uploaded documents
- Generate:
  - Short summary
  - Detailed summary
  - Chapter-wise summary
  - Key points
  - Definitions
  - Formulas
  - MCQs with answers and explanations
  - Flashcards
  - Interview questions
  - Topic difficulty analysis
- Chat with notes using RAG
- Keyword search and semantic search
- Analysis and chat history
- PDF export for generated content

## Folder Structure

```text
AI Notes Analyzer/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- uploads/
|   |-- package.json
|   `-- .env.example
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   |-- package.json
|   `-- .env.example
|-- package.json
`-- README.md
```

## Backend API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Documents
- `POST /api/documents/upload`
- `POST /api/documents`
- `GET /api/documents`
- `GET /api/documents/:id`
- `DELETE /api/documents/:id`
- `GET /api/documents/search?q=react&documentId=<optional>`

### AI
- `POST /api/ai/summary`
- `POST /api/ai/keypoints`
- `POST /api/ai/mcq`
- `POST /api/ai/flashcards`
- `POST /api/ai/interview`
- `POST /api/ai/difficulty`
- `POST /api/ai/chat`

## Database Models

### User
- `name`
- `email`
- `password`
- `createdAt`

### Document
- `userId`
- `title`
- `fileUrl`
- `fileType`
- `fileSize`
- `uploadedAt`
- `extractedText`
- `chunks`
- `analytics`

### Analysis
- `userId`
- `documentId`
- `type`
- `payload`
- `createdAt`

### Chat
- `userId`
- `documentId`
- `question`
- `answer`
- `citations`
- `timestamp`

## Environment Variables

### Backend
Copy [backend/.env.example](/c:/FSD/AI%20Analyser/backend/.env.example) to `backend/.env`.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ai-notes-analyzer
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
CHROMA_URL=http://localhost:8000
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=20
```

### Frontend
Copy [frontend/.env.example](/c:/FSD/AI%20Analyser/frontend/.env.example) to `frontend/.env`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## RAG Flow

1. User uploads a document.
2. Backend extracts text from `PDF`, `TXT`, or `DOCX`.
3. Text is cleaned and chunked with:
   - Chunk size: `1000`
   - Overlap: `200`
4. Chunks are embedded with Gemini embeddings.
5. Chunks are stored in ChromaDB.
6. User asks a question in chat.
7. Semantic retrieval fetches the most relevant chunks.
8. Gemini generates an answer using only the retrieved note context.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

Run MongoDB locally or point `MONGODB_URI` to MongoDB Atlas.

### 3. Start ChromaDB

Using Docker:

```bash
docker run -p 8000:8000 chromadb/chroma
```

### 4. Configure environment files

- `backend/.env`
- `frontend/.env`

### 5. Run the project

```bash
npm run dev
```

Frontend:
- `http://localhost:5173`

Backend:
- `http://localhost:5000`

## Deployment Guide

### Frontend
- Deploy `frontend/` to Vercel or Netlify.
- Set `VITE_API_BASE_URL` to the deployed backend API URL.

### Backend
- Deploy `backend/` to Render, Railway, or a VPS.
- Configure:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `GEMINI_API_KEY`
  - `CHROMA_URL`
  - `CLIENT_URL`
- Attach persistent storage if you want to keep uploaded files on disk.

### Recommended Production Setup
- Frontend on Vercel
- Backend on Render or Railway
- MongoDB Atlas
- ChromaDB hosted separately or on a container platform
- Object storage such as S3 or Cloudinary for uploaded files

## Notes for Production Hardening

- Move uploaded files from local disk to cloud object storage.
- Add refresh tokens and secure cookie support if needed.
- Add rate limiting, request validation, and audit logging.
- Add background jobs for large document processing.
- Add streaming chat responses for better UX.
- Normalize AI outputs into strict server-side JSON before saving.

## Important Implementation Note

This codebase is scaffolded as a production-ready foundation, but you still need to:
- install dependencies,
- provide valid Gemini credentials,
- run MongoDB and ChromaDB,
- and test with real documents in your environment.

## License

For personal or internal use.
