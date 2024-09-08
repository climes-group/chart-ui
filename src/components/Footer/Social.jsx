import styled from "styled-components";
import { THEME } from "../../utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;

  a {
    margin-left: 0.5rem;
  }

  ul {
    padding-left: 0;
  }

  li {
    display: inline-flex;
  }
`;

const MediaButton = styled.button`
  color: ${THEME.PRIMARY};
  padding: 10px;
  border-radius: 100%;
  background-color: #fff;
  border: solid 2px ${THEME.ACCENT};
  height: 45px;
  width: 45px;
  margin: 0.2rem;

  &:hover {
    border: solid 2px ${THEME.PRIMARY};
  }

  @media (max-width: 1024px) {
    align-self: flex-end;
  }
`;

function Social() {
  return (
    <Root>
      <ul>
        <li>
          <a href="https://twitter.com/PEO_HQ" target="_blank">
            <MediaButton id="social-twitter" aria-label="Twitter Link">
              <FontAwesomeIcon icon={faTwitter} />
            </MediaButton>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/company/peo---professional-engineers-ontario/"
            target="_blank"
          >
            <MediaButton id="social-linkedin" aria-label="Linkedin Link">
              <FontAwesomeIcon icon={faLinkedin} />
            </MediaButton>
          </a>
        </li>
      </ul>
    </Root>
  );
}

export default Social;
