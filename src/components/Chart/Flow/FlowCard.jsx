import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  setError,
  stepBackward,
  stepForward,
} from "../../../state/slices/flowReducer";
const FlowButtonsDiv = styled.div`
  margin: 2rem;
  > button {
    margin-left: 1em;
  }
`;

export default function FlowCard(props) {
  const dispatch = useDispatch();
  const conditions = useSelector((s) => s.flow.conditions);

  const error = useSelector((s) => s.flow.error);

  function next() {
    console.log(conditions);
    if (conditions.every((x) => x)) {
      console.log("Conditions passed");
      dispatch(stepForward());
    } else {
      console.warn("Conditions did not pass");
      dispatch(setError("Please specify a location."));
    }
  }

  return (
    <Accordion
      defaultExpanded={props.defaultExpanded}
      disabled={props.lastItem}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        {props.step.title}
      </AccordionSummary>

      <AccordionDetails>
        <Typography variant="body2">{props.step.desc}</Typography>
        <Typography variant="body2" sx={{ color: "red" }}>
          {error}
        </Typography>

        {props.children}
      </AccordionDetails>
      <AccordionActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => dispatch(stepBackward())}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={next}
          disabled={!!error}
        >
          Next
        </Button>
      </AccordionActions>
    </Accordion>
  );
}
