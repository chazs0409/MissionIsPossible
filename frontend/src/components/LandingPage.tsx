import logo from "../assets/logo.png";
import job from "../assets/job.jpg";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Landingpage = () => {
  const navigate = useNavigate();
  return (
    <main className="landing-page">
      <div className="container">
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
              A job platform built for F‑1 visa holders looking for OPT, CPT,
              STEM OPT, and H‑1B sponsorships. Stop guessing. Start applying to
              companies that actually hire international students.
            </p>

            <button className="primary-btn" onClick={() => navigate("/search")}>
              Continue with Email
            </button>
            <a className="guest-link" href="#">
              Continue as a guest →
            </a>
          </div>
        </div>
        <div className="about">
          <section className="section">
            <h2>
              Square One is built for international students who are tired of
              hearing “We don’t sponsor.”{" "}
            </h2>
            <p>
              We know how draining it is to job‑hunt when every application
              feels uncertain. Square One highlights only employers who truly
              hire F‑1 students for{" "}
              <span className="examples">OPT, CPT, STEM OPT, and H‑1B</span>. By
              reviewing hiring history and visa policies, we help you focus on
              real opportunities—not guesswork.
            </p>
            <button className="primary-btn">Call to action</button>
          </section>
          <img src={job} alt="job 2d photo" className="about-image" />
        </div>
        <Footer />
      </div>
    </main>
  );
};
export default Landingpage;
