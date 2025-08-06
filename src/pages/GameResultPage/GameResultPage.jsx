// src/pages/GameResultPage.tsx
import css from "./GameResultPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const GameResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { winner, player1, player2 } = location.state || {};

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
          <button
            className={css.textBtn}
            onClick={() => navigate("/gamesetting")}
          >
            🔁 Play again
          </button>
          <button onClick={() => navigate("/")}>🏠 To the beginning</button>
        </div>
      </div>
    </section>
  );
};

export default GameResultPage;
