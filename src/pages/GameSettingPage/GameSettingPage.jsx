import { useState } from "react";
import css from "./GameSettingPage.module.css";
import TicTacToeGame from "../../components/TicTacToeGame/TicTacToeGame";
import GameSettingsModal from "../../components/GameSettingsModal/GameSettingsModal";
import GameStatusLoading from "../../components/GameStatusLoading/GameStatusLoading";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import Loader from "../../components/Loader/Loader";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const GameSettingPage = () => {
  const [settings, setSettings] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showStatusLoading, setShowStatusLoading] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(false); // глобальний Loader

  const handleStart = data => {
    setShowModal(false);
    setShowGlobalLoader(true); // глобальний Loader
    setShowLoading(true); // Показати перший лоадер

    setTimeout(() => {
      setShowGlobalLoader(false);
      setShowLoading(false); // Сховати перший лоадер

      // Показати GameStatusLoading після короткої паузи (щоб не мерехтіло)
      setTimeout(() => {
        setShowStatusLoading(true);

        // Дати гравцеві побачити статус і потім старт гри
        setTimeout(() => {
          // toast.success("Have a nice game!");
          setShowStatusLoading(true);
          setSettings(data);
          setStartGame(true);
        }, 1000); // Пауза перед стартом гри
      }, 1000); // Невелика затримка між лоадерами
    }, 1000); // Показ першого лоадера 1с
  };

  return (
    <section className={css.container}>
      {/* <ToastContainer
        position="top-right"
        autoClose={5000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      {showLoading && <LoadingScreen />}
      {showStatusLoading && <GameStatusLoading />}

      {showModal && (
        <GameSettingsModal
          onClose={() => setShowModal(false)}
          onStart={handleStart}
        />
      )}
      {/* Глобальний Loader */}
      {showGlobalLoader && <Loader />}
      {startGame && settings && (
        <TicTacToeGame
          name="Olexandr"
          age={settings.age}
          language={settings.language}
          settings={settings}
        />
      )}
    </section>
  );
};

export default GameSettingPage;
