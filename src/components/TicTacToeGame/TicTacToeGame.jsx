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
// import { WinModalMidle } from "../WinModalMidle/WinModalMidle";
import winSound from "/src/assets/audio/finalliVin.mp3.wav";
import HeroIntro from "../HeroIntro/HeroIntro";
import HeroEffect from "../HeroEffect/HeroEffect";
import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";
import endDrowSound from "/src/assets/audio/endDrowGame.mp3.wav";
import { WinModalFirst } from "../WinModalFirst/WinModalFirst";
import arowIcon from "/src/assets/emages/arowLinkForward.png";
import restartSound from "/src/assets/audio/mixKids.mp3.wav";

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
  // const [showLoading, setShowLoading] = useState(false);
  // Анімації ходів
  const [animateLeft, setAnimateLeft] = useState(false);
  const [animateRight, setAnimateRight] = useState(false);
  const [showHeroEffect, setShowHeroEffect] = useState(false);
  const [showHeroEffectRight, setShowHeroEffectRight] = useState(false);
  // Новий стейт - useState([]); для зберігання індексів виграшних клітин щоб відобразити світіння 3-x зображень героя одночасно
  const [winningCells, setWinningCells] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const moveSoundX = useRef(null);
  const moveSoundO = useRef(null);
  const clickSoundRef = useRef(null);
  const startAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const [showSmile, setShowSmile] = useState(false);
  const [isVisible, setIsWinning] = useState(false);
  const [showButton, setShowButton] = useState(false); // ✅ початково приховано кнопку повернення
  const [slideDown, setSlideDown] = useState(false); //add стан анімації зсуву
  //NEW  Чий хід: X чи O
  // const [xIsNext, setXIsNext] = useState(true); // Чий хід: X чи O
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true); //  показуємо через 2 секунди
    }, 3000);

    return () => clearTimeout(timer); // очищення таймера
  }, []);
  // Музичні ефекти на useEffect() та useRef();
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
  //Основна анімація та звук при зміні current
  // (протилежний гравець підсвічується сяйвом та підстрибує)
  useEffect(() => {
    let timer;
    if (current === "O") {
      setIsAnimating(true); // <-- блокуємо кліки поки триває
      setShowHeroEffectRight(true);
      setAnimateLeft(true);
      setAnimateRight(false);
      if (moveSoundX.current) {
        moveSoundX.current.currentTime = 0;
        moveSoundX.current.play().catch(() => {});
      }
      timer = setTimeout(() => setAnimateLeft(false), 2000);
    } else if (current === "X") {
      setIsAnimating(true); // <-- блокуємо кліки поки триває
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
  // масив з 9 клітин гри з індексами
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
  //  функція перевірки переможця (виграв Х чи 0)
  const checkWin = b => {
    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c])
        return { player: b[a], line: [a, b1, c] };
    }
    return b.every(Boolean) ? { player: "Draw", line: [] } : null;
  };
  //Основна ФУНКЦІЯ- const handleClick = логіка та анімаціїї+звуки в ході Всієї гри при кліках на клітини поля гр
  const handleClick = i => {
    if (board[i] || winner || isVisible || isAnimating) return;
    // Створюємо копію ігрового поля
    const next = [...board];
    next[i] = current;
    const result = checkWin(next);
    setBoard(next);
    // Відтворення звуку кліку
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
    if (!result) {
      // Змінюємо хід на "O"
      setCurrent("O");
      // Через 1.5 сekond комп'ютер робить випадковий хід
      setTimeout(() => {
        if (winner) return;
        const free = next
          .map((v, idx) => (v ? null : idx))
          .filter(idx => idx !== null);
        if (free.length === 0) return;
        const j = free[Math.floor(Math.random() * free.length)];
        const afterO = [...next];
        afterO[j] = "O";
        setBoard(afterO);
        // Звук кліку для комп'ютера
        if (clickSoundRef.current) {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play().catch(() => {});
        }
        const res2 = checkWin(afterO);
        if (!res2) {
          // Ніхто не переміг — повертаємо хід гравцю X
          setCurrent("X");
        } else if (res2.player === "O") {
          // Комп'ютер виграв
          const a = new Audio(endDrowSound);
          a.play().catch(() => {});
          setTimeout(() => {
            navigate("/result", {
              state: { winner: "O", player1: "You", player2: "PLAYER 2" },
            });
          }, 1500);
        } else if (res2.player === "Draw") {
          // Нічия
          const a = new Audio(endDrowSound);
          a.play().catch(() => {});
          setTimeout(() => {
            navigate("/result", {
              state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
            });
          }, 1500);
        }
      }, 1500);
    } else {
      // Для надійності
      setCurrent("X");
    }
    //  Логіка обробки перемоги
    if (result) {
      const player = result.player;
      if (player === "X") {
        setShowSmile(true);
        setIsWinning(true);
        setWinningCells(result.line || []);
        // Затримка анімації зсуву поля гри вниз при виграші
        setTimeout(() => setSlideDown(true), 3000);
        // Затримка анімації показу першої сторінки з конфеті при виграші
        requestAnimationFrame(() =>
          setTimeout(() => {
            setSlideDown(false);
            setshowLoadingFirst(true);
          }, 4000)
        );
        if (winAudioRef.current) {
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play().catch(() => {});
        } else {
          const a = new Audio(winSound);
          a.play().catch(() => {});
        }
        setTimeout(() => {
          setIsWinning(false);
          setWinningCells([]);
          setShowSmile(false);
          setshowLoadingFirst(false);
          setWinner("X");
        }, 7000);
      } else if (player === "O") {
        const a = new Audio(endDrowSound);
        a.play().catch(() => {});
        setTimeout(() => {
          navigate("/result", {
            state: { winner: "O", player1: "You", player2: "PLAYER 2" },
          });
        }, 1500);
      } else if (player === "Draw") {
        const a = new Audio(endDrowSound);
        a.play().catch(() => {});
        setTimeout(() => {
          navigate("/result", {
            state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
          });
        }, 1500);
      }
    }
  };

  //Основна ФУНКЦІЯ = логіка та анімаціїї+звуки в ході Всієї гри при кліках на клітини поля гри

  //   const handleClick = i => {
  //     if (board[i] || winner || isVisible || isAnimating) return;
  //     // Створюємо копію ігрового поля
  //     const next = [...board];
  //     next[i] = current;
  //     const result = checkWin(next);
  //     setBoard(next);
  //     // Відтворення звуку кліку
  //     if (clickSoundRef.current) {
  //       clickSoundRef.current.currentTime = 0;
  //       clickSoundRef.current.play().catch(() => { });
  //     }
  //     // Якщо немає переможця — міняємо хід і виходимо
  //     if (!result) {
  //       // setCurrent(current === "X" ? "O" : "X");
  //       // return;
  //       setCurrent("O");
  //       // [NEW] Через 1с комп'ютер робить випадковий хід у ВІЛЬНУ клітину
  //       setTimeout(() => {
  //         // страховка: якщо за цей час з’явився переможець — нічого не робимо
  //         if (winner) return;

  //         // [NEW] знаходимо вільні клітини на основі СВІЖОГО снапшота next (ходу X)
  //         const free = next
  //           .map((v, idx) => (v ? null : idx))
  //           .filter((idx) => idx !== null);

  //         if (free.length === 0) return; // більше ходити нікуди

  //         const j = free[Math.floor(Math.random() * free.length)];
  //         const afterO = [...next];
  //         afterO[j] = "O";
  //         setBoard(afterO);

  //         // звук кліку для комп'ютера
  //         if (clickSoundRef.current) {
  //           clickSoundRef.current.currentTime = 0;
  //           clickSoundRef.current.play().catch(() => { });
  //         }

  //         const res2 = checkWin(afterO);

  //         if (!res2) {
  //           // [NEW] Ніхто не переміг — повертаємо хід гравцю X
  //           setCurrent("X");
  //         } else if (res2.player === "O") {
  //           // [NEW] Комп'ютер виграв — використовуємо твою вже існуючу гілку
  //           const a = new Audio(endDrowSound);
  //           a.play().catch(() => { });
  //           setTimeout(() => {
  //             navigate("/result", {
  //               state: { winner: "O", player1: "You", player2: "PLAYER 2" },
  //             });
  //           }, 1500);
  //         } else if (res2.player === "Draw") {
  //           // [NEW] Нічия
  //           const a = new Audio(endDrowSound);
  //           a.play().catch(() => { });
  //           setTimeout(() => {
  //             navigate("/result", {
  //               state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
  //             });
  //           }, 1500);
  //         }
  //       }, 1000);
  //     } else {
  //       // Теоретично користувач не ходить за O, але залишимо для надійності
  //       setCurrent("X");
  //     }
  //     return; // ВАЖЛИВО: нижче обробка перемоги X, її тут не чіпаємо
  //   }
  //   //END NEW Logik Game
  //   // Маємо результат — зберігаємо гравця (але winner встановимо пізніше для X, після loading)
  //   const player = result.player;
  //   // Умова коли гравець "X" виграв це те саме що в стані = setWinner("X");
  //   if (player === "X") {
  //     // setWinner("X"); // Прибрав тут тому що заважав!
  //     // Показуємо проміжну анімацію а саме смайлик з підсвіткою над героєм = Х зліва
  //     setShowSmile(true);
  //     setIsWinning(true); // Встановлюємо, що зараз період перемоги (підсвітка, анімації)
  //     //Це нове! Зберігаємо індекси клітин, які виграли
  //     setWinningCells(result.line || []); // result.line — це масив індексів з checkWin (виграшна комбінація з 3 х клітин)
  //     // Запускаємо з затримкою в setTimeout(() анімацію зсуву вниз = setSlideDown(true);
  //     setTimeout(() => {
  //       setSlideDown(true);
  //     }, 3000);
  //     requestAnimationFrame(() => {
  //       // невелика додаткова пауза (щоб анімація/пульс стартували)
  //       setTimeout(() => {
  //         // Прибираю анімацію зсуву вниз = setSlideDown(false);
  //         setSlideDown(false);
  //         setshowLoadingFirst(true);
  //       }, 6000);
  //     });
  //     // Повідомлення + звук
  //     if (winAudioRef.current) {
  //       winAudioRef.current.currentTime = 0;
  //       winAudioRef.current.play().catch(() => { });
  //     } else {
  //       // запасний варіант (якщо ref не ініціалізований)
  //       const a = new Audio(winSound);
  //       a.play().catch(() => { });
  //     }
  //     // Після 9 секунд ховаємо loading і встановлюємо winner = "X" (це викликає показ WinModal)
  //     setTimeout(() => {
  //       setIsWinning(false); // прибираю ефект підсвітки 3 х клітин
  //       setWinningCells([]); // прибираю ефект підсвітки
  //       setShowSmile(false);
  //       setshowLoadingFirst(false);
  //       setWinner("X");
  //     }, 10000);
  //   } else if (player === "O") {
  //     // Противник виграв — робимо коротку паузу і переходимо на сторінку результату
  //     // озвучка коли Противник виграв = "The opponent won. 😞"
  //     const a = new Audio(endDrowSound);
  //     a.play().catch(() => { });
  //     // toast.success("The opponent won. 😞");
  //     setTimeout(() => {
  //       navigate("/result", {
  //         state: { winner: "O", player1: "You", player2: "PLAYER 2" },
  //       });
  //     }, 1500);
  //   } else if (player === "Draw") {
  //     // Нічия — переходимо на сторінку результату (теж з невеликою затримкою)
  //     // озвучка коли нічья = "You have a draw!"
  //     const a = new Audio(endDrowSound);
  //     a.play().catch(() => { });
  //     // toast.success("You have a draw!");
  //     setTimeout(() => {
  //       navigate("/result", {
  //         state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
  //       });
  //     }, 1500);
  //   }
  // };
  //   // кінець ОСНОВНОЇ функції const handleClick
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIntro(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // const lines = [
  //   [0, 1, 2],
  //   [3, 4, 5],
  //   [6, 7, 8],
  //   [0, 3, 6],
  //   [1, 4, 7],
  //   [2, 5, 8],
  //   [0, 4, 8],
  //   [2, 4, 6],
  // ];

  // const checkWin = b => {
  //   for (let [a, b1, c] of lines) {
  //     if (b[a] && b[a] === b[b1] && b[a] === b[c])
  //       return { player: b[a], line: [a, b1, c] };
  //   }
  //   return b.every(Boolean) ? { player: "Draw", line: [] } : null;
  // };

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
  //  перехід на головну сторінку HomePage при кліку на кнопку справа з голубою стрілкою з затримкою 1 секунда
  const handleGameTurnBack = () => {
    const audio = new Audio(restartSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <section className={`${css.gameWrapper} ${slideDown ? css.slideDown : ""}`}>
      <main className={css.containerGame}>
        <section className={css.wrapper}>
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
                onFinish={() => {
                  setShowHeroEffect(false);
                  setIsAnimating(false); // розблокувати кліки
                }}
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
                {!showHeroEffect && getIconComponent("x")}
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

            {/* {showLoading && <WinModalMidle onRestart={() => {}} />} */}
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
                onFinish={
                  () => {
                    setShowHeroEffectRight(false);
                    setIsAnimating(false);
                  } //додав для зникнення героя знзу ефекта розблокувати кліки
                }
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
                {!showHeroEffectRight && getIconComponent("o")}
              </div>
              <span className={css.label}>PLAYER 2</span>
            </aside>
          </div>
        </section>
        <div className={css.buttonSection}>
          <button
            onClick={handleGameTurnBack}
            className={`${css.button} ${showButton ? css.visible : ""}`}
            aria-hidden={!showButton}
            tabIndex={showButton ? 0 : -1}
            type="button"
          >
            <img src={arowIcon} alt="" className={css.arrow} />
          </button>
        </div>
      </main>
    </section>
  );
};

export default TicTacToeGame;

// setTimeout(() => {
//   setWinner("X");
// }, 9000);
