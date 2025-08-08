import React, { useEffect, useState } from "react";
import { FcBusinesswoman } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import css from "./TicTacToeGame.module.css";
import Rose from "/assets/images/RoseYellow.png";
import Princesse from "/assets/images/Princasse.png";
import PrincesBlue from "/src/assets/emages/BlueGirl.png";
// import CircleBlue from "/src/assets/emages/CircleBlueCircle.png";
import { WinModal } from "../WinModal/WinModal";
import { useNavigate } from "react-router-dom";
import { WinModalMidle } from "../WinModalMidle/WinModalMidle";

import startSound from "/src/assets/audio/startGame.mp3.wav";
import clickSound from "/src/assets/audio/allclicks.mp3.wav";
// import successSound from "/src/assets/audio/success-mixkit.mp3";
import winSound from "/src/assets/audio/finalliVin.mp3.wav";
import HeroIntro from "../HeroIntro/HeroIntro";

const iconComponents = {
  rose: {
    x: Rose,
    o: Princesse,
  },
  princes: {
    x: PrincesBlue,
    o: FcBusinesswoman,
  },
  boy: {
    x: FcPortraitMode,
    o: FcBusinesswoman,
  },
  man: {
    x: FcBusinessman,
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

  // const successAudio = new Audio(successSound);
  // successAudio.play();

  useEffect(() => {
    const startAudio = new Audio(startSound);
    // Відтворення звуку після першого кліку користувача на кнопку початку гри на HomePage
    const handleUserInteraction = () => {
      startAudio.play().catch(e => console.warn("Autoplay blocked:", e));
      window.removeEventListener("click", handleUserInteraction);
    };
    window.addEventListener("click", handleUserInteraction);
    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  const handleClick = i => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = current;
    const result = checkWin(next);
    // ✅ Грає звук
    const click = new Audio(clickSound);
    click.currentTime = 0;
    click.play().catch(e => console.warn("Click sound error:", e));
    setBoard(next);
    setWinner(result);
    onEvent?.({ type: "move", board: next, result, currentPlayer: current });

    if (!result) {
      setCurrent(current === "X" ? "O" : "X");
    } else {
      if (result === "X") {
        setShowLoading(true);
        // тепер озвучка при виграшу
        const winAudio = new Audio(winSound);
        winAudio.currentTime = 0;
        winAudio.play().catch(e => console.warn("Win sound blocked:", e));
        setTimeout(() => {
          setShowLoading(false);
          // тепер тільки встановлюємо winner
          setWinner("X");
        }, 3000); // можеш змінити тривалість
      } else {
        setTimeout(() => {
          navigate("/result", {
            state: {
              winner: result,
              player1: "You",
              player2: "Opponent",
            },
          });
        }, 3000);
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
      return <Icon size={70} />;
    }
    return <img src={icon} alt={symbol} style={{ width: 70, height: 70 }} />;
  };

  return (
    <main className={css.wrapper}>
      <div className={css.playerLeftBlokLeft}>
        {/* <HeroIntro
          heroImage={iconComponents[settings.theme].x}
          onFinish={() => console.log("Hero intro finished")}
        /> */}

        {animateIntro && (
          <HeroIntro
            hero={
              typeof iconComponents[settings.theme].x === "string"
                ? iconComponents[settings.theme].x
                : React.createElement(iconComponents[settings.theme].x)
            }
            onFinish={() => console.log("Hero intro finished")}
          />
        )}

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

// {
//   animateIntro && (
//     <HeroIntro
//       heroImage={iconComponents[settings.theme].x}
//       onFinish={() => console.log("Hero intro finished")}
//     />
//   );
// }
