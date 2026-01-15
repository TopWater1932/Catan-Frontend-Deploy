import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/green-countryside-1527845592.avif";
import "../../styles/LandingPage.css";


function LandingPage() {
  const bgRef = useRef<HTMLDivElement | null>(null);

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

      <section className="lp-description">
        <div className="lp-textbox">

          <p className="project-intro">
            <strong>Catan Online</strong> is an online multiplayer web application for
            playing the timeless classic board game <em>Settlers of Catan</em> by Klaus Teuber.
            This collaborative project was designed and built by Tong Chen, Yianni Anastasiadis
            and Nathan Coelho.
          </p>

          <section>
            <h2>Project Purpose</h2>
            <p>
              This project was undertaken in our own time out of enjoyment in the software
              development process, a love for this board game, and for learning purposes.
            </p>
          </section>

          <section>
            <h2>Project Description</h2>
            <ul>
              <li>Full-stack web application for playing Settlers of Catan online.</li>
              <li>Up to 4-player live multiplayer via WebSocket protocol.</li>
              <li>Bots that utilise weighted heuristic decision trees.</li>
              <li>Bespoke gameplay notation system for recording game actions.</li>
            </ul>

            <p>
              This project leverages our diverse technical skill sets across mathematics,
              frontend development, backend development, application architecture, WebSocket
              networking, and UI design.
            </p>

            <p>
              Development was delivered in two-week sprints (as time permitted alongside work
              and study commitments), using Git/GitHub for asynchronous collaboration.
              Design decisions and discussions were documented through meeting minutes and
              supporting project documentation <a href='https://drive.google.com/drive/folders/1q-1ejzB_BP_KaN8PvSahUrlyKcF0TE1H?usp=sharing' target="_blank" rel="noopener noreferrer">here</a>.
            </p>

            <p>
              As of 16 Jan 2026 the MVP is approximately 70-80% complete.
            </p>
          </section>

          <section>
            <h2>Technical Details</h2>

            <h3>Tech Stack</h3>
            <ul>
              <li>Python FastAPI backend</li>
              <li>Python-based bots</li>
              <li>WebSocket endpoints</li>
              <li>React / TypeScript frontend</li>
            </ul>
          </section>

          <section>
            <h2>Backend</h2>
            <p>
              The backend is written in Python with a strong emphasis on object-oriented design.
              Python was chosen due to team familiarity and because performance trade-offs were
              negligible given the project scope.
            </p>

            <p>
              Game elements are separated into reusable classes to manage setup and gameplay
              flow. Examples include encapsulating legal build location logic within the
              Player class.
            </p>

            <p>
              The project introduced several algorithmic challenges, including board data
              representation and integration constraints imposed by frontend requirements.
            </p>

            <p>
              As of 14 Jan 2026, the backend remains incomplete but supports basic
              gameplay. Fully implemented features include:
            </p>

            <ul>
              <li>Board initialization (tiles, nodes, paths)</li>
              <li>Player setup phase</li>
              <li>Dice rolling and resource distribution</li>
              <li>Road, settlement, and city construction</li>
              <li>Maritime and domestic trading</li>
              <li>Longest Road calculation</li>
              <li>Turn management</li>
            </ul>
          </section>

          <section>
            <h2>Frontend</h2>
            <p>
              React was chosen to build the Frontend for the following reasons:
            </p>

            <ul>
              <li>Widely used and well documented.</li>
              <li>Established libraries for WebSockets (<code>react-use-websocket</code>) and board geometry (<code>Konva</code>).</li>
              <li>State-driven UI re-rendering suited to turn-based gameplay.</li>
              <li>Component-based architecture maps cleanly to board game elements.</li>
            </ul>

            <p>
              A TypeScript migration was completed midway through development to introduce
              type safety and improve collaboration.
            </p>

            <p>
              Emphasis was placed on reusability, scalability, and code clarity. One example
              is the reusable Modal component, which displays nearly all modal content
              throughout the application.
            </p>
          </section>

          <section>
            <h2>Networking Infrastructure</h2>
            <p>
              WebSocket communication was chosen over traditional REST APIs to enable immediate
              updates of game state changes to all clients connected to a lobby.
            </p>

            <p>
              Once a WebSocket connection is established, clients and server exchange JSON
              frames containing <code>actionCategory</code> and <code>actionType</code> fields
              used to route and process incoming actions.
            </p>

            <p>
              On the server, WebSocket connections are assigned to lobbies responsible for
              broadcasting state updates, managing disconnections, and reconnecting returning
              players to existing game state. On the client-side, automatic reconnection with exponential backoff is used,
              alongside a heartbeat ping to prevent idle disconnects.
            </p>

            <p>
              Lobby creation is handled via an HTTPS POST request to ensure players are assigned
              to a lobby before establishing their WebSocket connection.
            </p>
          </section>

          <section>
            <h2>Bots</h2>
            <p>
              As of 14 Jan 2026, the bot logic has not been fully integrated into the
              backend. The designed and tested bot workflow is as follows:
            </p>

            <ul>
              <li>Read current game state from the backend.</li>
              <li>Evaluate the position using a heuristic scoring function.</li>
              <li>Enumerate legal moves and evaluate resulting game states.</li>
              <li>Select and execute the highest scoring move.</li>
            </ul>

            <p>
              This architecture enables data collection through the custom notation system,
              allowing heuristics to be refined over time.
            </p>

            <p>
              An early design considered implementing bots as frontend clients communicating
              over WebSockets; this approach was abandoned due to unnecessary complexity,
              increased latency, and security concerns.
            </p>
          </section>

          <section>
            <h2>Planned Future Work</h2>
            <ul>
              <li>Improve bot performance using gameplay data-driven heuristic tuning.</li>
              <li>Implement responsiveness for mobile devices</li>
              <li>Scale the game to support up to 6 players.</li>
              <li>Refactor and polish backend code using common design patterns.</li>
              <li>Implement ports, development cards, and the Largest Army feature.</li>
              <li>Unit testing in both the frontend (Jest) and backend (Pytest).</li>
              <li>Optimise re-rendering behaviour in the React app through memoization and splitting contexts.</li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
