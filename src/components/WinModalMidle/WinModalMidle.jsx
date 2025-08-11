import css from "./WinModalMidle.module.css";
import finSound from "/src/assets/audio/mixkitFinnaliViner.mp3.wav";

export const WinModalMidle = () => {
  const audio = new Audio(finSound);
  audio.play().catch(e => console.warn("Autoplay blocked:", e));

  // Генеруємо масив з рандомними стилями для кожного конфеті
  const confettiCount = 70;
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
    const shapes = ["circle", "square", "rectangle", "triangle", "star"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    return { left, duration, delay, color, shape };
  });

  return (
    <section className={css.loadingWrapper}>
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
    </section>
  );
};
