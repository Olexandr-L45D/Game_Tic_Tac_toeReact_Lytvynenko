import css from "./StarkHeroEffect.module.css";
import starSound from "/src/assets/audio/endSong.mp3.wav"; // озвучка привітання

export default function StarkHeroEffect() {
  const audio = new Audio(starSound);
  audio.play().catch(e => console.warn("Autoplay blocked:", e));

  return (
    <section className={css.heroWrapper}>
      <div className={css.heroImageWrapper}>
        <div className={css.starImage}></div>
      </div>
    </section>
  );
}
