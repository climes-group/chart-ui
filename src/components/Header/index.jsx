import { Link } from "react-router-dom";
import climesBannerUrl from "../../assets/logos/climes_group_engineering_high.jpg";
import climesTreeTransUrl from "../../assets/logos/climes_logo_trim.png"; //Shortened logo

/**
 * Header component that displays nav in all viewports & sizes
 * @returns
 */
const Header = () => {
  return (
    <header className="relative mb-4 border-b-2 border-golden-accent">
      <div className="hidden md:block">
        <Link to="/">
          <img
            src={climesBannerUrl}
            alt="Climes Banner"
            className="py-4 max-h-44"
          />
        </Link>
      </div>
      <div className="flex md:hidden">
        <Link to="/">
          <img
            src={climesTreeTransUrl}
            alt="Climes Logo"
            title="Climes Logo"
            className="h-20 m-2 ml-4"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
