import styled from "styled-components";
import { THEME } from "../../utils";
import Social from "./Social";

const Root = styled.footer`
  border-top: solid 3px ${THEME.ACCENT};
  min-height: 200px;
  background-color: ${THEME.BKG};
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
`;

const Footer = () => {
  return (
    <Root>
      <Social />
    </Root>
  );
};

export default Footer;
