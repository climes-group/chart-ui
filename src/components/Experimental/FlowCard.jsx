import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import useFlow from "../../hooks/useFlow";

function FlowCard(props) {
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

FlowCard.defaultProps = {
  defaultExpanded: false,
  lastItem: false,
};

FlowCard.propTypes = {
  defaultExpanded: PropTypes.bool,
  lastItem: PropTypes.bool,
  step: PropTypes.shape({
    title: PropTypes.string,
    desc: PropTypes.string,
  }),
};

export default FlowCard;
