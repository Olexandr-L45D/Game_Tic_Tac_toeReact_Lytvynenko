import { NavLink } from "react-router-dom";
import css from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={css.container}>
      <div className={css.card}>
        <NavLink to="/gamesetting" className={css.gameStart}></NavLink>
      </div>
    </div>
  );
}
