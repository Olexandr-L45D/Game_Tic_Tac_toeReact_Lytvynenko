import React, { useEffect, useRef, useState } from "react";
import { FcBusinesswoman } from "react-icons/fc";
import { FcBusinessman } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import css from "./TicTacToeGame.module.css";
import Rose from "/assets/images/RoseYellow.png";
import Princesse from "/assets/images/Princasse.png";
import PrincesBlue from "/src/assets/emages/BlueGirl.png";
import { WinModal } from "../WinModal/WinModal";
import { useNavigate } from "react-router-dom";
import { WinModalMidle } from "../WinModalMidle/WinModalMidle";
import startSound from "/src/assets/audio/startGame.mp3.wav";
import clickSound from "/src/assets/audio/allclicks.mp3.wav";
import winSound from "/src/assets/audio/finalliVin.mp3.wav";
import HeroIntro from "../HeroIntro/HeroIntro";
import HeroEffect from "../HeroEffect/HeroEffect";
import WinLineEffect from "../WinLineEffect/WinLineEffect";
import GroupGreeting from "/src/assets/emages/GroupFone3.png";

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
  const [showHeroEffect, setShowHeroEffect] = useState(false);
  const [showHeroEffectRight, setShowHeroEffectRight] = useState(false);
  const [winLine, setWinLine] = useState([]);

  // NEW: для контролю порядку відображення фінальних ефектів
  const [pendingResult, setPendingResult] = useState(null); // { player, line } — тимчасово зберігаємо результат
  const [showWinLine, setShowWinLine] = useState(false); // коли true — рендеримо WinLineEffect перед фіналом

  const timersRef = useRef([]); // зберігаємо таймери щоб очищати їх при reset/unmount

  // Звуки для ходів
  const moveSoundX = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
  const moveSoundO = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
  // Обробка старту гри
  useEffect(() => {
    setShowHeroEffect(true); // стартовий ефект
  }, []);

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
      setShowHeroEffectRight(true);
      setAnimateLeft(true);
      setAnimateRight(false);
      moveSoundX.currentTime = 0;
      moveSoundX.play().catch(() => {});
      const timer = setTimeout(() => setAnimateLeft(false), 2000);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    } else if (current === "O") {
      setShowHeroEffect(true); // ефект при кліку гравця = Х
      setAnimateRight(true);
      setAnimateLeft(false);
      moveSoundO.currentTime = 0;
      moveSoundO.play().catch(() => {});
      const timer = setTimeout(() => setAnimateRight(false), 2000);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // ********** HANDLE CLICK **********
  const handleClick = i => {
    if (board[i] || winner || showWinLine) return; // блокувати кліки поки йде фінальний ефект

    const next = [...board];
    next[i] = current;
    const result = checkWin(next); // тепер повертає { player, line } або null

    // Звук кліку
    const click = new Audio(clickSound);
    click.currentTime = 0;
    click.play().catch(() => {});

    setBoard(next);
    onEvent?.({ type: "move", board: next, result, currentPlayer: current }); // зберігаємо подію — як було раніше

    if (!result) {
      // Якщо переможця ще нема — міняємо хід
      setCurrent(current === "X" ? "O" : "X");
    } else {
      // ***************** ЗМІНА ПОРЯДКУ ВІДОБРАЖЕННЯ *****************
      // Замість негайного setWinner(result.player) (який викликає фінальні модалки відразу),
      // ми зберігаємо результат у pendingResult і показуємо WinLineEffect (showWinLine = true).
      // Після того, як WinLineEffect викличе onFinish, ми виконаємо подальшу логіку (showLoading -> setWinner / navigate).
      //
      // Старий код (залишений закоментованим для референсу):
      // setWinner(result.player);
      // setWinLine(result.line || []);
      // if (result.player === "X") { setShowLoading(true); const winAudio = new Audio(winSound); ... }
      //
      // Новий: (нижче)
      setWinLine(result.line || []);
      setPendingResult(result);
      setShowWinLine(true);
      // Тепер WinLineEffect відмонтовано через onFinish() -> handleWinLineFinish() (нижче)
    }
  };

  // Обробник, який викликається коли WinLineEffect закінчив анімацію
  const handleWinLineFinish = () => {
    // WinLineEffect вже відграв (його useEffect викликав onFinish)
    const result = pendingResult;
    setShowWinLine(false);
    setPendingResult(null);

    if (!result) return;

    // Тепер виконуємо колишню логіку, але зроблено ПОСЛІДОВНО після WinLineEffect:
    if (result.player === "X") {
      // як в оригіналі — показ проміжного модального (showLoading -> WinModal)
      setShowLoading(true);

      // Рекомендація/примітка: раніше ти запускав winSound в handleClick.
      // Я залишаю відтворення звуку тут (після WinLineEffect), щоб звук співпав з проміжним модальним.
      // Якщо хочеш, щоб звук гра(в) під час WinLineEffect, перемісти виклик в WinLineEffect (зараз у тебе там вже був звук).
      const winAudio = new Audio(winSound);
      winAudio.currentTime = 0;
      winAudio.play().catch(() => {});

      const t = setTimeout(() => {
        setShowLoading(false);
        setWinner("X");

        // У твоєму попередньому коді інколи було navigate("/result", ...) —
        // Якщо хочеш зберегти навігацію (переходити на іншу сторінку після модалки), розкоментуй наступний рядок.
        // Але зауваж: якщо ти Navigate відразу — WinModal може не встигнути показатись.
        // navigate("/result", { state: { winner: result.player, player1: "You", player2: "Opponent" } });

        // Якщо потрібен перехід на сторінку результату в оригінальному місці — можна його залишити.
      }, 2500);

      timersRef.current.push(t);
    } else if (result.player !== "Draw") {
      // Якщо виграв опонент (O) — у старому коді ти робив navigate через 3 сек.
      const t = setTimeout(() => {
        navigate("/result", {
          state: {
            winner: result.player,
            player1: "You",
            player2: "Opponent",
          },
        });
      }, 2500);
      timersRef.current.push(t);
    } else {
      // Нічия — робимо те ж саме (або одразу навігація)
      const t = setTimeout(() => {
        navigate("/result", {
          state: {
            winner: "Draw",
            player1: "You",
            player2: "Opponent",
          },
        });
      }, 2500);
      timersRef.current.push(t);
    }
  };

  // очищення таймерів при unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIntro(false);
    }, 3000);
    timersRef.current.push(timer);
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
      if (b[a] && b[a] === b[b1] && b[a] === b[c])
        return { player: b[a], line: [a, b1, c] };
    }
    return b.every(Boolean) ? { player: "Draw", line: [] } : null;
  };

  const reset = () => {
    // очищаємо всі стани і таймери
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current = [];

    setBoard(Array(9).fill(null));
    setCurrent("X");
    setWinner(null);
    setShowLoading(false);
    setWinLine([]);
    setPendingResult(null);
    setShowWinLine(false);

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
        {showHeroEffect && (
          <HeroEffect
            hero={
              typeof iconComponents[settings.theme].x === "string"
                ? iconComponents[settings.theme].x
                : React.createElement(iconComponents[settings.theme].x)
            }
            visible={showHeroEffect}
            onFinish={() => setShowHeroEffect(false)}
          />
        )}

        <aside className={css.playerLeft}>
          <div
            className={`${css.heroIconWrapper} ${
              animateIntro
                ? css.introGlow
                : current === "X" && animateLeft
                ? css.turnGlow
                : ""
            }`}
          >
            {getIconComponent("x")}
          </div>

          <span className={css.label}>You</span>
        </aside>
      </div>

      <section className={themeClass}>
        <section className={css.gridWrapper} style={{ position: "relative" }}>
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

          {/* -----------------------
            Рендер WinLineEffect ТІЛЬКИ коли showWinLine === true,
            тобто ПЕРЕД тим як показати фінальні модалки/навігацію.
            Це гарантує, що підсвітка/фон з макета з'явиться вчасно.
            ----------------------- */}
          <div className={css.gridWrap} style={{ position: "relative" }}>
            {showWinLine && winLine.length > 0 && (
              <WinLineEffect
                cells={winLine}
                board={board.map(c => (c ? getIconComponent(c) : null))}
                theme={theme}
                bgImage={GroupGreeting}
                onFinish={handleWinLineFinish}
              />
            )}
          </div>
          {/* Старий варіант, який був раніше (залишаю закоментований для референсу):
              {winner && winLine.length > 0 && (
                <WinLineEffect ... />
              )}
              Ми більше не рендеримо WinLineEffect за умовою winner === ...,
              бо winner тепер встановлюється ТІЛЬКИ після того, як WinLineEffect пройшов.
          */}
        </section>

        {winner === "X" && <WinModal onRestart={handleRestartGame} />}

        {showLoading && <WinModalMidle onRestart={() => {}} />}
      </section>
      <div className={css.playerLeftBlokRight}>
        {showHeroEffectRight && (
          <HeroIntro
            hero={
              typeof iconComponents[settings.theme].o === "string"
                ? iconComponents[settings.theme].o
                : React.createElement(iconComponents[settings.theme].o)
            }
            visible={showHeroEffectRight}
            onFinish={() => setShowHeroEffectRight(false)}
          />
        )}
        <aside
          className={`${css.playerRight} ${
            animateIntro ? css.playerIntro : ""
          }`}
        >
          <div
            className={`${current === "0" ? css.glowingPlayer : ""} ${
              animateRight ? css.animateHeroMove : ""
            } ${css.heroIconWrapper}`}
          >
            {getIconComponent("o")}
          </div>
          <span className={css.label}>PLAYER 2</span>
        </aside>
      </div>
    </main>
  );
};

