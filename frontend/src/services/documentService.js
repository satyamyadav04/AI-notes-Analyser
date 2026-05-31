import api from "./api";

const getDocuments = () => api.get("/documents");
const getDocument = (id) => api.get(`/documents/${id}`);
const deleteDocument = (id) => api.delete(`/documents/${id}`);
const searchNotes = (params) => api.get("/documents/search", { params });

const uploadDocument = (formData) =>
  api.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export { getDocuments, getDocument, deleteDocument, searchNotes, uploadDocument };
