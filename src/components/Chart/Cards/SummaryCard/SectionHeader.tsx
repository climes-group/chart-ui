import { Pencil } from "lucide-react";

import useFlow from "@/hooks/useFlow";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

type SectionHeaderProps = {
  title: string;
  editTo: string;
  editLabel: string;
  headingId: string;
};

export default function SectionHeader({
  title,
  editTo,
  editLabel,
  headingId,
}: Readonly<SectionHeaderProps>) {
  const { t } = useTranslation();
  const { jumpTo } = useFlow();
  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 id={headingId} className="heading-section">
        {title}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => jumpTo(editTo)}
        aria-label={"Jump to " + editLabel}
        title={editLabel}
        className="text-muted-foreground hover:text-primary"
      >
        <Pencil className="size-3" />
        {t("summary.edit")}
      </Button>
    </div>
  );
}
