import { Navigate, Route, Routes } from "react-router-dom";
import { GamePage } from "../pages/game/GamePage";

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<GamePage />} />
    <Route path="*" element={<Navigate to={"/"} />} />
  </Routes>
);
