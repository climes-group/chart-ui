import climesTreeTransUrl from "@/assets/logos/climes_logo_trim.png";
import { Link } from "react-router-dom";
import Social from "./Social";

function Footer() {
  const linkStyle =
    "relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-teal-deep after:transition-all after:duration-300 hover:after:w-full";

  return (
    <footer className="bg-linen-bkg text-teal-deep border-golden-accent border-t-4">
      <div className="mx-auto flex max-w-screen-xl flex-col flex-wrap items-start justify-between gap-10 p-8 md:flex-row md:p-12">
        {/* Column 1: Logo and Copyright */}
        <div className="w-full min-w-[250px] text-left md:w-auto md:flex-1">
          <img
            src={climesTreeTransUrl}
            alt="Climes Logo"
            className="mb-4 h-12"
          />
          <p className="text-sm leading-relaxed text-current">
            &copy; {new Date().getFullYear()} Climes Group Engineering Inc.
            <br />
            All Rights Reserved.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="min-w-[150px] flex-1 text-left">
          <h4 className="mb-4 text-base font-semibold">Navigation</h4>
          <ul className="m-0 list-none space-y-3 p-0">
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
        <div className="min-w-[150px] flex-1 text-left">
          <h4 className="mb-4 text-base font-semibold">Legal</h4>
          <ul className="m-0 list-none space-y-3 p-0">
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
        <div className="min-w-[150px] flex-1 text-left">
          <h4 className="mb-4 text-base font-semibold">Connect</h4>
          <Social />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
