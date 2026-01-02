import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bg from "./assets/green-countryside-1527845592.avif";
import "./styles/LandingPage.css";


function LandingPage() {
  const bgRef = useRef(null);

  useEffect(() => {

    const onScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY;
      bgRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-page">
      {/* Parallax*/}
      <div
        ref={bgRef}
        className="lp-parallax-bg"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden="true"
      />

    
      <div className="lp-overlay" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <h1 className="lp-title">Catan Online</h1>
          <p className="lp-subtitle">
            A classic game <em>reimagined</em> 
          </p>

          <Link className="lp-play" to="/setup">
            PLAY NOW
          </Link>
        </div>

        <div className="lp-bottom-row">
          <div className="lp-credits">
            <h3>Developer Credits</h3>
            <ul>
              <li>Yianni Anastasiadis</li>
              <li>Tong Chen</li>
              <li>Nathan Coelho</li>
            </ul>
          </div>

          <div className="lp-scroll">
            <p>
              Scroll Down
              <br />
              for Project Description
            </p>
            <div className="lp-arrow">↓</div>
          </div>
        </div>
      </section>

      {/*  */}
      <section className="lp-description">
        <div className="lp-textbox">
          {/* blank for now*/}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
