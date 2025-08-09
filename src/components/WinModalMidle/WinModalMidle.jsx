import css from "./WinModalMidle.module.css";

export const WinModalMidle = () => {
  // Генеруємо масив з рандомними стилями для кожного конфеті
  const confettiCount = 30;
  const confettis = Array.from({ length: confettiCount }, () => {
    const left = Math.floor(Math.random() * 100); // від 0% до 100%
    const duration = (Math.random() * 1.5 + 2).toFixed(2); // від 2 до 3.5 сек
    const delay = (Math.random() * 3).toFixed(2); // від 0 до 3 сек
    // Рандомний колір (жовтий/помаранчевий/білий)
    const colors = ["#f5af19", "#fbd786", "#fff8b5"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return { left, duration, delay, color };
  });

  return (
    <div className={css.loadingWrapper}>
      {confettis.map(({ left, duration, delay, color }, i) => (
        <span
          key={i}
          className={css.confetti}
          style={{
            "--confetti-left": left,
            "--confetti-duration": `${duration}s`,
            "--confetti-delay": `${delay}s`,
            "--confetti-color": color,
          }}
        />
      ))}
    </div>
  );
};

// export const WinModalMidle = () => {
//   return (
//     <div className={css.loadingWrapper}>
//       {/* Конфеті */}
//       {[...Array(30)].map((_, i) => (
//         <span key={i} className={css.confetti} />
//       ))}
//     </div>
//   );
// };
