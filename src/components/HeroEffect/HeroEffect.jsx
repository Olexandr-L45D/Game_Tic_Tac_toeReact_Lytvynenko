import { useEffect, useState } from "react";
import css from "./HeroEffect.module.css";
import starSound from "/src/assets/audio/clikcs.mp3.wav"; // озвучка привітання

export default function HeroEffect({
  hero,
  visible,
  duration = 1000,
  onFinish,
}) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      const audio = new Audio(starSound);
      audio.play().catch(e => console.warn("Autoplay blocked:", e));

      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onFinish?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onFinish]);

  if (!show) return null;

  const isString = typeof hero === "string";

  return (
    <section className={css.heroWrapper}>
      <h2 className={css.heroTitle}>Your turn</h2>
      <div className={css.heroImageWrapper}>
        {isString ? (
          <img src={hero} alt="Hero" className={css.heroImage} />
        ) : (
          <div className={`${css.heroImage} ${css.heroIcon}`}>{hero}</div>
        )}

        {[...Array(20)].map((_, i) => (
          <span key={i} className={css.star} />
        ))}
      </div>
    </section>
  );
}
