import { useState } from "react";
import css from "./GameSettingsModal.module.css";
import { NavLink } from "react-router-dom";

const GameSettingsModal = ({ onClose, onStart }) => {
  const [theme, setTheme] = useState("rose");
  const [age, setAge] = useState(5);
  const [language, setLanguage] = useState("uk");
  // const [isComputer, setIsComputer] = useState(true);

  const handleSubmit = e => {
    e.preventDefault();
    onStart({ theme, age, language });
    onClose();
  };

  return (
    <section className={css.modalSection}>
      <div className={css.modalOverlay}>
        <section className={css.blokTitle}>
          <h2 className={css.title}>To start the game, please select</h2>
          <h3 className={css.title}>a hero, language and age.</h3>
        </section>
        <div className={css.modalContent}>
          <h2 className={css.title}>Settings</h2>
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
              <button type="submit">Start</button>
              <NavLink className={css.buttonEnd} to="/">
                End
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GameSettingsModal;
