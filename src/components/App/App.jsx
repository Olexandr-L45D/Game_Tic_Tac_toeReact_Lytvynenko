import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../Loader/Loader";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));

const GameMainPage = lazy(() =>
  import("../../pages/GameMainPage/GameMainPage")
);
const GameResultPage = lazy(() =>
  import("../../pages/GameResultPage/GameResultPage")
);

const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

export default function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/gamemain" element={<GameMainPage />} />
          <Route path="/result" element={<GameResultPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
