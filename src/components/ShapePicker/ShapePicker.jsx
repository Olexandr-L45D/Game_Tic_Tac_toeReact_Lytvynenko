// import React from "react";
import css from "./ShapePicker.module.css";

const ShapePicker = ({ shapes }) => {
  const handleDragStart = (e, shape) => {
    e.dataTransfer.setData("shape", JSON.stringify(shape));
  };

  return (
    <footer className={css.shapePicker}>
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={css.shape}
          draggable
          onDragStart={e => handleDragStart(e, shape)}
        >
          {shape.map((row, r) => (
            <div key={r} className={css.shapeRow}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={css.shapeCell}
                  style={{ backgroundColor: cell || "transparent" }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </footer>
  );
};

export default ShapePicker;
