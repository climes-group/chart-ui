import { Button, type ButtonProps } from "@/components/ui/button";
import SelectionPill from "@/components/ui/SelectionPill";
import { Switch } from "@/components/ui/switch";
import { useTheme, type ThemeMode } from "@/theme/ThemeProvider";
import {
  ArrowRight,
  Download,
  FileText,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import A from "./A";

const buttonStyles = [
  { variant: "default", label: "Default", icon: <FileText /> },
  { variant: "primary", label: "Primary", icon: <Download /> },
  { variant: "destructive", label: "Destructive", icon: <Trash2 /> },
  { variant: "outline", label: "Outline", icon: <RefreshCw /> },
  { variant: "secondary", label: "Secondary" },
  { variant: "ghost", label: "Ghost", icon: <ArrowRight /> },
  { variant: "option", label: "Option" },
  { variant: "muted", label: "Muted" },
  { variant: "outline-muted", label: "Outline muted" },
  { variant: "link", label: "Link", icon: <ArrowRight /> },
] satisfies {
  variant: NonNullable<ButtonProps["variant"]>;
  label: string;
  icon?: ReactNode;
}[];

const palette = [
  { name: "Teal Deep", hex: "#224352", text: "text-white" },
  { name: "Golden Accent", hex: "#e2b046", text: "text-primary" },
  { name: "Dark Gold", hex: "#8d6517", text: "text-white", tag: "AA" },
  { name: "Warm Gold", hex: "#fadba4", text: "text-primary" },
  { name: "Linen", hex: "#f0efe3", text: "text-foreground" },
  { name: "Coral", hex: "#e3724f", text: "text-white" },
  { name: "Dark Coral", hex: "#c85a3a", text: "text-white", tag: "AA" },
  { name: "Warm Brown", hex: "#9b592e", text: "text-white" },
  { name: "Moss", hex: "#345800", text: "text-white" },
  { name: "Charcoal", hex: "#1a202c", text: "text-white" },
];

function Design() {
  const { mode, setMode } = useTheme();

  return (
    <main className="mx-auto min-h-100 max-w-5xl space-y-12 p-8">
      <header>
        <h1 className="mb-2">Design System</h1>
        <p className="body-muted mb-0">
          Foundations and components used across the application.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        <Section title="Theme">
          <div className="flex flex-wrap gap-3">
            {(["light", "dark", "cyberpunk"] as ThemeMode[]).map((theme) => (
              <Button
                key={theme}
                variant={mode === theme ? "default" : "outline"}
                onClick={() => setMode(theme)}
              >
                {theme}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Colours">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {palette.map((color) => (
              <div
                key={color.hex}
                className="border-border overflow-hidden rounded-lg border"
              >
                <div
                  className={`flex h-12 items-end p-2 ${color.text}`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="text-sm font-medium">{color.hex}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <span className="text-sm font-semibold">{color.name}</span>
                  {color.tag && (
                    <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-semibold">
                      {color.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Typography">
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <TypeSample title="Page title" className="text-2xl font-bold" />
          <TypeSample
            title="Section heading"
            className="text-xl font-semibold"
          />
          <TypeSample
            title="Form section"
            className="text-base font-semibold"
          />
          <div>
            <p className="mb-1">Body and supporting information</p>
            <p className="body-muted mb-0 text-sm">Compact supporting text</p>
          </div>
        </div>
      </Section>

      <Section title="Card controls">
        <p className="body-muted mb-6">
          The category tabs and option selections used together in the cards.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <CategoryTabsPreview />
          <SelectionPillsPreview />
        </div>
      </Section>

      <div className="grid gap-10 md:grid-cols-2">
        <Section title="Switches">
          <div className="flex flex-wrap items-center gap-6">
            <ShowcaseSwitch label="Off" />
            <ShowcaseSwitch label="On" defaultChecked />
          </div>
        </Section>

        <Section title="Buttons">
          <div className="grid grid-cols-2 gap-2">
            {buttonStyles.map(({ variant, label, icon }) => (
              <Button key={variant} variant={variant}>
                {icon}
                {label}
              </Button>
            ))}
            <Button variant="default" disabled>
              Disabled
            </Button>
          </div>
        </Section>
      </div>

      <Section title="Links">
        <p className="mb-0">
          Inline links use an <A href="#">animated underline</A> on hover.
        </p>
      </Section>
    </main>
  );
}

function TypeSample({
  title,
  className,
}: Readonly<{ title: string; className: string }>) {
  return (
    <div>
      <h2 className={`mb-0 ${className}`}>{title}</h2>
    </div>
  );
}

function CategoryTabsPreview() {
  const [activeCategory, setActiveCategory] = useState("Heating");
  const categories = ["Heating", "Cooling", "Hot Water"];

  return (
    <div>
      <h3 className="mb-3">Underline tabs</h3>
      <div
        className="border-border flex flex-wrap gap-4 border-b"
        role="group"
        aria-label="Category tab example"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <Button
              key={category}
              variant="ghost"
              size="pill"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`relative shrink-0 rounded-none bg-transparent px-1 pb-2 whitespace-nowrap shadow-none active:scale-100 ${
                isActive
                  ? "text-primary after:bg-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 hover:bg-transparent"
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              }`}
            >
              {category}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function SelectionPillsPreview() {
  const [selectedNames, setSelectedNames] = useState(
    () => new Set(["Heating"]),
  );
  const options = [
    { name: "Heating", showInfoIcon: false },
    { name: "Cooling", showInfoIcon: true },
    {
      name: "Very long high-efficiency heat recovery system",
      showInfoIcon: true,
    },
  ];

  return (
    <div>
      <h3 className="mb-3">Soft-surface selection</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map(({ name, showInfoIcon }) => (
          <SelectionPill
            key={name}
            name={name}
            showInfoIcon={showInfoIcon}
            isSelected={selectedNames.has(name)}
            onToggle={() => {
              setSelectedNames((current) => {
                const next = new Set(current);
                if (next.has(name)) {
                  next.delete(name);
                } else {
                  next.add(name);
                }
                return next;
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ShowcaseSwitch({
  label,
  defaultChecked = false,
}: Readonly<{ label: string; defaultChecked?: boolean }>) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex items-center gap-2">
      <span className="text-sm">{label}</span>
      <Switch
        aria-label={`${label} switch`}
        checked={checked}
        onCheckedChange={setChecked}
      />
    </label>
  );
}

function Section({
  title,
  children,
}: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section>
      <h2 className="mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default Design;
