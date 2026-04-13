import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function formatGeneratedAt(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ConfirmDeleteDialog({ filename, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      <Card className="relative z-10 mx-4 w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="heading-section">Delete report?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="body-muted">
            This will permanently delete{" "}
            <span className="text-charcoal font-medium">{filename}</span>. This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SavedReports() {
  const profile = useSelector((state) => state.user.profile);
  const token = useSelector((state) => state.user.token);

  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;

    setStatus("loading");
    fetch(`${import.meta.env.VITE_API_HOST}/reports`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setReports(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}/reports/${encodeURIComponent(pendingDelete)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReports((prev) => prev.filter((r) => r.filename !== pendingDelete));
    } catch {
      // keep list unchanged on error; dialog will close
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  if (!profile) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <FileText className="text-teal-deep size-6 shrink-0" />
          <CardTitle className="heading-card">Saved Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="body-muted flex items-center justify-center gap-2 py-12">
              <Loader2 className="size-5 animate-spin" />
              <span>Loading reports…</span>
            </div>
          )}

          {status === "error" && (
            <p className="body-muted text-coral py-12 text-center">
              Failed to load reports. Please try again later.
            </p>
          )}

          {status === "ready" && reports.length === 0 && (
            <p className="body-muted py-12 text-center">
              No saved reports found.
            </p>
          )}

          {status === "ready" && reports.length > 0 && (
            <ul className="divide-border divide-y">
              {reports.map((report) => (
                <li
                  key={report.filename}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-teal-deep truncate font-medium">
                      {report.filename}
                    </p>
                    <p className="body-muted">
                      Generated {formatGeneratedAt(report.generated_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="primary" size="sm" asChild>
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download />
                        Download
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-coral border-coral/40 hover:bg-coral/5 hover:border-coral/70"
                      onClick={() => setPendingDelete(report.filename)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {pendingDelete && (
        <ConfirmDeleteDialog
          filename={pendingDelete}
          onConfirm={deleting ? undefined : handleDelete}
          onCancel={() => !deleting && setPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default SavedReports;
