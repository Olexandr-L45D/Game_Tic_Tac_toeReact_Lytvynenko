import { useEffect, useState } from "react";
import css from "./HeroIntro.module.css";
import heroImg from "/src/assets/emages/HeroYour.png"; // зображення героя
import starSound from "/src/assets/audio/mixKids.mp3.wav"; // озвучка привітання

export default function HeroIntro({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Запуск звуку привітання
    const audio = new Audio(starSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));

    // Автоматичне приховування через 3 сек (або можна вручну через onFinish)
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  return (
    <section className={css.heroWrapper}>
      <h2 className={css.heroTitle}>Your turn</h2>
      <img src={heroImg} alt="Hero" className={css.heroImage} />
      {[...Array(20)].map((_, i) => (
        <span key={i} className={css.star} />
      ))}
    </section>
  );
}
