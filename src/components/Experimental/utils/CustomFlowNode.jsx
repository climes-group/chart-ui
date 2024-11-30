import { faObjectGroup } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import Switch from "react-switch";
import { Handle, Position, useNodeId } from "reactflow";
import styled from "styled-components";
import { THEME } from "../../../utils";

const Label = styled.div`
  font-size: 1.2em;
  padding: 10px 20px;
  display: flex;
`;

function getTextColourForCategory(category) {
  switch (category) {
    case "vulnerability":
      return "black";
    case "hazard":
      return "black";
    default:
      return "black";
  }
}

function getBgColourForCategory(category) {
  switch (category) {
    case "climate":
      return "rgb(186, 227, 215, 0.6)";
    case "vulnerability":
      return "rgb(97, 132, 184, 0.5)";
    case "weather":
      return "rgb(153, 201, 222, 0.5)";
    case "hazard":
      return "rgb(151, 209, 198, 0.5)";
    default:
      return "white";
  }
}

const Node = styled.div`
  display: relative;
  padding: 10px 20px;
  border-radius: 5px;
  padding-top: 2em;
  min-width: 225px;
  min-height: 75px;
  .react-flow__handle {
    //background: ${(props) => props.theme.primary};
    width: 8px;
    height: 10px;
    border-radius: 3px;
  }
  font-size: 1.2em;
  color: ${(props) => getTextColourForCategory(props.nodeType)};

  background: ${(props) => getBgColourForCategory(props.nodeType)};
  opacity: 1;
  border: 2px solid ${THEME.PRIMARY};
`;

const Toggle = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

const TypeWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.2em;
  border: 1px solid #000;
  background: rgb(255, 255, 255, 0.2);
  opacity: 0.5;

  &:hover {
    opacity: 0.8;
  }
`;

export default memo(({ data, selected }) => {
  const { label, isActive, category, nodeType } = data;
  const nodeId = useNodeId();
  return (
    <Node
      isActive={isActive}
      selected={selected}
      labelId={data.label}
      nodeType={nodeType}
    >
      <Toggle>
        <Switch checked={isActive} />
      </Toggle>
      <TypeWrapper>
        <FontAwesomeIcon icon={faObjectGroup} />
        {nodeType} [{nodeId}]
      </TypeWrapper>
      <Label>{label}</Label>
      {category ? <div>({category})</div> : null}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Node>
  );
});
