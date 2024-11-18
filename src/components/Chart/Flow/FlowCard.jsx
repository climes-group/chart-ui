import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import useFlow from "../../../hooks/useFlow";

const FlowButtonsDiv = styled.div`
  margin: 2rem;
  > button {
    margin-left: 1em;
  }
`;

export default function FlowCard(props) {
  const { next, back, error } = useFlow();

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
        <Button variant="outlined" color="secondary" onClick={back}>
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
