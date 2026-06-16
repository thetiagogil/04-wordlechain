import { Navigate, Route, Routes } from "react-router-dom";
import { GamePage } from "./lazy-pages";
import { RouteSuspense } from "./RouteSuspense";

export const AppRouter = () => (
  <RouteSuspense>
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  </RouteSuspense>
);
