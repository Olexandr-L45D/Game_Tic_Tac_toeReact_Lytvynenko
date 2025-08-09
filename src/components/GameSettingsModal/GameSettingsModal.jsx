import { useState } from "react";
import css from "./GameSettingsModal.module.css";
import { useNavigate } from "react-router-dom";
import startSound from "/src/assets/audio/startGame.mp3.wav";
import endSound from "/src/assets/audio/endSong.mp3.wav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GameSettingsModal = ({ onClose, onStart }) => {
  const [theme, setTheme] = useState("rose");
  const [age, setAge] = useState(5);
  const [language, setLanguage] = useState("uk");
  const navigate = useNavigate();

  const handleStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    toast.success("Have a nice game!");
  };

  const handleGameEnd = () => {
    const audio = new Audio(endSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    const confirmed = window.confirm(
      "Do you want to go back to the beginning of the game?"
    );
    if (confirmed) {
      navigate("/");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    onStart({ theme, age, language });
    onClose();
  };

  return (
    <section className={css.modalSection}>
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
      <div className={css.modalOverlay}>
        <section className={css.blokTitle}>
          <h1 className={css.Alltitle}>Tic-Tac-Toe Game 🥳 🏆</h1>
          <h3 className={css.title}>Choose your hero, be a champ! ✨ </h3>
          <h3 className={css.title}>Adjust the age and language ✨</h3>
          <h3 className={css.text}>to suit you. ✨</h3>
        </section>
        <div className={css.modalContent}>
          {/* <h2 className={css.titleSet}>Settings</h2> */}
          <form onSubmit={handleSubmit}>
            <label>
              Hero:
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="rose">Learose</option>
                <option value="princes">Princesse</option>
                <option value="boy">Boy</option>
                <option value="man">Man</option>
              </select>
            </label>
            <label>
              Age:
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                min="3"
                max="17"
              />
            </label>
            <label>
              Language:
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="uk">Українська</option>
                <option value="en">English</option>
                <option value="pl">Polski</option> {/* польська їх мовою */}
                <option value="de">Deutsch</option> {/* німецька їх мовою */}
              </select>
            </label>

            <div className={css.buttons}>
              <button onClick={handleStart} type="submit">
                Start
              </button>
              <button onClick={handleGameEnd} className={css.buttonEnd}>
                Restart
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GameSettingsModal;
