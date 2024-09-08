import styled from "styled-components";
import Img from "./Img";

const Root = styled.div`
  border: 1px dotted #000;
  box-sizing: border-box;
  padding: 1em;

  label {
    border: 1px dotted #000;
    box-sizing: border-box;
    margin-top: 1em;
    display: block;
  }
`;

function Figure({ src, label }) {
  return (
    <Root>
      <Img src={src} />
      <label>{label}</label>
    </Root>
  );
}

export default Figure;
