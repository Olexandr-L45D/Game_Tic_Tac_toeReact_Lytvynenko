// WinLineEffect.jsx
import { useEffect } from "react";
import css from "./WinLineEffect.module.css";

export default function WinLineEffect({
  cells,
  board,
  bgImage,
  onFinish,
  playSound,
}) {
  useEffect(() => {
    if (playSound) playSound();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000); // час анімації

    return () => clearTimeout(timer);
  }, [onFinish, playSound]);

  return (
    <div className={css.overlay}>
      {bgImage && (
        <div
          className={css.bg}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Сітка з виграшною лінією */}
      <div className={css.grid}>
        {cells.map(index => (
          <div key={index} className={css.winCell}>
            {board[index]}
          </div>
        ))}
      </div>
    </div>
  );
}
