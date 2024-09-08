import { Link } from "react-router-dom";
import styled from "styled-components";
import peoImgUrl from "../../assets/logo-peo-en.png";
import climesUrl from "../../assets/logos/clime_tree_trans.png";
import { THEME } from "../../utils";
import ContactInfo from "./ContactInfo";

const Root = styled.footer`
  border-top: solid 3px ${THEME.ACCENT};
  min-height: 200px;
  background-color: ${THEME.BKG};
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;

  h3 {
    font-weight: 700;
  }

  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

const PeoLogoContainer = styled.div`
  img {
    width: 250px;
  }

  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 1em;
    border-bottom: 1px solid #224352;
    align-items: center;
  }

  @media (max-width: 767px) {
    flex-wrap: wrap;
    justify-content: space-around;
  }
`;

const Auth = styled.div`
  max-width: 300px;
  margin: 2rem;
  font-size: 0.8rem;
  text-align: left;
`;

const ClimesLogo = styled.div`
  align-self: center;
  margin: 1rem;

  img {
    height: 200px;
  }
`;

const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  @media (max-width: 767px) {
    flex-wrap: wrap;
  }
`;

const PeoLogoPortion = (
  <PeoLogoContainer>
    <a href="https://www.peo.on.ca/">
      <img src={peoImgUrl} alt="PEO Logo Image" />
    </a>
    <Auth>
      Authorized by the Association of Professional Engineers of Ontario to
      offer professional engineering services.
    </Auth>
  </PeoLogoContainer>
);

const Footer = () => {
  return (
    <Root>
      <FlexContainer>
        <ClimesLogo>
          <Link to={""}>
            <img src={climesUrl} alt="Climes Group Engineering Inc. logo" />
          </Link>
        </ClimesLogo>
        <ContactInfo />
      </FlexContainer>
    </Root>
  );
};

export default Footer;
