// GameSettingPage.tsx
import { useState } from "react";
import css from "./GameSettingPage.module.css";
import TicTacToeGame from "../../components/TicTacToeGame/TicTacToeGame";
import GameSettingsModal from "../../components/GameSettingsModal/GameSettingsModal";
import GameStatusLoading from "../../components/GameStatusLoading/GameStatusLoading";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
const GameSettingPage = () => {
  const [settings, setSettings] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showStatusLoading, setShowStatusLoading] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const handleStart = data => {
    setShowModal(false);
    setShowLoading(true); // Показати перший лоадер

    setTimeout(() => {
      setShowLoading(false); // Сховати перший лоадер

      // Показати GameStatusLoading після короткої паузи (щоб не мерехтіло)
      setTimeout(() => {
        setShowStatusLoading(true);

        // Дати гравцеві побачити статус і потім старт гри
        setTimeout(() => {
          setShowStatusLoading(true);
          setSettings(data);
          setStartGame(true);
        }, 1000); // Пауза перед стартом гри
      }, 1500); // Невелика затримка між лоадерами
    }, 1500); // Показ першого лоадера 1с
  };

  return (
    <div className={css.container}>
      {showLoading && <LoadingScreen />}
      {showStatusLoading && <GameStatusLoading />}

      {showModal && (
        <GameSettingsModal
          onClose={() => setShowModal(false)}
          onStart={handleStart}
        />
      )}

      {startGame && settings && (
        <TicTacToeGame
          name="Olexandr"
          age={settings.age}
          language={settings.language}
          settings={settings}
        />
      )}
    </div>
  );
};

export default GameSettingPage;
