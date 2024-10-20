import { Link } from "react-router-dom";
import styled from "styled-components";
import climesBannerUrl from "../../assets/logos/climes_group_engineering_high.jpg";
import climesTreeTransUrl from "../../assets/logos/climes_logo_trim.png"; //Shortened logo
import { THEME } from "../../utils";

const Root = styled.div`
  position: relative;
  border-bottom: solid 3px ${THEME.ACCENT};
  margin-bottom: 1em;
`;

const DesktopHeader = styled.div`
  display: block;
  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileHeader = styled.div`
  display: none;
  height: 100px;
  @media (max-width: 767px) {
    display: flex;
  }
`;

const ClimesBanner = styled.div`
  text-align: left;
  padding: 1em 0em;
  padding-bottom: 0px;
  img {
    height: 100px;

    @media (max-width: 767px) {
      display: none;
    }
  }
`;
const ClimesLogoMobile = styled.div`
  text-align: left;
  img {
    height: 80px;
    margin: 0.5em;
    margin-left: 1em;
  }
`;

const MenuOl = styled.ol`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 0px;
  margin-top: 0em;
  padding-left: 0px;
  z-index: 1;

  @media (max-width: 767px) {
    display: none;
  }
`;

const MenuLi = styled.li`
  padding: 1rem;
  padding-left: 2rem;
  background-clip: content-box, padding-box;
  list-style-type: none;
  line-height: 1.5;
  padding-bottom: 0;

  & :hover {
    text-decoration: underline;
  }

  a {
    text-decoration: none;
    color: ${THEME.PRIMARY};
  }
`;

/**
 * Header component that displays nav in all viewports & sizes
 * @returns
 */
const Header = ({}) => {
  return (
    <>
      <Root>
        <DesktopHeader>
          <ClimesBanner>
            <Link to="/">
              <img src={climesBannerUrl} alt="Climes Banner Image" />
            </Link>
          </ClimesBanner>
        </DesktopHeader>
        <MobileHeader>
          <ClimesLogoMobile>
            <Link to="/">
              <img src={climesTreeTransUrl} alt="Climes Banner Image" />
            </Link>
          </ClimesLogoMobile>
        </MobileHeader>
      </Root>
    </>
  );
};

export default Header;
