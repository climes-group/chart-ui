import { Link } from "react-router-dom";
import climesTreeTransUrl from "../../assets/logos/climes_logo_trim.png";
import Social from "./Social";

function Footer() {
  const linkStyle =
    "relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-moss-primary after:transition-all after:duration-300 hover:after:w-full";

  return (
    <footer className="bg-linen-bkg text-moss-primary border-t-4 border-golden-accent">
      <div className="max-w-screen-xl mx-auto p-8 md:p-12 flex flex-col md:flex-row flex-wrap justify-between items-start gap-10">
        {/* Column 1: Logo and Copyright */}
        <div className="w-full text-left md:w-auto md:flex-1 min-w-[250px]">
          <img
            src={climesTreeTransUrl}
            alt="Climes Logo"
            className="h-12 mb-4"
          />
          <p className="font-avenir text-sm leading-relaxed text-black">
            &copy; {new Date().getFullYear()} Climes Group Engineering Inc.
            <br />
            All Rights Reserved.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="flex-1 min-w-[150px] text-left">
          <h4 className="font-avenir font-semibold text-lg mb-4">Navigation</h4>
          <ul className="list-none p-0 m-0 space-y-3">
            <li>
              <Link to="/" className={linkStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/flow/intake" className={linkStyle}>
                Start CHART
              </Link>
            </li>
            <li>
              <Link to="/design" className={linkStyle}>
                Design System
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div className="flex-1 min-w-[150px] text-left">
          <h4 className="font-avenir font-semibold text-lg mb-4">Legal</h4>
          <ul className="list-none p-0 m-0 space-y-3">
            <li>
              <a href="#" className={linkStyle}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className={linkStyle}>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Social */}
        <div className="flex-1 min-w-[150px] text-left">
          <h4 className="font-avenir font-semibold text-lg mb-4">Connect</h4>
          <Social />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
