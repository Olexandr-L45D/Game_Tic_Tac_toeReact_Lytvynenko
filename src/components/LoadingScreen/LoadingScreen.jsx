import css from "./LoadingScreen.module.css";
import startSound from "/src/assets/audio/startGame.mp3.wav";
const LoadingScreen = () => {
  const audio = new Audio(startSound);
  audio.play().catch(e => console.warn("Autoplay blocked:", e));
  return <div className={css.loadingWrapper}></div>;
};

export default LoadingScreen;
