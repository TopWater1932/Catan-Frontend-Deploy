import { useEffect, useMemo, useState, useContext } from "react";
import { WebsocketContext } from '../../context/WebsocketContext.jsx'
import "../../styles/Dice.css";

function PipFace({ value, rolling }) {
  const on = useMemo(() => {
    const maps = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    return new Set(maps[Number(value)] ?? []);
  }, [value]);

  return (
    <div className={rolling ? "dice-face-lg rolling" : "dice-face-lg"}>
      <div className="pip-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={on.has(i) ? "pip pip-on" : "pip"} />
        ))}
      </div>
    </div>
  );
}

export default function Dice() {

  const {setDisplayDice} = useContext(WebsocketContext)

  const [open, setOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [die1, setDie1] = useState(1);
  const [die2, setDie2] = useState(1);

  const rollOnce = () => {
    if (rolling) return;
    setOpen(true);
    setRolling(true);
  };

  useEffect(() => {
    if (!rolling) return;

    const interval = setInterval(() => {
      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
    }, 80);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDie1(Math.floor(Math.random() * 6) + 1);
      setDie2(Math.floor(Math.random() * 6) + 1);
      setRolling(false);
    }, 900);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [rolling]);

  const close = () => {
    if (rolling) return;
    setOpen(false);
    setDisplayDice(false);
  };

  return (
    <>
      <div className="dice-launcher">
        <button
          className="button dice-launch-btn"
          onClick={rollOnce}
          disabled={rolling}
        >
          {rolling ? "Rolling..." : "Roll Dice"}
        </button>
      </div>

      {open && (
        <div className="dice-overlay" onClick={close}>
          <div className="dice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dice-modal-title">Dice Roll</div>

            <div className="dice-row">
              <PipFace value={die1} rolling={rolling} />
              <PipFace value={die2} rolling={rolling} />
            </div>

            {!rolling && (
              <div className="dice-total">Total: {die1 + die2}</div>
            )}

            <div className="dice-hint">
              {rolling ? "Rolling…" : "Click outside to close"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}