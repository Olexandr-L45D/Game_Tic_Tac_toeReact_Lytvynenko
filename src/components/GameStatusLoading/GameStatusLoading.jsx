import { NavLink } from "react-router-dom";
import css from "./GameStatusLoading.module.css";

const GameStatusLoading = () => {
  return (
    <section className={css.statusWrapper}>
      <section className={css.containerLoad}>
        <NavLink to="/" className={css.iconLeft}></NavLink>

        <section className={css.centrLoad}>
          <div className={css.iconLoad}></div>
        </section>
        <div className={css.iconRight}></div>
      </section>
    </section>
  );
};

export default GameStatusLoading;
