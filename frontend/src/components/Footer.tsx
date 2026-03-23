
import './componentcss/footer.css'; 
import instagram from '../assets/instagram.svg';
import linkedin from '../assets/linkedin.svg';
import x from '../assets/x.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section: Logo, Description, and Socials */}
        <div className="footer-brand">
          <h2 className="footer-logo">Square One</h2>
          <p className="footer-desc">Navigating the path from OPT to H-1B. 
                                    Find your next opportunity with employers 
                                    who actually hire international students.</p>
          <div className="social-icons">
             <a href="https://www.instagram.com/atsquareone/" target="_blank" rel="noopener noreferrer">
             <img src={instagram} alt="Instagram" className="icon-instagram" />
             </a>
             <a href="https://www.linkedin.com/company/atsquareone/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
             <img src={linkedin} alt="LinkedIn" className="icon-linkedin" />
             </a>
             <a href="https://www.facebook.com/atsquareone" target="_blank" rel="noopener noreferrer">
             <img src={x} alt="X" className="icon-x" />
             </a>
             
          </div>
        </div>

        {/* Right Section: Link Columns */}
        <div className="footer-links">
          <div className="link-column">
            <h4>Features</h4>
            <ul>
              <li><a href="#">Core features</a></li>
              <li><a href="#">Pro experience</a></li>
              <li><a href="#">Integrations</a></li>
            </ul>
          </div>

          <div className="link-column">
            <h4>Learn more</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case studies</a></li>
              <li><a href="#">Customer stories</a></li>
              <li><a href="#">Best practices</a></li>
            </ul>
          </div>

          <div className="link-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Legal</a></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
