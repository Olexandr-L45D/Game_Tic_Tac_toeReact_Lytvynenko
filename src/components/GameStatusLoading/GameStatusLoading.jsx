import { useNavigate } from "react-router-dom";
import css from "./GameStatusLoading.module.css";
import restartSound from "/src/assets/audio/clikcs.mp3.wav";

const GameStatusLoading = () => {
  const navigate = useNavigate();

  const handleGameStart = () => {
    const audio = new Audio(restartSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    const confirmed = window.confirm(
      "Do you want to go back to the beginning of the game?"
    );
    if (confirmed) {
      navigate("/");
    }
  };
  return (
    <section className={css.statusWrapper}>
      <section className={css.containerLoad}>
        <div onClick={handleGameStart} className={css.iconLeft}></div>
        <section className={css.centrLoad}>
          <div className={css.iconLoad}></div>
        </section>
        <div className={css.iconRight}></div>
      </section>
    </section>
  );
};

export default GameStatusLoading;

//  <NavLink to="/" className={css.iconLeft}></NavLink>;
