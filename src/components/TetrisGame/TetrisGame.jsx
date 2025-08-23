import { useEffect, useState } from "react";
import css from "./TetrisGame.module.css";
const GRID_SIZE = 8;
const COLORS = [
  "#7CFC00", // салатово-зелений
  "#0000FF", // синій
  "#00BFFF", // голубий
  "#FFFF00", // жовтий
  "#800080", // фіолетовий
  "#FFA500", // оранжевий
  "#FF6347", // червоний (рідкісний бонусний)
];

const getRandomColor = () => {
  const rareChance = Math.random();
  // Робимо червоний рідкісним
  if (rareChance < 0.05) return COLORS[6];
  return COLORS[Math.floor(Math.random() * 6)];
};

const TetrisGame = () => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);

  // ініціалізація
  useEffect(() => {
    const savedScore = localStorage.getItem("gameScore");
    if (savedScore) setScore(Number(savedScore));

    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => getRandomColor())
    );
    setGrid(newGrid);
  }, []);

  // збереження скору
  useEffect(() => {
    localStorage.setItem("gameScore", score);
  }, [score]);

  return (
    <section className={css.gameWrapper}>
      <main className={css.containerGame}>
        <div className={css.container}>
          {/* Header */}
          <header className={css.header}>
            <h1 className={css.title}>Color Blocks</h1>
            <div className={css.scoreBox}>
              <span className={css.scoreLabel}>Score:</span>
              <span className={css.scoreValue}>{score}</span>
            </div>
          </header>

          {/* Main Board */}
          <main className={css.boardWrapper}>
            <div className={css.board}>
              {grid.map((row, rowIndex) =>
                row.map((color, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={css.cell}
                    style={{ backgroundColor: color }}
                  />
                ))
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className={css.footer}>
            <button className={css.button} onClick={() => setScore(0)}>
              Reset Score
            </button>
          </footer>
        </div>
      </main>
    </section>
  );
};

export default TetrisGame;

//  <section className={`${css.gameWrapper} ${slideDown ? css.slideDown : ""}`}></section>
