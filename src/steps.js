const steps = [
  {
    name: "intake",
    label: "Intake",
  },
  {
    name: "siteLocation",
    label: "Site Location",
  },
  {
    name: "applicableSystems",
    label: "System Inventory",
  },
  { name: "summary", label: "Summary" },
  { name: "report", label: "Report" },
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
