import styled from "styled-components";

const Row = styled.div`
  display: flex;
  margin-top: 2em;

  @media (max-width: 767px) {
    flex-wrap: wrap;
  }

  p {
    margin-left: 2em;
    text-align: left;
  }
`;

export default Row;
