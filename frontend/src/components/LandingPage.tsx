import logo from "../assets/logo.png";

const Landingpage = () => {
  return (
    <main className="landing-page">
      <header>
        <img src={logo} alt="Mission Impossible Logo" className="logo" />
        <nav className="navbar">
          <a href="#" className="nav-link">
            About
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
          <a href="#" className="nav-link signup">
            Sign Up
          </a>
        </nav>
      </header>
      <div className="hero">
        <div className="hero-content">
          <h1>Tired of “We Don’t Sponsor”?</h1>

          <p className="subtitle">
            We connect international students with employers who do.
          </p>

          <p className="description">
            A job platform built for F‑1 visa holders looking for OPT, CPT, STEM
            OPT, and H‑1B sponsorships. Stop guessing. Start applying to
            companies that actually hire international students.
          </p>

          <button className="primary-btn">Continue with Email</button>
          <a className="guest-link" href="#">
            Continue as a guest →
          </a>
        </div>
      </div>
    </main>
  );
};
export default Landingpage;
