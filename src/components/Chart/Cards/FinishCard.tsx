import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { formatDate, useTranslation } from "@/i18n";
import { resetAppState } from "@/state/actions/resetAppState";
import { useAppDispatch, type RootState } from "@/state/store";
import steps from "@/steps";

type Props = { onBackToReport?: () => void };

export default function FinishCard({ onBackToReport }: Readonly<Props>) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intake = useSelector((s: RootState) => s.report.intakeForm);
  const selectedSystems = useSelector(
    (s: RootState) => s.report.selectedSystems,
  );
  const reportGenAt = useSelector((s: RootState) => s.report.reportGenAt);
  const { t, locale } = useTranslation();

  const handleReset = () => {
    dispatch(resetAppState(steps));
    navigate("/flow/intake");
  };

  const date = reportGenAt
    ? formatDate(reportGenAt, locale, { dateStyle: "medium" })
    : null;
  const address =
    intake?.project_address?.trim() || t("finish.fallbackAddress");
  const count = selectedSystems?.length ?? 0;
  const systemsSuffix =
    count === 1
      ? t("finish.summaryAfterOne")
      : t("finish.summaryAfterOther");

  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <CheckCircle2
        className="text-moss-primary mb-4 size-16"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h2 className="heading-card mb-3">{t("finish.title")}</h2>
      <p className="body-muted mb-2 max-w-md">
        {t("finish.summaryBefore")}
        <strong>{address}</strong>
        {t("finish.summaryMiddle")}
        <strong>{count}</strong>
        {systemsSuffix}
        {date ? t("finish.summaryDate", { date }) : ""}
        {t("finish.summaryEnd")}
      </p>
      {onBackToReport && (
        <button
          type="button"
          onClick={onBackToReport}
          className="text-primary mt-2 mb-8 text-sm underline"
        >
          {t("finish.backToReport")}
        </button>
      )}

      {!confirmOpen ? (
        <Button
          onClick={() => setConfirmOpen(true)}
          variant="outline"
          className="mt-4"
        >
          {t("finish.startNew")}
        </Button>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="text-foreground text-sm">{t("finish.confirmReset")}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              {t("finish.yesReset")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
