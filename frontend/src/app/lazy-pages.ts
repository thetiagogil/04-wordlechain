import { lazy } from "react";

export const GamePage = lazy(() =>
  import("../pages/game/GamePage").then((module) => ({
    default: module.GamePage,
  })),
);
