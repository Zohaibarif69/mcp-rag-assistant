import { Outlet } from "react-router";
import { ThemeProvider } from "../context/ThemeContext";

export function Root() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}
