// src/pages/GameResultPage.tsx
import css from "./GameResultPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import startSound from "/src/assets/audio/startGame.mp3.wav";
import endSound from "/src/assets/audio/endSong.mp3.wav";

const GameResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { winner, player1, player2 } = location.state || {};
  const handleStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    alert("Have a nice game!");
    navigate("/gamesetting");
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

  return (
    <section className={css.modalOverlay}>
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1 className={css.title}>Game the end</h1>
        <p className={css.text}>
          {winner === "Draw"
            ? "🤝 Draw!"
            : winner === "X"
            ? `🏆 Winner: ${player1}`
            : `😞 Winner: ${player2}`}
        </p>

        <div style={{ marginTop: "20px" }}>
          <button className={css.textBtn} onClick={handleStart}>
            🔁 Play again
          </button>
          <button onClick={handleGameEnd}>🏠 To the beginning</button>
        </div>
      </div>
    </section>
  );
};

export default GameResultPage;
