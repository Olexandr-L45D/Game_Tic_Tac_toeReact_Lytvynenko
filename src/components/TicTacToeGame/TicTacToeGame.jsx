import { useEffect, useState } from "react";
import { FcBusinesswoman } from "react-icons/fc";
import css from "./TicTacToeGame.module.css";
import Rose from "/assets/images/RoseYellow.png";
import Princesse from "/assets/images/Princasse.png";
import { WinModal } from "../WinModal/WinModal";
import { useNavigate } from "react-router-dom";
import { WinModalMidle } from "../WinModalMidle/WinModalMidle";

// Об'єкт для іконок та зображень
const iconComponents = {
  rose: {
    x: Rose,
    o: Princesse,
  },
  princes: {
    x: Princesse,
    o: FcBusinesswoman,
  },
};

const TicTacToeGame = ({ settings, onEvent }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState("X");
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();
  const [animateIntro, setAnimateIntro] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const handleClick = i => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = current;
    const result = checkWin(next);

    setBoard(next);
    setWinner(result);
    onEvent?.({ type: "move", board: next, result, currentPlayer: current });

    if (!result) {
      setCurrent(current === "X" ? "O" : "X");
    } else {
      if (result === "X") {
        setShowLoading(true);

        setTimeout(() => {
          setShowLoading(false);
          // тепер тільки встановлюємо winner
          setWinner("X");
        }, 1500); // можеш змінити тривалість
      } else {
        setTimeout(() => {
          navigate("/result", {
            state: {
              winner: result,
              player1: "You",
              player2: "Enemy",
            },
          });
        }, 1500);
      }
    }
  };

  //  Ефект для анімації героя при старті
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWin = b => {
    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.every(Boolean) ? "Draw" : null;
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrent("X");
    setWinner(null);
    onEvent?.({ type: "reset" });
  };

  const handleRestartGame = () => {
    reset();
  };

  const theme = settings?.theme || "default";
  const themeClass = `game_container theme_${theme}`;

  const getIconComponent = symbol => {
    const icon = iconComponents[theme]?.[symbol.toLowerCase()];
    if (!icon) return symbol;
    if (typeof icon === "function") {
      const Icon = icon;
      return <Icon size={60} />;
    }
    return <img src={icon} alt={symbol} style={{ width: 70, height: 70 }} />;
  };

  return (
    <main className={css.wrapper}>
      <div className={css.playerLeftBlokLeft}>
        <aside
          className={`${css.playerLeft} ${
            animateIntro ? `${css.glowingPlayer} ${css.playerIntro}` : ""
          }`}
        >
          {getIconComponent("x")}
          <span className={css.label}>You</span>
        </aside>
      </div>

      <section className={themeClass}>
        <section className={css.gridWrapper}>
          <div className={css.gridOverlay}></div>
          <div className={css.grid}>
            {board.map((cell, i) => (
              <button
                key={i}
                className={`${css.cell} ${css["cell--" + theme]}`}
                onClick={() => handleClick(i)}
                aria-label={`Cell ${i + 1}`}
              >
                {cell ? getIconComponent(cell) : null}
              </button>
            ))}
          </div>
        </section>

        {winner === "X" && <WinModal onRestart={handleRestartGame} />}

        {showLoading && <WinModalMidle onRestart={() => {}} />}
      </section>

      <aside className={css.playerRight}>
        {getIconComponent("o")}
        <span className={css.label}>PLAYER 2</span>
      </aside>
    </main>
  );
};

export default TicTacToeGame;
