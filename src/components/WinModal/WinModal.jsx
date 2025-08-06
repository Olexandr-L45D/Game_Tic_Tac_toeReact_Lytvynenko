import css from "./WinModal.module.css";

export const WinModal = ({ onRestart }) => {
  return (
    <div className={css.container}>
      <button onClick={onRestart} className={css.button}></button>
    </div>
  );
};