export default TicTacToeGame;

// import React, { useEffect, useState } from "react";
// import { FcBusinesswoman } from "react-icons/fc";
// import { FcBusinessman } from "react-icons/fc";
// import { FcPortraitMode } from "react-icons/fc";
// import css from "./TicTacToeGame.module.css";
// import Rose from "/assets/images/RoseYellow.png";
// import Princesse from "/assets/images/Princasse.png";
// import PrincesBlue from "/src/assets/emages/BlueGirl.png";
// import { WinModal } from "../WinModal/WinModal";
// import { useNavigate } from "react-router-dom";
// import { WinModalMidle } from "../WinModalMidle/WinModalMidle";
// import startSound from "/src/assets/audio/startGame.mp3.wav";
// import clickSound from "/src/assets/audio/allclicks.mp3.wav";
// import winSound from "/src/assets/audio/finalliVin.mp3.wav";
// import HeroIntro from "../HeroIntro/HeroIntro";
// import HeroEffect from "../HeroEffect/HeroEffect";
// import WinLineEffect from "../WinLineEffect/WinLineEffect";
// import GroupGreeting from "/src/assets/emages/GroupFone3.png";

// const iconComponents = {
//   rose: {
//     x: Rose,
//     o: Princesse,
//   },
//   princes: {
//     x: PrincesBlue,
//     o: FcBusinesswoman,
//   },
//   boy: {
//     x: FcPortraitMode,
//     o: FcBusinesswoman,
//   },
//   man: {
//     x: FcBusinessman,
//     o: FcBusinesswoman,
//   },
// };

