import css from "./GameResultModal.module.css";

const GameResultModal = ({ message, onNext, show }) => {
  if (!show) return null;

  return (
    <div className={css.modalBackdrop}>
      <div className={css.modalContent}>
        <p>{message}</p>
        <button onClick={onNext}>Continue</button>
      </div>
    </div>
  );
};

export default GameResultModal;
