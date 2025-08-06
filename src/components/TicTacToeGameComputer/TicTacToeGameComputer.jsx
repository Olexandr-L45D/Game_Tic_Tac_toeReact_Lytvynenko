import css from "./TicTacToeGameComputer.module.css";
import { useState, useEffect } from "react";
import { FcBusinesswoman } from "react-icons/fc";
import Rose from "/assets/images/RoseYellow.png";
import Princesse from "/assets/images/Princasse.png";
import Empty from "/assets/images/RectangleNull.png";
import { useNavigate } from "react-router-dom";

const iconComponents = {
  rose: {
    x: Rose,
    o: Princesse,
  },
  princes: {
    x: Princesse,
    o: Empty,
  },
  dora: {
    x: FcBusinesswoman,
    o: Empty,
  },
};

const TicTacToeGameComputer = ({ settings, onEvent }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState("X");
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const isComputer = settings?.isComputer || false;

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

  const makeMove = (i, player) => {
    const next = [...board];
    next[i] = player;
    const result = checkWin(next);

    setBoard(next);
    setWinner(result);
    onEvent?.({ type: "move", board: next, result, currentPlayer: player });

    if (!result) {
      setCurrent(player === "X" ? "O" : "X");
    } else {
      setTimeout(() => {
        navigate("/result", {
          state: {
            winner: result,
            player1: "You",
            player2: "Computer",
          },
        });
      }, 800);
    }
  };

  const handleClick = i => {
    if (board[i] || winner || (isComputer && current === "O")) return;
    makeMove(i, current);
  };

  // AI move
  useEffect(() => {
    if (isComputer && current === "O" && !winner) {
      const timeout = setTimeout(() => {
        const emptyCells = board
          .map((cell, idx) => (cell === null ? idx : null))
          .filter(i => i !== null);

        const randomIndex =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        if (randomIndex !== undefined) {
          makeMove(randomIndex, "O");
        }
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [board, current, winner, isComputer]);

  const theme = settings?.theme || "default";
  //   const themeClass = `game_container theme_${theme}`;

  const getIconComponent = symbol => {
    const icon = iconComponents[theme]?.[symbol.toLowerCase()];
    if (!icon) return symbol;
    if (typeof icon === "function") {
      const Icon = icon;
      return <Icon size={60} />;
    }
    return <img src={icon} alt={symbol} style={{ width: 65, height: 65 }} />;
  };

  return (
    <main className={css.wrapper}>
      <div className={css.blokLeft}></div>

      <aside className={css.playerLeft}>
        {getIconComponent("x")}
        <span className={css.label}>You : X</span>
      </aside>

      <section className={css.gameSection}>
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
        <div className={css.statusWrapper}></div>
      </section>

      <aside className={css.playerRight}>
        {getIconComponent("o")}
        <span className={css.label}>PLAYER 2</span>
      </aside>

      <div className={css.blokRight}></div>
    </main>
  );
};

export default TicTacToeGameComputer;
