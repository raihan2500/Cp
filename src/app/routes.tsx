import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { HomeScreen } from "./components/HomeScreen";
import { ContestsScreen } from "./components/ContestsScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { NotesScreen } from "./components/NotesScreen";
import { ProfileScreen } from "./components/ProfileScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: HomeScreen },
      { path: "contests", Component: ContestsScreen },
      { path: "practice", Component: PracticeScreen },
      { path: "notes", Component: NotesScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);