// const TicTacToeGame = ({ settings, onEvent }) => {
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [current, setCurrent] = useState("X");
//   const [winner, setWinner] = useState(null);
//   const navigate = useNavigate();
//   const [animateIntro, setAnimateIntro] = useState(true);
//   const [showLoading, setShowLoading] = useState(false);
//   // Анімації ходів
//   const [animateLeft, setAnimateLeft] = useState(false);
//   const [animateRight, setAnimateRight] = useState(false);
//   const [showHeroEffect, setShowHeroEffect] = useState(false);
//   const [showHeroEffectRight, setShowHeroEffectRight] = useState(false);
//   const [winLine, setWinLine] = useState([]);

//   // Звуки для ходів
//   const moveSoundX = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
//   const moveSoundO = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
//   // Обробка старту гри
//   useEffect(() => {
//     setShowHeroEffect(true); // стартовий ефект
//   }, []);

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

//   // Обробка анімації при зміні current (ходу)
//   useEffect(() => {
//     if (current === "X") {
//       setShowHeroEffectRight(true);
//       setAnimateLeft(true);
//       setAnimateRight(false);
//       moveSoundX.currentTime = 0;
//       moveSoundX.play().catch(() => {});
//       const timer = setTimeout(() => setAnimateLeft(false), 2000);
//       return () => clearTimeout(timer);
//     } else if (current === "O") {
//       setShowHeroEffect(true); // ефект при кліку гравця = Х
//       setAnimateRight(true);
//       setAnimateLeft(false);
//       moveSoundO.currentTime = 0;
//       moveSoundO.play().catch(() => {});
//       const timer = setTimeout(() => setAnimateRight(false), 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [current]);

//   // const handleClick = i => {
//   //   if (board[i] || winner) return;
//   //   const next = [...board];
//   //   next[i] = current;
//   //   const result = checkWin(next);

//   //   const click = new Audio(clickSound);
//   //   click.currentTime = 0;
//   //   click.play().catch(() => {});

//   //   setBoard(next);
//   //   setWinner(result);
//   //   onEvent?.({ type: "move", board: next, result, currentPlayer: current });

