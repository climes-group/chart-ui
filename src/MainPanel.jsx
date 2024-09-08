import styled from "styled-components";

const Root = styled.main`
  display: flex;
  flex-direction: column;
  padding: 2em;

  flex-grow: 1;

  h1 {
    margin-top: 1.5em;
  }

  @media (max-width: 767px) {
    padding: 1em;

    h1 {
      margin-top: 0em;
    }
  }
`;

const StyledH1 = styled.h1`
  color: #fff;
  font-size: 1.5rem;
  background-color: #345800;
  padding: 0em 1em;
  text-align: left;
  max-width: 50%;
  line-height: 2em;
  font-variant: small-caps;
`;

const Container = styled.div`
  margin: 0rem 4rem;
  padding: 0rem;
  height: 100%;
  @media (max-width: 1024px) {
    margin: 0;
  }

  @media (max-width: 767px) {
    padding-top: 0px;
  }
`;

const MainPanel = ({ heading, children }) => {
  return (
    <Root>
      <StyledH1>{heading}</StyledH1>
      <Container>{children}</Container>
    </Root>
  );
};

export default MainPanel;
