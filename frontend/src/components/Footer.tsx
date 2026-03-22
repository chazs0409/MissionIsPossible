// const Footer = () => {
//   return (
//     <footer className="footer">
//       FOOTER TEXT TEST Lorem ipsum dolor sit amet consectetur adipisicing elit.
//       Tempore veniam doloremque deserunt, exercitationem rerum corporis nihil
//       iste sunt ratione nemo ipsum ea cum laudantium voluptates nulla nobis
//       blanditiis accusantium incidunt!
//       {/* Footer code here
//     Also use footer.css for styling */}
//     </footer>
//   );
// };
// export default Footer;
import './Footer.css'; 
import instagram from '../assets/instagram.svg';
import linkedin from '../assets/linkedin1.svg';
import x from '../assets/x.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section: Logo, Description, and Socials */}
        <div className="footer-brand">
          <h2 className="footer-logo">Square One</h2>
          <p className="footer-desc">Descriptive line about what your company does.</p>
          <div className="social-icons">
             {/* You can replace these with actual icon components later */}
             <img src={instagram} alt="Instagram" className="icon-instagram" />
             <img src={linkedin} alt="LinkedIn" className="icon-linkedin" />
             <img src={x} alt="X" className="icon-x" />
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
