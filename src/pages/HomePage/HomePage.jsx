import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";
import startSound from "/src/assets/audio/successMixkit.mp3.wav";
import { useState } from "react";
import LoaderBaground from "../../components/LoaderBaground/LoaderBaground";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGameStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setLoading(true);
    setTimeout(() => {
      navigate("/gamesetting");
    }, 2000); // плавний перехід після 2с
  };

  return (
    <section className={css.container}>
      {loading ? (
        <LoaderBaground />
      ) : (
        <div className={css.card}>
          <div className={css.titleGlow}></div>
          <div onClick={handleGameStart} className={css.gameStart}></div>
        </div>
      )}
    </section>
  );
}
