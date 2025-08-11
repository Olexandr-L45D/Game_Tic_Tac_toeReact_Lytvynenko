import React, { useEffect, useState, useRef } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import winSound from "/src/assets/audio/finalliVin.mp3.wav";
import HeroIntro from "../HeroIntro/HeroIntro";
import HeroEffect from "../HeroEffect/HeroEffect";
import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";
import endDrowSound from "/src/assets/audio/endDrowGame.mp3.wav";
import { WinModalFirst } from "../WinModalFirst/WinModalFirst";

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
  const [showLoadingFirst, setshowLoadingFirst] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  // Анімації ходів showLoadingFirst
  const [animateLeft, setAnimateLeft] = useState(false);
  const [animateRight, setAnimateRight] = useState(false);
  const [showHeroEffect, setShowHeroEffect] = useState(false);
  const [showHeroEffectRight, setShowHeroEffectRight] = useState(false);
  // Новий стейт для зберігання індексів виграшних клітин щоб відобразити світіння 3 зображень героя одночасно
  const [winningCells, setWinningCells] = useState([]);
  // const [winLine, setWinLine] = useState([]);
  const moveSoundX = useRef(null);
  const moveSoundO = useRef(null);
  const clickSoundRef = useRef(null);
  const startAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const [showSmile, setShowSmile] = useState(false);
  const [isVisible, setIsWinning] = useState(false);

  useEffect(() => {
    moveSoundX.current = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
    moveSoundO.current = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
    clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
    startAudioRef.current = new Audio("/src/assets/audio/clikcs.mp3.wav");
    winAudioRef.current = new Audio(
      "/src/assets/audio/mixkitFinnaliViner.mp3.wav"
    );
  }, []);
  // Обробка старту гри (стартовий ефект)
  useEffect(() => {
    // setShowHeroEffect(true);
  }, []);
  // Відтворення стартового звуку після першого кліку на сторінці (HomePage)
  useEffect(() => {
    const handleUserInteraction = () => {
      startAudioRef.current
        ?.play()
        .catch(e => console.warn("Autoplay blocked:", e));
      window.removeEventListener("click", handleUserInteraction);
    };
    window.addEventListener("click", handleUserInteraction);
    return () => window.removeEventListener("click", handleUserInteraction);
  }, []);

  // Анімація та звук при зміні current
  useEffect(() => {
    let timer;
    if (current === "O") {
      setShowHeroEffectRight(true);
      setAnimateLeft(true);
      setAnimateRight(false);
      if (moveSoundX.current) {
        moveSoundX.current.currentTime = 0;
        moveSoundX.current.play().catch(() => {});
      }
      timer = setTimeout(() => setAnimateLeft(false), 2000);
    } else if (current === "X") {
      setShowHeroEffect(true);
      setAnimateRight(true);
      setAnimateLeft(false);
      if (moveSoundO.current) {
        moveSoundO.current.currentTime = 0;
        moveSoundO.current.play().catch(() => {});
      }
      timer = setTimeout(() => setAnimateRight(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [current]);
  // useEffect(() => {
  //   let timer; current === "O"
  //   if (current === "X") {
  //     setShowHeroEffectRight(true);
  //     setAnimateLeft(true);
  //     setAnimateRight(false);
  //     if (moveSoundX.current) {
  //       moveSoundX.current.currentTime = 0;
  //       moveSoundX.current.play().catch(() => {});
  //     }
  //     timer = setTimeout(() => setAnimateLeft(false), 1500);
  //   } else if (current === "O") {
  //     setShowHeroEffect(true);
  //     setAnimateRight(true);
  //     setAnimateLeft(false);
  //     if (moveSoundO.current) {
  //       moveSoundO.current.currentTime = 0;
  //       moveSoundO.current.play().catch(() => {});
  //     }
  //     timer = setTimeout(() => setAnimateRight(false), 1500);
  //   }
  //   return () => clearTimeout(timer);
  // }, [current]);

  // Основна функція логіки при кліках в грі

  const handleClick = i => {
    if (board[i] || winner || isVisible) return;
    const next = [...board];
    next[i] = current;
    const result = checkWin(next);
    // Відтворення звуку кліку
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
    setBoard(next);
    // Якщо немає переможця — міняємо хід і виходимо
    if (!result) {
      setCurrent(current === "X" ? "O" : "X");
      return;
    }
    // Маємо результат — зберігаємо гравця (але winner встановимо пізніше для X, після loading)
    const player = result.player;

    if (player === "X") {
      //Це нове! Зберігаємо індекси клітин, які виграли
      setShowSmile(true);
      setIsWinning(true); // Встановлюємо, що зараз період перемоги (підсвітка, анімації)
      setWinningCells(result.line || []); // result.line — це масив індексів з checkWin (виграшна комбінація з 3 х клітин)
      // Показуємо проміжну анімацію а саме смайлик з підсвіткою над героєм = Х зліва
      // 3) даємо браузеру відмальовувати (за потреби можна додати короткий timeout)
      requestAnimationFrame(() => {
        // невелика додаткова пауза (щоб анімація/пульс стартували)
        setTimeout(() => {
          setshowLoadingFirst(true);
        }, 4000);
      });

      // невелика додаткова пауза (щоб анімація/пульс стартували)
      setTimeout(() => {
        setShowLoading(true); // тут вже з'явиться overlay після того, як підсвітка в DOM
        // Показуємо проміжну анімацію/екран (конфеті тощо)
        setWinner("X");
      }, 8000);

      // Показуємо проміжну анімацію/екран (конфеті тощо)
      //без використання =  requestAnimationFrame(() => {
      // setTimeout(() => {
      //   setShowLoading(true);
      //   setWinner("X");
      // }, 6000);

      // Повідомлення + звук
      toast.success("Congratulations on your victory! 🏆");
      if (winAudioRef.current) {
        winAudioRef.current.currentTime = 0;
        winAudioRef.current.play().catch(() => {});
      } else {
        // запасний варіант (якщо ref не ініціалізований)
        const a = new Audio(winSound);
        a.play().catch(() => {});
      }

      // Після 9 секунд ховаємо loading і встановлюємо winner = "X" (це викликає показ WinModal)
      setTimeout(() => {
        setIsWinning(false); // прибираю ефект підсвітки 3 х клітин
        setWinningCells([]); // прибираю ефект підсвітки
        setShowLoading(false);
        setShowSmile(false);
        setshowLoadingFirst(false);
        setWinner("X");
      }, 12000);
    } else if (player === "O") {
      // Противник виграв — робимо коротку паузу і переходимо на сторінку результату
      // озвучка коли Противник виграв
      const a = new Audio(endDrowSound);
      a.play().catch(() => {});

      toast.success("The opponent won. 😞");
      setTimeout(() => {
        navigate("/result", {
          state: { winner: "O", player1: "You", player2: "PLAYER 2" },
        });
      }, 1500);
    } else if (player === "Draw") {
      // Нічия — переходимо на сторінку результату (теж з невеликою затримкою)
      // озвучка коли нічья
      const a = new Audio(endDrowSound);
      a.play().catch(() => {});

      toast.success("You have a draw!");
      setTimeout(() => {
        navigate("/result", {
          state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
        });
      }, 1500);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIntro(false);
    }, 1500);
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
      <ToastContainer
        position="top-right"
        autoClose={5000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={css.playerLeftBlokLeft}>
        {showSmile && <StarkHeroEffect onRestart={() => {}} />}

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
        <section className={css.gridWrapper}>
          <div className={css.gridOverlay}></div>
          <div className={css.grid}>
            {board.map((cell, i) => (
              <button
                key={i}
                className={`${css.cell} ${css["cell--" + theme]} ${
                  winningCells.includes(i)
                    ? isVisible || winner === "X"
                      ? css.visible + " " + css.winner // показуємо виграшну з підсвіткою
                      : css.hidden // виграшна, але ще прихована
                    : "" // звичайна клітинка без ефекту
                }`}
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
        {showLoadingFirst && <WinModalFirst onRestart={() => {}} />}
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
            className={`${current === "O" ? css.glowingPlayer : ""} ${
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

// variancy to render in DOM

// <section className={css.gridWrapper}>
//   <div className={css.gridOverlay}></div>
//   {isWinning ? (
//     <div className={css.grid}>
//       {board.map((cell, i) => (
//         <button
//           key={i}
//           className={`${css.cell} ${css["cell--" + theme]} ${
//             winningCells.includes(i) ? css.winner : ""
//           }`}
//           onClick={() => handleClick(i)}
//           aria-label={`Cell ${i + 1}`}
//         >
//           {cell ? getIconComponent(cell) : null}
//         </button>
//       ))}
//     </div>
//   ) : (
//     <div className={css.grid}>
//       {board.map((cell, i) => (
//         <button
//           key={i}
//           className={`${css.cell} ${css["cell--" + theme]}`}
//           onClick={() => handleClick(i)}
//           aria-label={`Cell ${i + 1}`}
//         >
//           {cell ? getIconComponent(cell) : null}
//         </button>
//       ))}
//     </div>
//   )}
// </section>;

// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (winner === "X") {
//       setShowLoading(true);
//     }
//   }, 2000);
//   return () => clearTimeout(timer);
// }, [winner]);

//{
/*         
        {winner === "X" && showStarkSmailEffect && (
          <StarkHeroEffect onRestart={() => {}} />
        )} */
//}

//{
/* {showStarkSmailEffect && (
          <StarkHeroEffect
            visible={showStarkSmailEffect}
            onFinish={() => setShowStarkSmailEffect(false)}
          />
        )} */
//}

// якщо я хочу з затримкою то пишу в середину сеттаймаута
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (winner === "X") {
//       setShowSmile(true);
//     }
//   }, 2000);
//   return () => clearTimeout(timer);
// }, [winner]);

/*           
          {winner && winLine.length > 0 && (
            <WinLineEffect
              cells={winLine}
              board={board.map(c => (c ? getIconComponent(c) : null))}
              theme={theme}
              bgImage={GroupGreeting}
            />
          )} */

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
//       }
//else {
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
