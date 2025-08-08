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
  // Анімації ходів
  const [animateLeft, setAnimateLeft] = useState(false);
  const [animateRight, setAnimateRight] = useState(false);
  // Звуки для ходів
  const moveSoundX = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
  const moveSoundO = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
  // Обробка старту гри
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

  // Обробка анімації при зміні current (ходу)
  useEffect(() => {
    if (current === "X") {
      setAnimateLeft(true);
      setAnimateRight(false);
      moveSoundX.currentTime = 0;
      moveSoundX.play().catch(() => {});
      const timer = setTimeout(() => setAnimateLeft(false), 2000);
      return () => clearTimeout(timer);
    } else if (current === "O") {
      setAnimateRight(true);
      setAnimateLeft(false);
      moveSoundO.currentTime = 0;
      moveSoundO.play().catch(() => {});
      const timer = setTimeout(() => setAnimateRight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [current]);

  const handleClick = i => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = current;
    const result = checkWin(next);

    const click = new Audio(clickSound);
    click.currentTime = 0;
    click.play().catch(() => {});

    setBoard(next);
    setWinner(result);
    onEvent?.({ type: "move", board: next, result, currentPlayer: current });

    if (!result) {
      setCurrent(current === "X" ? "O" : "X");
    } else {
      if (result === "X") {
        setShowLoading(true);
        const winAudio = new Audio(winSound);
        winAudio.currentTime = 0;
        winAudio.play().catch(() => {});
        setTimeout(() => {
          setShowLoading(false);
          setWinner("X");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/result", {
            state: { winner: result, player1: "You", player2: "Opponent" },
          });
        }, 3000);
      }
    }
  };

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

        {/* <aside
          className={`${css.playerLeft} ${
            animateIntro ? `${css.playerIntro}` : ""
          } ${current === "X" ? css.glowingPlayer : ""} ${
            current === "X" && animateLeft ? css.animateHeroMove : ""
          }`}
        >
          {getIconComponent("x")}
          <span className={css.label}>You</span>
        </aside> */}
        <aside
          className={`${css.playerLeft} ${animateIntro ? css.playerIntro : ""}`}
        >
          <div
            className={`${current === "X" ? css.glowingPlayer : ""} ${
              animateLeft ? css.animateHeroMove : ""
            } ${css.heroIconWrapper}`}
          >
            {getIconComponent("x")}
          </div>
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

      <aside
        className={`${css.playerRight} ${animateIntro ? css.playerIntro : ""}`}
      >
        <div
          className={`${current === "0" ? css.glowingPlayer : ""} ${
            animateRight ? css.animateHeroMove : ""
          } ${css.heroIconWrapper}`}
        >
          {getIconComponent("o")}
        </div>
        <span className={css.label}>Opponent</span>
      </aside>
    </main>
  );
};

export default TicTacToeGame;

// const TicTacToeGame = ({ settings, onEvent }) => {
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [current, setCurrent] = useState("X");
//   const [winner, setWinner] = useState(null);
//   const navigate = useNavigate();
//   const [animateIntro, setAnimateIntro] = useState(true);
//   const [showLoading, setShowLoading] = useState(false);

//   // const successAudio = new Audio(successSound);
//   // successAudio.play();

//   useEffect(() => {
//     const startAudio = new Audio(startSound);
//     // Відтворення звуку після першого кліку користувача на кнопку початку гри на HomePage
//     const handleUserInteraction = () => {
//       startAudio.play().catch(e => console.warn("Autoplay blocked:", e));
//       window.removeEventListener("click", handleUserInteraction);
//     };
//     window.addEventListener("click", handleUserInteraction);
//     return () => {
//       window.removeEventListener("click", handleUserInteraction);
//     };
//   }, []);

//   const handleClick = i => {
//     if (board[i] || winner) return;
//     const next = [...board];
//     next[i] = current;
//     const result = checkWin(next);
//     // ✅ Грає звук
//     const click = new Audio(clickSound);
//     click.currentTime = 0;
//     click.play().catch(e => console.warn("Click sound error:", e));
//     setBoard(next);
//     setWinner(result);
//     onEvent?.({ type: "move", board: next, result, currentPlayer: current });

//     if (!result) {
//       setCurrent(current === "X" ? "O" : "X");
//     } else {
//       if (result === "X") {
//         setShowLoading(true);
//         // тепер озвучка при виграшу
//         const winAudio = new Audio(winSound);
//         winAudio.currentTime = 0;
//         winAudio.play().catch(e => console.warn("Win sound blocked:", e));
//         setTimeout(() => {
//           setShowLoading(false);
//           // тепер тільки встановлюємо winner
//           setWinner("X");
//         }, 3000); // можеш змінити тривалість
//       } else {
//         setTimeout(() => {
//           navigate("/result", {
//             state: {
//               winner: result,
//               player1: "You",
//               player2: "Opponent",
//             },
//           });
//         }, 3000);
//       }
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setAnimateIntro(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];

//   const checkWin = b => {
//     for (let [a, b1, c] of lines) {
//       if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
//     }
//     return b.every(Boolean) ? "Draw" : null;
//   };

//   const reset = () => {
//     setBoard(Array(9).fill(null));
//     setCurrent("X");
//     setWinner(null);
//     onEvent?.({ type: "reset" });
//   };

//   const handleRestartGame = () => {
//     reset();
//   };

//   const theme = settings?.theme || "default";
//   const themeClass = `game_container theme_${theme}`;

//   const getIconComponent = symbol => {
//     const icon = iconComponents[theme]?.[symbol.toLowerCase()];
//     if (!icon) return symbol;
//     if (typeof icon === "function") {
//       const Icon = icon;
//       return <Icon size={70} />;
//     }
//     return <img src={icon} alt={symbol} style={{ width: 70, height: 70 }} />;
//   };

//   return (
//     <main className={css.wrapper}>
//       <div className={css.playerLeftBlokLeft}>
//         {animateIntro && (
//           <HeroIntro
//             hero={
//               typeof iconComponents[settings.theme].x === "string"
//                 ? iconComponents[settings.theme].x
//                 : React.createElement(iconComponents[settings.theme].x)
//             }
//             onFinish={() => console.log("Hero intro finished")}
//           />
//         )}

//         <aside
//           className={`${css.playerLeft} ${
//             animateIntro ? `${css.glowingPlayer} ${css.playerIntro}` : ""
//           }`}
//         >
//           {getIconComponent("x")}

//           <span className={css.label}>You</span>
//         </aside>
//       </div>

//       <section className={themeClass}>
//         <section className={css.gridWrapper}>
//           <div className={css.gridOverlay}></div>
//           <div className={css.grid}>
//             {board.map((cell, i) => (
//               <button
//                 key={i}
//                 className={`${css.cell} ${css["cell--" + theme]}`}
//                 onClick={() => handleClick(i)}
//                 aria-label={`Cell ${i + 1}`}
//               >
//                 {cell ? getIconComponent(cell) : null}
//               </button>
//             ))}
//           </div>
//         </section>

//         {winner === "X" && <WinModal onRestart={handleRestartGame} />}

//         {showLoading && <WinModalMidle onRestart={() => {}} />}
//       </section>

//       <aside className={css.playerRight}>
//         {getIconComponent("o")}
//         <span className={css.label}>PLAYER 2</span>
//       </aside>
//     </main>
//   );
// };

// export default TicTacToeGame;
