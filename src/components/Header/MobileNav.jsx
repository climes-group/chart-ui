import styled from "styled-components";
import { THEME } from "../../utils";

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: block;
  }

  a {
    color: #fff;
  }

  /* Position and sizing of burger button */
  .bm-burger-button {
    position: absolute;
    width: 36px;
    height: 30px;
    right: 36px;
    top: 36px;
  }

  /* Color/shape of burger icon bars */
  .bm-burger-bars {
    background: rgb(52, 88, 0);
  }

  /* Color/shape of burger icon bars on hover*/
  .bm-burger-bars-hover {
    background: ${THEME.ACCENT};
  }

  /* Position and sizing of clickable cross button */
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: ${THEME.ACCENT};
  }

  .bm-menu-wrap {
    position: fixed;
    height: 100%;
  }

  /* General sidebar styles */
  .bm-menu {
    background: #373a47;
    padding: 2.5em 1.5em 0;
    font-size: 1.15em;
  }

  .bm-item {
    & :hover {
      color: ${THEME.ACCENT};
    }
    & :active {
      color: ${THEME.ACCENT};
    }
  }

  /* Morph shape necessary with bubble or elastic */
  .bm-morph-shape {
    fill: #373a47;
  }

  /* Wrapper for item list */
  .bm-item-list {
    color: #b8b7ad;
    padding: 0.8em;
  }

  /* Styling of overlay */
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const MobileLinkWrapper = styled.div`
  margin-top: 1em;
`;

export default function MobileNav() {
  return <MobileOnly></MobileOnly>;
}
