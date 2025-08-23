import { useEffect, useState } from "react";
import css from "./GameMainPage.module.css";
// import GameSettingsModal from "../../components/GameSettingsModal/GameSettingsModal";
import Loader from "../../components/Loader/Loader";
import TetrisGame from "../../components/TetrisGame/TetrisGame";
import startSound from "/src/assets/audio/successMixkit.mp3.wav";

const GameMainPage = () => {
  const [startGame, setStartGame] = useState(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(false); // глобальний Loader

  // збереження скору
  useEffect(() => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setTimeout(() => {
      setShowGlobalLoader(true);
      // setSettings(data);
      setStartGame(true);
    }, 1000); // Пауза перед стартом гри
  }, []);

  return (
    <section className={css.container}>
      {/* Глобальний Loader */}
      {showGlobalLoader && <Loader />}

      {startGame && <TetrisGame />}
    </section>
  );
};

export default GameMainPage;

// {
//   showModal && (
//     <GameSettingsModal
//       onClose={() => setShowModal(false)}
//       onStart={handleStart}
//     />
//   );
// }

//  const [isGameOver, setIsGameOver] = useState(false);
//  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

// const handleGameEnd = () => {
//   setIsGameOver(true);
//   setTimeout(() => {
//     setIsAnimationFinished(true);
//   }, 2000); // має співпадати з CSS transition
// };

// {
//   startGame && settings && !isAnimationFinished && (
//     <div
//       className={`${css.gameWrapper} ${isGameOver ? css.slideDown : ""}`}
//     >
//       <TicTacToeGame
//         name="Olexandr"
//         age={settings.age}
//         language={settings.language}
//         settings={settings}
//         onGameEnd={handleGameEnd} // викликається при завершенні гри
//       />
//     </div>
//   );
// }
//

/* {isAnimationFinished && <WinModalFirst />} */
