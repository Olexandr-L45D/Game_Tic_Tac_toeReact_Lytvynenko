import { useState } from "react";
import css from "./GameSettingsModal.module.css";
import { useNavigate } from "react-router-dom";
import startSound from "/src/assets/audio/startGame.mp3.wav";
import endSound from "/src/assets/audio/endSong.mp3.wav";

const GameSettingsModal = ({ onClose, onStart }) => {
  const [theme, setTheme] = useState("rose");
  const [age, setAge] = useState(5);
  const [language, setLanguage] = useState("uk");
  const navigate = useNavigate();

  const handleStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    alert("Have a nice game!");
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
      <div className={css.modalOverlay}>
        <section className={css.blokTitle}>
          <h2 className={css.title}>To start a more interesting game,</h2>
          <h3 className={css.text}>please select your hero,</h3>
          <h3 className={css.text}>language and age.</h3>
        </section>
        <div className={css.modalContent}>
          <h2 className={css.titleSet}>Settings</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Hero:
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="rose">Learose</option>
                <option value="princes">Princesse</option>
              </select>
            </label>

            <label>
              Age:
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                min="3"
                max="12"
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
              </select>
            </label>

            <div className={css.buttons}>
              <button onClick={handleStart} type="submit">
                Start
              </button>
              <button onClick={handleGameEnd} className={css.buttonEnd}>
                End
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GameSettingsModal;
