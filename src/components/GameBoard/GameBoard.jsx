// import React from "react";
import css from "./GameBoard.module.css";

const GameBoard = ({ grid, onDropShape }) => {
  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const shapeData = e.dataTransfer.getData("shape");
    if (shapeData) {
      const shape = JSON.parse(shapeData);
      onDropShape(shape, row, col);
    }
  };

  const allowDrop = e => e.preventDefault();

  return (
    <section className={css.boardContainer}>
      <div className={css.board}>
        {grid.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <div
              key={`${rIndex}-${cIndex}`}
              className={css.cell}
              style={{ backgroundColor: cell || "transparent" }}
              onDrop={e => handleDrop(e, rIndex, cIndex)}
              onDragOver={allowDrop}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default GameBoard;
