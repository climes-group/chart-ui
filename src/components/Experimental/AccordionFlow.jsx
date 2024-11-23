import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setInitial } from "../../state/slices/flowReducer";
import ApplicableSystemsCard from "../Chart/Flow/Cards/ApplicableSystemsCard";
import SiteLocationCard from "../Chart/Flow/Cards/SiteLocationCard";
import GeoDialog from "../Chart/GeoDialog";
import FlowCard from "./FlowCard";

const Root = styled.div`
  padding: 1em;
`;

class Step {
  constructor(prev, curr, next, name, title, desc, conditions = []) {
    this.prev = prev;
    this.id = curr;
    this.next = next;
    this.name = name;
    this.title = title;
    this.desc = desc;
    this.conditions = conditions;
  }

  get stepObj() {
    return {
      id: this.id,
      prev: this.prev,
      next: this.next,
      name: this.name,
      title: this.title,
      desc: this.desc,
    };
  }
}

const stepArr = [
  new Step(
    null,
    0,
    1,
    "siteLocation",
    "Site Location",
    "Select the site location.",
    [(state) => state.geo.geoData],
  ),
  new Step(
    0,
    1,
    null,
    "applicableSystem",
    "Applicable Systems",
    "Specify applicable systems.",
  ),
  new Step(1, 2, 3, "Step A", "Step A", "Step A."),
  new Step(2, 3, 4, "Step A", "Step A", "Step A."),
];

function renderInnerCard(currStep) {
  const { name } = currStep;
  switch (name) {
    case "siteLocation":
      return <SiteLocationCard />;
    case "applicableSystem":
      return <ApplicableSystemsCard />;
    default:
      return "";
      break;
  }
}

export default function AccordionFlow() {
  const currentStepInd = useSelector((s) => s.flow.currentStepInd);

  const dispatch = useDispatch();

  useEffect(() => {
    // initialize flow array with first step
    dispatch(setInitial(stepArr[0].stepObj));
  }, []);

  const [stateChain, setStateChain] = useState([...stepArr.slice(0, 4)]);

  return (
    <Paper sx={{ backgroundColor: "rgb(240, 239, 227)", maxWidth: 640 }}>
      <GeoDialog />
      <Root>
        {stateChain.map((el, ind) => {
          function checkConditions() {
            // if there are conditions, make sure every condition passes
            if (el.conditions?.length >= 1) {
              console.log("got some conditions");
              return el.conditions.every((x) => x);
            }
            return true;
          }

          return (
            <FlowCard
              key={el.id}
              defaultExpanded={el.id === currentStepInd}
              lastItem={ind === stateChain.length - 1}
              step={el}
              conditionsCheck={checkConditions}
            >
              {renderInnerCard(el)}
            </FlowCard>
          );
        })}
      </Root>
    </Paper>
  );
}
