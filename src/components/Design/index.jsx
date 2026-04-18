import { ArrowRight, Download, FileText, RefreshCw, Trash2 } from "lucide-react";
import A from "./A";
import { Button } from "@/components/ui/button";

/* ── page ── */
function Design() {
  return (
    <main className="p-8 min-h-100 max-w-5xl mx-auto">
      <h1 className="mb-2">Design System</h1>
      <p className="body-muted mb-12">
        Colours, typography, and components used across the application.
      </p>

      {/* ─── Colour Palette ─── */}
      <Section title="Colours">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { name: "Teal Deep", hex: "#224352", text: "text-white" },
            { name: "Golden Accent", hex: "#e2b046", text: "text-teal-deep" },
            { name: "Dark Gold", hex: "#8d6517", text: "text-white", tag: "AA" },
            { name: "Warm Gold", hex: "#fadba4", text: "text-teal-deep" },
            { name: "Linen", hex: "#f0efe3", text: "text-charcoal" },
            { name: "Coral", hex: "#e3724f", text: "text-white" },
            { name: "Dark Coral", hex: "#c85a3a", text: "text-white", tag: "AA" },
            { name: "Warm Brown", hex: "#9b592e", text: "text-white" },
            { name: "Moss", hex: "#345800", text: "text-white" },
            { name: "Charcoal", hex: "#1a202c", text: "text-white" },
          ].map((c) => (
            <div key={c.hex} className="rounded-lg overflow-hidden border border-border">
              <div
                className={`h-14 flex items-end p-2 ${c.text}`}
                style={{ backgroundColor: c.hex }}
              >
                <span className="text-[0.65rem] font-medium opacity-90">
                  {c.hex}
                </span>
              </div>
              <div className="px-2 py-1.5 flex items-center gap-1.5">
                <span className="text-xs font-semibold">{c.name}</span>
                {c.tag && (
                  <span className="text-[0.6rem] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {c.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Typography ─── */}
      <Section title="Typography">
        <div className="space-y-4 text-left">
          <div className="flex items-baseline gap-4">
            <h1 className="mb-0">Heading 1</h1>
            <span className="body-muted whitespace-nowrap">2rem / 700</span>
          </div>
          <div className="flex items-baseline gap-4">
            <h2 className="mb-0">Heading 2</h2>
            <span className="body-muted whitespace-nowrap">1.5rem / 600</span>
          </div>
          <div className="flex items-baseline gap-4">
            <h3 className="mb-0">Heading 3</h3>
            <span className="body-muted whitespace-nowrap">1.125rem / 600</span>
          </div>
          <div className="flex items-baseline gap-4">
            <h4 className="mb-0">Heading 4</h4>
            <span className="body-muted whitespace-nowrap">1rem / 600</span>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="mb-1">Body text — the default for all content.</p>
            <p className="body-muted mb-0">Muted text — secondary information and captions.</p>
          </div>
        </div>
      </Section>

      {/* ─── Links ─── */}
      <Section title="Links">
        <p className="text-left mb-0">
          Inline links use an <A href="#">animated underline</A> on hover.
        </p>
      </Section>

      {/* ─── Buttons ─── */}
      <Section title="Buttons">
        {/* Variants */}
        <h3 className="mb-4">Variants</h3>
        <div className="flex flex-wrap gap-3 mb-10">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>

        {/* Sizes */}
        <h3 className="mb-4">Sizes</h3>
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Button size="lg">Large</Button>
          <Button>Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon"><ArrowRight /></Button>
        </div>

        {/* With icons */}
        <h3 className="mb-4">With Icons</h3>
        <div className="flex flex-wrap gap-3 mb-10">
          <Button>
            <FileText /> Generate Report
          </Button>
          <Button variant="primary" size="sm">
            <Download className="size-4" /> Download
          </Button>
          <Button variant="outline">
            <RefreshCw className="size-4" /> Regenerate
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>

        {/* States */}
        <h3 className="mb-4">States</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline">Enabled</Button>
          <Button variant="outline" disabled>Disabled</Button>
          <Button variant="destructive">Enabled</Button>
          <Button variant="destructive" disabled>Disabled</Button>
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-14">
      <h2 className="mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default Design;
