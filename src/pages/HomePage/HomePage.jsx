import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";
import startSound from "/src/assets/audio/successMixkit.mp3.wav";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGameStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setLoading(true);
    setTimeout(() => {
      navigate("/gamemain");
    }, 1500); // плавний перехід після 1.5 с
  };

  return (
    <section className={css.container}>
      {loading ? (
        <Loader />
      ) : (
        <div className={css.card}>
          <h1 className={css.title}>Tetris</h1>
          <div className={css.titleGlo}></div>
          <div onClick={handleGameStart} className={css.gameStart}>
            Play
          </div>
        </div>
      )}
    </section>
  );
}

/* <button
  onClick={handleGameFinall}
  className={`${css.button} ${showButton ? css.visible : ""}`}
  aria-hidden={!showButton}
  tabIndex={showButton ? 0 : -1}
  type="button"
>
  Play Game Again
  <img src={playIcon} alt="" className={css.arrow} />
</button>; */
