import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser.js");

  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

async function bootstrap() {
  try {
    await enableMocking();
    console.log("MSW 시작 성공");
  } catch (error) {
    console.error("MSW 시작 실패:", error);
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
