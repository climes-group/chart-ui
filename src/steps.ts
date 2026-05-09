// Step labels and error messages are looked up by `name` from the i18n
// dictionary at render time (keys: `steps.<name>` and `steps.errors.<name>`).
// `leaveCondition: true` initializes the step's gate as unmet — set when the
// step requires user action before navigation to the next step is allowed.
export type Step = {
  name: string;
  leaveCondition?: boolean;
  prev?: string | null;
  next?: string | null;
  id?: number;
};

const base: { name: string; leaveCondition?: boolean }[] = [
  { name: "intake", leaveCondition: true },
  { name: "inventory", leaveCondition: true },
  { name: "summary" },
  { name: "report" },
];

const steps: Step[] = base.map((step, index) => ({
  ...step,
  prev: index === 0 ? null : base[index - 1].name,
  next: index === base.length - 1 ? null : base[index + 1].name,
  id: index,
}));

export default steps;
