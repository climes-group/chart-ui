import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Social() {
  return (
    <section className="flex flex-col m-4">
      <ul className="pl-0">
        <li className="list-none inline-flex">
          <a href="https://twitter.com/PEO_HQ" target="_blank" className="ml-4">
            <button
              id="social-twitter"
              aria-label="Twitter Link"
              className="media-icon"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </button>
          </a>
        </li>
        <li className="list-none inline-flex">
          <a
            href="https://www.linkedin.com/company/peo---professional-engineers-ontario/"
            target="_blank"
            className="ml-4"
          >
            <button
              id="social-linkedin"
              aria-label="Linkedin Link"
              className="media-icon"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </button>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default Social;
