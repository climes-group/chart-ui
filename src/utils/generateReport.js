import { json2csv } from "json-2-csv";

export function generateCsvFomJson(data) {
  const csv = json2csv(data, { header: true });
  return csv;
}

export function downloadCsv(csv, fileName) {
  const csvBlob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(csvBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}
