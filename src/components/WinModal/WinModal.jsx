import css from "./WinModal.module.css";
import restartSound from "/src/assets/audio/mixKids.mp3.wav";

export const WinModal = ({ onRestart }) => {
  const handleGameFinall = () => {
    const audio = new Audio(restartSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    alert("Congratulations on your victory!");
    setTimeout(() => {
      onRestart();
    }, 1500);
  };
  return (
    <div className={css.container}>
      <button onClick={handleGameFinall} className={css.button}></button>
    </div>
  );
};
