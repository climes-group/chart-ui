import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Social() {
  return (
    <div className="flex items-center gap-6">
      <a
        href="https://twitter.com/PEO_HQ"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter Link"
        className="hover:text-golden-accent hover:scale-110 transition-all duration-300"
      >
        <FontAwesomeIcon icon={faTwitter} size="lg" />
      </a>
      <a
        href="https://www.linkedin.com/company/peo---professional-engineers-ontario/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Linkedin Link"
        className="hover:text-golden-accent hover:scale-110 transition-all duration-300"
      >
        <FontAwesomeIcon icon={faLinkedin} size="lg" />
      </a>
    </div>
  );
}

export default Social;
