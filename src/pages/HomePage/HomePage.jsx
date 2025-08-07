import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";
import startSound from "/src/assets/audio/startGame.mp3.wav";

export default function HomePage() {
  const navigate = useNavigate();

  const handleGameStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    alert("Have a nice game!");
    navigate("/gamesetting");
  };

  return (
    <section className={css.container}>
      <div className={css.card}>
        <div onClick={handleGameStart} className={css.gameStart}></div>
      </div>
    </section>
  );
}
