import css from "./WinModal.module.css";
import restartSound from "/src/assets/audio/mixKids.mp3.wav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const WinModal = ({ onRestart }) => {
  const handleGameFinall = () => {
    const audio = new Audio(restartSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    toast.success(
      "Congratulations on your victory! 🏆 Fantastic win! 🥳 Every victory brings you closer to greatness.Keep having fun! 😄🎈"
    );

    setTimeout(() => {
      onRestart();
    }, 3000);
  };
  // Генеруємо масив з рандомними стилями для кожного конфеті
  const confettiCount = 50;
  const confettis = Array.from({ length: confettiCount }, () => {
    const left = Math.floor(Math.random() * 100);
    const duration = (Math.random() * 1.5 + 3).toFixed(2);
    const delay = (Math.random() * 3).toFixed(2);

    const colors = [
      "#f5af19", // помаранчевий
      "#fbd786", // жовтий
      "#44e60e", // зелений
      "#86c4fb", // блакитний
      "#fff8b5", // світло-жовтий
      "#ea0e75", // рожевий
      "#ff0000", // червоний
      "#2a27d0", // синій
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
        autoClose={7000} // 5 seconds
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
      <button onClick={handleGameFinall} className={css.button}></button>
    </section>
  );
};
