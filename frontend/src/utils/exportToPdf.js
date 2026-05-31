import jsPDF from "jspdf";

const exportToPdf = (title, content) => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 180);

  doc.setFontSize(18);
  doc.text(title, 14, 18);
  doc.setFontSize(11);
  doc.text(lines, 14, 30);
  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
};

export default exportToPdf;
