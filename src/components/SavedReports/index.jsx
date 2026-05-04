import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, useTranslation } from "@/i18n";
import { Download, FileText, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      <Card
        className="relative z-10 mx-4 w-full max-w-sm shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <CardHeader>
          <CardTitle className="heading-section">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="body-muted">{message}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="destructive" size="sm" onClick={onConfirm}>
              {confirmLabel}
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
  const { t, locale } = useTranslation();

  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [pendingDelete, setPendingDelete] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [deleteAllError, setDeleteAllError] = useState(false);

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
        const items = Array.isArray(data?.data) ? data.data : [];
        setReports(items);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  function formatGenerated(value) {
    if (!value) return t("savedReports.unknownDate");
    const formatted = formatDate(value, locale, {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return formatted || value;
  }

  async function handleDownload(filename) {
    setDownloadError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}/reports/${encodeURIComponent(filename)}/download`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError(filename);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}/reports/${encodeURIComponent(pendingDelete)}/delete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReports((prev) => prev.filter((r) => r.name !== pendingDelete));
    } catch {
      // keep list unchanged on error; dialog will close
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  async function handleDeleteAll() {
    setDeleting(true);
    setDeleteAllError(false);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}/reports/delete_all`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReports([]);
      setConfirmDeleteAll(false);
    } catch {
      setDeleteAllError(true);
      setConfirmDeleteAll(false);
    } finally {
      setDeleting(false);
    }
  }

  if (!profile) return <Navigate to="/" replace />;

  const hasReports = status === "ready" && reports.length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <FileText className="text-teal-deep size-6 shrink-0" />
          <CardTitle className="heading-card flex-1">{t("savedReports.heading")}</CardTitle>
          {hasReports && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDeleteAll(true)}
            >
              <Trash2 />
              {t("savedReports.deleteAllReports")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="body-muted flex items-center justify-center gap-2 py-12">
              <Loader2 className="size-5 animate-spin" />
              <span>{t("savedReports.loading")}</span>
            </div>
          )}

          {downloadError && (
            <p className="text-coral bg-coral/10 rounded-md px-3 py-2 text-sm">
              {t("savedReports.downloadError", { filename: downloadError })}
            </p>
          )}

          {deleteAllError && (
            <p className="text-coral bg-coral/10 mb-3 rounded-md px-3 py-2 text-sm">
              {t("savedReports.deleteAllError")}
            </p>
          )}

          {status === "error" && (
            <p className="body-muted text-coral py-12 text-center">
              {t("savedReports.loadError")}
            </p>
          )}

          {status === "ready" && reports.length === 0 && (
            <p className="body-muted py-12 text-center">
              {t("savedReports.empty")}
            </p>
          )}

          {hasReports && (
            <ul className="divide-border divide-y">
              {reports.map((report) => (
                <li
                  key={report.name}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-teal-deep truncate font-medium">
                      {report.name}
                    </p>
                    <p className="body-muted">
                      {t("savedReports.generated", {
                        date: formatGenerated(report.created),
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownload(report.name)}
                    >
                      <Download />
                      {t("common.download")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDelete(report.name)}
                    >
                      <Trash2 />
                      {t("common.delete")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {pendingDelete && (
        <ConfirmDialog
          title={t("savedReports.confirmDeleteTitle")}
          message={
            <>
              {t("savedReports.confirmDeleteBefore")}
              <span className="text-charcoal font-medium">{pendingDelete}</span>
              {t("savedReports.confirmDeleteAfter")}
            </>
          }
          confirmLabel={t("common.delete")}
          cancelLabel={t("common.cancel")}
          onConfirm={deleting ? undefined : handleDelete}
          onCancel={() => !deleting && setPendingDelete(null)}
        />
      )}

      {confirmDeleteAll && (
        <ConfirmDialog
          title={t("savedReports.confirmDeleteAllTitle")}
          message={
            <>
              {t("savedReports.confirmDeleteAllBefore")}
              <span className="text-charcoal font-medium">
                {reports.length}
              </span>
              {t("savedReports.confirmDeleteAllAfter")}
            </>
          }
          confirmLabel={t("savedReports.confirmDeleteAllAction")}
          cancelLabel={t("common.cancel")}
          onConfirm={deleting ? undefined : handleDeleteAll}
          onCancel={() => !deleting && setConfirmDeleteAll(false)}
        />
      )}
    </div>
  );
}

export default SavedReports;
