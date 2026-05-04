// Step labels and error messages are looked up by `name` from the i18n
// dictionary at render time (keys: `steps.<name>` and `steps.errors.<name>`).
// `leaveCondition: true` initializes the step's gate as unmet — set when the
// step requires user action before navigation to the next step is allowed.
const steps = [
  { name: "intake", leaveCondition: true },
  { name: "inventory", leaveCondition: true },
  { name: "summary" },
  { name: "report" },
];

// add prev and next to steps where next is name of next item in steps array
steps.forEach((step, index) => {
  step.prev = index === 0 ? null : steps[index - 1].name;
  step.next = index === steps.length - 1 ? null : steps[index + 1].name;
});

// add id to steps
steps.forEach((step, index) => {
  step.id = index;
});

export default steps;
