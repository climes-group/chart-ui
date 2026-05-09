import { json2csv } from "json-2-csv";

export function generateCsvFomJson(data: object[]): string {
  return json2csv(data);
}

export function downloadCsv(csv: string, fileName: string): void {
  const csvBlob = new Blob([csv], { type: "text/csv" });
  const url = globalThis.URL.createObjectURL(csvBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}