//   //   if (!result) {
//   //     setCurrent(current === "X" ? "O" : "X");
//   //   } else {
//   //     if (result === "X") {
//   //       setShowLoading(true);
//   //       const winAudio = new Audio(winSound);
//   //       winAudio.currentTime = 0;
//   //       winAudio.play().catch(() => {});
//   //       setTimeout(() => {
//   //         setShowLoading(false);
//   //         setWinner("X");
//   //       }, 3000);
//   //     } else {
//   //       setTimeout(() => {
//   //         navigate("/result", {
//   //           state: { winner: result, player1: "You", player2: "Opponent" },
//   //         });
//   //       }, 3000);
//   //     }
//   //   }
//   // };

//   const handleClick = i => {
//     if (board[i] || winner) return;

//     const next = [...board];
//     next[i] = current;
//     const result = checkWin(next); // тепер повертає { player, line } або null

//     // Звук кліку
//     const click = new Audio(clickSound);
//     click.currentTime = 0;
//     click.play().catch(() => {});

//     setBoard(next);

//     if (!result) {
//       // Якщо переможця ще нема — міняємо хід
//       setCurrent(current === "X" ? "O" : "X");
//     } else {
//       // Зберігаємо переможця і виграшну лінію
//       setWinner(result.player);
//       setWinLine(result.line || []);

//       if (result.player === "X") {
//         // Стара логіка з показом проміжного модального вікна
//         setShowLoading(true);
//         const winAudio = new Audio(winSound);
//         winAudio.currentTime = 0;
//         winAudio.play().catch(() => {});

//         // Чекаємо 3 сек, ховаємо лоадер і показуємо фінальне модальне
//         setTimeout(() => {
//           setShowLoading(false);
//           setWinner("X");

//           // Додатково: після ефекту підсвітки — редірект
//           navigate("/result", {
//             state: {
//               winner: result.player,
//               player1: "You",
//               player2: "Opponent",
//             },
//           });
//         }, 3000);
//       } else if (result.player !== "Draw") {
//         // Якщо переміг не X (наприклад, O) — просто 3 сек затримка перед переходом
//         setTimeout(() => {
//           navigate("/result", {
//             state: {
//               winner: result.player,
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
//       if (b[a] && b[a] === b[b1] && b[a] === b[c])
//         return { player: b[a], line: [a, b1, c] };
//     }
//     return b.every(Boolean) ? { player: "Draw", line: [] } : null;
//   };

//   // const checkWin = b => {
//   //   for (let [a, b1, c] of lines) {
//   //     if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
//   //   }
//   //   return b.every(Boolean) ? "Draw" : null;
//   // };

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
//         {showHeroEffect && (
//           <HeroEffect
//             hero={
//               typeof iconComponents[settings.theme].x === "string"
//                 ? iconComponents[settings.theme].x
//                 : React.createElement(iconComponents[settings.theme].x)
//             }
//             visible={showHeroEffect}
//             onFinish={() => setShowHeroEffect(false)}
//           />
//         )}

//         <aside className={css.playerLeft}>
//           <div
//             className={`${css.heroIconWrapper} ${
//               animateIntro
//                 ? css.introGlow
//                 : current === "X" && animateLeft
//                 ? css.turnGlow
//                 : ""
//             }`}
//           >
//             {getIconComponent("x")}
//           </div>

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
//           {winner && winLine.length > 0 && (
//             <WinLineEffect
//               cells={winLine}
//               board={board.map(c => (c ? getIconComponent(c) : null))}
//               theme={theme}
//               bgImage={GroupGreeting}
//             />
//           )}
//         </section>

//         {winner === "X" && <WinModal onRestart={handleRestartGame} />}

//         {showLoading && <WinModalMidle onRestart={() => {}} />}
//       </section>
//       <div className={css.playerLeftBlokRight}>
//         {showHeroEffectRight && (
//           <HeroIntro
//             hero={
//               typeof iconComponents[settings.theme].o === "string"
//                 ? iconComponents[settings.theme].o
//                 : React.createElement(iconComponents[settings.theme].o)
//             }
//             visible={showHeroEffectRight}
//             onFinish={() => setShowHeroEffectRight(false)}
//           />
//         )}
//         <aside
//           className={`${css.playerRight} ${
//             animateIntro ? css.playerIntro : ""
//           }`}
//         >
//           <div
//             className={`${current === "0" ? css.glowingPlayer : ""} ${
//               animateRight ? css.animateHeroMove : ""
//             } ${css.heroIconWrapper}`}
//           >
//             {getIconComponent("o")}
//           </div>
//           <span className={css.label}>PLAYER 2</span>
//         </aside>
//       </div>
//     </main>
//   );
// };

// export default TicTacToeGame;

// <aside
//   className={`${css.playerLeft} ${animateIntro ? css.playerIntro : ""}`}
// ></aside>;

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
