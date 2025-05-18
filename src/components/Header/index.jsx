import { Link } from "react-router-dom";
import climesBannerUrl from "../../assets/logos/climes_group_engineering_high.jpg";
import climesTreeTransUrl from "../../assets/logos/climes_logo_trim.png"; //Shortened logo
import OidcLogin from "../Auth/OidcLogin";

/**
 * Header component that displays nav in all viewports & sizes
 * @returns
 */
const Header = () => {
  return (
    <header className="relative mb-4 border-b-2 border-golden-accent">
      <div className="hidden md:flex md:align-center md:justify-between">
        <Link to="/">
          <img
            src={climesBannerUrl}
            alt="Climes Banner"
            className="py-4 max-h-32"
          />
        </Link>
        <OidcLogin />
      </div>
      <div className="flex md:hidden align-center justify-between">
        <Link to="/">
          <img
            src={climesTreeTransUrl}
            alt="Climes Logo"
            title="Climes Logo"
            className="h-20 m-2 ml-4"
          />
        </Link>
        <OidcLogin />
      </div>
    </header>
  );
};

export default Header;
