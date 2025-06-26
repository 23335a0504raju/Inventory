import { faFacebook, faGithub, faInstagram, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import './css/footer.css';
const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h3>About Us</h3>
          <ul className="footer-links">
            <li><a href="/about">Who We Are</a></li>
            <li><a href="/team">Our Team</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/report">Report a Problem</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="footer-social">
            <a href="https://www.facebook.com/krishna.budumuru.5" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook}/></a>
            <a href="https://x.com/BudumuruMohan" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter}/></a>
            <a href="https://www.instagram.com/krishna_5488_/?hl=en" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram}/></a>
            <a href="https://www.linkedin.com/in/krishna-mohan-2a2971259/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedinIn}/></a>
            <a href="https://github.com/Mohan5488" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} YourWebsite. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
