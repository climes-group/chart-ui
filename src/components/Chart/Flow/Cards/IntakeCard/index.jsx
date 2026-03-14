import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { selectIntakeForm, setIntakeField } from "@/state/slices/reportReducer";
import AssessorInformationSection from "./AssessorInformationSection";
import BuildingInformationSection from "./BuildingInformationSection";
import ProjectInformationSection from "./ProjectInformationSection";

export default function IntakeCard({ onSubmit }) {
  const dispatch = useDispatch();
  const values = useSelector(selectIntakeForm);

  const handleChange =
    (key) =>
    (event) => {
      dispatch(setIntakeField({ key, value: event.target.value }));
    };

  const handleModellingStandardChange = (option) => (event) => {
    const current = Array.isArray(values.modelling_standard)
      ? values.modelling_standard
      : [];

    if (event.target.checked) {
      if (current.includes(option)) return;
      dispatch(
        setIntakeField({
          key: "modelling_standard",
          value: [...current, option],
        }),
      );
      return;
    }

    dispatch(
      setIntakeField({
        key: "modelling_standard",
        value: current.filter((item) => item !== option),
      }),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(values);
    }
  };

  return (
    <div>
      <h2 className="heading-card mb-1">Intake</h2>
      <p className="body-muted mb-4">
        Provide the core project, building, and assessor information to
        generate a complete intake record.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-card/40 border border-border rounded-lg p-4 md:p-6"
      >
        <ProjectInformationSection
          values={values}
          onChange={handleChange}
          onModellingStandardChange={handleModellingStandardChange}
        />

        <BuildingInformationSection values={values} onChange={handleChange} />

        <AssessorInformationSection values={values} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Save Intake
          </Button>
        </div>
      </form>
    </div>
  );
}

