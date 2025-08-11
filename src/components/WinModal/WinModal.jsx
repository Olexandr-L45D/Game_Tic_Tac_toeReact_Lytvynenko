import { useEffect, useState } from "react";
import css from "./WinModal.module.css";
import restartSound from "/src/assets/audio/mixKids.mp3.wav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const WinModal = ({ onRestart }) => {
  const [showButton, setShowButton] = useState(false); // ✅ початково приховано

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true); //  показуємо через 2 секунди
    }, 3000);

    return () => clearTimeout(timer); // очищення таймера
  }, []);

  //  основна логіка
  const handleGameFinall = () => {
    const audio = new Audio(restartSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    toast.success(
      "Congratulations on your victory! 🏆 Fantastic win! 🥳 Every victory brings you closer to greatness.Keep having fun! 😄🎈"
    );

    setTimeout(() => {
      onRestart();
    }, 4000);
  };
  // Генеруємо масив з рандомними стилями для кожного конфеті
  const confettiCount = 100;
  const confettis = Array.from({ length: confettiCount }, () => {
    const left = Math.floor(Math.random() * 100);
    const duration = (Math.random() * 1.5 + 4).toFixed(2);
    const delay = (Math.random() * 4).toFixed(2);

    const colors = [
      "#fff8b5", // світло-жовтий
      "#ffffff", // білий
      "#f5af19", // помаранчевий
      "#fbd786", // жовтий
      "#44e60e", // слалатовий
      "#008000", // зелений
      "#86c4fb", // блакитний
      "#2a27d0", // синій
      "#ea0e75", // рожевий
      "#ff0000", // червоний
      "#800000", // коричневий
      "#800080", // фіолетовий
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Тип фігури: circle, square, rectangle
    const shapes = ["circle", "square", "rectangle"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    return { left, duration, delay, color, shape };
  });
  return (
    <section className={css.container}>
      <ToastContainer
        position="top-right"
        autoClose={7000} // 7 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        {confettis.map(({ left, duration, delay, color, shape }, i) => (
          <span
            key={i}
            className={`${css.confetti} ${css[shape]}`}
            style={{
              "--confetti-left": left,
              "--confetti-duration": `${duration}s`,
              "--confetti-delay": `${delay}s`,
              "--confetti-color": color,
            }}
          />
        ))}
      </div>
      <div className={css.sectionBlok}>
        <h1 className={css.title}>Congratulations!</h1>
        <button
          onClick={handleGameFinall}
          className={`${css.button} ${showButton ? css.visible : ""}`}
          aria-hidden={!showButton}
          tabIndex={showButton ? 0 : -1}
          type="button"
        >
          Play Game Again
          <img src="/src/assets/emages/play.png" alt="" className={css.arrow} />
        </button>
      </div>
      {/* <button onClick={handleGameFinall} className={css.button}>Play Game Again</button> */}
    </section>
  );
};
