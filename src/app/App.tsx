import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeContext";
import { UserInfoProvider } from "./components/UserInfo";

export default function App() {
  return (
    <ThemeProvider>
      <UserInfoProvider>
        <RouterProvider router={router} />
      </UserInfoProvider>
    </ThemeProvider>
  );
}
