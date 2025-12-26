import { useEffect, useMemo, useState } from "react";
import "./styles/Dice.css"; // keep this for the wiggle animation if it loads lol

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
    <div
      className={rolling ? "dice-face-lg rolling" : "dice-face-lg"}
      style={{
        width: 120,
        height: 120,
        border: "2px solid rgb(50,50,50)",
        borderRadius: 18,
        display: "grid",
        placeItems: "center",
        background: "rgba(255,255,255,0.25)",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 86,
          height: 86,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              justifySelf: "center",
              alignSelf: "center",
              background: "rgb(50,50,50)",
              opacity: on.has(i) ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Dice() {
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
  };

  return (
    <>
      {}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        <button
          onClick={rollOnce}
          disabled={rolling}
          style={{
            pointerEvents: "auto",
            padding: "12px 18px",
            borderRadius: 12,
            border: "2px solid rgb(50,50,50)",
            background: "rgb(255, 239, 147)",
            color: "rgb(50,50,50)",
            fontWeight: 700,
            cursor: rolling ? "default" : "pointer",
            opacity: rolling ? 0.75 : 1,
          }}
        >
          {rolling ? "Rolling..." : "Roll Dice"}
        </button>
      </div>

      {open && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgb(255, 239, 147)",
              color: "rgb(50,50,50)",
              borderRadius: 14,
              padding: "22px 20px",
              minWidth: 360,
              outline: "1px solid black",
              display: "grid",
              gap: 14,
              placeItems: "center",
            }}
          >
            <div style={{ fontWeight: 800 }}>Dice Roll</div>

            <div style={{ display: "flex", gap: 16 }}>
              <PipFace value={die1} rolling={rolling} />
              <PipFace value={die2} rolling={rolling} />
            </div>

            {!rolling && (
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                Total: {die1 + die2}
              </div>
            )}

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              {rolling ? "Rolling…" : "Click outside to close"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
