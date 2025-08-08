import { useEffect, useState } from "react";
import css from "./HeroIntro.module.css";
import starSound from "/src/assets/audio/mixKids.mp3.wav"; // озвучка привітання

export default function HeroIntro({ hero, onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Запуск звуку привітання
    const audio = new Audio(starSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    // Приховування через 3 секунди
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  const isString = typeof hero === "string"; // якщо передали шлях до картинки

  return (
    <section className={css.heroWrapper}>
      <h2 className={css.heroTitle}>Your turn</h2>

      {isString ? (
        <img src={hero} alt="Hero" className={css.heroImage} />
      ) : (
        <div className={`${css.heroImage} ${css.heroIcon}`}>{hero}</div>
      )}

      {[...Array(20)].map((_, i) => (
        <span key={i} className={css.star} />
      ))}
    </section>
  );
}

// export default function HeroIntro({ onFinish }) {
//   const [show, setShow] = useState(true);

//   useEffect(() => {

//     const audio = new Audio(starSound);
//     audio.play().catch(e => console.warn("Autoplay blocked:", e));

//     const timer = setTimeout(() => {
//       setShow(false);
//       if (onFinish) onFinish();
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [onFinish]);

//   if (!show) return null;

//   return (
//     <section className={css.heroWrapper}>
//       <h2 className={css.heroTitle}>Your turn</h2>
//       <img src={heroImg} alt="Hero" className={css.heroImage} />
//       {[...Array(20)].map((_, i) => (
//         <span key={i} className={css.star} />
//       ))}
//     </section>
//   );
// };
