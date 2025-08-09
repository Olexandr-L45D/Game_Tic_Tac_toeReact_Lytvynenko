import { RotatingLines } from "react-loader-spinner";
import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loaderContainer}>
      <section className={css.loader}>
        <RotatingLines />
      </section>
    </div>
  );
}
